from importlib.util import find_spec
from json import load
from urllib.request import urlopen

import pip
from django.core.management import BaseCommand, CommandParser
from github import Github

from apps.core.models import Plugin

ORG = 'reactmed'
REPO = 'neurdicom-plugins'
META = 'META.json'
REPO_URL = 'git+git://github.com/reactmed/neurdicom-plugins.git'


class Command(BaseCommand):
    help = "Install plugins from repository"

    def add_arguments(self, parser: CommandParser):
        parser.add_argument('plugins', nargs='+', type=str)
        parser.add_argument('--upgrade', action='store_true', dest='upgrade',
                            help='Upgrade plugins')
        parser.add_argument('--clear', action='store_true', dest='clear',
                            help='Clear plugins')
        parser.add_argument('--validate', action='store_true', dest='validate',
                            help='Validate plugins')

    def handle(self, *args, **options):
        upgrade = options.get('upgrade', True)
        clear = options.get('clear', False)
        validate = options.get('validate', False)
        if clear:
            self.stdout.write('Clear plugins')
            for plugin in Plugin.objects.all():
                plugin.plugin.delete()
                plugin.delete()
        g = Github()
        repo = g.get_organization(ORG).get_repo(REPO)
        for plugin in options['plugins']:
            if upgrade:
                pip.main(['install', '--upgrade', '%s#subdirectory=%s' % (REPO_URL, plugin)])
            else:
                pip.main(['install', '%s#subdirectory=%s' % (REPO_URL, plugin)])
            if find_spec(plugin) is None:
                raise ModuleNotFoundError('%s was not installed!' % plugin)
            if validate:
                try:
                    __import__(plugin).Plugin
                except AttributeError:
                    raise RuntimeError('Plugin does not have main class "Plugin"')

            meta_url = repo.get_contents('%s/META.json' % plugin).download_url
            with urlopen(meta_url) as meta_file:
                meta = load(meta_file)
                plugin = Plugin()
                plugin.author = meta['author']
                plugin.name = meta['name']
                plugin.display_name = meta['display_name']
                plugin.version = meta['version']
                plugin.info = meta.get('info', None)
                plugin.docs = meta.get('docs', None)
                plugin.modalities = meta.get('modalities', [])
                plugin.tags = meta.get('tags', [])
                plugin.params = meta.get('params', [])
                plugin.result = meta['result']
                plugin.save()
        self.stdout.write('Installing plugins completed!')

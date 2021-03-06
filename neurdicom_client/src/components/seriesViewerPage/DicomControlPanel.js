import React, {Component} from 'react';
import {Button, Dropdown, Icon, Menu, Modal} from "semantic-ui-react";
import PropTypes from 'prop-types';
import PluginsService from "../../services/PluginsService";

const colorScaleOptions = [
    {
        'key': 'main',
        'value': 'main',
        'text': 'Original'
    },
    {
        'key': 'heatmap',
        'value': 'heatmap',
        'text': 'Heatmap'
    },
    {
        'key': 'inverseHeatmap',
        'value': 'inverseHeatmap',
        'text': 'Inverse Heatmap'
    },
    {
        'key': 'hotRed',
        'value': 'hotRed',
        'text': 'Hot Red'
    },
    {
        'key': 'hotGreen',
        'value': 'hotGreen',
        'text': 'Hot Green'
    },
    {
        'key': 'hotBlue',
        'value': 'hotBlue',
        'text': 'Hot Blue'
    },
    {
        'key': 'inverse',
        'value': 'inverse',
        'text': 'Inverse'
    }
];

const viewModeOptions = [
    {
        'key': 'one',
        'value': 'one',
        'text': 'One image'
    },
    {
        'key': 'two',
        'value': 'two',
        'text': 'Two images'
    }
];

class DicomControlPanel extends Component {
    constructor(props) {
        super(props);
        this.onHome = this.props.onHome || function () {
        };
        this.onNextInstance = this.props.onNextInstance || function () {
        };
        this.onPrevInstance = this.props.onPrevInstance || function () {
        };
        this.onPlay = this.props.onPlay || function () {
        };
        this.onStop = this.props.onStop || function () {
        };
        this.onSetColorScale = this.props.onSetColorScale || function () {
        };
        this.onSetViewMode = this.props.onSetViewMode || function () {
        };
        this.onRotateLeft = this.props.onRotateLeft || function () {
        };
        this.onRotateRight = this.props.onRotateRight || function () {
        };
        this.setState = this.setState.bind(this);
        this.state = {
            pluginOptions: []
        }
    }

    componentDidMount() {
        PluginsService.findPlugins((plugins) => {
            const pluginOptions = plugins.map(function (plugin) {
                return {
                    key: plugin.id,
                    value: plugin.id,
                    text: plugin.info
                };
            });
            this.setState({pluginOptions: pluginOptions})
        });
    }

    render() {
        const pluginOptions = this.state.pluginOptions;
        return (
            <Menu inverted style={{borderRadius: '0px', marginBottom: '0px'}}>
                <Menu.Item>
                    <Button size={'small'} icon inverted onClick={this.onHome}>
                        <Icon name={'home'}/>
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button icon inverted onClick={this.onPrevInstance}>
                        <Icon name={'arrow left'}/>
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button icon inverted onClick={this.onPlay}>
                        <Icon name={'play'}/>
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button icon inverted onClick={this.onStop}>
                        <Icon name={'stop'}/>
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Dropdown placeholder='Color scale' fluid search selection options={colorScaleOptions}
                              onChange={this.onSetColorScale}/>
                </Menu.Item>
                <Menu.Item>
                    <Dropdown placeholder='View Mode' fluid search selection options={viewModeOptions}
                              onChange={this.onSetViewMode}/>
                </Menu.Item>
                <Menu.Item>
                    <Button icon inverted>
                        <Icon name={'sun'}/>
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button icon inverted>
                        <Icon name={'zoom'}/>
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button icon inverted>
                        <Icon name={'zoom out'}/>
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button icon inverted onClick={this.onRotateLeft}>
                        <Icon name={'redo'}/>
                    </Button>
                </Menu.Item>
                <Menu.Item>
                    <Button icon inverted onClick={this.onRotateRight}>
                        <Icon name={'undo'}/>
                    </Button>
                </Menu.Item>
                <Menu.Item position={'right'}>
                    <Dropdown placeholder='Plugin' fluid search selection options={pluginOptions}
                    />
                </Menu.Item>
                <Menu.Item>
                    <Button primary>
                        Apply plugin
                    </Button>
                </Menu.Item>
                <Menu.Item position={'right'}>
                    <Button icon inverted onClick={this.onNextInstance}>
                        <Icon name={'arrow right'}/>
                    </Button>
                </Menu.Item>
            </Menu>
        );
    }
}

DicomControlPanel.propTypes = {
    onHome: PropTypes.func,
    onPrevInstance: PropTypes.func,
    onNextInstance: PropTypes.func,
    onPlay: PropTypes.func,
    onStop: PropTypes.func,
    onSetColorScale: PropTypes.func,
    onSetViewMode: PropTypes.func,
    onRotateLeft: PropTypes.func,
    onRotateRight: PropTypes.func

};

export default DicomControlPanel;
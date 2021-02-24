import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';
import _ from 'underscore';
import classnames from 'classnames';

import ResizeListenerMixin from './resize-listener-mixin';

const SmartOverflow = createReactClass({
    displayName: 'SmartOverflow',

    propTypes: {
        heightBuffer: PropTypes.number,
        marginBottom: PropTypes.number,
        className: PropTypes.string,
        children: PropTypes.node,
    },

    getInitialState() {
        return {
            isOverflowing: false,
            triggerHeight: null,
            style: undefined,
        };
    },

    getDefaultProps() {
        return {
            heightBuffer: 20,
            marginBottom: 0,
        };
    },

    mixins: [ResizeListenerMixin],

    getOffset() {
        const componentNode = ReactDOM.findDOMNode(this);
        return componentNode.getBoundingClientRect().top;
    },

    getTriggerHeight() {
        const topOffset = this.getOffset();
        return topOffset + this.state.sizesInitial.componentEl.height;
    },

    componentDidUpdate() {
    // on the cycle after sizesInitial initially gets set from ResizeListenerMixin,
    // determine trigger height
        if (!_.isEmpty(this.state.sizesInitial) && (this.state.triggerHeight == null)) {
            const triggerHeight = this.getTriggerHeight();
            const triggerHeightState = { triggerHeight };
            this.setState(triggerHeightState);

            // pass in trigger height as well for initial styles
            const sizes = _.defaults({}, this.state.sizesInitial, triggerHeightState);
            this._resizeListener(sizes);
        }
    },

    _resizeListener(sizes) {
        let style;
        if (sizes.windowEl.height < (sizes.triggerHeight || this.state.triggerHeight)) {
            const maxHeight = sizes.windowEl.height - this.getOffset() - this.props.heightBuffer;
            const { marginBottom } = this.props;
            style = { maxHeight, marginBottom };
        } else {
            style = undefined;
        }

        return this.setState({ style });
    },

    render() {
        const { className } = this.props;

        const classes = classnames('openstax-smart-overflow', className);

        return (
            <div className={classes} style={this.state.style}>
                {this.props.children}
            </div>
        );
    },
});

export default SmartOverflow;

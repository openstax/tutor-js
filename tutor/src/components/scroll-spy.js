import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import { map, debounce, sortBy } from 'lodash';

import ScrollListenerMixin from 'shared/mixins/ScrollListener';

// A component that accepts a dom selector that matches portions of the document
//
// It listens for scroll events and notifies it's children
// when elements that match the selector are visible in the current viewport
//
// The elements are sorted by what percentage of the screen they occupy
// If they are all equivilent, they're returned in document order
//
// For instance if the current page is made up of vertically stacked '.panels'
// ScrollSpy will calculate which .panels are currently visible and notify it's component
// when the selection changes
const ScrollSpy = createReactClass({
    displayName: 'ScrollSpy',
    getInitialState() { return {}; },
    mixins: [ScrollListenerMixin],

    getDefaultProps() {
        return { windowImpl: window };
    },

    propTypes: {
        dataSelector: PropTypes.string.isRequired,
        windowImpl: PropTypes.object,
        children: PropTypes.node,
    },

    UNSAFE_componentWillMount() {
        return this.calculateScroll();
    },

    onPageScroll: debounce( function() {
        return this.calculateScroll();
    }
    , 100),

    calculateScroll() {
        const onScreen = [];

        const height = this.props.windowImpl.innerHeight;

        const elements = this.props.windowImpl.document.querySelectorAll(`[${this.props.dataSelector}]`);

        for (let index = 0; index < elements.length; index++) {
            const el = elements[index];
            const bounds = el.getBoundingClientRect();
            const visibleHeight =
        Math.min(height, bounds.bottom) - Math.max(0, bounds.top);
            if (visibleHeight > 0) {
                const key = el.getAttribute(this.props.dataSelector);
                // Calculate the percentage of the screen the element occupies
                // 0.01 * index is removed so that equivalent sized elements will be sorted by
                // the position they occur in
                onScreen.push([key, (visibleHeight / height) - (0.01 * onScreen.length)]);
            }
        }

        return this.setState({
            onScreen: map( sortBy(onScreen, '1').reverse(), '0' ),
        });
    },

    render() {
        return React.cloneElement(this.props.children, { onScreenElements: this.state.onScreen, shouldUpdate: !this.state.isScrolling });
    },
});

export default ScrollSpy;

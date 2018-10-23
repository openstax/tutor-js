import _ from 'underscore';
import chai from 'chai';
const { expect } = chai;
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { Promise } from 'es6-promise';
import { commonActions } from './utilities';
const sandbox = null;

class Wrapper extends React.Component {
  render() {
    return React.createElement(this.props._wrapped_component,
      _.extend(_.omit(this.props, '_wrapped_component', 'children'), { ref: 'element' }),
      this.props.children
    );
  }
}

const Testing = {
  renderComponent(component, options = {}) {
    if (!options.props) { options.props = {}; }
    const unmountAfter = options.unmountAfter || 5;
    const root = document.createElement('div');
    const promise = new Promise( function(resolve, reject) {
      const props = _.clone(options.props);
      props._wrapped_component = component;

      const wrapper = ReactDOM.render( <Wrapper {...props} />, root );
      const renderResult = {
        root,
        wrapper,
        getDom() { return ReactDOM.findDOMNode(wrapper.refs.element); },
        dom: ReactDOM.findDOMNode(wrapper.refs.element),
        element: wrapper.refs.element,
      };
      return resolve(renderResult);
    });
    // defer adding the then callback so it'll be called after whatever is attached after the return
    _.defer(() => promise.then(function() {
      _.delay( () => ReactDOM.unmountComponentAtNode(root)
        , unmountAfter );
      return arguments;
    })
    );
    return promise;
  },

  actions: commonActions,
};

export { Testing, expect, sinon, React, _, ReactTestUtils, ReactDOM };

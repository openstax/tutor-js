import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import ReactTestUtils from 'react-dom/test-utils';
import Renderer from 'react-test-renderer';
import { Provider } from 'mobx-react';
import Factory from '../factories';
export FakeWindow from './fake-window';

const ld = require('lodash');

export  { ld, Factory, React, Router, ReactTestUtils, Renderer, Provider };

//
//
// import chai from 'chai';
// import { extend, omit, clone, defer, delay } from 'lodash';
// const { expect } = chai;
// import React from 'react';
// import ReactDOM from 'react-dom';
// import ReactTestUtils from 'react-dom/test-utils';
// import { Promise } from 'es6-promise';
// import { commonActions } from './utilities';
// const sandbox = null;
//
// class Wrapper extends React.Component {
//   render() {
//     return React.createElement(this.props._wrapped_component,
//       extend(omit(this.props, '_wrapped_component', 'children'), { ref: 'element' }),
//       this.props.children
//     );
//   }
// }
//
// const Testing = {
//   renderComponent(component, options = {}) {
//     if (!options.props) { options.props = {}; }
//     const unmountAfter = options.unmountAfter || 5;
//     const root = document.createElement('div');
//     const promise = new Promise( function(resolve, reject) {
//       const props = clone(options.props);
//       props._wrapped_component = component;
//
//       const wrapper = ReactDOM.render( <Wrapper {...props} />, root );
//       const renderResult = {
//         root,
//         wrapper,
//         getDom() { return ReactDOM.findDOMNode(wrapper.refs.element); },
//         dom: ReactDOM.findDOMNode(wrapper.refs.element),
//         element: wrapper.refs.element,
//       };
//       return resolve(renderResult);
//     });
//     // defer adding the then callback so it'll be called after whatever is attached after the return
//     defer(() => promise.then(function() {
//       delay( () => ReactDOM.unmountComponentAtNode(root)
//         , unmountAfter );
//       return arguments;
//     })
//     );
//     return promise;
//   },
//
//   actions: commonActions,
// };
//
// export { Testing, expect, React, ReactTestUtils, ReactDOM };

export * from 'shared/specs/helpers';
import { MemoryRouter as Router } from 'react-router-dom';

import TimeMock from './time-mock';

export { Router, TimeMock };
export Factory from '../factories';


// import React from 'react';
// import { MemoryRouter as Router } from 'react-router-dom';
// import ReactTestUtils from 'react-dom/test-utils';
// import Renderer from 'react-test-renderer';
// import { Provider } from 'mobx-react';
//
//
// export  { React, Router, ReactTestUtils, Renderer, Provider };
//
// import PropTypes from 'prop-types';
// import React from 'react';
// import ReactDOM from 'react-dom';
// import TestRouter from './test-router';
//
// import { spyOnComponentMethod, stubComponentMethod } from 'sinon-spy-react';
// import { DragDropManager } from 'dnd-core';
// import TestBackend from 'react-dnd-test-backend';
// import { Provider } from 'mobx-react';
//
// // No longer exists, needs further investigation if we're using it
// // ReactContext   = require('react/lib/ReactContext')
//
// import createHistory from 'history/createMemoryHistory';
// import { Router as ReactRouter } from 'react-router-dom';
//
// import { Promise } from 'es6-promise';
// import { commonActions } from './utilities';
// let sandbox = null;
// const Sinon = {};
//
//
// let ROUTER = null;
// let CURRENT_ROUTER_PARAMS = null;
// let CURRENT_ROUTER_PATH   = null;
// let CURRENT_ROUTER_QUERY = null;
// // Mock a router for the context
// beforeEach(function() {
//   sandbox = sinon.sandbox.create();
//   return ROUTER  = new TestRouter;
// });
//
// afterEach(() => sandbox.restore());
//
// // A wrapper component to setup the router context
// class Wrapper extends React.Component {
//   static childContextTypes = {
//     router: PropTypes.object,
//     dragDropManager: PropTypes.object,
//   };
//
//   getChildContext() {
//     return {
//       router: ROUTER,
//       dragDropManager: new DragDropManager(TestBackend),
//     };
//   }
//
//   render() {
//     const location = { pathname: '/' };
//     const props = _.omit(this.props, '_wrapped_component', 'injected');
//     if (!this.props.noReference) { props.ref = 'element'; }
//     const body = React.createElement(this.props._wrapped_component, props);
//     return (
//       <ReactRouter history={createHistory({ initialEntries: ['/dashboard'] })}>
//         {this.props.injected ? <Provider {...this.props.injected}>
//           {body}
//         </Provider> : body}
//       </ReactRouter>
//     );
//   }
// }
//
//
// const Testing = {
//   renderComponent(component, options = {}) {
//     if (!options.props) { options.props = {}; }
//     const unmountAfter = options.unmountAfter || 1;
//     CURRENT_ROUTER_PARAMS = options.routerParams || {};
//     CURRENT_ROUTER_QUERY = options.routerQuery || {};
//     CURRENT_ROUTER_PATH   = options.routerPath || '/';
//     if (typeof Router.currentParams.mockReturnValue === 'function') {
//       Router.currentParams.mockReturnValue(CURRENT_ROUTER_PARAMS);
//     }
//     if (typeof Router.currentQuery.mockReturnValue === 'function') {
//       Router.currentQuery.mockReturnValue(CURRENT_ROUTER_QUERY);
//     }
//     const root = document.createElement('div');
//     const promise = new Promise( function(resolve, reject) {
//       const props = _.clone(options.props);
//       props._wrapped_component = component;
//       const wrapper = ReactDOM.render( <Wrapper {...props} />, root );
//       return resolve({
//         root,
//         wrapper,
//         element: wrapper.refs.element,
//         dom: ReactDOM.findDOMNode(wrapper.refs.element),
//       });
//     });
//     // defer adding the then callback so it'll be called after whatever is attached after the return
//     _.defer(() => promise.then(function() {
//       _.delay( function() {
//         ReactDOM.unmountComponentAtNode(root);
//         CURRENT_ROUTER_PATH   = '/';
//         return CURRENT_ROUTER_PARAMS = {};
//       }
//         , unmountAfter );
//       return arguments;
//     })
//     );
//     return promise;
//   },
//
//   actions: commonActions,
//
//   shallowRender(component) {
//     const context = { router: ROUTER };
//     //    ReactContext.current = context
//     const renderer = ReactTestUtils.createRenderer();
//     renderer.render(component, context);
//     const output = renderer.getRenderOutput();
//     // ReactContext.current = {}
//
//     return output;
//   },
// };
//
// // Hide the router behind a defined property so it can access the ROUTER variable that's set in the beforeEach
// Object.defineProperty(
//   Testing,
//   'router',
//   {
//     get() { return ROUTER; },
//   },
// );
//
// const pause = scope =>
//   new Promise(function(resolve) {
//     return _.defer(() => resolve(scope));
//   })
// ;
//
//
// export { Testing, sinon, React, ReactDOM, _, ReactTestUtils, spyOnComponentMethod, stubComponentMethod, SnapShot, pause, Wrapper };

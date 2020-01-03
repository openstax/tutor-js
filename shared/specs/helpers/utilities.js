import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';

import { Promise } from 'es6-promise';
import _ from 'underscore';


const componentStub = {
  container: document.createElement('div'),

  _render(div, component, result) {
    if (result == null) { result = {}; }

    const promise = new Promise(function(resolve, reject) {
      try {
        return React.render(component, div, function() {
          component = this;
          // merge in custom results with the default kitchen sink of results
          result = _.defaults({ div, component }, result);
          return resolve(result);
        });
      } catch (error) {
        return reject(error);
      }
    });

    return promise;
  },

  render(component, result) {
    return this._render(this.container, component, result);
  },

  unmount() {
    React.unmountComponentAtNode(this.container);
    return this.container = document.createElement('div');
  },
};

const commonActions = {
  clickButton(div, selector) {
    if (selector == null) { selector = 'button.btn-primary'; }
    let button = div.querySelector(selector);
    commonActions.click(button);
    return button = div.querySelector(selector);
  },

  click(clickElementNode, eventData = {}) {
    return ReactTestUtils.Simulate.click(clickElementNode, eventData);
  },

  // http://stackoverflow.com/questions/24140773/could-not-simulate-mouseenter-event-using-react-test-utils
  mouseEnter(clickElementNode, eventData = {}) {
    return ReactTestUtils.SimulateNative.mouseOver(clickElementNode, eventData);
  },

  mouseLeave(clickElementNode, eventData = {}) {
    return ReactTestUtils.SimulateNative.mouseOut(clickElementNode, eventData);
  },

  blur(clickElementNode, eventData = {}) {
    return ReactTestUtils.Simulate.blur(clickElementNode, eventData);
  },

  select(selectElementNode) {
    return ReactTestUtils.Simulate.select(selectElementNode);
  },

  _clickMatch(selector, ...args) {
    const { div } = args[0];
    commonActions.clickButton(div, selector);
    return args[0];
  },

  clickMatch(selector) {
    return (...args) => Promise.resolve(commonActions._clickMatch(selector, ...Array.from(args)));
  },

  _clickComponent(target, ...args) {
    const targetNode = React.findDOMNode(target);
    commonActions.click(targetNode);
    return args[0];
  },

  _clickComponentOfType(targetComponent, ...args) {
    const { component } = args[0];
    const target = ReactTestUtils.findRenderedComponentWithType(component, targetComponent);
    return commonActions._clickComponent(target);
  },

  clickComponentOfType(targetComponent) {
    return (...args) => Promise.resolve(commonActions._clickComponentOfType(targetComponent, ...Array.from(args)));
  },

  clickComponent(targetComponent) {
    return (...args) => Promise.resolve(commonActions._clickComponent(targetComponent, ...Array.from(args)));
  },

  _clickDOMNode(targetNode, ...args) {
    commonActions.click(targetNode);
    return args[0];
  },

  clickDOMNode(targetDOMNode) {
    return (...args) => Promise.resolve(commonActions._clickDOMNode(targetDOMNode, ...Array.from(args)));
  },

  _focusMatch(selector, ...args) {
    const { div } = args[0];
    const elementNode = div.querySelector(selector);
    ReactTestUtils.Simulate.focus(elementNode);
    return args[0];
  },

  focusMatch(selector) {
    return (...args) => Promise.resolve(commonActions._focusMatch(selector, ...Array.from(args)));
  },

  _changeDOMNode(targetNode, eventData, ...args) {
    ReactTestUtils.Simulate.change(targetNode, eventData);
    return args[0];
  },

  _changeMatch(selector, eventData, ...args) {
    const { div } = args[0];
    const elementNode = div.querySelector(selector);
    commonActions._changeDOMNode(elementNode, eventData);
    return args[0];
  },

  changeMatch(selector, eventData) {
    return (...args) => Promise.resolve(commonActions._changeMatch(selector, eventData, ...Array.from(args)));
  },

  _hoverMatch(selector, ...args) {
    const { div } = args[0];
    const elementNode = div.querySelector(selector);
    ReactTestUtils.Simulate.mouseOver(elementNode);
    return args[0];
  },

  hoverMatch(selector) {
    return (...args) => Promise.resolve(commonActions._hoverMatch(selector, ...Array.from(args)));
  },

  _fillTextarea(selector, response, ...args) {
    const { div } = args[0];
    if (selector == null) { selector = 'textarea'; }
    if (response == null) { response = 'Test Response'; }

    const textarea = div.querySelector(selector);
    textarea.value = response;
    ReactTestUtils.Simulate.focus(textarea);
    ReactTestUtils.Simulate.keyDown(textarea, { key: 'Enter' });
    ReactTestUtils.Simulate.change(textarea);

    return _.defaults(args[0], { textarea });
  },

  fillTextarea(selector, response) {
    return (...args) => Promise.resolve(commonActions._fillTextarea(selector, response, ...Array.from(args)));
  },

  playThroughFunctions(actionAndCheckFunctions) {
    return (...args) =>
      // perform appropriate step actions for each incomplete step
      // by chaining each promised step action
      // Forces promises to execute in order.  The actions are order dependent
      // so Promises.all will not work in this case.
      actionAndCheckFunctions.reduce((current, next) => current.then(next)
        , Promise.resolve(...Array.from(args || [])))
    ;
  },
};

export { componentStub, commonActions };

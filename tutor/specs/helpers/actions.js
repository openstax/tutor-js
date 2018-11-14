import TestUtils from 'react-dom/test-utils';

const Actions = {
  clickButton(div, selector) {
    var button;
    if (selector == null) {
      selector = 'button.btn-primary';
    }
    button = div.querySelector(selector);
    commonActions.click(button);
    return button = div.querySelector(selector);
  },
  click(clickElementNode, eventData = {}) {
    return TestUtils.Simulate.click(clickElementNode, eventData);
  },
  // http://stackoverflow.com/questions/24140773/could-not-simulate-mouseenter-event-using-react-test-utils
  mouseEnter(clickElementNode, eventData = {}) {
    return TestUtils.SimulateNative.mouseOver(clickElementNode, eventData);
  },
  mouseLeave(clickElementNode, eventData = {}) {
    return TestUtils.SimulateNative.mouseOut(clickElementNode, eventData);
  },
  blur(clickElementNode, eventData = {}) {
    return TestUtils.Simulate.blur(clickElementNode, eventData);
  },
  select(selectElementNode) {
    return TestUtils.Simulate.select(selectElementNode);
  },
};

export default Actions;

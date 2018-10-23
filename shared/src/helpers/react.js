import MobxPropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import indexOf from 'lodash/indexOf';
import pickBy from 'lodash/pickBy';
import concat from 'lodash/concat';
import some from 'lodash/some';
import kebabCase from 'lodash/kebabCase';
import { detect } from 'detect-browser';
import 'mobx-react';

const PASSABLE_PROPS = ['className', 'id', 'children', 'target', 'ref', 'tabIndex', 'role'];
const PASSABLE_PREFIXES = ['data-', 'aria-', 'on'];
const filterProps = (props, options = {}) =>
  pickBy(props, (prop, name) =>

    (indexOf(concat(PASSABLE_PROPS, options.props || []), name) > -1) ||
      some(concat(PASSABLE_PREFIXES, options.prefixes || []), prefix => name.indexOf(prefix) === 0)
  )
;

const renderRoot = function(getComponent, rootEl, props = {}) {
  if (!rootEl) {
    rootEl = document.createElement('div');
    document.body.appendChild(rootEl);
  }

  rootEl.id = 'ox-react-root-container';
  const browser = detect();
  if (browser) {
    rootEl.setAttribute('data-browser', browser.name);
    rootEl.setAttribute('data-browser-version', browser.version);
  }
  rootEl.setAttribute('role', 'main');

  const render = function() {
    const Root = getComponent();
    return ReactDOM.render(<Root {...props} />, rootEl);
  };

  render();
  return render;
};


const ArrayOrMobxType = MobxPropTypes.oneOfType([
  MobxPropTypes.array,
  MobxPropTypes.observableArray,
]);

const idType = MobxPropTypes.oneOfType([
  MobxPropTypes.string,
  MobxPropTypes.number,
]);

export { filterProps, renderRoot, ArrayOrMobxType, idType };

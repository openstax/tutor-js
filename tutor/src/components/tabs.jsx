import React from 'react';
import classnames from 'classnames';
import { autobind } from 'core-decorators';
import { isNil, extend, partial, map, get } from 'lodash';
import Router from '../helpers/router';
import PropTypes from 'prop-types';
import qs from 'qs';
import { __RouterContext } from 'react-router-dom';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

// Used to cancel router transitions the same way an onClick event is
class FakeEvent {
  static initClass() {
    this.prototype._isDefaultPrevented = false;
  }
  preventDefault() { return this._isDefaultPrevented = true; }
  isDefaultPrevented() {  return this._isDefaultPrevented; }
}
FakeEvent.initClass();

// Renders ONLY the list of tabs (not tab body), with @props.chilren inline with the tabs
// Usefull for rendering controls beside the Tabs


const getTab = (props) => Router.currentQuery(props.windowImpl).tab;

export default

@observer
class Tabs extends React.Component {

  static contextType = __RouterContext;

  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    tabIndex: PropTypes.number,
    initialActive: PropTypes.number,
    params: PropTypes.object,
    className: PropTypes.string,
    tabs: PropTypes.arrayOf(
      PropTypes.oneOfType([ PropTypes.string, PropTypes.element ])
    ).isRequired,
    windowImpl: PropTypes.object,
    children: PropTypes.node,
  }

  static defaultProps = {
    windowImpl: window,
    initialActive: 0,
  }

  @observable activeIndex = isNil(getTab(this.props)) ? this.props.initialActive : parseInt(getTab(this.props));

  constructor(props) {
    super(props);
    if (this.activeIndex != this.props.initialActive) {
      const ev = new FakeEvent;
      this.props.onSelect(this.activeIndex, ev);
      if (ev.isDefaultPrevented()) {
        this.selectTabIndex(this.activeIndex);
      }
    }
  }

  // called when the router has transistioned, validate the new tabindex
  UNSAFE_componentWillReceiveProps(nextProps) {
    const tab = get(nextProps, 'params.tab');
    if (isNil(tab)) { return; }

    const activeIndex = parseInt(tab, 10);
    if (activeIndex === this.activeIndex) { return; }

    const ev = new FakeEvent;
    this.props.onSelect(activeIndex, ev);
    if (ev.isDefaultPrevented()) {
      if (this.context) {
        this.context.history.push(
          this.context.location.pathname, {}, { tab: this.activeIndex },
        );
      }
    } else {
      this.activeIndex = activeIndex;
    }
  }

  // callable from the parent component via a ref
  @action.bound selectTabIndex(activeIndex) {
    const query = extend(Router.currentQuery(this.props.windowImpl), { tab: activeIndex });
    if (this.context.history) {
      this.context.history.push(
        this.props.windowImpl.location.pathname + '?' + qs.stringify(query)
      );
    }
    this.activeIndex = activeIndex;
  }

  @action.bound onTabClick(activeIndex, ev) {
    this.props.onSelect(activeIndex, ev);
    if (!ev.isDefaultPrevented()) {
      this.selectTabIndex(activeIndex);
    }
    return (
      ev.preventDefault()
    );
  }

  @autobind renderTab(tab, index) {
    const isSelected = index === this.activeIndex;

    return (
      <li key={index} className={classnames({ active: isSelected })}
        aria-selected={isSelected != null ? isSelected : { 'true': 'false' }}
        role="tab"
      >
        <a
          href="#"
          onClick={partial(this.onTabClick, index)}>
          <h2>
            {tab}
          </h2>
        </a>
      </li>
    );
  }

  render() {
    return (
      <nav className={classnames('tutor-tabs', this.props.className)}>
        <ul className="nav nav-tabs" role="tablist">
          {map(this.props.tabs, this.renderTab)}
        </ul>
        {this.props.children}
      </nav>
    );
  }
}

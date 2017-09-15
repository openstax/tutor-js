import React from 'react';
import classnames from 'classnames';

import { isNil, extend, partial, map, get } from 'lodash';
import Router from '../helpers/router';
import qs from 'qs';

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

@observer
export default class CourseSettings extends React.PureComponent {

  static propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    tabIndex: React.PropTypes.number,
    initialActive: React.PropTypes.number,
    params: React.PropTypes.object,
    className: React.PropTypes.string,
    tabs: React.PropTypes.arrayOf(
      React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.element ])
    ).isRequired,
    windowImpl: React.PropTypes.object,
  }

  static defaultProps = {
    windowImpl: window,
    initialActive: 0,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  @observable activeIndex = isNil(getTab(this.props)) ? this.props.initialActive : parseInt(getTab(this.props));

  componentWillMount() {
    // the router tab query param specified a different value than initialActive
    if (this.activeIndex !== this.props.initialActive) {
      const ev = new FakeEvent;
      this.props.onSelect(this.activeIndex, ev);
      if (ev.isDefaultPrevented()) {
        this.selectTabIndex(this.props.initialActive);
      }
    }
  }

  // called when the router has transistioned, validate the new tabindex
  componentWillReceiveProps(nextProps) {
    const tab = get(nextProps, 'params.tab');
    if (isNil(tab)) { return; }

    const activeIndex = parseInt(tab, 10);
    if (activeIndex === this.activeIndex) { return; }

    const ev = new FakeEvent;
    this.props.onSelect(activeIndex, ev);
    if (ev.isDefaultPrevented()) {
      if (this.context.router) {
        this.context.router.history.push(
          this.context.router.getCurrentPathname(), {}, { tab: this.activeIndex },
        );
      }
    } else {
      this.activeIndex = activeIndex;
    }
  }

  // callable from the parent component via a ref
  @action.bound selectTabIndex(activeIndex) {
    const query = extend(Router.currentQuery(this.props.windowImpl), { tab: activeIndex });
    if (this.context.router != null) {
      this.context.router.history.push(
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

  @action.bound renderTab(tab, index) {
    const isSelected = index === this.activeIndex;

    return (
      <li key={index} className={classnames({ active: isSelected })}>
        <a
          href="#"
          aria-selected={isSelected != null ? isSelected : { 'true': 'false' }}
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
        <ul className="nav nav-tabs">
          {map(this.props.tabs, this.renderTab)}
        </ul>
        {this.props.children}
      </nav>
    );
  }
}

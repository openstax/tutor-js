import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

import {  partial, flatMap, get, isEmpty } from 'lodash';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import Icon from '../icon';

import TourAnchor from '../tours/anchor';
import BrowseTheBook from '../buttons/browse-the-book';
import Router from '../../helpers/router';
import User from '../../models/user';
import UserMenu from '../../models/user/menu';
import Courses from '../../models/courses-map';

function BrowseBookMenuItem({ params: { courseId }, label }) {
  return (
    <li role="presentation">
      <BrowseTheBook unstyled courseId={courseId}>
        <TourAnchor id="menu-option-browse-book">{label}</TourAnchor>
      </BrowseTheBook>
    </li>
  );
}

const CustomComponents = {
  browseBook: BrowseBookMenuItem,
};

@observer
export default class ActionsMenu extends React.Component {

  static defaultProps = { windowImpl: window }

  static propTypes = {
    courseId: React.PropTypes.string,
    windowImpl: React.PropTypes.object,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  @autobind
  transitionToMenuItem(href, evKey, clickEvent) {
    clickEvent.preventDefault();
    this.context.router.history.push(href);
  }

  @autobind
  renderMenuItem(menuOption) {
    const options = menuOption.options || {};
    const isActive = false;
    const key = `menu-option-${options.key || menuOption.name || menuOption.key || menuOption.label}`;
    const Component = CustomComponents[menuOption.name];

    if (Component) {
      return <Component key={key} {...menuOption} active={isActive} />;
    }

    let props;
    if (menuOption.href) {
      props = { href: menuOption.href };
    } else {
      const href = Router.makePathname(menuOption.name, menuOption.params, menuOption.options);
      props = { href, onSelect: partial(this.transitionToMenuItem, href) };
    }

    const item = (
      <MenuItem
        {...props}
        className={classnames(menuOption.name, options.className, { 'active': isActive })}
        key={key}
        data-name={menuOption.name}
      >
        <TourAnchor id={key}>
          {menuOption.label}
        </TourAnchor>
      </MenuItem>
    );
    if (options.separator) {
      const separator = (suffix = 'divider') =>
        <MenuItem divider={true} key={`${key}-${suffix}`} />;
      switch (options.separator) {
      case 'after':
        return [item, separator()];
      case 'before':
        return [separator(), item];
      case 'both':
        return [separator('before'), item, separator('after')];
      }
    }
    return item;
  }

  render() {
    const menuRoutes = UserMenu.getRoutes(this.props.courseId);

    if (isEmpty(menuRoutes)) {
      return null;
    }

    return (
      <Dropdown
        id="actions-menu"
        pullRight
        className={classnames('actions-menu')}
      >
        <Dropdown.Toggle
          useAnchor={true}
          noCaret
        >
          <Icon type="bars" />
          <span className="control-label" title="Menu and settings">Menu</span>
          <Icon type="angle-down" />
        </Dropdown.Toggle>
        <Dropdown.Menu >
          {flatMap(menuRoutes, this.renderMenuItem)}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

}

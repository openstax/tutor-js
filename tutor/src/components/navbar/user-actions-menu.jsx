import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';

import {  partial, flatMap, get } from 'lodash';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import Icon from '../icon';

import TourAnchor from '../tours/anchor';
import AccountLink from './account-link';
import BrowseTheBook from '../buttons/browse-the-book';
import LogOut from './logout';
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
export default class UserActionsMenu extends React.PureComponent {

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
    this.context.router.transitionTo(href);
  }

  @autobind
  renderMenuItem(menuOption) {
    const options = menuOption.options || {};
    const isActive = menuOption.name && Router.isActive(menuOption.name, menuOption.params, { window: this.props.windowImpl });
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

    const course = Courses.get(this.props.courseId);
    const isConceptCoach = get(course, 'is_concept_coach', false);
    return (
      <Dropdown
        id="user-actions-menu"
        pullRight
        className={classnames('user-actions-menu', { 'is-concept-coach': isConceptCoach })}
      >
        <Dropdown.Toggle
          useAnchor={true}
        >
          <Icon type="user" />
          <span>{User.name}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu >
          {flatMap(UserMenu.getRoutes(this.props.courseId), this.renderMenuItem)}
          <AccountLink bsRole="menu-item" />
          <LogOut bsRole="menu" isConceptCoach={isConceptCoach} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }

}

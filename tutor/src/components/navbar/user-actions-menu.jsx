import React from 'react';

import { Dropdown, MenuItem } from 'react-bootstrap';
import {  partial, map, get } from 'lodash';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';

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
  renderMenuItem(route, index) {
    const isActive = route.name && Router.isActive(route.name, route.params, { window: this.props.windowImpl });
    const key = route.key ? `dropdown-item-${route.key}` : `dropdown-item-${index}`;
    const Component = CustomComponents[route.name];

    if (Component) {
      return <Component key={key} {...route} active={isActive} />;
    }

    let props;
    if (route.href) {
      props = { href: route.href };
    } else {
      const href = Router.makePathname(route.name, route.params, route.options);
      props = { href, onSelect: partial(this.transitionToMenuItem, href) };
    }

    // MenuItem doesn't pass on props to the li currently, so using className instead for route.name visual control.
    return (
      <MenuItem
        {...props}
        className={classnames(route.name, get(route, 'options.className'), { 'active': isActive })}
        key={key}
        data-name={route.name}
      >
        <TourAnchor id={`menu-option-${route.name || route.key || route.label}`}>
          {route.label}
        </TourAnchor>
      </MenuItem>
    );
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
          {User.name}
        </Dropdown.Toggle>
        <Dropdown.Menu >
          {map(UserMenu.getRoutes(this.props.courseId), this.renderMenuItem)}
          <MenuItem divider={true} key="dropdown-item-divider" />
          <AccountLink bsRole="menu-item" />
          <MenuItem
            key="nav-help-link"
            className="-help-link"
            target="_blank"
            href={UserMenu.helpLinkForCourseId(this.props.courseId)}
            onSelect={this.externalLinkClicked}>
            <span>
              Get Help
            </span>
          </MenuItem>
          <LogOut bsRole="menu" isConceptCoach={isConceptCoach} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }

}

import React from 'react';

import { Dropdown, MenuItem } from 'react-bootstrap';


import { invoke, partial, map, each, get } from 'lodash';
import classnames from 'classnames';
import TourAnchor from '../tours/anchor';
import Router from '../../helpers/router';
import UserName from './username';
import AccountLink from './account-link';
import BrowseTheBook from '../buttons/browse-the-book';
import BindStoreMixin from '../bind-store-mixin';
import LogOut from './logout';

import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';

import User from '../../models/user';
import UserMenu from '../../models/user/menu';
import Courses from '../../models/courses-map';

const BrowseBookMenuOption = props =>
  <li>
    <BrowseTheBook unstyled={true} courseId={props.courseId}>
      <TourAnchor id="menu-option-browse-book">
        <span>
          Browse the Book
        </span>
      </TourAnchor>
    </BrowseTheBook>
  </li>
;

@observer
export default class UserActionsMenu extends React.PureComponent {

  static defaultProps = { windowImpl: window }

  static propTypes = {
    courseId: React.PropTypes.string,
    onItemClick: React.PropTypes.func,
    windowImpl: React.PropTypes.object,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  transitionToMenuItem(href, evKey, clickEvent) {
    clickEvent.preventDefault();
    this.context.router.transitionTo(href);
    invoke(this.props, 'onItemClick');
  }


  externalLinkClicked() {
    invoke(this.props, 'onItemClick');
  }

  @autobind
  renderMenuItem(route, index) {

    const isActive = route.name && Router.isActive(route.name, route.params, { window: this.props.windowImpl });

    let props;
    if (route.href) {
      props = {
        href: route.href,
        onSelect: this.props.onItemClick,
      };
    } else {
      const href = Router.makePathname(route.name, route.params, route.options);
      props = { href, onSelect: partial(this.transitionToMenuItem, href) };
    }
    const key = route.key ? `dropdown-item-${route.key}` : `dropdown-item-${index}`;

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

  renderMenuItems() {
    const { courseId } = this.props;

    const menu = map(UserMenu.getRoutes(courseId), this.renderMenuItem);

    menu.push(<BrowseBookMenuOption key="browse-book" courseId={courseId} />);

    // if (User.isTeacher && courseId) {
    //   menu.push(<BS.MenuItem divider={true} key="dropdown-item-divider-course" />);
    //   each(UserMenu.getCourseMenuRoutes(courseId, false), (route) => {
    //     return (
    //       menu.push(this.renderMenuItem(route, menu.length))
    //     );
    //   });
    // }

    if (User.is_admin) {
      menu.push(this.renderMenuItem({ label: 'Admin', href: '/admin', key: 'admin' }, menu.length ));
    }

    if (User.is_customer_service) {
      menu.push(this.renderMenuItem({ label: 'Customer Service', href: '/customer_service', key: 'cs' }, menu.length ));
    }

    if (User.is_content_analyst) {
      menu.push(this.renderMenuItem({ name: 'QADashboard', label: 'QA Content', params: {} }, menu.length ));
      menu.push(this.renderMenuItem({ label: 'Content Analyst', href: '/content_analyst', key: 'ca' }, menu.length ));
    }

    menu.push(<MenuItem divider={true} key="dropdown-item-divider" />);
    return (
        menu
    );
  }

  render() {
    const course = Courses.get(this.props.courseId);
    const isConceptCoach = get(course, 'is_concept_coach', false);
    return (
      <Dropdown
        className={classnames('user-actions-menu', { 'is-concept-coach': isConceptCoach })}
      >
        <Dropdown.Toggle
          useAnchor={true}
        >
          {User.name}
        </Dropdown.Toggle>
        <Dropdown.Menu >
          {this.renderMenuItems()}
          <AccountLink bsRole="menu-item" onClick={this.externalLinkClicked} />
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

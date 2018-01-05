import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import TutorRouter from '../../helpers/router'
import { Route } from 'react-router';

import {  partial, flatMap, get, isEmpty, omit } from 'lodash';
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

const RoutedMenuItem = (props) => {
  const { label, name, tourId, className, route } = props;
  const isActive = TutorRouter.isActive(route.name, route.params, route.options);

  return (<Route path={props.href} exact>
    <MenuItem
      className={classnames(name, className, { 'active': isActive })}
      data-name={name}
      {...omit(props, ['label', 'name', 'tourId', 'className', 'route'])}
    >
      <TourAnchor id={tourId}>
        {label}
      </TourAnchor>
    </MenuItem>
  </Route>);
}

function BrowseBookMenuItem({ params: { courseId }, className, active, label }) {
  return (
    <li role="presentation" className={classnames(className, { 'active': active })}>
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
    const isActive = TutorRouter.isActive(menuOption.name, menuOption.params, menuOption.options);
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

    const item = (<RoutedMenuItem {...props}
      route={menuOption}
      key={key}
      tourId={key}
      label={menuOption.label}
      name={menuOption.name}
    />);

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

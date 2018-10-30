import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import TutorRouter from '../../helpers/router';
import { Route } from 'react-router';
import { partial, flatMap, isEmpty, omit } from 'lodash';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { autobind } from 'core-decorators';
import Icon from '../icon';
import TourAnchor from '../tours/anchor';
import Router from '../../helpers/router';
import UserMenu from '../../models/user/menu';
import Course from '../../models/course';

const RoutedDropdownItem = (props) => {
  const { label, name, tourId, className, route } = props;
  const isActive = TutorRouter.isActive(route.name, route.params, route.options);

  return (
    <Route path={props.href} exact>
      <Dropdown.Item
        className={classnames(name, className, { 'active': isActive })}
        data-name={name}
        {...omit(props, ['label', 'name', 'tourId', 'className', 'route'])}
      >
        <TourAnchor id={tourId}>
          {label}
        </TourAnchor>
      </Dropdown.Item>
    </Route>
  );
};

function BrowseBookDropdownItem({ params: { course }, className, active, label, ...props }) {
  return (
    <Dropdown.Item
      {...props}
      href={`/book/${course.ecosystem_id}`}
      target="_blank"
    >
      <TourAnchor id="menu-option-browse-book">
        Browse the Book
      </TourAnchor>
    </Dropdown.Item>
  );
}

const CustomComponents = {
  browseBook: BrowseBookDropdownItem,
};

export default
@observer
class ActionsMenu extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
  }

  static contexttypes = {
    router: PropTypes.object,
  }

  @autobind
  transitionToDropdownItem(href, evKey, clickEvent) {
    clickEvent.preventDefault();
    this.context.router.history.push(href);
  }

  @autobind
  renderDropdownItem(menuOption) {
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
      props = { href, onSelect: partial(this.transitionToDropdownItem, href) };
    }

    const item = (
      <RoutedDropdownItem
        {...props}
        route={menuOption}
        key={key}
        tourId={key}
        label={menuOption.label}
        name={menuOption.name}
      />
    );

    if (options.separator) {
      const separator = (suffix = 'divider') =>
        <Dropdown.Item divider={true} key={`${key}-${suffix}`} />;
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
    const menuRoutes = UserMenu.getRoutes(this.props.course);

    if (isEmpty(menuRoutes)) {
      return null;
    }

    return (
      <Dropdown
        className={classnames('actions-menu')}
      >
        <Dropdown.Toggle
          id="actions-menu"
          aria-label="Menu and settings"
          variant="ox"
        >
          <Icon type="bars" />
          <span className="control-label" title="Menu and settings">Menu</span>
          <Icon type="angle-down" className="toggle" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {flatMap(menuRoutes, this.renderDropdownItem)}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

};

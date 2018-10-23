import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
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
import Courses from '../../models/courses-map';

const RoutedMenuItem = (props) => {
  const { label, name, tourId, className, route } = props;
  const isActive = TutorRouter.isActive(route.name, route.params, route.options);

  return (
    <Route path={props.href} exact>
      <MenuItem
        className={classnames(name, className, { 'active': isActive })}
        data-name={name}
        {...omit(props, ['label', 'name', 'tourId', 'className', 'route'])}
      >
        <TourAnchor id={tourId}>
          {label}
        </TourAnchor>
      </MenuItem>
    </Route>
  );
};

function BrowseBookMenuItem({ params: { courseId }, className, active, label, ...props }) {
  const course = Courses.get(courseId);
  return (
    <MenuItem
      {...props}
      href={`/book/${course.ecosystem_id}`}
      target="_blank"
    >
      <TourAnchor id="menu-option-browse-book">
        Browse the Book
      </TourAnchor>
    </MenuItem>
  );
}

const CustomComponents = {
  browseBook: BrowseBookMenuItem,
};

export default
@observer
class ActionsMenu extends React.Component {

  static defaultProps = { windowImpl: window }

  static propTypes = {
    courseId: PropTypes.string,
    windowImpl: PropTypes.object,
  }

  static contextTypes = {
    router: PropTypes.object,
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

    const item = (
      <RoutedMenuItem
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
        className={classnames('actions-menu')}
      >
        <Dropdown.Toggle
          useAnchor={true}
          aria-label="Menu and settings"
          noCaret
        >
          <Icon type="bars" />
          <span className="control-label" title="Menu and settings">Menu</span>
          <Icon type="angle-down" className="toggle" />
        </Dropdown.Toggle>
        <Dropdown.Menu >
          {flatMap(menuRoutes, this.renderMenuItem)}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

};

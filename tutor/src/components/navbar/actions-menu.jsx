import { React, PropTypes, cn, observer, autobind, useHistory } from 'vendor';
import { Dropdown } from 'react-bootstrap';
import TutorRouter from '../../helpers/router';
import { flatMap, isEmpty } from 'lodash';
import { Icon } from 'shared';
import TourAnchor from '../tours/anchor';
import Router from '../../helpers/router';
import UserMenu from '../../models/user/menu';
import Course from '../../models/course';

const RoutedDropdownItem = (props) => {
  // eslint-disable-next-line react/prop-types
  let { label } = props;
  const {
    // eslint-disable-next-line react/prop-types
    name, tourId, className, route, locked, href, options = {},
  } = props;
  const active = TutorRouter.isActive(route.name, route.params, route.options);
  const history = useHistory();

  const onClick = (ev) => {
    ev.preventDefault();
    if (options.newWindow) {
      window.open(href);
    } else if (options.redirect) {
      window.location = href;
    } else {
      history.push(href);
    }
  };

  if (locked) {
    label = (
      <React.Fragment>
        {label}
        <Icon type="lock" />
      </React.Fragment>
    );
  }

  return (
    <Dropdown.Item
      onClick={onClick}
      data-item={options.key || name}
      disabled={locked}
      className={cn(className, { locked, active })}
    >
      <TourAnchor id={tourId}>
        {label}
      </TourAnchor>
    </Dropdown.Item>

  );
};

RoutedDropdownItem.propTypes = {
  route: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};


// eslint-disable-next-line
function BrowseBookDropdownItem({ course, className, active, label, ...props }) {
  return (
    <Dropdown.Item
      {...props}
      href={`/book/${course.id}`}
      target="_blank"
    >
      <TourAnchor id="menu-option-browse-book">
        Browse the Book
      </TourAnchor>
    </Dropdown.Item>
  );
}
BrowseBookDropdownItem.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
};
const CustomComponents = {
  browseBook: BrowseBookDropdownItem,
};

export default
@observer
class ActionsMenu extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
  }

  @autobind
  renderDropdownItem(menuOption) {
    const options = menuOption.options || {};
    const isActive = TutorRouter.isActive(menuOption.name, menuOption.params, menuOption.options);
    const key = `menu-option-${options.key || menuOption.name || menuOption.key || menuOption.label}`;
    const Component = CustomComponents[menuOption.name];

    if (Component) {
      return <Component key={key} {...menuOption} course={this.props.course} active={isActive} />;
    }

    let props;
    if (menuOption.href) {
      props = { href: menuOption.href, target: menuOption.target };
    } else {
      const href = Router.makePathname(menuOption.name, menuOption.params, menuOption.options);
      props = { href };
    }

    const item = (
      <RoutedDropdownItem
        {...props}
        {...menuOption}
        route={menuOption}
        key={key}
        tourId={key}
      />
    );

    if (options.separator) {
      const separator = (suffix = 'divider') =>
        <Dropdown.Divider key={`${key}-${suffix}`} />;
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
      <Dropdown className="actions-menu">
        <Dropdown.Toggle
          id="actions-menu"
          aria-label="Menu and settings"
          variant="ox"
        >
          <Icon type="bars" />
          <span className="control-label" title="Menu and settings">Menu</span>
          <Icon type="chevron-down" className="toggle" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {flatMap(menuRoutes, this.renderDropdownItem)}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

}

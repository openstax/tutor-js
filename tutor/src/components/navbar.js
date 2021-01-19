import {
  React, PropTypes, observer, cn,
} from 'vendor';
import { get } from 'lodash';
import Router from '../helpers/router';
import { NavbarContext } from './navbar/context';
import { Nav, NavbarBottomShadow } from './navbar/nav';


@observer
class Navbar extends React.Component {

  static propTypes = {
    area: PropTypes.string.isRequired,
    isDocked: PropTypes.bool,
    context: PropTypes.instanceOf(NavbarContext).isRequired,
  };

  getRouterName() {
    return get(Router.currentMatch(), 'entry.name', '');
  }

  render() {
    const {
      area, isDocked, context: {
        isEmpty, className, left, right, center,
      },
    } = this.props;
    if (isEmpty) {
      return null;
    }

    const navRouteClassName = `nav-${this.getRouterName()}`;

    return (
      <Nav
        area={area}
        shouldHideNavbar={this.shouldHideNavbar}
        isDocked={isDocked}
        className={cn('tutor-navbar', navRouteClassName, className)}
      >
        <div className="left-side-controls">
          {left.components}
        </div>
        <div className="center-control">
          {center.components}
        </div>
        <div className="right-side-controls">
          {right.components}
        </div>
      </Nav>
    );
  }
}

export { Navbar, NavbarBottomShadow };

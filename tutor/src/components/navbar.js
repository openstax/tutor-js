import {
  React, PropTypes, observer, cn,
} from 'vendor';
import { NavbarContext } from './navbar/context';
import { Nav, NavbarBottomShadow } from './navbar/nav';


@observer
class Navbar extends React.Component {

  static propTypes = {
    area: PropTypes.string.isRequired,
    isDocked: PropTypes.bool,
    context: PropTypes.instanceOf(NavbarContext).isRequired,
  };

  render() {
    const {
      area, isDocked, context: {
        isEmpty, className, left, right, center,
      },
    } = this.props;
    if (isEmpty) {
      return null;
    }

    return (
      <Nav
        area={area}
        shouldHideNavbar={this.shouldHideNavbar}
        isDocked={isDocked}
        className={cn('tutor-navbar', className)}
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

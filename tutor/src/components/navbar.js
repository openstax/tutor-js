import {
  React, PropTypes, observer, styled, css, cn,
} from 'vendor';
import Theme, { breakpoint } from 'theme';
import { NavbarContext } from './navbar/context';

const NavbarBottomShadow = css`
   box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.1);
`;

const Docked = css`
   position: relative;
   border-bottom: 1px solid ${Theme.colors.navbars.border};
`;

const Header = css`
   top: 0;
   z-index: ${Theme.zIndex.navbar};
   height: ${Theme.navbars.top.height};
   ${props => props.isDocked && Docked}
   ${props => !props.isDocked && NavbarBottomShadow}
`;

const Footer = css`
   bottom: 0;
   box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.1);
   z-index: ${Theme.zIndex.footer};
   height: ${Theme.navbars.bottom.height};
`;

const Nav = styled.nav`
  color: ${Theme.colors.neutral.gray};
  background: white;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  justify-content: center;
  padding-right: 1rem;
  padding-left:  1rem;
  position: fixed;
  right: 0;
  left: 0;
  transition: height 0.2s ease-in-out;
  ${props => props.area == 'header' && Header};
  ${props => props.area == 'footer' && Footer};
  > * { display: flex; }
  .left-side-controls,
  .right-side-controls {
    flex: 1;
  }
  .right-side-controls {
    justify-content: flex-end;
  }
`;

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

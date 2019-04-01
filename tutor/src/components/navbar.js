import {
  React, PropTypes, observer, styled, css, cn,
} from '../helpers/react';
import Theme from '../theme';
import { NavbarContext } from './navbar/context';

const NavbarBottomShadow = css`
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, 0.1);
`;

export { NavbarBottomShadow };

const Docked = css`
  position: inherit;
  border-bottom: 1px solid ${Theme.colors.neutral.lighter};
`;

const Header = css`
  top: 0;
  z-index: 1030;
  height: ${Theme.navbars.top.height};
  ${props => props.isDocked && Docked}
  ${props => !props.isDocked && NavbarBottomShadow}
`;

const Footer = css`
  bottom: 0;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.1);
  z-index: 5;
  height: ${Theme.navbars.bottom.height};
`;

const Collapsed = css`

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
  ${props => props.isCollapsed && Collapsed}
`;

const Region = css`
  display: flex;
`;

const Side = css`
 ${Region}
  flex: 1;
`;

const Left = styled.div`
  ${Side}
`;

const Right = styled.div`
  ${Side}
  justify-content: flex-end;
`;

const Center = styled.div`
  ${Region}
`;

@observer
class Navbar extends React.Component {

  static propTypes = {
    area: PropTypes.string.isRequired,
    isCollapsed: PropTypes.bool,
    isDocked: PropTypes.bool,
    context: PropTypes.instanceOf(NavbarContext).isRequired,
  };

  render() {
    const {
      area, isCollapsed, isDocked, context: {
        isEmpty, className, left, right, center,
      },
    } = this.props;

    if (isEmpty) {
      return null;
    }

    return (
      <Nav
        area={area}
        isDocked={isDocked}
        isCollapsed={isCollapsed}
        className={cn('tutor-navbar', className)}
      >
        <Left className="left-side-controls">
          {left.components}
        </Left>
        <Center className="center-control">
          {center.components}
        </Center>
        <Right className="right-side-controls">
          {right.components}
        </Right>
      </Nav>
    );
  }
}

export { Navbar };

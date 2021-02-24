import { React, PropTypes, styled, css, observer, cn } from 'vendor';
import { NavbarBottomShadow } from '../navbar.js';

const Padding = css`
  padding-right: 1rem;
  padding-left: 1rem;
`;

const StyledSecondaryToolbar = styled.div`
  top: 0;
  z-index: 1029;
  position: sticky;
  background: white;
  ${props => !props.renderFn.unpadded && Padding}
  ${NavbarBottomShadow};
`;

@observer
class SecondaryToolbar extends React.Component {

  static propTypes = {
      controls: PropTypes.func.isRequired,
      className: PropTypes.string,
  }

  render() {
      const { controls, className } = this.props;

      return (
          <StyledSecondaryToolbar renderFn={controls} className={cn(className)}>
              {controls()}
          </StyledSecondaryToolbar>
      );
  }

}

export { SecondaryToolbar };

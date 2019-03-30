import { React, PropTypes, styled, observer } from '../../helpers/react';
import { NavbarBottomShadow } from '../navbar.js';

const StyledSecondaryToolbar = styled.div`
  top: 0;
  z-index: 6;
  position: sticky;
  background: white;
  padding-right: 1rem;
  padding-left: 1rem;
  ${NavbarBottomShadow};
`;

@observer
class SecondaryToolbar extends React.Component {

  static propTypes = {
    controls: PropTypes.func.isRequired,
  }

  render() {
    const { controls } = this.props;
    return (
      <StyledSecondaryToolbar>
        {controls()}
      </StyledSecondaryToolbar>
    );
  }

}

export { SecondaryToolbar };

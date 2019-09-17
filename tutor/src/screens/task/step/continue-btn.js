import { React, PropTypes, styled } from '../../../helpers/react';
import { Button } from 'react-bootstrap';


const StyledBtn = styled(Button).attrs({ size: 'lg' })`
  align-self: flex-end;
  margin: 4rem;
`;

export default function ContinueBtn({ ux: {
  canGoForward, isForwardEnabled, goForward,
}, ...props }) {
  if (!canGoForward) { return null; }

  return (
    <StyledBtn
      variant="primary"
      {...props}
      className="continue"
      disabled={!isForwardEnabled}
      onClick={goForward}
    >
      Continue
    </StyledBtn>
  );
}


ContinueBtn.propTypes = {
  ux: PropTypes.shape({
    isForwardEnabled: PropTypes.bool.isRequired,
    canGoForward: PropTypes.bool.isRequired,
    goForward: PropTypes.func.isRequired,
  }).isRequired,
};

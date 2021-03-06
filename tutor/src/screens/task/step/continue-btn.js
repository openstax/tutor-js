import { React, PropTypes, styled } from 'vendor';
import { Button } from 'react-bootstrap';


const StyledBtn = styled(Button).attrs({ size: 'lg' })`
  align-self: flex-end;
  margin: 4rem;
  float: right;
`;

export default function ContinueBtn({
    ux: { canGoForward, goForward, canUpdateCurrentStep },
    label = canUpdateCurrentStep ? 'Next' : 'Continue',
    ...props }) {
    return (
        <StyledBtn
            variant="primary"
            {...props}
            className="continue"
            disabled={!canGoForward}
            onClick={goForward}
        >
            {label}
        </StyledBtn>
    );
}


ContinueBtn.propTypes = {
    label: PropTypes.string,
    ux: PropTypes.shape({
        canGoForward: PropTypes.bool.isRequired,
        goForward: PropTypes.func.isRequired,
        canUpdateCurrentStep: PropTypes.bool,
        goToStepId: PropTypes.func.isRequired,
    }).isRequired,
};

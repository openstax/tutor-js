import { React, styled, PropTypes } from 'vendor';
import { colors } from 'theme';
import { Icon } from 'shared';

const StyledSavePracticeButton = styled.button`
    border: 1px solid ${colors.cerulan};
    border-radius: 4px;
    font-size: 1.4rem;
    line-height: 1.8rem;
    color: ${colors.cerulan};
    padding: 2px 10px 2px 5px;

    .save-practice-icon {
        margin-right: 0.75rem;
        margin-left: 0.15rem;
        padding: 1px;
        vertical-align: -0.2em;
    }
`;

const SavePracticeButton = ({ disabled = false }) => {
  return <StyledSavePracticeButton disabled={disabled}> 
    <Icon
      type="plus"
      color={colors.cerulan}
      className="save-practice-icon"/>
   Save to practice 
  </StyledSavePracticeButton>;
};
SavePracticeButton.propTypes = {
  disabled: PropTypes.bool,
};

export default SavePracticeButton;
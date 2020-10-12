import { React, styled, PropTypes, css } from 'vendor';
import { colors } from 'theme';
import { Icon } from 'shared';

const StyledSavePracticeButton = styled.button`
    border: 1px solid ${colors.cerulan};
    border-radius: 4px;
    font-size: 1.4rem;
    line-height: 1.8rem;
    color: ${colors.cerulan};
    padding: 2px 5px;

    ${props => props.isSaved && css`
      color: white;
      background-color: ${colors.cerulan};
    `}

    .save-practice-icon {
        margin-right: 0.75rem;
        margin-left: 0.15rem;
        padding: 1px;
        vertical-align: -0.2em;
    }
`;

const getIcon = (isSaved) => {
  return (
    <>
      {
        isSaved
          ? <Icon
            type="minus"
            color="white"
            className="save-practice-icon"/>
          : <Icon
            type="plus"
            color={colors.cerulan}
            className="save-practice-icon"/>
      }
    </>
  );
};

/**
 * Creates a button that says "Save to practice" or "Remove from pratice" depending if the question was saved or not.
 * The state of the button is not controlled in this component because a student can click this button in a MPQ and save all of the questions in that MPQ.
 * Therefore we pass the `isSaved` prop to see if the question was saved, and `addOrRemove` function to call the api to remove or add the question to pratice.
 * @param {*} param0 
 */
const SavePracticeButton = ({ disabled = false, isSaved, addOrRemove }) => {
  return (
    <StyledSavePracticeButton
      disabled={disabled}
      onClick={addOrRemove}
      isSaved={isSaved}
      className="save-practice-button"> 
      {getIcon(isSaved)}
      {isSaved ? 'Remove from' : 'Save to'} practice 
    </StyledSavePracticeButton>
  );
};
SavePracticeButton.propTypes = {
  disabled: PropTypes.bool,
  isSaved: PropTypes.bool.isRequired,
  addOrRemove: PropTypes.func.isRequired,
};

export default SavePracticeButton;
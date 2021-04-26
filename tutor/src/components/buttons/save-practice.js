import { React, styled, PropTypes, css, observer } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { colors } from 'theme';
import { Icon } from 'shared';

const StyledSavePracticeButton = styled.button`
    border: 1px solid ${colors.cerulan};
    border-radius: 4px;
    font-size: 1.4rem;
    line-height: 1.8rem;
    color: ${colors.cerulan};
    padding: 2px 5px;
    background-color: white;

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

const getIconAndLabel = (isSaved, isSavingOrRemoving) => {
    if (isSavingOrRemoving) {
        return (
            <>
                <Icon
                    type='spinner'
                    spin
                    className="save-practice-icon" />
                <span>{isSaved ? 'Removing...' : 'Saving...'}</span>
            </>
        );
    } 
    if(isSaved) {
        return (
            <>
                <Icon
                    type="minus"
                    color="white"
                    className="save-practice-icon"/>
                <span>Remove from practice</span>
            </>
        );
    }

    return (
        <>
            <Icon
                type="plus"
                color={colors.cerulan}
                className="save-practice-icon"/>
            <span>Save to practice</span>
        </>
    );
};

const mpqTooltip = (
    <Tooltip id="mpq-practice-question-tooltip">
      All parts get saved in a multi-part question.
    </Tooltip>
);


const SavePracticeButton = observer(({
    disabled = false,
    practiceQuestions = undefined,
    taskStep = undefined,
}) => {

    const saveOrRemovePracticeQuestion = () => {
        const practiceQuestion = getPracticeQuestion();
        if(practiceQuestion) {
            practiceQuestion.destroy();
        }
        else {
            practiceQuestions.create({ tasked_exercise_id: taskStep.tasked_id });
        }
    };

    const getPracticeQuestion = () => {
        return practiceQuestions.findByExerciseId(taskStep.exercise_id);
    };

    const isSaved = () => {
        return Boolean(getPracticeQuestion());
    };

    const isMpq = () => {
        return Boolean(taskStep && taskStep.multiPartGroup);
    };

    const savePracticeButton = () => {
        if(disabled) {
            return (
                <StyledSavePracticeButton
                    disabled={disabled}
                    className="save-practice-button"
                    data-test-id="save-practice-button"> 
                    {getIconAndLabel()}
                </StyledSavePracticeButton>
            );
        }

        return (
            <StyledSavePracticeButton
                onClick={saveOrRemovePracticeQuestion}
                isSaved={isSaved()}
                className="save-practice-button"
                data-test-id="save-practice-button"> 
                {getIconAndLabel(isSaved(), practiceQuestions.isAnyPending)}
            </StyledSavePracticeButton>
        );
    };
    

    // return button with mpq tooltip info
    // only after the question was saved
    if(isMpq() && isSaved()) {
        return(
            <OverlayTrigger
                placement="bottom"
                overlay={mpqTooltip}
                delay={{ show: 50, hide: 150 }}
            >
                {savePracticeButton()}
            </OverlayTrigger>
        );
    }
    return savePracticeButton();

});

SavePracticeButton.propTypes = {
    disabled: PropTypes.bool,
    practiceQuestions: PropTypes.object,
    taskStep: PropTypes.object,
};

export default SavePracticeButton;

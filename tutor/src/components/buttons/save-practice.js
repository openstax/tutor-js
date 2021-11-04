import { React, styled, PropTypes, css, observer, cn } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { colors } from 'theme';
import { Icon } from 'shared';
import { runInAction } from 'shared/model';

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

const getIconAndLabel = (isSaved, isSavingOrRemoving, label) => {
    if (isSavingOrRemoving) {
        return (
            <>
                <Icon
                    type='spinner'
                    spin
                    className="save-practice-icon"
                />
                <span>{isSaved ? 'Removing...' : 'Saving...'}</span>
            </>
        );
    }

    return (
        <>
            <Icon
                type="star"
                color={isSaved ? 'white' : colors.cerulan}
                className="save-practice-icon"
                aria-label={label}
            />
            <span>{label}</span>
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
        if (practiceQuestion) {
            practiceQuestion.destroy();
        }
        else {
            runInAction(() => practiceQuestions.create(taskStep.tasked_id));
        }
    };

    const getPracticeQuestion = () => {
        if (!practiceQuestions) { return null; }
        return practiceQuestions.findByUuid(taskStep.exercise_uuid);
    };

    const isSaved = () => {
        return Boolean(getPracticeQuestion());
    };

    const isMpq = () => {
        return Boolean(taskStep && taskStep.multiPartGroup);
    };

    const savePracticeButton = () => {
        const label = `${isSaved() ? 'Remove from' : 'Save to'} practice`;

        if (disabled) {
            return (
                <StyledSavePracticeButton
                    disabled={disabled}
                    className={cn('save-practice-button', { 'is-saved': isSaved() })}
                    data-test-id="save-practice-button"
                >
                    {getIconAndLabel(false, false, label)}
                </StyledSavePracticeButton>
            );
        }

        return (
            <StyledSavePracticeButton
                onClick={saveOrRemovePracticeQuestion}
                isSaved={isSaved()}
                disabled={practiceQuestions.isAnyPending}
                className={cn('save-practice-button', { 'is-saving': practiceQuestions.isAnyPending, 'is-saved': isSaved() })}
                data-test-id="save-practice-button"
                aria-label={label}
            >
                {getIconAndLabel(isSaved(), practiceQuestions.isAnyPending, label)}
            </StyledSavePracticeButton>
        );
    };


    // return button with mpq tooltip info
    // only after the question was saved
    if (isMpq() && isSaved()) {
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

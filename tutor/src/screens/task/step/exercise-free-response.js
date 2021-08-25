import {
    React, PropTypes, observer, styled, action, css, moment,
} from 'vendor';
import { modelize } from 'shared/model'
import { Button } from 'react-bootstrap';
import { Course, StudentTaskStep, ResponseValidation } from '../../../models';
import Question from 'shared/model/exercise/question';
import TaskUX from '../ux';
import { WRQStatus } from './wrq-status';
import QuestionStem from './question-stem';
import { colors } from '../../../theme';
import { ResponseValidationUX } from '../response-validation-ux';
import { NudgeMessages, NudgeMessage } from './nudge-message';
import { StepCardFooter } from './card';
import ScoresHelper from '../../../helpers/scores';

const StyledFreeResponse = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextAreaErrorStyle = css`
  background-color: #f5e9ea;
`;

const InfoRow = styled.div`
  margin: 8px 0;
  display: flex;
  justify-content: ${props => props.hasSubmitted ? 'space-between' : 'flex-end'};
  line-height: 1.6rem;
  .word-limit-error-info {
    color: ${colors.danger};
  }
  span {
    font-size: 12px;
    line-height: 16px;
    + span {
      margin-left: 1rem;
    }
  };
  color: ${colors.neutral.thin};
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  min-height: 10.5em;
  line-height: 1.5em;
  margin: 2.5rem 0 0 0;
  padding: 0.5em;
  border: 1px solid ${colors.neutral.std};
  color: ${colors.neutral.dark};
  ${props => props.isErrored && TextAreaErrorStyle};
  ${props => props.showWarning && css`
    border: 2px solid ${colors.danger};
  `}
  background-color: ${props => props.readOnly && colors.neutral.cool};
`;
TextArea.displayName = 'TextArea';

const RevertButton = observer(({ ux }) => {
    if (!ux.textHasChanged || !ux.canRevert) {
        return null;
    }

    return (
        <Button
            variant="secondary"
            disabled={!ux.textHasChanged}
            onClick={ux.cancelWRQResubmit}
        >
            Cancel
        </Button>
    );

});


@observer
class FreeResponseReview extends React.Component {
    static propTypes = {
        step: PropTypes.instanceOf(StudentTaskStep).isRequired,
    };
    render() {
        const { step } = this.props;
        if (!step.free_response) { return null; }
        return (
            <>
                <div className="free-response">{step.free_response}</div>
            </>
        );
    }
}

@observer
class FreeResponseInput extends React.Component {

    static propTypes = {
        questionNumber: PropTypes.number,
        course: PropTypes.instanceOf(Course).isRequired,
        step: PropTypes.instanceOf(StudentTaskStep).isRequired,
        question: PropTypes.instanceOf(Question).isRequired,
        taskUX: PropTypes.instanceOf(TaskUX).isRequired,
        response_validation: PropTypes.instanceOf(ResponseValidation),
    };

    ux = new ResponseValidationUX({
        step: this.props.step,
        taskUX: this.props.taskUX,
        messages: NudgeMessages,
        validator: this.props.response_validation,
    });

    constructor(props) {
        super(props)
        modelize(this)
    }

    @action.bound onSave() {
        const { taskUX, step } = this.props;
        taskUX.setCurrentMultiPartStep(step);
        this.ux.onSave();
    }

    render() {
        const { ux, props: { questionNumber, course, step, question } } = this;

        return (
            <StyledFreeResponse
                data-test-id="student-free-response"
            >
                <div className="step-card-body">
                    <QuestionStem
                        questionNumber={questionNumber}
                        question={question}
                    />
                    <TextArea
                        value={ux.response}
                        onChange={ux.setResponse}
                        data-test-id="free-response-box"
                        placeholder="Enter your response..."
                        isErrored={ux.displayNudgeError}
                        showWarning={ux.isOverWordLimit}
                        aria-label="question response text box"
                        readOnly={ux.taskUX.isReadOnly}
                    />
                    <InfoRow hasSubmitted={!!ux.lastSubmitted}>
                        <div>
                            {ux.lastSubmitted && <span>Last submitted on {moment(ux.lastSubmitted).format('MMM DD [at] hh:mm A')}</span>}
                            {ux.isDisplayingNudge && <NudgeMessage course={course} step={step} ux={ux} />}
                        </div>

                        <div>
                            <span>{ux.responseWords} words</span>
                            {ux.isOverWordLimit && <span className="word-limit-error-info">Maximum {ux.wordLimit} words</span>}
                        </div>
                    </InfoRow>
                </div>
                <StepCardFooter isDisplayingNudge={ux.isDisplayingNudge}>
                    <div className="points">
                        <strong>Points: {ScoresHelper.formatPoints(step.available_points)}</strong>
                        <WRQStatus step={step} />
                    </div>
                    <div className="controls">
                        <RevertButton size="lg" ux={ux} />
                        <Button
                            size="lg"
                            data-test-id="submit-answer-btn"
                            disabled={ux.isSubmitDisabled}
                            onClick={this.onSave}
                        >
                            {ux.submitBtnLabel}
                        </Button>
                    </div>
                </StepCardFooter>
            </StyledFreeResponse>
        );
    }

}

export { FreeResponseInput, FreeResponseReview };

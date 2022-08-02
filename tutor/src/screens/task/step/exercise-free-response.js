import {
    React, PropTypes, observer, styled, action, css,
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
import { FreeResponseInput as OSFreeResponse } from '@openstax/assignment-components';
import { pick } from 'lodash';

const StyledFreeResponse = styled.div`
  display: flex;
  flex-direction: column;
`;

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

        const inputProps = {
            ...pick(ux, 'lastSubmitted', 'wordLimit', 'isDisplayingNudge'),
            leftInfoComponent: ( (ux.lastSubmitted || ux.isDisplayingNudge) &&
                <div>
                    {ux.lastSubmitted && <span className="last-submitted">Last submitted on {ux.lastSubmitted.format('MMM DD [at] hh:mm A')}</span>}
                    {ux.isDisplayingNudge && <NudgeMessage course={course} step={step} ux={ux} />}
                </div>
                )
        }

        return (
            <StyledFreeResponse
                data-test-id="student-free-response"
            >
                <div className="step-card-body">
                    <QuestionStem
                        questionNumber={questionNumber}
                        question={question}
                    />
                    <OSFreeResponse
                        {...inputProps}
                        defaultValue={ux.response}
                        onChange={ux.setResponse}
                        readOnly={ux.taskUX.isReadOnly}
                    />
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

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
        const { ux, props: { questionNumber, course, step, question, onSave } } = this;

        const freeResponseProps = {
            ...pick(ux, 'wordLimit', 'isSubmitDisabled', 'submitBtnLabel', 'textHasChanged'),
            availablePoints: ScoresHelper.formatPoints(step.available_points),
            cancelHandler: ux.cancelWRQResubmit,
            defaultValue: ux.response,
            infoRowChildren: ( (ux.lastSubmitted || ux.isDisplayingNudge) &&
                <div>
                    {ux.lastSubmitted && <span className="last-submitted">Last submitted on {ux.lastSubmitted.format('MMM DD [at] hh:mm A')}</span>}
                    {ux.isDisplayingNudge && <NudgeMessage course={course} step={step} ux={ux} />}
                </div>
                ),
            onChange: ux.setResponse,
            saveHandler: onSave,
            question,
            questionNumber,
            readOnly: ux.taskUX.isReadOnly,
            pointsChildren: <WRQStatus step={step} />,
        }

        return <OSFreeResponse {...freeResponseProps} />;
    }

}

export { FreeResponseInput, FreeResponseReview };

import {
    React, PropTypes, observer, styled,
} from 'vendor';
import {
    Facebook as ReadingLoader,
    BulletList as HomeworkLoader,
} from 'react-content-loader';
import Reading from './reading';
import Exercise from './exercise';
import Placeholder from './placeholder';
import HtmlContent from './html-content';
import Failure from './failure';
import End from './end';
import SavedPracticeEnd from './saved_practice_end';
import { LoadingCard } from './card';
import Instructions from './instructions';
import {
    PersonalizedGroup,
    TwoStepValueProp,
    IndividualReview,
    SpacedPractice,
} from './value-props';


const STEP_TYPES = {
    reading: Reading,
    video: HtmlContent,
    exercise: Exercise,
    placeholder: Placeholder,
    interactive: HtmlContent,
    'instructions': Instructions,
    'two-step-intro': TwoStepValueProp,
    'personalized-intro': PersonalizedGroup,
    'spaced-practice-intro': SpacedPractice,
    'individual-review-intro': IndividualReview,
};

const PENDING_TYPES = {
    reading: ReadingLoader,
    exercise: HomeworkLoader,
    video: HtmlContent.Loader,
    interactive: HtmlContent.Loader,
};

// has plenty of space at bottom so last step can
// be scrolled up and user knows it's last
const MultipartGroup = styled.div`
  padding-bottom: 200px;
`;

@observer
class TaskStep extends React.Component {

    static propTypes = {
        pending: PropTypes.func,
        ux: PropTypes.object.isRequired,
        step: PropTypes.shape({
            steps: PropTypes.array,
            type: PropTypes.string.isRequired,
            needsFetched: PropTypes.bool,
            api: PropTypes.shape({
                errors: {
                    any: PropTypes.bool,
                },
            }),
            task: PropTypes.shape({
                type: PropTypes.string.isRequired,
            }),
        }).isRequired,
    };

    render() {
        const { ux, step } = this.props;

        if (!step || (step.api.errors.any)) {
            return <Failure task={ux.task} step={step} />;
        }
        const { type, needsFetched } = step;

        const stepProps = {
            ...this.props,
            onContinue: ux.canGoForward ? ux.goForward : null,
        };

        STEP_TYPES.end = step.task && step.task.type === 'practice_saved'
            ? SavedPracticeEnd 
            : End;

        if ('mpq' === type) {
            return (
                <MultipartGroup>
                    {step.steps.map((s, i) =>
                        <TaskStep
                            key={i}
                            {...stepProps}
                            isMultiPart
                            isFollowupMPQ={0 !== i}
                            step={s}
                        />)}
                </MultipartGroup>
            );
        }

        if (needsFetched) {
            const Pending = PENDING_TYPES[type] || PENDING_TYPES.reading;
            return <LoadingCard><Pending /></LoadingCard>;
        }

        const Step = STEP_TYPES[type];

        if (!Step) {
            return <Failure task={ux.task} step={step} />;
        }

        return (
            <Step {...stepProps} />
        );
    }
}

export { TaskStep };

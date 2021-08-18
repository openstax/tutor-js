import {
    React, PropTypes, observer, styled,
} from 'vendor';
import UX from '../ux';
import { ArbitraryHtmlAndMath as H } from 'shared';
import { fonts, colors, breakpoint } from 'theme';
import { TaskStepCard } from './card';
import ExerciseQuestion from './exercise-question';
import { Raven, StudentTaskStep } from '../../../models';
import Badges from 'shared/components/exercise-badges';
import { StepToolbar } from './toolbar';

const StyledTaskStepCard = styled(TaskStepCard)`
  font-size: 1.8rem;
  line-height: 3rem;

  .openstax-question {
    /* add Lato font */
    ${fonts.sans('2rem')};
  }
`;

const StyledMultipartBadge = styled(Badges)`
    margin: 0 auto 18px;
    min-width: 960px;
    font-weight: bold;

    &.openstax-exercise-badges {
        color: ${colors.neutral.grayblue};
    }

    ${breakpoint.desktop`
        max-width: 1000px;
        min-width: 750px;
    `}
    ${breakpoint.large`
        min-width: 1000px;
    `}
    ${breakpoint.tablet`
        display: none;
    `}
`;

const Preamble = ({ isHidden, content }) => {
    if (isHidden) { return null; }

    return (
        <React.Fragment>

            {content.context &&
        <H className="exercise-context"
            block html={content.context} />}

            {content.stimulus_html &&
        <H className="exercise-stimulus"
            block html={content.stimulus_html} />}

            {content.stem_html &&
        <H className="exercise-stem"
            block html={content.stem_html} />}

        </React.Fragment>
    );
};

Preamble.propTypes = {
    isHidden: PropTypes.bool,
    content: PropTypes.object,
};


@observer
export default class ExerciseTaskStep extends React.Component {

    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
        step: PropTypes.instanceOf(StudentTaskStep).isRequired,
        isFollowupMPQ: PropTypes.bool,
        isMultiPart: PropTypes.bool,
        windowImpl: PropTypes.object,
    }

    constructor(props) {
        super(props);
        const { step } = props;
        if (!step.content || !step.content.questions) {
            this.logAndRetryFetch();
        }
    }

    // TODO: remove this code when we no longer see it's messages logged
    logAndRetryFetch() {
        const { step } = this.props;

        step.fetch().then(() => {
            Raven.log('No questions found on step', {
                stepId: step.id,
                type: step.type,
                foundAfterReFetch: !!(step.content && step.content.questions),
            });
        });
    }

    render() {
        const { ux, step, isMultiPart, isFollowupMPQ } = this.props;
        const { content } = step;

        return (
            <>
                <StyledTaskStepCard
                    step={step}
                    questionNumber={ux.questionNumberForStep(step)}
                    numberOfQuestions={ux.exerciseSteps ? ux.exerciseSteps.length : 0}
                    goBackward={() => ux.goToStep(ux.previousStep)}
                    canGoBackward={Boolean(ux.previousStep)}
                    goForward={() => ux.goToStep(ux.nextStep)}
                    canGoForward={Boolean(ux.nextStep)}
                    isMultipart={isMultiPart}
                    isFollowupMPQ={isFollowupMPQ}
                    multipartBadge={<StyledMultipartBadge multiPart={isMultiPart && !isFollowupMPQ} />}
                    typeBadge={
                        <Badges
                            spacedPractice={step.isSpacedPractice}
                            personalized={!isFollowupMPQ && step.isPersonalized}
                            writtenResponse={step.isWrittenResponseExercise}
                            multipleChoice={!step.isTwoStep && !step.isPersonalized && !step.isSpacedPractice && step.isMultipleChoiceExercise}
                            twoStep={!step.isPersonalized && !step.isSpacedPractice && step.isTwoStep}
                            interactive={step.isInteractive}
                        />
                    }
                >
                    <StepToolbar
                        course={ux.course}
                        step={step}
                        practiceQuestions={ux.course.practiceQuestions}
                        showSaveToPractice={ux.canSaveToPractice}
                        hideContentLink={ux.isDisplayingNudge}
                        hideToolbar={ux.hideToolbar}
                    />

                    <Preamble
                        content={content}
                        isHidden={isFollowupMPQ} />

                    {(content.questions || []).map((q, i) =>
                        <ExerciseQuestion
                            ux={ux}
                            index={i}
                            key={q.id}
                            step={step}
                            question={q}
                        />)}
                </StyledTaskStepCard>
            </>
        );
    }

}

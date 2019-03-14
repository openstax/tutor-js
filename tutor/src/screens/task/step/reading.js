import { React, PropTypes, observer, styled } from '../../../helpers/react';
import Notes from '../../../components/notes';
import RelatedContent from '../../../components/related-content';
import { AsyncButton, ArbitraryHtmlAndMath } from 'shared';
import UX from '../ux';

const StepWrapper = styled.div`


`;

export default
@observer
class ReadingTaskStep extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    windowImpl: PropTypes.object,
  }

  // componentDidMount() {
  //   if (!step.isFetched) { step.fetch() }
  // }

  render() {
    const {
      ux, ux: {
        course,
        currentStep: step,
        currentStep: { content }
      },
    } = this.props;
    //    step = this.props.ux.currentStep;
    // if (!step.isFetched) {
    //   debugger
    // }

    return (
      <StepWrapper className="reading-step">

        <RelatedContent
          hasLearningObjectives={content.has_learning_objectives}
          chapter_section={content.chapterSection}
          title={content.title}
        />
        <Notes
          course={course}
          page={content.page}
          windowImpl={this.props.windowImpl}
        >
          <ArbitraryHtmlAndMath
            className="book-content"
            shouldExcludeFrame={this.shouldExcludeFrame}
            html={content.content_html}
          />
        </Notes>
        {ux.canGoForward &&
          <AsyncButton
            variant="primary"
            isWaiting={this.state.isContinuing}
            waitingText="Loading…"
            onClick={this.onContinue}
            >
            Continue
          </AsyncButton>}
      </StepWrapper>

    );
  }

};

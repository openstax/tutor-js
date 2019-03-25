import { React, PropTypes, observer, styled } from '../../../helpers/react';
import { AsyncButton } from 'shared';
import BookPage from '../../../components/book-page';
import UX from '../ux';

const StyledReading = styled.div`
  width: 1000px;
  margin: 0 auto;
`;

export default
@observer
class ReadingTaskStep extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    windowImpl: PropTypes.object,
  }

  render() {
    const {
      canGoForward, currentStep: step,
    } = this.props.ux;

    const { content } = step;

    return (
      <StyledReading
        className="content"
      >
        <BookPage
          ux={this.props.ux.pageContentUX}
          hasLearningObjectives={content.has_learning_objectives}
          chapter_section={content.chapterSection}
          title={content.title}

        />
        {canGoForward &&
          <AsyncButton
            variant="primary"
            waitingText="Loading…"
            onClick={this.onContinue}
            isWaiting={step.api.isPending}
            >
            Continue
          </AsyncButton>}
      </StyledReading>
    );
  }

}

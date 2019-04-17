import { React, PropTypes, observer, styled } from '../../../helpers/react';
import BookPage from '../../../components/book-page';
import UX from '../ux';
import { TaskStepCard } from './card';
import Step from '../../../models/student-tasks/step';
import ContinueBtn from './continue-btn';

const StyledReading = styled(TaskStepCard)`

`;

export default
@observer
class ReadingTaskStep extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    step: PropTypes.instanceOf(Step).isRequired,
    windowImpl: PropTypes.object,
  }

  render() {
    const { content } = this.props.step;

    return (
      <StyledReading unpadded step={this.props.step}>
        <BookPage
          ux={this.props.ux.pageContentUX}
          hasLearningObjectives={content.has_learning_objectives}
          chapter_section={content.chapterSection}
          title={content.pageTitle}
        />
        <ContinueBtn ux={this.props.ux} />
      </StyledReading>
    );
  }

}

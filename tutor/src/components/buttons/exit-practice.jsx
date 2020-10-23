import { React, PropTypes, styled, computed, observer, action, withRouter } from 'vendor';
import { Button } from 'react-bootstrap';
import Router from '../../../src/helpers/router';


const StyledExitPracticeButton = styled(Button)`
  &&& {
    height: 2.8rem;
    padding: 15px 25px;
  }
`;


export default
@withRouter
@observer
class ExitPractice extends React.Component {

  static propTypes = {
    task: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  @computed get destinationPath() {
    const { task } = this.props;
    if (this.props.task.isSavedPractice) {
      return Router.makePathname('practiceQuestions', { courseId: task.course.id, id: task.id });
    }
    return Router.makePathname('dashboard', { courseId: task.course.id });
  }

  @action.bound async onExitPractice() {
    await this.props.task.exit();
    this.props.history.push(this.destinationPath);
  }

  render() {
    if (this.props.task.isSavedPractice) return null;

    return (

      <StyledExitPracticeButton
        variant="default"
        className="btn-standard btn-inline"
        onClick={this.onExitPractice}
      >
        Exit Practice
      </StyledExitPracticeButton>
    );

  }

}

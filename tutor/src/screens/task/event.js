import { React, PropTypes, observer } from 'vendor';
import { CenteredBackButton } from './back-button';
import UX from './ux';
import { StepCard } from './step/card';
import withFooter from './with-footer';

@observer
class EventTask extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  render() {
    const { ux: { course, task } } = this.props;

    return (
      <StepCard className="event-task">
        <h1>{task.title}</h1>
        <h3>{task.description}</h3>
        <CenteredBackButton
          fallbackLink={{
            text: 'Back to dashboard', to: 'dashboard', params: { courseId: course.id },
          }} />
      </StepCard>
    );
  }

}

export default withFooter(EventTask);

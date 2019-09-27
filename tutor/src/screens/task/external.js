import {
  React, PropTypes, observer, computed, action, styled,
} from 'vendor';
import ContentLoader from 'react-content-loader';
import UX from './ux';
import { StepCard } from './step/card';
import { CenteredBackButton } from './back-button';

const Link = styled.a`
  margin-top: 2rem;
`;

const Loader = () => (
  <ContentLoader>
    <rect x="0" y="0" rx="3" ry="3" width="250" height="10" />
    <rect x="0" y="10" rx="3" ry="3" width="250" height="10" />
  </ContentLoader>
);

export default
@observer
class ExternalTaskStep extends React.Component {

  static Loader = Loader;

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  onContextMenu(ev) {
    return ev.preventDefault();
  }

  @computed get url() {
    const { ux: { task } } = this.props;
    let { external_url } = task.steps[0];
    if (!/^https?:\/\//.test(external_url)) {
      external_url = `http://${external_url}`;
    }
    return external_url;
  }

  @action.bound onContinue() {
    const step = this.props.ux.currentStep;
    step.is_completed = true;
    step.save();
  }

  render() {
    const { ux: { course, task } } = this.props;

    return (
      <StepCard className="external-url-task">
        <h1>{task.title}</h1>
        <h3>{task.description}</h3>

        <Link
          href={this.url}
          target="_blank"
          onContextMenu={this.onContextMenu}
          onClick={this.onContinue}
        >
          {this.url}
        </Link>
        <CenteredBackButton
          size="lg"
          fallbackLink={{
            text: 'Back to dashboard', to: 'dashboard', params: { courseId: course.id },
          }} />
      </StepCard>
    );
  }
}

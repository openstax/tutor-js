import {
  React, PropTypes, observer, computed, action,
} from 'vendor';
import ContentLoader from 'react-content-loader';
import UX from './ux';
import Instructions from './step/instructions';
import withFooter from './with-footer';

const Loader = () => (
  <ContentLoader>
    <rect x="0" y="0" rx="3" ry="3" width="250" height="10" />
    <rect x="0" y="10" rx="3" ry="3" width="250" height="10" />
  </ContentLoader>
);

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
    const { ux } = this.props;

    return (
      <Instructions ux={ux} />
    );
  }
}

export default withFooter(ExternalTaskStep);

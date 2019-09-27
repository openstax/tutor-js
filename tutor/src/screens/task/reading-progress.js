import { React, PropTypes, observer, styled, inject, autobind } from 'vendor';
import { ProgressBar } from 'react-bootstrap';
import UX from './ux';

const StyledProgressBar = styled(ProgressBar)`
   && { border-radius: 0; }
`;

@inject('setSecondaryTopControls')
@observer
class ReadingProgress extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    setSecondaryTopControls: PropTypes.func.isRequired,
    unDocked: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    if (!props.unDocked) {
      props.setSecondaryTopControls(this.renderProgress);
    }
    this.renderProgress.unpadded = true;
  }

  componentWillUnmount() {
    if (!this.props.unDocked) {
      this.props.setSecondaryTopControls(null);
    }
  }

  // nothing is rendered directly, instead it's set in the secondaryToolbar
  render() {
    if (this.props.unDocked) {
      return this.renderProgress();
    }
    return null;
  }

  @autobind renderProgress() {
    const { ux } = this.props;

    return (
      <StyledProgressBar now={ux.progressPercent} variant="success" />
    );
  }

}

export { ReadingProgress };

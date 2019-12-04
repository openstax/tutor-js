import { React, PropTypes, observer, styled, inject, autobind } from 'vendor';
import { ProgressBar } from 'react-bootstrap';
import UX from './ux';
import MilestonesToggle from './reading-milestones-toggle';
import NotesSummaryToggle from '../../components/notes/summary-toggle';

const StyledNavbar = styled.div`
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Top = styled.div`
    display: flex;
    flex: 1;
    justify-content: space-between;

`;

const Left = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
`;

const Right = styled.div`
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledProgressBar = styled(ProgressBar)`
   && { border-radius: 0; }
`;

@inject('setSecondaryTopControls')
@observer
class ReadingNavbar extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    setSecondaryTopControls: PropTypes.func.isRequired,
    unDocked: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    if (!props.unDocked) {
      props.setSecondaryTopControls(this.renderNavbar);
    }
    this.renderNavbar.unpadded = true;
  }

  componentWillUnmount() {
    if (!this.props.unDocked) {
      this.props.setSecondaryTopControls(null);
    }
  }

  // nothing is rendered directly, instead it's set in the secondaryToolbar
  render() {
    if (this.props.unDocked) {
      return this.renderNavbar();
    }
    return null;
  }

  @autobind renderNavbar() {
    const { ux } = this.props;

    return (
      <StyledNavbar>
        <Top>
          <Left>
            {ux.course.name} | {ux.task.title}
          </Left>
          <Right>
            <MilestonesToggle model={ux.currentStep} />
            <NotesSummaryToggle
              course={ux.course}
              type="reading"
              model={ux.currentStep}
            />

          </Right>
        </Top>
        <StyledProgressBar now={ux.progressPercent} variant="success" />
      </StyledNavbar>
    );
  }

}

export default ReadingNavbar;

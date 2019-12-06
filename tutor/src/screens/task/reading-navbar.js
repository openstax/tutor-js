import { React, PropTypes, observer, styled, inject, autobind } from 'vendor';
import { ProgressBar } from 'react-bootstrap';
import UX from './ux';
import MilestonesToggle from './reading-milestones-toggle';
import NotesSummaryToggle from '../../components/notes/summary-toggle';
import { Icon } from 'shared';
import TimeHelper from '../../helpers/time';
import TutorLink from '../../components/link';
import Theme from '../../theme';

const StyledNavbar = styled.div`
  min-height: 60px;
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
  font-size: 1.6rem;
  line-height: 2rem;
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

const Divider = styled.span`
  color: ${Theme.colors.navbars.divider};
  margin: 0 0.8rem;
`;

const AngleDivider = styled(Divider)`
  margin-top: 2px;
  svg { margin: 0; }
`;

const TaskTitle = styled.div`
  font-weight: bold;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledTutorLink = styled(TutorLink)`
  margin-left: 0.5rem;
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
            <StyledTutorLink to="dashboard" params={{ courseId: ux.course.id }}>
              {ux.course.name}
            </StyledTutorLink>
            <AngleDivider>
              <Icon type="angle-right" />
            </AngleDivider>
            <TaskTitle>{ux.task.title}</TaskTitle>
            <Divider>|</Divider>
            Due {TimeHelper.toShortHumanDateTime(ux.task.due_at)}
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

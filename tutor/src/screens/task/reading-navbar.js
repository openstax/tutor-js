import { React, PropTypes, observer, styled, inject, autobind } from 'vendor';
import { ProgressBar } from 'react-bootstrap';
import UX from './ux';
import MilestonesToggle from './reading-milestones-toggle';
import NotesSummaryToggle from '../../components/notes/summary-toggle';
import StepToolbarToggle from './step-toolbar-toggle';
import { Icon } from 'shared';
import TutorLink from '../../components/link';
import Time from '../../components/time';
import { colors, breakpoint } from 'theme';

const StyledNavbar = styled.div`
  ${breakpoint.only.mobile`
    .hide-mobile {
      display: none;
    }
  `}
`;
StyledNavbar.displayName = 'StyledNavbar';

const StyledTutorLink = styled(TutorLink)`
  padding: 1.6rem 0 0;
  display: inline-block;
  .ox-icon {
    margin: 0 0.2rem 0 0;
  }
`;
StyledTutorLink.displayName = 'StyledTutorLink';

const Top = styled.div`
  padding: 0 ${breakpoint.margins.tablet};
  ${breakpoint.only.mobile`
    padding: 0 ${breakpoint.margins.mobile};
  `}
`;
Top.displayName = 'Top';

const Middle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 ${breakpoint.margins.tablet};
  ${breakpoint.only.mobile`

    padding: 0 ${breakpoint.margins.mobile};
  `}
`;
Middle.displayName = 'Middle';

const Left = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  line-height: 2.4rem;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: 4.4rem;

  button {
    padding: 1.4rem;
    margin: 0 0 0 1.4rem;
    min-width: 4.8rem;
    min-height: 4.8rem;
    .ox-icon {
      margin: 0;
    }
    > :not(.ox-icon) {
      display: none;
    }
    ${breakpoint.desktop`
      > :not(.ox-icon) {
        display: inline;
      }
      .ox-icon {
        margin-right: 0.8rem;
      }
      .toolbar-icon {
          display: none;
      }
    `}
  }
`;

const StyledProgressBar = styled(ProgressBar)`
   && {
    border-radius: 0;
    height: 8px;
  }
`;

const Divider = styled.span`
  color: ${colors.navbars.divider};
  font-weight: bold;
  margin: 0 0.8rem;
`;

const TaskTitle = styled.div`
  font-weight: bold;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
            props.setSecondaryTopControls(this.renderNavbar, true);
        }
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
                    <StyledTutorLink to="dashboard" params={{ courseId: ux.course.id }}>
                        <Icon type="chevron-left" /> Dashboard
                    </StyledTutorLink>
                </Top>
                <Middle>
                    <Left>
                        <TaskTitle>{ux.task.title}</TaskTitle>
                        <Divider className="hide-mobile">|</Divider>
                        <span className="hide-mobile">
                            Due <Time date={ux.task.due_at} format="llll" />
                        </span>
                    </Left>
                    <Right>
                        <StepToolbarToggle ux={ux} />
                        <NotesSummaryToggle
                            course={ux.course}
                            type="reading"
                            model={ux.currentStep}
                        />
                        <MilestonesToggle model={ux.currentStep} />
                    </Right>
                </Middle>
                <StyledProgressBar now={ux.progressPercent} variant="success" />
            </StyledNavbar>
        );
    }

}

export default ReadingNavbar;

import { React, PropTypes, styled, observer } from 'vendor';
import ProgressCard from './progress';
import UX from './ux';
import { TaskStep } from './step';
import ObscuredPage from '../../components/obscured-page';
import ReadingNavbar from './reading-navbar';


const StyledReading = styled.div`

`;

@observer
class ReadingTask extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    windowImpl: PropTypes.object,
  }

  render() {
    const { ux, windowImpl } = this.props;

    return (
      <StyledReading className="reading-task">
        <ProgressCard ux={ux}>
          <ReadingNavbar ux={ux} />
          <ObscuredPage>
            <TaskStep
              ux={ux}
              step={ux.currentGroupedStep}
              windowImpl={windowImpl}
            />
          </ObscuredPage>
        </ProgressCard>
      </StyledReading>
    );
  }

}

export default ReadingTask;

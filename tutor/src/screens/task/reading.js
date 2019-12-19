import { React, PropTypes, styled, observer, cn } from 'vendor';
import ProgressCard from './progress';
import UX from './ux';
import { TaskStep } from './step';
import ReadingNavbar from './reading-navbar';
import PagingNavigation from '../../components/paging-navigation';

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
        <ReadingNavbar ux={ux} />
        <PagingNavigation
          className={cn('progress-panel')}
          enableKeys={true}
          isForwardEnabled={ux.canGoForward}
          isBackwardEnabled={ux.canGoBackward}
          onForwardNavigation={ux.goForward}
          onBackwardNavigation={ux.goBackward}
          titles={ux.relatedStepTitles}
        >
          <ProgressCard ux={ux} />
          <TaskStep
            ux={ux}
            step={ux.currentGroupedStep}
            windowImpl={windowImpl}
          />
        </PagingNavigation>
      </StyledReading>
    );
  }

}

export default ReadingTask;

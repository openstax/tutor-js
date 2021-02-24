import { React, PropTypes, styled, observer, cn } from 'vendor';
import ProgressCard from './progress';
import UX from './ux';
import { TaskStep } from './step';
import ReadingNavbar from './reading-navbar';
import PagingNavigation from '../../components/paging-navigation';
import { PrevIcon, NextIcon } from '../../components/icons/pagination';
import { breakpoint } from 'theme';

const StyledReading = styled.div`
  && :not(.paging-footer) .paging-control {
    display: none;
    ${breakpoint.reading_pagination`
      display: block;
    `}
  }
`;

const IconWrapper = styled.div.attrs({
    className: 'arrow-wrapper',
})`
  &&.arrow-wrapper {
    width: 100%;
    height: 100%;
    max-width: 80px;
    padding: 0 4px;
  }
`;

const StyledPagingNavigation = styled(PagingNavigation)`
  margin-top: 60px;
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
              <StyledPagingNavigation
                  className={cn('progress-panel')}
                  enableKeys={true}
                  forwardRenderer={<IconWrapper><NextIcon /></IconWrapper>}
                  backwardRenderer={<IconWrapper><PrevIcon /></IconWrapper>}
                  isForwardEnabled={ux.canGoForward}
                  isBackwardEnabled={ux.canGoBackward}
                  onForwardNavigation={ux.goForward}
                  onBackwardNavigation={ux.goBackward}
                  titles={ux.relatedStepTitles}
                  renderMobileFooter={true}
              >
                  <ProgressCard ux={ux} />
                  <TaskStep
                      ux={ux}
                      step={ux.currentGroupedStep}
                      windowImpl={windowImpl}
                      data-test-id="task-step"
                  />
              </StyledPagingNavigation>
          </StyledReading>
      );
  }

}

export default ReadingTask;

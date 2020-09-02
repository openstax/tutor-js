import { React, PropTypes, observer, styled } from 'vendor';
import Table from './table';
import TourRegion from '../../components/tours/region';
import Header from '../../components/header';
import LoadingScreen from 'shared/components/loading-animation';
import { breakpoint } from 'theme';
import UX from './ux';

const StyledTourRegion = styled(TourRegion)`
  ${breakpoint.desktop`
    margin: 40px 10rem;
  `}
  ${breakpoint.tablet`
    margin: ${breakpoint.margins.tablet};
  `}
  ${breakpoint.mobile`
    margin: ${breakpoint.margins.mobile};
  `}
`;

@observer
class StudentGradebook extends React.Component {

  static displayName = 'StudentGradebook';

  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string,
      courseId: PropTypes.string.isRequired,
    }),
  }

  ux = new UX({
    ...this.props.params,
  });

  render() {
    const { ux } = this;

    if (!ux.isReady) {
      return <LoadingScreen message="Loading Grades…" />;
    }

    return (
      <>
        <Header
          backTo="dashboard"
          backToParams={{ courseId: ux.course.id }}
          backToText="Dashboard"
          title="Scores"
        />
        <StyledTourRegion
          id="gradebook"
          className="gradebook-table"
          courseId={this.ux.course.id}
          otherTours={['preview-gradebook']}
        >
          <Table ux={ux} />
        </StyledTourRegion>
      </>
    );
  }
}

export default StudentGradebook;

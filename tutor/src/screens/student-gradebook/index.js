import { React, PropTypes, observer, styled } from 'vendor';
import Table from './table';
import TourRegion from '../../components/tours/region';
import TutorLink from '../../components/link';
import LoadingScreen from 'shared/components/loading-animation';
import { Icon } from 'shared';
import { colors } from 'theme';
import UX from './ux';

const StudentGradebookHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 55px;
  align-items: center;
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.neutral.pale};
  padding: 25px 32px 16px;

  a {
    width: 100%;
    color: ${colors.link};
  }
  .title {
    font-weight: bold;
    font-size: 3.6rem;
    line-height: 4.5rem;
    margin: 10px 0 0 0;
  }
`;

const StyledTourRegion = styled(TourRegion)`
  margin: 40px 10rem;
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
        <StudentGradebookHeader
          role="dialog"
          tabIndex="-1"
        >
          <TutorLink to="dashboard" params={{ courseId: ux.course.id }}>
            <Icon
              size="lg"
              type="angle-left"
              className="-move-exercise-up circle"
            />
              Dashboard
          </TutorLink>
          {/** 5/27/20: Display title as Scores */}
          <h1 className="title">Scores</h1>
        </StudentGradebookHeader>

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

import { React, PropTypes, observer, styled } from 'vendor';
import StatsModel from '../../models/stats';
import { ScrollToTop } from 'shared';
import LoadingScreen from 'shared/components/loading-animation';
import Chart from './chart';
import './styles.scss';

const Wrapper = styled.div`
  max-width: 1150px;
  margin: auto;
  padding: 2rem;
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Info = styled.p`
  min-width: 100%;
  text-align: center;
`;

@observer
class Stats extends React.Component {

  static propTypes = {
    stats: PropTypes.instanceOf(StatsModel),
  };

  stats = this.props.stats || new StatsModel();

  constructor(props) {
    super(props);
    this.stats.fetch();
  }

  render() {
    if (!this.stats.api.hasBeenFetched) {
      return (
        <LoadingScreen message="Loading Stats…" />
      );
    }

    return (
      <ScrollToTop>
        <Wrapper>
          <Container>
            <Chart
              data={this.stats.data}
              title="Active Courses"
              series={[
                { property: 'active_courses' },
              ]}
            />
            <Chart
              data={this.stats.data}
              title="Active Users"
              series={[
                { label: 'Students', property: 'active_students' },
                { label: 'Instructors', property: 'active_instructors' },
              ]}
            />
            <Info>“<b>Active</b>” is a course with at least 3 members</Info>
            <Chart
              data={this.stats.data}
              title="Steps Completed"
              series={[
                { label: 'Reading', property: 'reading_steps' },
                { label: 'Homework', property: 'exercise_steps' },
              ]}
            />
            <Chart
              data={this.stats.data}
              title="Assignments"
              series={[
                { label: 'Reading', property: 'reading_task_plans' },
                { label: 'Homework', property: 'homework_task_plans' },
              ]}
            />
            <Chart
              data={this.stats.data}
              title="Highlighting"
              series={[
                { label: 'Highlights', property: 'highlights' },
                { label: 'Notes', property: 'notes' },
              ]}
            />
            <Chart
              data={this.stats.data}
              title="Free Response Nudges"
              series={[
                { label: 'Submissions', property: 'nudge_calculated' },
                { label: 'Invalid', property: 'nudge_initially_invalid' },
                { label: 'Corrected', property: 'nudge_retry_correct' },
              ]}
            />

          </Container>
        </Wrapper>
      </ScrollToTop>
    );
  }
}

export default Stats;

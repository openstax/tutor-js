import {
    React, PropTypes, observer, action, observable, computed, styled,
} from 'vendor';
import { last } from 'lodash';
import StatsModel from '../../models/stats';
import { ScrollToTop } from 'shared';
import LoadingScreen from 'shared/components/loading-animation';
import Chart from './chart';
import Table from './table';
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

  @observable zoomTS;

  @action.bound onZoom(context, zoom) {
      this.zoomTS = zoom.xaxis.max;
  }

  @computed get tableRow() {
      if (this.zoomTS) {
          const row = this.stats.data.find((r) => r.starts_at > this.zoomTS);
          if (row) {
              return row;
          }
      }
      return last(this.stats.data);
  }

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
      const chartProps = {
          onZoom: this.onZoom,
      };

      return (
          <ScrollToTop>
              <Wrapper>
                  {this.tableRow && <Table row={this.tableRow} />}
                  <Info>All values are for <b>Active</b> courses that have at least 3 students</Info>
                  <Container>
                      <Chart
                          id="courses"
                          data={this.stats.data}
                          title="New Courses"
                          series={[
                              { property: 'new_courses' },
                          ]}
                          {...chartProps}
                      />
                      <Chart
                          id="users"
                          data={this.stats.data}
                          title="Users"
                          series={[
                              { label: 'Students', property: 'new_students' },
                              { label: 'Instructors', property: 'new_instructors' },
                          ]}
                          {...chartProps}
                      />
                      <Chart
                          id="steps"
                          data={this.stats.data}
                          title="Steps Completed"
                          series={[
                              { label: 'Reading', property: 'reading_steps' },
                              { label: 'Homework', property: 'exercise_steps' },
                              { label: 'Practice', property: 'practice_steps' },
                          ]}
                          {...chartProps}
                      />
                      <Chart
                          id="assignments"
                          data={this.stats.data}
                          title="Assignments"
                          series={[
                              { label: 'Reading', property: 'reading_task_plans' },
                              { label: 'Homework', property: 'homework_task_plans' },
                          ]}
                          {...chartProps}
                      />
                      <Chart
                          id="highlights"
                          data={this.stats.data}
                          title="Highlighting"
                          series={[
                              { label: 'Highlights', property: 'new_highlights' },
                              { label: 'Notes', property: 'new_notes' },
                          ]}
                          {...chartProps}
                      />
                      <Chart
                          id="nudge"
                          data={this.stats.data}
                          title="Free Response Nudges"
                          series={[
                              { label: 'Submissions', property: 'nudge_calculated' },
                              { label: 'Invalid', property: 'nudge_initially_invalid' },
                              { label: 'Corrected', property: 'nudge_retry_correct' },
                          ]}
                          {...chartProps}
                      />
                  </Container>
              </Wrapper>
          </ScrollToTop>
      );
  }
}

export default Stats;

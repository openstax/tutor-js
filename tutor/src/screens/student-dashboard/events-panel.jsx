import { React, PropTypes, styled } from 'vendor';
import { Card } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { map } from 'lodash';
import Responsive from '../../components/responsive';
import Time from '../../components/time';
import moment from 'moment';
import Course from '../../models/course';
import EmptyCard from './empty-panel';
import EventRow from './event-row';
import { Row, TitleCell, DueCell, StatusCell, ScoreCell } from './cells';

const StyledTitle = styled.span`
  font-weight: 600;
`;

@observer
export default
class EventsCard extends React.Component {
  static propTypes = {
      events:         PropTypes.array.isRequired,
      course:         PropTypes.instanceOf(Course).isRequired,
      emptyClassName: PropTypes.string,
      emptyMessage:   PropTypes.string,
      spinner:        PropTypes.bool,
      startAt:        PropTypes.object,
      endAt:          PropTypes.object,
      limit:          PropTypes.number,
      title:          PropTypes.string,
      className:      PropTypes.string,
  }

  renderTitle() {
      if (this.props.title) {
          return <span className="title">{this.props.title}</span>;
      }
      return (
          <StyledTitle className="date-range">
              <Time date={moment(this.props.startAt).toDate()} />
              <span> – </span>
              <Time date={moment(this.props.endAt).toDate()} />
          </StyledTitle>
      );
  }
  
  renderEmptyCard() {
      const { emptyClassName, course, emptyMessage, spinner, events } = this.props;
      return (
          <EmptyCard
              className={emptyClassName}
              course={course}
              message={emptyMessage}
              spinner={spinner}
              tasks={events} />
      );
  }

  renderDesktop() {
      const { className, course, events } = this.props;
      return (
          <Card className={className}>
              <Row>
                  <TitleCell>
                      {this.renderTitle()}
                  </TitleCell>
                  <DueCell>
            Due on
                  </DueCell>
                  <StatusCell>
            Status
                  </StatusCell>
                  <ScoreCell>
            Scores
                  </ScoreCell>
              </Row>
              {map(events, e => 
                  <EventRow
                      key={e.id}
                      course={course}
                      event={e}
                  />
              )}
              {this.renderEmptyCard()}
          </Card>
      );
  }

  renderMobile() {
      const { className, course, events } = this.props;
      return (
          <Card className={className}>
              <Row>
                  <TitleCell>
                      {this.renderTitle()}
                  </TitleCell>
              </Row>
              {map(events, e => 
                  <EventRow
                      key={e.id}
                      course={course}
                      event={e}
                  />
              )}
              {this.renderEmptyCard()}
          </Card>
      );
  }

  render() {
      return (
          <Responsive
              desktop={this.renderDesktop()}
              mobile={this.renderMobile()}
          />
      );
  }
}

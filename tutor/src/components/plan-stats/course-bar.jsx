import PropTypes from 'prop-types';
import React from 'react';
import { map, partial } from 'lodash';
import { Container, Row, Col } from 'react-bootstrap';
import { Icon } from 'shared';

class CourseBar extends React.Component {
    static displayName = 'CourseBar';

    static propTypes = {
        data: PropTypes.object.isRequired,
        type: PropTypes.string.isRequired,
        totalCols: PropTypes.number,
    };

    static defaultProps = { totalCols: 12 };

    getCorrectLabel = (data) => {
        const tooltipMsg = `\
Percent correct out of total attempted.
This score does not take unanswered questions into account,
so it may differ from the average you see in Student Scores.\
`;
        const icon =
      <Icon type="info-circle" tooltip={tooltipMsg} tooltipProps={{ placement: 'top' }} />;
        const label =
      <span>
          {'\
  Percent Correct '}
          {icon}
      </span>;
        return (
            { label, type: 'average', value: `${data.mean_grade_percent}%` }
        );
    };

    getStats = () => {
        const { data, type } = this.props;
        let completeLabel = 'Complete';
        let inProgressLabel = 'In Progress';
        const notStartedLabel = 'Not Started';
        const {
            complete_count = 0,
            partially_complete_count = 0,
            total_count = 0,
        } = data;

        let stats = [{
            type: 'complete',
            label: completeLabel,
            value: complete_count,
        }, {
            type: 'in-progress',
            label: inProgressLabel,
            value: partially_complete_count,
        }, {
            type: 'not-started',
            label: notStartedLabel,
            value: total_count - (complete_count + partially_complete_count),
        }];

        if (type === 'external') {
            completeLabel = 'Clicked';
            inProgressLabel = 'Viewed';

            stats = [{
                type: 'complete',
                label: completeLabel,
                value: complete_count,
            }, {
                type: 'not-started',
                label: notStartedLabel,
                value: total_count - (complete_count + partially_complete_count),
            }];
        }

        if ((type === 'homework') && data.mean_grade_percent) {
            stats.unshift(this.getCorrectLabel(data));
        }

        return stats;
    };

    renderCourseStat = (stat, cols) => {
        if (cols == null) { cols = 4; }

        return (
            <Col xs={cols} className={stat.type} key={stat.type}>
                <label>
                    {stat.label}
          : <span className={`data-container-value text-${stat.type}`}>{stat.value}</span>
                </label>
            </Col>
        );
    };

    render() {
        const { totalCols } = this.props;
        const stats = this.getStats();

        const cols = totalCols / stats.length;
        const statsColumns = map(stats, partial(this.renderCourseStat, partial.placeholder, cols));

        return (
            <Container className="data-container" key="course-bar" bsPrefix=" ">
                <Row className="stats" noGutters={true}>
                    {statsColumns}
                </Row>
            </Container>
        );
    }
}

export default CourseBar;

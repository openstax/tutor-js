import PropTypes from 'prop-types';
import React from 'react';
import { Container } from 'react-bootstrap';
import { first, get } from 'lodash';
import CoursePeriodsNavShell from '../../components/course-periods-nav';
import CourseGroupingLabel from '../../components/course-grouping-label';
import TourRegion from '../../components/tours/region';

import Guide from './guide';
import ColorKey from './color-key';

export default class PerformanceForecastTeacherDisplay extends React.Component {
    static displayName = 'PerformanceForecastTeacherDisplay';

    static propTypes = {
        course:  PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        const { periods } = props.course.performance
        this.state = { periodId: get(first(periods), 'period_id') };
    }

    selectPeriod = (period) => {
        return this.setState({ periodId: period.id });
    };

    renderEmptyMessage = () => {
        return (
            <div className="no-data-message">
                There have been no questions worked for
                this <CourseGroupingLabel course={this.props.course} lowercase={true} />.
            </div>
        );
    };

    renderHeading = () => {
        return (
            <div>
                <div className="guide-heading">
                    <div className="info">
                        <p>
                            The performance forecast is an estimate of each group’s understanding of a topic. It is personalized display based on their answers to reading questions,
                            homework problems, and previous practices.
                        </p>
                        <div className="guide-group-key teacher">
                            <ColorKey />
                        </div>
                    </div>
                </div>
                <CoursePeriodsNavShell
                    handleSelect={this.selectPeriod}
                    intialActive={this.state.periodId}
                    course={this.props.course}
                />
            </div>
        );
    };

    renderWeakerExplanation = () => {
        return (
            <div className="explanation">
                <p>
                    Tutor shows the weakest topics for
                    each <CourseGroupingLabel course={this.props.course} lowercase={true} />.
                </p>
                <p>
                    Students may need your help in those areas.
                </p>
            </div>
        );
    };

    render() {
        const { course } = this.props;
        const performance = course.performance.periods.find(p => p.period_id == this.state.periodId)

        return (
            <Container className="performance-forecast teacher">
                <TourRegion id="performance-forecast">
                    <Guide
                        course={course}
                        performance={performance}
                        weakerTitle="Weaker Areas"
                        heading={this.renderHeading()}
                        weakerExplanation={this.renderWeakerExplanation()}
                        weakerEmptyMessage="Your students haven't worked enough problems for Tutor to predict their weakest topics."
                        emptyMessage={this.renderEmptyMessage()}
                    />
                </TourRegion>
            </Container>
        );
    }
}

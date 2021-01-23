import PropTypes from 'prop-types';
import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment-timezone';
import styled from 'styled-components';
import { Form, Row, Col } from 'react-bootstrap';
import Courses from '../../models/courses-map';
import CoursePage from '../../components/course-page';
import Tabs from '../../components/tabs';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import StudentAccess from './student-access';
import RenameCourseLink from './rename-course';
import Timezone from './timezone';
import { colors, breakpoint } from 'theme';
import './styles.scss';

const df = (d) => moment(d).format('MMM DD, YYYY');

const StyledCourseSettings = styled(CoursePage)`
  &&& .body-wrapper {
    padding: 0 40px;
    .body {
      padding-top: 10px;
    }
  }

  &&& .course-details {
    .form-group {
      margin-bottom: 2.4rem;
      label {
        font-weight: 700;
        color: ${colors.darker};
        font-size: 1.4rem;
        line-height: 2rem;
        padding: 10px 0;
      }
      .form-control {
        height: 45px;
        color: ${colors.darker};
        font-size: 1.6rem;
        width: 25%;
        &#course-name {
          width: 60%;
          ${breakpoint.tablet`
            width: 100%;
          `}
        }
        &#endDate, 
        &#startDate {
          width: 57%;
          ${breakpoint.tablet`
            width: 100%;
          `}
        }
        ${breakpoint.tablet`
          width: 100%;
        `}
      }
      &.dates {
        .end-date-label {
          margin-left: -15rem;
          ${breakpoint.tablet`
            margin-left: 0;
          `}
        }
      }
    }
  }
`;

export default
@observer
class CourseSettings extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
    }).isRequired,
  }

  @observable tabIndex;

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  @action.bound onTabSelect(tabIndex) {
    this.tabIndex = tabIndex;
  }

  renderAccess() {
    return (
      <StudentAccess course={this.course} />
    );
  }

  renderCourseDetails() {
    const { course } = this;
    return (
      <div className="course-details">
        <Form>
          <Form.Group as={Row} controlId="course-name">
            <Form.Label column sm="2" md="1">
              Course name
            </Form.Label>
            <Col sm="10" md="11">
              <Form.Control defaultValue={course.name} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="course-code">
            <Form.Label column sm="2" md="1">
            Course code
            </Form.Label>
            <Col sm="10" md="11">
              <Form.Control placeholder="SOC-101. Optional" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="term">
            <Form.Label column sm="2" md="1">
            Term
            </Form.Label>
            <Col sm="10" md="11">
              <Form.Control defaultValue={course.termFull}/>
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="dates">
            <Form.Label column sm="2" md="1">
            Start date
            </Form.Label>
            <Col sm="4" md="5">
              <Form.Control id="startDate" defaultValue={df(course.bounds.start)}/>
            </Col>
            <Form.Label column sm="2" md="1" className="end-date-label">
            End date
            </Form.Label>
            <Col sm="4" md="5">
              <Form.Control id="endDate" defaultValue={df(course.bounds.end)}/>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="time-zone">
            <Form.Label column sm="2" md="1">
            Time zone
            </Form.Label>
            <Col sm="10" md="11">
              <Form.Control defaultValue={course.timezone} />
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }

  titleBreadcrumbs(course) {
    return <CourseBreadcrumb course={course} currentTitle="Course Settings" noBottomMargin />;
  }

  render() {
    const { course, tabIndex } = this;
    return (
      <StyledCourseSettings
        className="settings"
        title=""
        course={course}
        titleBreadcrumbs={this.titleBreadcrumbs(course)}
        titleAppearance="light"
        controlBackgroundColor='white'
      >
        <Tabs
          tabs={['STUDENT ACCESS', 'COURSE DETAILS']}
          onSelect={this.onTabSelect}
        />
        {tabIndex ? this.renderCourseDetails() : this.renderAccess()}
      </StyledCourseSettings>
    );
  }
}

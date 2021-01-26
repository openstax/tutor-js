import PropTypes from 'prop-types';
import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment-timezone';
import styled from 'styled-components';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import cn from 'classnames';
import Courses from '../../models/courses-map';
import CoursePage from '../../components/course-page';
import Tabs from '../../components/tabs';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import StudentAccess from './student-access';
import DeleteCourseModal from './delete-course-button';
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
    form {
      .form-controls {
        display: flex;
        justify-content: space-between;
        width: 75%;
        .btn.btn-primary {
          padding: 0.75rem 2rem;
          &.hidden {
            display: none;
          }
        }
        .btn.btn-link {
          margin-left: -15px;
          padding-top: 15px;
        }
      }
      .form-group {
        margin-bottom: 2.4rem;
        &.row {
          margin-left: 0;
        }
        span.error-message {
          color: red;
          margin-top: 2px;
        }
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
          &.error-input {
            background: #fbe7ea;
            color: red;
            border-color: #f4c0c5;
            border-width: 2px;
          }
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
    .disabled-delete-course {
      color: #027EB5;
      opacity: 40%;
      width: fit-content;
      font-weight: 500;
      font-size: 1.4rem;
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
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  }

  componentDidMount() {
    this.course.roster.fetch();
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

  renderTitleBreadcrumbs() {
    return <CourseBreadcrumb course={this.course} currentTitle="Course Settings" noBottomMargin />;
  }

  renderCourseDetails() {
    const { course } = this;
    const initialValues = {
      courseName: course.name,
      courseCode: '',
      term: course.termFull,
      startDate: course.bounds.start,
      endDate: course.bounds.end,
      timezone: course.timezone,
    };

    const hasChanges = (courseName, courseCode, timezone) => {
      const hasCourseNameChanged = initialValues.courseName !== courseName.trim();
      const hasCourseCodeChanged = initialValues.courseCode !== courseCode.trim();
      const hasTimezoneChanged = initialValues.timezone !== timezone;
      return hasCourseNameChanged || hasCourseCodeChanged || hasTimezoneChanged;
    };

    const validate = (values) => {
      const errors = {};
      if(!values.courseName.trim())
        errors.courseName = 'Required';
      return errors;
    };

    return (
      <div className="course-details">
        <Formik initialValues={initialValues} validate={validate}>
          {({
            values,
            handleChange,
            errors,
          }) => (
            <Form>
              <Form.Group as={Row} controlId="course-name">
                <Form.Label column sm="2" md="1">
              Course name
                </Form.Label>
                <Col sm="10" md="11">
                  <Form.Control
                    value={values.courseName}
                    type="text"
                    name="courseName"
                    placeholder="Course Name"
                    className={cn({ 'error-input': errors && errors.courseName })}
                    onChange={handleChange} />
                  {errors && errors.courseName && <span className="error-message">{errors.courseName}</span>}
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="course-code">
                <Form.Label column sm="2" md="1">
            Course code
                </Form.Label>
                <Col sm="10" md="11">
                  <Form.Control
                    value={values.courseCode}
                    type="text"
                    name="courseCode"
                    placeholder="SOC-101. Optional"
                    onChange={handleChange} />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="term">
                <Form.Label column sm="2" md="1">
            Term
                </Form.Label>
                <Col sm="10" md="11">
                  <Form.Control value={values.term} type="text" name="term" readOnly/>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="dates">
                <Form.Label column sm="2" md="1">
            Start date
                </Form.Label>
                <Col sm="4" md="5">
                  <Form.Control
                    id="startDate"
                    value={df(values.startDate)}
                    type="text"
                    name="startDate"
                    readOnly/>
                </Col>
                <Form.Label column sm="2" md="1" className="end-date-label">
            End date
                </Form.Label>
                <Col sm="4" md="5">
                  <Form.Control
                    id="endDate"
                    defaultValue={df(values.endDate)}
                    type="text"
                    name="endDate"
                    readOnly/>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="time-zone">
                <Form.Label column sm="2" md="1">
            Time zone
                </Form.Label>
                <Col sm="10" md="11">
                  <Form.Control value={values.timezone} type="text" name="timezone" onChange={handleChange} />
                </Col>
              </Form.Group>
              <hr />
              <div className="form-controls">
                <DeleteCourseModal course={course} history={this.props.history} />
                <Button
                  variant="primary"
                  className={cn({ 'hidden': !hasChanges(values.courseName, values.courseCode, values.timezone) })}
                  disabled={!isEmpty(errors)}
                  onClick={() => console.log('submit')}>
            Save changes
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    );
  }

  render() {
    const { course, tabIndex } = this;
    return (
      <StyledCourseSettings
        className="settings"
        title=""
        course={course}
        renderTitleBreadcrumbs={this.renderTitleBreadcrumbs()}
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

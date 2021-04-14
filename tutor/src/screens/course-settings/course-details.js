import { React, PropTypes, moment, styled, cn, observer, useState } from 'vendor';
import { Form, Row, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import DeleteCourseModal from './delete-course-button';
import Timezone from './timezone';
import { Course, currentToasts } from '../../models'
import { AsyncButton } from 'shared';
import { colors, breakpoint } from 'theme';

const StyledCourseDetails = styled.div`
  &&& {
    form {
      .form-controls {
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;
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
        .dropdown {
          width: 100%;
          .dropdown-toggle {
            height: 45px;
            width: 25%;
            ${breakpoint.tablet`
                width: 100%;
            `}
          }
          .dropdown-menu {
            min-width: 25%;
            ${breakpoint.tablet`
                width: 100%;
            `}
          }
        }
        span.error-message {
          color: red;
          margin-top: 2px;
        }
        label, .timezone-label {
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
            background: ${colors.states.trouble};
            color: red;
            border-color: ${colors.states.border_trouble};
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
      hr {
        width: 80%;
        margin: 0;
        margin-bottom: 1.5rem;
        ${breakpoint.tablet`
            width: 100%;
        `}
      }
    }
    .disabled-delete-course {
      color: ${colors.link};
      opacity: 40%;
      width: fit-content;
      font-weight: 500;
      font-size: 1.4rem;
    }
  }
`;

const df = (d) => moment(d).format('MMM DD, YYYY');

const CourseDetails = observer(({ course, history }) => {
    const [isSaving, setIsSaving] = useState(false);
    
    const initialValues = {
        courseName: course.name,
        courseCode: course.code,
        term: course.termFull,
        startDate: course.bounds.start,
        endDate: course.bounds.end,
        timezone: course.timezone,
    };

    const hasChanges = ({ courseName, courseCode, timezone }) => {
        const hasCourseNameChanged = initialValues.courseName !== courseName.trim();
        const hasCourseCodeChanged = initialValues.courseCode !== courseCode.trim();
        const hasTimezoneChanged = initialValues.timezone !== timezone;
        return hasCourseNameChanged || hasCourseCodeChanged || hasTimezoneChanged || isSaving;
    };

    const validate = (values) => {
        const errors = {};
        if(!values.courseName.trim())
            errors.courseName = 'Required';
        return errors;
    };

    const onSubmit = ({ courseName, courseCode, timezone }) => {
        setIsSaving(true);
        course.name = courseName;
        course.code = courseCode;
        course.timezone = timezone;
        course.save().then(() => {
            setIsSaving(false);
            currentToasts.add({ handler: 'courseSettingsSaved', status: 'ok' });
        });
    };

    return (
        <StyledCourseDetails>
            <Formik initialValues={initialValues} validate={validate}>
                {({
                    setFieldValue,
                    values,
                    handleChange,
                    errors,
                }) => (
                    <Form className="course-detail-settings-form">
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
                                    onChange={handleChange}
                                    disabled={isSaving} />
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
                                    onChange={handleChange}
                                    disabled={isSaving} />
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
                            <Form.Label column sm="2" md="1" htmlFor="startDate">
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
                            <Form.Label column sm="2" md="1" className="end-date-label" htmlFor="endDate">
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
                            <Col sm="2" md="1" className="timezone-label">
                                <span>Time zone</span>
                            </Col>
                            <Col sm="10" md="11">
                                <Timezone
                                    value={values.timezone}
                                    onChange={(timezone) => setFieldValue('timezone', timezone)}
                                    disabled={isSaving}/>
                            </Col>
                        </Form.Group>
                        <hr />
                        <div className="form-controls">
                            <DeleteCourseModal course={course} history={history} />
                            <AsyncButton
                                className={cn('save-changes-button', { 'hidden': !hasChanges(values) })}
                                disabled={!isEmpty(errors)}
                                onClick={() => onSubmit(values)}
                                isWaiting={isSaving}
                                waitingText="Saving..."
                            >
                Save changes
                            </AsyncButton>
                        </div>
                    </Form>
                )}
            </Formik>
        </StyledCourseDetails>
    );
});
CourseDetails.propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    history: PropTypes.object.isRequired,
};

export default CourseDetails;

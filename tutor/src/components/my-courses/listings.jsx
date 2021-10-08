import { React, PropTypes, computed, observer, styled, modelize } from 'vendor';
import { isEmpty, merge, map } from 'lodash';
import { Col, Row, Container } from 'react-bootstrap';
import classnames from 'classnames';
import { Course as CourseModel, currentUser, currentCourses } from '../../models';
import { Course, CourseTeacher } from './course';
import CreateACourse from './create-a-course';
import { breakpoint } from 'theme';

const StyledContainer = styled(Container)`
  ${breakpoint.tablet`
    max-width: 100%;
    padding: 0 ${breakpoint.margins.tablet};
  `}
  ${breakpoint.mobile`
    max-width: 100%;
    padding: 0 calc(${breakpoint.margins.mobile} * 2);
  `}
`;

function wrapCourse(Item, course = {}) {
    return (
        <Col key={course.id} lg={3} md={4} sm={6} xs={12}>
            <Item
                course={course}
            />
        </Col>
    );
}

function MyCoursesNone() {
    return (
        <Row className="my-courses-none">
            <Col xs={12}>
                <p>
                    There are no current courses.
                </p>
            </Col>
        </Row>
    );
}

const MyCoursesCreate = () => {
    return (
        <Col lg={3} md={4} sm={6} xs={12}>
            <CreateACourse />
        </Col>
    );
};


const DEFAULT_COURSE_ITEMS = {
    teacher: CourseTeacher,
    student: Course,
};


@observer
class MyCoursesBase extends React.Component {
    static propTypes = {
        courses:    PropTypes.arrayOf( PropTypes.instanceOf(CourseModel) ).isRequired,
        items:      PropTypes.objectOf(PropTypes.element),
        className:  PropTypes.string,
        before:     PropTypes.element,
        after:      PropTypes.element,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get items() {
        return merge({}, DEFAULT_COURSE_ITEMS, this.props.items);
    }

    renderCourse(course) {
        const Item = this.items[currentUser.verifiedRoleForCourse(course)];
        return Item ? wrapCourse(Item, course) : null;
    }

    render() {
        const { courses, className, before, after } = this.props;

        const sectionClasses = classnames('my-courses-section', className);
        return (
            <Row className={sectionClasses}>
                {before}
                {map(courses, (course) => this.renderCourse(course))}
                {after}
            </Row>
        );
    }
}

@observer
class MyCoursesTitle extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        main: PropTypes.bool,
    }

    static defaultProps = {
        main: false,
    }

    render() {
        const { title } = this.props;
        return (
            <Row className="my-courses-title">
                <Col xs={12}>
                    <h1>{title}</h1>
                </Col>
            </Row>
        );
    }
}


@observer
class MyCoursesCurrent extends React.Component {

    render () {
        const baseName = 'my-courses-current';
        const courses = currentCourses.tutor.nonPreview.currentAndFuture.array;
        return (
            <div data-test-id="current-courses" className={baseName}>
                <StyledContainer>
                    <MyCoursesTitle title="Current Courses" main={true} />
                    {isEmpty(courses) ? <MyCoursesNone /> : undefined}
                    <MyCoursesBase
                        className={`${baseName}-section`}
                        courses={courses}
                        after={currentUser.canCreateCourses ? <MyCoursesCreate /> : undefined}
                    />
                </StyledContainer>
            </div>
        );
    }
}

@observer
class MyCoursesBasic extends React.Component {
    static propTypes = {
        title:    PropTypes.string.isRequired,
        baseName: PropTypes.string.isRequired,
        courses:  PropTypes.arrayOf( PropTypes.instanceOf(CourseModel) ).isRequired,
        before:   PropTypes.element,
        after:    PropTypes.element,
    }

    render() {
        const { courses, baseName, title, before, after } = this.props;
        if (isEmpty(courses)) { return null; }

        return (
            (
                <div className={baseName}>
                    <StyledContainer>
                        <MyCoursesTitle title={title} />
                        <MyCoursesBase
                            className={`${baseName}-section`}
                            courses={courses}
                            before={before}
                            after={after}
                        />
                    </StyledContainer>
                </div>
            )
        );
    }
}


@observer
class MyCoursesPast extends React.Component {
    render() {
        return (
            <MyCoursesBasic
                courses={currentCourses.tutor.nonPreview.completed.array}
                baseName={'my-courses-past'}
                title="Past Courses"
            />
        );
    }
}


@observer
class MyCoursesFuture extends React.Component {
    render() {
        return (
            <MyCoursesBasic
                courses={currentCourses.tutor.nonPreview.future.array}
                baseName={'my-courses-future'}
                title="Future Courses"
            />
        );
    }
}


export { MyCoursesCurrent, MyCoursesPast, MyCoursesFuture };

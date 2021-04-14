import { React, PropTypes, observer, inject, styled } from 'vendor';
import { first } from 'lodash';
import { TaskInfo } from './task-info';
import { Course } from '../../models';
import { BackButton } from './back-button';
import UX from './ux';

const StyledFooterControls = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
`;

const Name = styled.div`
  font-weight: bold;
  margin-right: 1rem;
`;

const TeacherReviewInfo = observer(({ task }) => {
    const student = first(task.students);
    if (!student) { return null; }

    return <Name>Reviewing {student.name}</Name>;
});

const TaskFooterControls = observer(({ task, course }) => {

    return (
        <StyledFooterControls>
            {course.currentRole.isTeacher && <TeacherReviewInfo task={task} />}
            <BackButton
                fallbackLink={{
                    text: 'Back to dashboard', to: 'dashboard', params: { courseId: course.id },
                }} />
        </StyledFooterControls>
    );
});

TaskFooterControls.displayName = 'TaskFooterControls';
TaskFooterControls.propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
};
export { TaskFooterControls };


@inject('bottomNavbar')
@observer
class Footer extends React.Component {

    static displayName = 'Footer'

    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,

        bottomNavbar: PropTypes.shape({
            left: PropTypes.shape({
                set: PropTypes.func.isRequired,
                delete: PropTypes.func.isRequired,
            }).isRequired,
            right: PropTypes.shape({
                set: PropTypes.func.isRequired,
                delete: PropTypes.func.isRequired,
            }).isRequired,
        }),
        children: PropTypes.object.isRequired,
    }

    componentDidMount() {
        const { course, task } = this.props.ux;

        this.props.bottomNavbar.left.set('taskInfo', () =>
            <TaskInfo task={task} />
        );
        this.props.bottomNavbar.right.set('taskControls', () =>
            <TaskFooterControls task={task} course={course} />
        );
    }

    componentWillUnmount() {
        this.props.bottomNavbar.left.delete('taskInfo');
        this.props.bottomNavbar.right.delete('taskControls');
    }

    render() {
        return this.props.children;
    }
}

const withFooter = (ChildComponent) => {
    const WithFooterWrapper = ( props ) => {
        return (
            <Footer ux={props.ux}>
                <ChildComponent {...props} />
            </Footer>
        );
    };
    WithFooterWrapper.propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
    };
    return WithFooterWrapper;
};

export default withFooter;

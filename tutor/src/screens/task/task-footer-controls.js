import { React, PropTypes, observer, styled } from 'vendor';
import { first } from 'lodash';
import Course from '../../models/course';
import { BackButton } from './back-button';

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

import {
  React, PropTypes, styled,
} from '../helpers/react';
import { withRouter } from 'react-router';
import { Icon } from 'shared';
import Course from '../models/course';
import Theme from '../theme';

const StyledTeacherAsStudentFrame = styled.div`
  width: 10px;
  position: fixed;
  border: 2px solid ${Theme.colors.teal};
  width: 100vw;
  height: 100vh;
  z-index: ${Theme.zIndex.navbar + 1};
  top: 0;
  pointer-events: none;
`;

const ExitButton = styled.button`
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  color: white;
  background-color: ${Theme.colors.teal};
  position: absolute;
  border: 0;
  left: calc(50% - 140px);
  width: 280px;
  height: 24px;
`;

const BottomButton = styled(ExitButton)`
  bottom: 0;
  border-radius: 2px 2px 0 0;
`;

const TopButton = styled(ExitButton)`
  top: 0;
  border-radius: 0 0 2px 2px;
`;

const returnToTeacherRole = (course, history) => {
  return async () => {
    await course.roles.teacher.become();
    history.push(`/course/${course.id}`);
  };
};


const TeacherAsStudentFrame = withRouter(({ course, children, history }) => {
  if (!course || !course.currentRole.isTeacherStudent) { return children; }

  const onClick = returnToTeacherRole(course, history);

  return (
    <React.Fragment>
      <StyledTeacherAsStudentFrame>
        <TopButton onClick={onClick}>Exit student view</TopButton>
        <BottomButton onClick={onClick}>
          <Icon type="glasses" size="2x" />
          You’re viewing Tutor as a student
        </BottomButton>
      </StyledTeacherAsStudentFrame>
      {children}
    </React.Fragment>
  );
});
TeacherAsStudentFrame.displayName = 'TeacherAsStudentFrame';
TeacherAsStudentFrame.propTypes = {
  course: PropTypes.instanceOf(Course),
  children: PropTypes.node.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default TeacherAsStudentFrame;

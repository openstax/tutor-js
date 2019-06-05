import {
  React, PropTypes, styled,
} from '../helpers/react';
import Course from '../models/course';

const StyledTeacherAsStudentFrame = styled.div`
  width: 10px;
  background-color: red;
  position: fixed;
  border: 10px solid red;
  width: 100%;
  height: 100vh;
  z-index: 1000000000;
  top: 0;
`;

const TeacherAsStudentFrame = ({ course, children }) => {
  if (!course || !course.currentRole.teacherStudent) { return children; }

  return (
    <StyledTeacherAsStudentFrame>
      {children}
    </StyledTeacherAsStudentFrame>
  );
};

TeacherAsStudentFrame.propTypes = {
  course: PropTypes.instanceOf(Course),
  children: PropTypes.node.isRequired,
};

export default TeacherAsStudentFrame;

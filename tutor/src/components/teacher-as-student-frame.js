import {
  React, PropTypes, styled, observer,
} from '../helpers/react';
import { withRouter } from 'react-router';
import { Icon } from 'shared';
import Course from '../models/course';
import Theme from '../theme';

const StyledTeacherAsStudentFrame = styled.div`
  width: 10px;
  position: fixed;
  border: 4px solid ${Theme.colors.teal};
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
  height: 22px;
  font-size: 1.2rem;
`;

const TopButton = styled(ExitButton)`
  top: 0;
  border-radius: 0 0 2px 2px;
  .ox-icon { width: 1rem; height: 1rem; }
`;

const BottomNote = styled(ExitButton)`
  bottom: 0;
  border-radius: 2px 2px 0 0;
  .ox-icon { width: 2.4rem; height: 2.4rem; }
`;

const returnToTeacherRole = (course, history) => {
  return async () => {
    const role = course.roles.teacher;
    history.replace(`/course/${course.id}/become/${role.id}`);
  };
};

const IGNORED_ROUTES = [
  'view-reference-book',
];

@withRouter
@observer
class TeacherAsStudentFrame extends React.Component {
  static displayName = 'TeacherAsStudentFrame';

  static propTypes = {
    course: PropTypes.instanceOf(Course),
    routeName: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  }

  render() {
    const { course, routeName, children, history } = this.props;

    if (
      IGNORED_ROUTES.includes(routeName) ||
        !course || !course.currentRole.isTeacherStudent
    ) { return children; }

    const onClick = returnToTeacherRole(course, history);

    return (
      <React.Fragment>
        <StyledTeacherAsStudentFrame>
          <TopButton onClick={onClick}>
            Exit student view
            <Icon type="close" />
          </TopButton>
          <BottomNote as="div">
            <Icon type="glasses" />
            You’re viewing OpenStax Tutor as a student
          </BottomNote>
        </StyledTeacherAsStudentFrame>
        {children}
      </React.Fragment>
    );
  }
}

export default TeacherAsStudentFrame;

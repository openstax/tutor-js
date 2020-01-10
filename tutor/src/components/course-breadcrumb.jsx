import { React, PropTypes, cn, computed, styled, css, Theme } from 'vendor';
import { Icon } from 'shared';
import TutorLink from './link';
import { Course } from '../models/courses-map';

const Wrapper = styled.div`
  display: flex;
  font-size: 1.6rem;
  line-height: 2.5rem;
  margin: 2rem 0;
  max-width: 1200px;
`;

const Divider = styled.span`
  color: ${Theme.colors.navbars.divider};
  margin: 0 0.8rem;
`;

const AngleDivider = styled(Divider)`
  margin-top: 2px;
  svg { margin: 0; }
`;

const TaskTitle = styled.div`
  color: ${Theme.colors.neutral.grayblue};
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default class CourseBreadcrumb extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    currentTitle: PropTypes.string.isRequired,
  }

  render() {
    return (
      <Wrapper>
        <TutorLink to="dashboard" params={{ courseId: this.props.course.id }}>
          {this.props.course.name}
        </TutorLink>
        <AngleDivider>
          <Icon type="angle-right" />
        </AngleDivider>
        <TaskTitle>{this.props.currentTitle}</TaskTitle>
      </Wrapper>
    );
  }
};

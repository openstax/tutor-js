import { React, PropTypes, styled, css, Theme } from 'vendor';
import { Icon } from 'shared';
import TutorLink from './link';
import { Course } from '../models/courses-map';
import { TruncatedText } from '../components/text';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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

const TaskTitle = styled(TruncatedText)`
  color: ${Theme.colors.neutral.grayblue};

  ${props => props.titleSize === 'lg' && css`
    max-width: 100%;
    margin-top: 1rem;
    font-size: 3.6rem;
    font-weight: bold;
    line-height: initial;
    color: ${Theme.colors.neutral.darker};
  `}
`;

const CourseBreadcrumb = ({ course, currentTitle, titleSize, plan }) => {
  return (
    <Wrapper>
      <TutorLink to="dashboard" params={{ courseId: course.id }}>
        {course.name}
        <AngleDivider>
          <Icon type="angle-right" />
        </AngleDivider>
      </TutorLink>

      {
        plan &&
          <>
            <TutorLink
              to="reviewAssignment"
              params={{ courseId: course.id, id: plan.id }}
            >
              <TruncatedText>{plan.title}</TruncatedText>
            </TutorLink>
            <AngleDivider>
              <Icon type="angle-right" />
            </AngleDivider>
          </>
      }
      <TaskTitle as="h2" titleSize={titleSize}>{currentTitle}</TaskTitle>
    </Wrapper>
  );
};

CourseBreadcrumb.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
  plan: PropTypes.object,
  currentTitle: PropTypes.string.isRequired,
  titleSize: PropTypes.string,
};

export default CourseBreadcrumb;

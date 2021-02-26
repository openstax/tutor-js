import { React, PropTypes, styled, Theme, cn, observer } from 'vendor';
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
  ${props => props.noBottomMargin && 'margin-bottom: 0;'}
`;

const Links = styled.div`
  display: flex;
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
  flex: 1;
  max-width: 100%;
  margin-top: 1rem;
  font-size: 3.6rem;
  font-weight: bold;
  line-height: initial;
  color: ${Theme.colors.neutral.darker};
`;

const CourseBreadcrumb = observer(({ course, currentTitle, plan, noBottomMargin, className = '' }) => {
    return (
        <Wrapper noBottomMargin={noBottomMargin} className={cn(className)}>
            <Links>
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
            </Links>
            <TaskTitle as="h2">{currentTitle}</TaskTitle>
        </Wrapper>
    );
});

CourseBreadcrumb.propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    plan: PropTypes.object,
    currentTitle: PropTypes.string.isRequired,
    noBottomMargin: PropTypes.bool,
    className: PropTypes.string,
};

export default CourseBreadcrumb;

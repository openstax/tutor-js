import { React, PropTypes, styled, cn } from 'vendor';
import TutorLink from './link';

const StyledNoStudentsMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    .btn.btn-default {
        margin-top: 1rem;
        
        &:hover {
            color: white;
        }
    }
`;

const NoStudentsMessage = ({ className, courseId }) => {
  return (
    <StyledNoStudentsMessage className={cn('no-students-message', className)}>
      <p>
        There are no students enrolled in this section yet.  Manage student access for this section
        in <TutorLink to="courseSettings" params={{ courseId }}>Course settings</TutorLink>.
      </p>
      <TutorLink primaryBtn to="courseSettings" params={{ courseId }}>Manage student access</TutorLink>
    </StyledNoStudentsMessage>
  );
};
NoStudentsMessage.propTypes = {
  className: PropTypes.string,
  courseId: PropTypes.string.isRequired,
};

export default NoStudentsMessage;

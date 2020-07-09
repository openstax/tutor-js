import { React, PropTypes, styled } from 'vendor';
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

const NoStudentsMessage = ({ courseId }) => {
  return (
    <StyledNoStudentsMessage>
      <p>
        There are no students enrolled in this section yet.  Manage student access for this section
        in <TutorLink to="settings" params={{ courseId }}>Course settings</TutorLink>.
      </p>
      <TutorLink primaryBtn to="settings" params={{ courseId }}>Manage student access</TutorLink>
    </StyledNoStudentsMessage>
  );
};
NoStudentsMessage.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default NoStudentsMessage;

import { React, styled, PropTypes } from 'vendor';

const StyledAssignmentClosedBanner = styled.div`
  background-color: #5e6062;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 1.3rem;
`;

const AssignmentClosedBanner = ({ ux }) => {
  if (!ux.task.isAssignmentClosed) {
    return null;
  }
  return ( 
    <StyledAssignmentClosedBanner>
      <span>This assignment is closed.</span>
      {!ux.course.currentRole.isTeacher && (
        <span> You can no longer add or edit a response.</span>)}
    </StyledAssignmentClosedBanner>
  );
};

AssignmentClosedBanner.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default AssignmentClosedBanner;

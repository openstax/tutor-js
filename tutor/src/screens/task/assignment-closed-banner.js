import React from 'react';
import styled from 'styled-components';

const StyledAssignmentClosedBanner = styled.div`
  background-color: #5e6062;
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 1.3rem;
`;

const AssignmentClosedBanner = () => {
  return ( 
    <StyledAssignmentClosedBanner>
      <span>This assignment is closed. You can no longer add or edit a response.</span>
    </StyledAssignmentClosedBanner>
  );
};

AssignmentClosedBanner.propTypes = {

};

export default AssignmentClosedBanner;

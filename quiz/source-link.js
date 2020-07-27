import React from 'react';
import styled from 'styled-components';

const Prefix = styled.span`
  margin-right: 0.5rem;
`;
const Wrapper = styled.div`
  display: inline;
  text-align: right;
  margin-top: 20px;
`;

const SourceLink = ({ exercise }) => {

  return (
    <Wrapper>
      <Prefix>Comes from Microbiology chapter</Prefix>
      <span dangerouslySetInnerHTML={{__html: exercise.quiz.referenceHTML}} />
    </Wrapper>
  );
};

export default SourceLink;

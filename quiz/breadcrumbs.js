import React from 'react';
import styled, { css } from 'styled-components';
import { observer } from 'vendor';
import { Icon } from 'shared';
import TutorBreadcrumb from '../tutor/src/components/breadcrumb';

const isActiveCss = css`
  z-index: 2;
  transform: scale(1.4);
  border-radius: 50%;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.2);
`;

const Circle = styled.a`
  font-size: 20px;
  border-radius: 40px;
  height: 40px;
  min-width: 40px;
  position: relative;
  font-weight: 500;
  cursor: pointer;
  margin: 2px;
  display: inline-block;
  text-align: center;
  background: white;
  border: 1px solid lightGrey;
  color: #818181;
  display: flex;
  align-items: center;
  justify-content: center;
  .ox-icon {
    position: absolute;
    top: 1px;
    right: 1px;
    height: 15px;
    width: 15px;
    margin: 0;
  }  
  ${props => props.isActive && isActiveCss}
  &:hover {
    ${isActiveCss}
  }
`;

const StatusIcon = observer(({ exercise }) => {
  if (!exercise.selectedAnswerId) { return null; }
  if (exercise.isCorrect) {
    return <Icon color="green" type="check-circle" />;
  }
  return <Icon color="red" type="times-circle" />;
});

const Breadcrumb = observer(({ exercise, index, isActive, onSelect }) => {
  return (
    <Circle isActive={isActive} onClick={() => onSelect(index)}>
      <span>{index + 1}</span>
      <StatusIcon exercise={exercise} index={index} />
    </Circle>
  );
});

const BCWrapper = styled.div`
  height: 40px;
  display: flex;
  margin-bottom: 20px;
  justify-content: space-around;
`;

const Breadcrumbs = observer(({
  exercises, activeIndex, setActiveIndex,
}) => {
  
  return (
    <BCWrapper className="task-breadcrumbs">
      {exercises.map((ex, i) => (
        <Breadcrumb
          key={i}
          index={i}
          exercise={ex}
          isActive={i==activeIndex}
          onSelect={setActiveIndex}
        />

      ))}
    </BCWrapper>
  );
});

export default Breadcrumbs;

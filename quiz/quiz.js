import React, { useState } from 'react';
import { observer, observable, action, computed } from 'vendor';
import styled from 'styled-components';
import { sampleSize, sumBy, find, without } from 'lodash';
import Breadcrumbs from './breadcrumbs';
import Question from './question';
import SourceLink from './source-link'

const NUM_EXERCISES = 10;

const Wrapper = styled.div`
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
`;

const NextButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: #f47641;
  color: white;
`;

const Body = styled.div`
  flex: 1;
  .answers-table { margin-left: 40px; }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


const StatsWrapper = styled.div`
  font-size: 1.8rem;
  padding-left: 40px;
`;

const Next = observer(({ onClick, exercise, isLast }) => {
  if (!exercise.selectedAnswerId) return null;

  return (
    <NextButton
      onClick={onClick}
    >
      {isLast ? 'Restart' : 'Next'}
    </NextButton>
  );
});

const Stats = observer(({ exercises }) => {
  const isStarted = find(exercises, 'selectedAnswerId');
  if (!isStarted) return <StatsWrapper />

  return (
    <StatsWrapper>
      {sumBy(exercises, 'isCorrect')} / {exercises.length} correct
    </StatsWrapper>
  );
});

@observer
class Quiz extends React.Component {

  @observable exercises = [];
  @observable index = 0;
  
  chooseNewExercises() {
    const exercises = without(this.props.exercises, this.exercises);
    this.exercises = sampleSize(exercises, NUM_EXERCISES);
  }

  constructor(props) {
    super(props);
    this.chooseNewExercises();
  }

  @action.bound setIndex(i) {
    this.index = i;
  }

  @computed get exercise() {
    return this.exercises[this.index];
  }

  @computed get isLast() {
    return this.index == this.exercises.length - 1;
  }

  @action.bound onNextClick() {
    if (this.isLast) {
      this.chooseNewExercises();
      this.index = 0;
    } else {
      this.index += 1;
    }
  }

  render() {
    const { exercises, exercise, isLast, index } = this;
    
    return (
      <Wrapper className="task-quiz">
        <Breadcrumbs
          exercises={exercises}
          activeIndex={index}
          setActiveIndex={this.setIndex}
        />
        <Body>
          <Question
            key={index}
            exercise={exercise}
          />
        </Body>
        <Footer>
          <Stats exercises={exercises} />
          <Next
            exercise={exercise}
            isLast={isLast}
            onClick={this.onNextClick}
          >{this.nextButtonLabel}</Next>
        </Footer>
        <SourceLink exercise={exercise} />
      </Wrapper>
    );
  }

}

export default Quiz;

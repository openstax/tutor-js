import React from 'react';
import { observer, observable, action, computed } from 'vendor';
import styled from 'styled-components';
import { sampleSize, without, sumBy, find } from 'lodash';
import Breadcrumbs from './breadcrumbs';
import Question from './question';
import SourceLink from './source-link';

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
  justify-content: flex-end;
  align-items: center;
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

@observer
class Quiz extends React.Component {

  @observable choosenExercises = [];
  @observable availableExercises = this.props.exercises;
  @observable index = 0;
  
  chooseNewExercises() {
    this.availableExercises = without(this.availableExercises, this.choosenExercises);
    this.choosenExercises = sampleSize(this.availableExercises, NUM_EXERCISES);
  }

  constructor(props) {
    super(props);
    this.chooseNewExercises();
  }

  @action.bound setIndex(i) {
    this.index = i;
  }

  @computed get exercise() {
    return this.choosenExercises[this.index];
  }

  @computed get isLast() {
    return this.index == this.choosenExercises.length - 1;
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
    const { choosenExercises, exercise, isLast, index } = this;
    
    return (
      <Wrapper className="task-quiz">
        <Breadcrumbs
          exercises={choosenExercises}
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

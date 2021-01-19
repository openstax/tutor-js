import {
  React, PropTypes, observer, computed, styled, css,
} from 'vendor';
import { Button } from 'react-bootstrap';
import ScrollSpy from '../../../components/scroll-spy';
import Sectionizer from '../../../components/exercises/sectionizer';
import { Icon } from 'shared';
import TourAnchor from '../../../components/tours/anchor';
import HomeExerciseFilters from '../../../components/exercises/homework-exercise-filters';
import SelectionsTooltip from './selections-tooltip';
import { colors } from '../../../theme';

const Wrapper = styled.div`
  background: #fff;
  position: sticky;
  top: 59px;
  z-index: 10;
  border-top: 1px solid ${colors.neutral.pale};
  border-bottom: 1px solid ${colors.neutral.pale};
`;

const Filters = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem 5rem;
  border-top: 1px solid ${colors.neutral.pale};
  background-color: ${colors.neutral.lightest};
  
  .question-filters {
    margin-top: 0.75rem;
    .dropdown-menu.show {
      width: 30rem;
    }
  }

  .btn.btn-primary {
    padding: 0.5rem 5rem;
  }
`;

const SelectionButton = styled.button`
  background: transparent;
  border: 1px solid ${colors.neutral.lite};
  color: ${colors.neutral.lite};
  width: 2.2rem;
  height: 2.2rem;
  padding: 0;
  display: flex;
  align-items: center;
  border-radius: 100%;

  &:disabled {
    visibility: hidden;
  }
`;

const Columns = styled.div`
  background-color: ${colors.neutral.white};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Sections = styled.div`
  margin-left: 6.4rem;
`;

const Indicators = styled.div`
  margin: 0.4rem 0;
`;

const Indicator = styled.div`
  text-align: center;
  min-width: 20rem;
  padding: 1.5rem 4rem;

  &:not(:last-child) {
    border-right: 1px solid ${colors.neutral.pale};
  }
`;

const Counter = styled.div`
  font-size: 2.4rem;
  font-weight: bold;
  line-height: 3rem;

  ${props => props.variant === 'plus' && css`
    align-self: flex-end;
    font-size: 1.6rem;
  `}
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: normal;
`;

const SectionizerControls = styled.div`
  .sectionizer {
    flex-wrap: nowrap;
    display: flex;
    align-items: center;
    text-align: center;

    div {
      cursor: pointer;
      display: inline-block;
      font-size: 1.2rem;
      width: 4rem;

      &.section {
        border: 1px solid ${colors.neutral.pale};
        position: relative;
        margin-right: 0;
        margin-left: -1px;
        height: 4rem;
        line-height: 4rem;

        &:first-child {
          margin-left: 0;
        }
      }
      &.active {
        background-color: ${colors.neutral.light};
        z-index: 10;
      }
      &.disabled {
        cursor: default;
        color: ${colors.neutral.light};
      }
    }
  }
`;

@observer
class ExerciseControls extends React.Component {
  static propTypes = {
    ux: PropTypes.object.isRequired,
    sectionizerProps: PropTypes.object,
    hideSectionizer: PropTypes.bool,
    onDisplayAddEditQuestionModal: PropTypes.func.isRequired,
    showingDetails: PropTypes.bool,
  };

  renderSectionizer() {
    if (this.props.hideSectionizer) {
      return <div className="controls" />;
    } else {
      return (
        <SectionizerControls>
          <ScrollSpy dataSelector="data-section">
            <Sectionizer
              ref="sectionizer"
              {...this.props.sectionizerProps}
              nonAvailableWidth={1000}
              disableScroll
              onScreenElements={[]}
            />
          </ScrollSpy>
        </SectionizerControls>
      );
    }
  }

  @computed get canAdd() {
    return this.props.ux.canEdit;
  }

  renderExplanation() {
    if (this.canAdd) { return null; }
    return (
      <div className="tutor-added-later">
        <span>
          Tutor selections are added later to support spaced practice and personalized learning.
        </span>
      </div>
    );
  }

  renderIncreaseButton() {
    const { ux } = this.props;

    return (
      <SelectionButton
        disabled={!ux.canIncreaseTutorExercises}
        onClick={ux.increaseTutorSelection}
        variant="plain"
        data-test-id="increase-button"
      >
        <Icon
          type="plus"
          size="xs"
        />
      </SelectionButton>
    );
  }

  renderDecreaseButton() {
    const { ux } = this.props;

    return (
      <SelectionButton
        disabled={!ux.canDecreaseTutorExercises}
        onClick={ux.decreaseTutorSelection}
        variant="plain"
        data-test-id="decrease-button"
      >
        <Icon
          type="minus"
          size="xs"
        />
      </SelectionButton>
    );
  }

  homeworkFiltersAndCreateButton() {
    const { ux, onDisplayAddEditQuestionModal } = this.props;
    return (
      <Filters>
        <HomeExerciseFilters
          className="question-filters"
          // need to pass the `exercises.homework` so the useEffect can be triggered
          // useEffect treats an Observable map as an array so it won't listen to changes
          // if we add or delete an element.
          exercises={ux.exercises ? ux.exercises.homework : null}
          returnFilteredExercises={(ex) => ux.onFilterHomeworkExercises(ex)}/>
        <Button
          variant="primary"
          onClick={() => onDisplayAddEditQuestionModal(true)}>
              Create question
        </Button>
      </Filters>
    );
  }

  render() {
    const { ux: { numMCQs, numWRQs, numTutorSelections, totalSelections }, showingDetails } = this.props;

    if(showingDetails) {
      return null;
    }
    
    return (
      <Wrapper>
        <Columns>
          <Sections>
            {this.renderSectionizer()}
          </Sections>
          <Indicators>
            <Columns>
              <Indicator>
                <div>
                  My Selections
                </div>
                <Columns>
                  <Counter>
                    <Title>MCQs</Title>
                    <span data-test-id="selection-count">{numMCQs}</span>
                  </Counter>
                  <Counter variant="plus">
                    +
                  </Counter>
                  <Counter>
                    <Title>WRQs</Title>
                    <span data-test-id="selection-count">{numWRQs}</span>
                  </Counter>
                </Columns>
              </Indicator>
              <Indicator>
                <TourAnchor id="tutor-selections">
                  <div className="tutor-selections">
                    <div>Personalized questions</div>
                    <SelectionsTooltip />
                    <Columns>
                      {this.renderDecreaseButton()}
                      <Counter data-test-id="tutor-count">
                        {numTutorSelections}
                      </Counter>
                      {this.renderIncreaseButton()}
                    </Columns>
                  </div>
                </TourAnchor>
              </Indicator>
              <Indicator>
                Total
                <Counter data-test-id="total-count">
                  {totalSelections}
                </Counter>
              </Indicator>
              {this.renderExplanation()}
            </Columns>
          </Indicators>
        </Columns>
        {this.homeworkFiltersAndCreateButton()}
      </Wrapper>
    );
  }
}

export default ExerciseControls;

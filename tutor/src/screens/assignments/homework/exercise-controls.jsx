import {
  React, PropTypes, observer, autobind, computed, styled, css
} from 'vendor';
import { Button } from 'react-bootstrap';
import ScrollSpy from '../../../components/scroll-spy';
import Sectionizer from '../../../components/exercises/sectionizer';
import { Icon } from 'shared';
import TourAnchor from '../../../components/tours/anchor';
import SelectionsTooltip from './selections-tooltip';
import { colors } from '../../../theme';

const Wrapper = styled.div`

`;

const Filter = styled.div`
  padding: 1.6rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.6rem;

  & > :first-child {
    margin-right: 2.4rem;
  }
`;

const Buttons = styled.div`

`;

const Columns = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Sections = styled.div`

`;

const Indicators = styled.div`

`;

const Indicator = styled.div`
  text-align: center;
  min-width: 12rem;
  padding: 0.5rem 4rem;

  &:not(:last-child) {
    border-right: 1px solid ${colors.neutral.pale};
  }
`;

const Counter = styled.div`
  font-size: 2.4rem;
  font-weight: bold;
  line-height: 3rem;

  ${props => props.variant === "plus" && css`
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
    sectionizerProps:    PropTypes.object,
    hideSectionizer: PropTypes.bool,
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
              onScreenElements={[]} />
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
    if (ux.canIncreaseTutorExercises) {
      return (
        <Icon
          type="chevron-up" onClick={ux.increaseTutorSelection}
          className="hover-circle" size="xs" />
      );
    } else {
      return <span className="circle-btn-placeholder" />;
    }
  }

  renderDecreaseButton() {
    const { ux } = this.props;
    if (ux.canDecreaseTutorExercises) {
      return (
        <Icon
          type="chevron-down" onClick={ux.decreaseTutorSelection}
          className="hover-circle" size="xs" />
      );
    } else {
      return <span className="circle-btn-placeholder" />;
    }
  }

  render() {
    const { ux: { numExerciseSteps, numTutorSelections } } = this.props;

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
                    {numExerciseSteps}
                  </Counter>
                  <Counter variant="plus">
                    +
                  </Counter>
                  <Counter>
                    <Title>WRQs</Title>
                    0
                  </Counter>
                </Columns>
              </Indicator>
              <Indicator>
                <TourAnchor id="tutor-selections">
                  <div className="tutor-selections">
                    OpenStax Tutor Selections
                    <Columns>
                      {this.renderDecreaseButton()}
                      <Counter>
                        {numTutorSelections}
                      </Counter>
                      {this.renderIncreaseButton()}
                    </Columns>
                  </div>
                  <SelectionsTooltip />
                </TourAnchor>
              </Indicator>
              <Indicator>
                Total
                <Counter>
                  {numExerciseSteps + numTutorSelections}
                </Counter>
              </Indicator>
              {this.renderExplanation()}
            </Columns>
          </Indicators>
        </Columns>
        <Filter>
          <strong>Filter</strong>
          <div>
            <Button variant="light">All questions</Button>
            <Button variant="light">Multiple-choice questions only</Button>
            <Button variant="light">Written-response questions only</Button>
          </div>
        </Filter>
      </Wrapper>
    );
  }
}

export default ExerciseControls;

import { React, PropTypes, observer, cn, styled } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import { map, sumBy } from 'lodash';
import { colors } from 'theme';
import S from '../../src/helpers/string';

const PointsScoredStatus = {
  NOT_ANSWERED_NOT_GRADED: 'not-answered-not-graded',
  INCORRECT: 'incorrect',
  CORRECT: 'correct',
  PARTIAL: 'partial',
};

const StyledStickyTable = styled(StickyTable)`
  padding-bottom: 5px;

  .sticky-table-cell {
    min-height: 40px;
  }

  .current-step {
    font-weight: 800;
  }

  .correct {
    background: ${colors.pointsScoredStatus.correct};
  }

  .incorrect {
    background: ${colors.pointsScoredStatus.incorrect};
  }

  .partial {
    background: ${colors.pointsScoredStatus.partial};
  }


  /** Add top border on first row */
  .sticky-table-row:first-child > .sticky-table-cell {
      border-top: 1px solid ${colors.neutral.pale};
      background-color: ${colors.neutral.lightest};

      :not(:first-child):not(:last-child) {
        color: ${colors.link};
        cursor: pointer;
        :not(.current-step) {
            text-decoration: underline;
        }
      }
  }

  /** Add top border on first row */
  .sticky-table-row:not(:first-child) > .sticky-table-cell {
      border-bottom: 1px solid ${colors.neutral.pale};
  }

  /* Add left border on first columns */
  .sticky-table-row > :first-child {
      border-left: 1px solid ${colors.neutral.pale};
      background-color: ${colors.neutral.lightest};
      padding: 10px;
    }

  /* Add right border on last columns */
  .sticky-table-row > :last-child {
    border-right: 1px solid ${colors.neutral.pale};
    font-weight: bolder;
  }
  
  /* Not first column cells */
  .sticky-table-row > :not(:first-child) {
        min-width: 48px;
        text-align:center;
        vertical-align: middle; 
        :not(:last-child) {
          border-right: 1px solid ${colors.neutral.pale};
        }
    }

  /** Icons */
  .sticky-table-row {
    .icons {
      width: 5%;
      i {
        position: absolute;
        right: 0;
        top: 22px;
        left: 8px;
        display: inline-block;
        width: 3rem;
        height: 3rem;
        background-size: 3rem 3rem;
        background-repeat: no-repeat;
        background-position: center;
        transition: transform .1s ease-in-out, margin .3s ease-in-out;
      }
    }
  }
`;

const pointsScoredStatus = (step) => {
  if(step.pointsScored === null) return PointsScoredStatus.NOT_ANSWERED_NOT_GRADED;
  if(step.pointsScored <= 0) return PointsScoredStatus.INCORRECT;
  if(step.pointsScored >= step.available_points) return PointsScoredStatus.CORRECT;
  return PointsScoredStatus.PARTIAL;
};

@observer
class TaskProgress extends React.Component {
  static propTypes = {
    steps: PropTypes.array.isRequired,
    goToStep: PropTypes.func.isRequired,
    currentStep: PropTypes.object.isRequired,
  };

  render() {
    const { steps, currentStep, goToStep } = this.props;
    

    let progressIndex = 0;
    return (
      <StyledStickyTable rightStickyColumnCount={1} borderWidth={'1px'} >
        <Row>
          <Cell>Question number</Cell>
          {
            steps.map((step, stepIndex) => {
              if (!step.isInfo) {
                progressIndex += 1;
                return (
                  <Cell
                    key={stepIndex}
                    className={cn({ 'current-step': step === currentStep })}
                    onClick={() => goToStep(stepIndex, step)}>
                    {progressIndex}
                  </Cell>
                );
              }
              else if (step.isInfo) {
                // get the step info labels
                let crumbClasses = '';
                if (step.labels != null) { crumbClasses = map(step.labels, label => `icon-${label}`); }
                const iconClasses = cn(`icon-${step.type}`, crumbClasses);
                return (
                  <Cell
                    key={stepIndex}
                    rowSpan="3"
                    className="icons"
                    onClick={() => goToStep(stepIndex, step)}>
                    <i className={`icon-sm ${iconClasses}`} />
                  </Cell>
                );
              }
              return null;
            })
          }
          <Cell>Total</Cell>
        </Row>
        <Row>
          <Cell>Available Points</Cell>
          {
            steps.map((step, stepIndex) => {
              if(!step.isInfo) {
                progressIndex += 1;
                return <Cell key={stepIndex}>{S.numberWithOneDecimalPlace(step.availablePoints)}</Cell>;
              }
              return <Cell key={stepIndex}></Cell>;
            })
          }
          <Cell>{S.numberWithOneDecimalPlace(sumBy(steps, s => s.availablePoints))}</Cell>
        </Row>
        {
          steps.some(s => s.correct_answer_id || s.grader_points) &&
            <Row>
              <Cell>Points Scored</Cell>
              {
                steps.map((step, stepIndex) => {
                  if(!step.isInfo) {
                    return (
                      <Cell key={stepIndex} className={pointsScoredStatus(step)}>
                        {step.pointsScored !== null ? S.numberWithOneDecimalPlace(step.pointsScored) : '---' }
                      </Cell>
                    );
                  }
                  return <Cell key={stepIndex}></Cell>;
                })
              }
              <Cell>{
                S.numberWithOneDecimalPlace(sumBy(steps, s => {
                  return s.pointsScored !== null ? s.pointsScored : 0;
                }))
              }</Cell>
            </Row>
        }
      </StyledStickyTable>
    );
    
    
  }

}

export default TaskProgress;

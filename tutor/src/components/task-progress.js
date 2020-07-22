import { React, PropTypes, observer, cn, styled } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { map, sumBy, isNil } from 'lodash';
import { Icon } from 'shared';
import { colors } from 'theme';
import { CornerTriangle } from './dropped-question';
import LatePointsInfo from './late-points-info';
import S, { UNWORKED } from '../../src/helpers/string';

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
    position: relative;
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

  .icon {
    position: absolute;
    left: 28px;
    bottom: 24px;

    & svg {
      height: 8px;
    }
  }


  /** Add top border on first row */
  .sticky-table-row:first-child > .sticky-table-cell {
    border-top: 1px solid ${colors.neutral.pale};
    background-color: ${colors.neutral.lightest};

    :not(:first-child):not(:last-child):not(.late-work) {
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

const StyledPopover = styled(Popover)`
  /** https://styled-components.com/docs/faqs#how-can-i-override-inline-styles */
    &[style] {
      border: 1px #d5d5d5 solid !important;
      top: ${props => props.graded ? '72px' : '42px'} !important;  
    }
    padding: 10px 7px;
    text-align: center;

    p {
      margin-bottom: 0.2rem;
    }

    table {
        font-size: 1.3rem;

        td {
            line-height: 1.2;
        }

        tr td:last-child {
            padding-left: 2px;
        }
    }
`;

const pointsScoredStatus = (step) => {
  if(step.pointsScored === null) return PointsScoredStatus.NOT_ANSWERED_NOT_GRADED;
  if(step.pointsScored <= 0) return PointsScoredStatus.INCORRECT;
  if(step.pointsScored >= step.available_points) return PointsScoredStatus.CORRECT;
  return PointsScoredStatus.PARTIAL;
};

const renderLateInfoPopover = (step) => {
  if(isNil(step.pointsScored)) {
    return (
      <StyledPopover><p><strong>Not yet graded</strong></p></StyledPopover>
    );
  }

  return (
    <StyledPopover graded>
      <LatePointsInfo step={step} />
    </StyledPopover>
  );
};

const renderPointsScoredCell = (step) => {
  if(step.isLate) {
    return (
      <OverlayTrigger
        key={step.id}
        show={true}
        placement="bottom"
        overlay={renderLateInfoPopover(step)}>
        <Cell className={cn(pointsScoredStatus(step), { 'isLateCell': step.isLate })}>
          {
            step.isLate && 
            <div className="icon">
              <Icon
                color={colors.danger}
                type='clock'
                data-test-id="late-icon"
              />
            </div>
          }
          <span>{step.pointsScored !== null ? S.numberWithOneDecimalPlace(step.pointsScored) : UNWORKED }</span>
        </Cell>
      </OverlayTrigger>
    );
  }

  return (
    <Cell key={step.id} className={pointsScoredStatus(step)}>
      <span>{step.pointsScored !== null ? S.numberWithOneDecimalPlace(step.pointsScored) : UNWORKED }</span>
    </Cell>
  );
};

@observer
class TaskProgress extends React.Component {
  static propTypes = {
    steps: PropTypes.array.isRequired,
    goToStep: PropTypes.func.isRequired,
    currentStep: PropTypes.object.isRequired,
  };
  render() {
    const { steps, currentStep, currentStep: { task }, goToStep } = this.props;
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
                    data-step-index={stepIndex}
                    className={cn({ 'current-step': step === currentStep })}
                    onClick={() => goToStep(step.id)}>
                    {progressIndex}
                    {step.isDroppedQuestion &&
                      <CornerTriangle color="blue"
                        tooltip={step.dropped_method == 'zeroed' ?
                          'Question dropped: question is worth zero points' : 'Question dropped: full credit assigned for this question'}
                      />}
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
                    data-step-index={stepIndex}
                    rowSpan="3"
                    className="icons"
                    onClick={() => goToStep(step.id)}>
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
                return <Cell key={stepIndex}>{S.numberWithOneDecimalPlace(step.available_points)}</Cell>;
              }
              return <Cell key={stepIndex}></Cell>;
            })
          }
          <Cell>{S.numberWithOneDecimalPlace(sumBy(steps, s => s.available_points))}</Cell>
        </Row>
        {
          steps.some(s => s.correct_answer_id || !isNil(s.pointsScored)) &&
            <Row>
              <Cell>Points Scored</Cell>
              {
                steps.map((step, stepIndex) => {
                  if(!step.isInfo) {
                    return renderPointsScoredCell(step, stepIndex);
                  }
                  return <Cell key={stepIndex}></Cell>;
                })
              }
              <Cell>
                {isNil(task.publishedPoints) ?
                  UNWORKED : S.numberWithOneDecimalPlace(task.publishedPoints)}
              </Cell>
            </Row>
        }
      </StyledStickyTable>
    );
  }
}

export default TaskProgress;

import { React, PropTypes, observer, cn, styled } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { map, sumBy, isNil } from 'lodash';
import { Icon } from 'shared';
import { colors } from 'theme';
import { DroppedStepIndicator } from './dropped-question';
import LatePointsInfo from './late-points-info';
import ScoresHelper, { UNWORKED } from '../../src/helpers/scores';

const PointsScoredStatus = {
    NOT_ANSWERED_NOT_GRADED: 'not-answered-not-graded',
    INCORRECT: 'incorrect',
    CORRECT: 'correct',
    PARTIAL: 'partial',
};

const StyledStickyTable = styled(StickyTable)`
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

  ${({ theme }) => theme.breakpoint.tablet`
    font-size: 1.2rem;
  `};

  /** Add top border on first row */
  .sticky-table-row:first-child > .sticky-table-cell {
    border-top: 1px solid ${colors.neutral.pale};
    background-color: ${colors.neutral.lightest};

    &.completed {
      background-color: #e5e5e5;
    }

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

  ${({ theme, hideTaskProgressTable }) => hideTaskProgressTable && theme.breakpoint.tablet`
    display: none;
  `};
`;

const StyledPopover = styled(Popover).withConfig({
    shouldForwardProp: prop => prop !== 'graded',
})`
  /** https://styled-components.com/docs/faqs#how-can-i-override-inline-styles */
  &[style] {
    border: 1px #d5d5d5 solid !important;
    top: ${props => props.graded ? '72px' : '42px'} !important;
  }

  pointer-events: none;
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

const renderInfoPopover = (step) => {
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

export const renderPointsScoredCell = (step) => {
    // OverlayTrigger errors when given a null "overlay" attribute
    // Different if branches handle overlay vs no overlay
    if((step.is_completed && isNil(step.pointsScored)) || step.isLate) {
        // All steps with an overlay popover are handled here
        return (
            <OverlayTrigger
                key={step.id}
                show={true}
                placement="bottom"
                overlay={renderInfoPopover(step)}>
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
                    <span>{
                        // UNWORKED steps don't have a popover, so not handled in this branch
                        isNil(step.pointsScored) ?
                            <Icon type="info-circle" color="#818181" /> :
                            ScoresHelper.formatPoints(step.pointsScored)
                    }</span>
                </Cell>
            </OverlayTrigger>
        );
    }

    // All steps without an overlay popover are handled here
    return (
        <Cell key={step.id} className={pointsScoredStatus(step)}>
            <span>{
                isNil(step.pointsScored) ? UNWORKED : ScoresHelper.formatPoints(step.pointsScored)
            }</span>
        </Cell>
    );
};

@observer
class TaskProgress extends React.Component {
    static propTypes = {
        steps: PropTypes.array.isRequired,
        goToStep: PropTypes.func.isRequired,
        currentStep: PropTypes.object.isRequired,
        hideTaskProgressTable: PropTypes.bool.isRequired,
    };

    render() {
        const { hideTaskProgressTable, steps, currentStep, currentStep: { task }, goToStep } = this.props;
        let progressIndex = 0;

        return (
            <StyledStickyTable rightStickyColumnCount={1} borderWidth={'1px'} hideTaskProgressTable={hideTaskProgressTable}>
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
                                        className={cn({ 'current-step': step === currentStep, 'completed': step.is_completed })}
                                        onClick={() => goToStep(step.id)}
                                    >
                                        {progressIndex}
                                        <DroppedStepIndicator step={step} />
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
                                return <Cell key={stepIndex}>{ScoresHelper.formatPoints(step.available_points)}</Cell>;
                            }
                            return <Cell key={stepIndex}></Cell>;
                        })
                    }
                    <Cell>{ScoresHelper.formatPoints(sumBy(steps, s => s.available_points))}</Cell>
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
                        UNWORKED : ScoresHelper.formatPoints(task.publishedPoints)}
                </Cell>
            </Row>
                }
            </StyledStickyTable>
        );
    }
}

export default TaskProgress;

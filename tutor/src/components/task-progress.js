import { React, PropTypes, observer, action, cn, styled } from 'vendor';
import { Table } from 'react-bootstrap';
import { map } from 'lodash';
import { colors } from 'theme';

const StyledTable = styled(Table)`
    .table-bordered th, .table-bordered td {
        border: 2px solid ${colors.neutral.pale};
        padding: 10px;
    }
    /* Not first column */
    > tr > :not(:first-child) {
        text-align:center;
        vertical-align: middle;
    }
    /* First column */
    > tr > :first-child {
        width: 15%;
        background-color: ${colors.neutral.lightest};
        color: #6f6f6f;
        font-weight: 500;
        font-size: 13px;
    }

    /* Questions row */
    tr:first-child {
        background-color: ${colors.neutral.lightest};
        > *:not(:first-child):not(:last-child) {
            color: ${colors.link};
            cursor: pointer;
            :not(.current-step) {
                text-decoration: underline;
            }
        }
        .current-step {
            font-weight: 800;
        }
        .icons {
          width: 5%;
          i {
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

@observer
class TaskProgress extends React.Component {
  static propTypes = {
    step: PropTypes.object.isRequired,
    stepIndex: PropTypes.oneOfType([
      PropTypes.number, PropTypes.string,
    ]).isRequired,
    className: PropTypes.string,
    goToStep: PropTypes.func.isRequired,
    isCurrent: PropTypes.bool,
    canReview: PropTypes.bool,
    dataStepIndex: PropTypes.number,
  };

  render() {
    let status, title;
    let isCorrect = false;
    let isIncorrect = false;
    const {
      step, canReview, isCurrent, className, dataStepIndex, ux,
    } = this.props;
    // const isCompleted = step.isInfo ? null : step.is_completed;
    // const { type: crumbType } = step;
    // const isEnd = 'end' === crumbType;
    // if (isCompleted) {
    //   if (canReview && (step.correct_answer_id != null)) {
    //     if (step.isCorrect) {
    //       isCorrect = true;
    //     } else if (step.answer_id) {
    //       isIncorrect = true;
    //     }
    //   }
    // }

    // if (isCurrent) {
    //   title = `Current Step (${crumbType})`;
    // }

    // if (isCompleted) {
    //   if (title == null) { title = `Step Completed (${crumbType}). Click to review`; }
    // }

    // if (isCorrect) {
    //   status = <i className="icon-lg icon-correct" />;
    // }

    // if (isIncorrect) {
    //   status = <i className="icon-lg icon-incorrect" />;
    // }

    // if (isEnd) {
    //   title = `${(step.task != null ? step.task.title : undefined)} Completion`;
    // }

    // const classes = cn(
    //   'openstax-breadcrumbs-step',
    //   'icon-stack',
    //   'icon-lg',
    //   step.group,
    //   `breadcrumb-${crumbType}`,
    //   className,
    //   {
    //     current: isCurrent,
    //     active: isCurrent,
    //     completed: isCompleted,
    //     'status-correct': isCorrect,
    //     'status-incorrect': isIncorrect,
    //   },
    // );
    

    let progressIndex = 0;
    return (
    //   <span
    //     title={title}
    //     aria-label={title}
    //     className={classes}
    //     data-step-id={step.id}
    //     key={`step-${step.id}`}
    //     onClick={this.goToStep}
    //     data-step-index={dataStepIndex}
    //     data-chapter={step.sectionLabel}
    //   >
    //     <i className={`icon-lg ${iconClasses}`} />
    //     {status}
    //   </span>
      <StyledTable bordered responsive>
        <tr>
          <th>Question Number</th>
          {
            ux.steps.map((step, stepIndex) => {
              if (!step.isInfo) {
                progressIndex += 1;
                return (
                  <td
                    className={cn({ 'current-step': step === ux.currentStep })}
                    onClick={() => ux.goToStep(stepIndex, step)}>
                    {progressIndex}
                  </td>
                );
              }
              else if (step.isInfo) {
                // get the step info labels
                let crumbClasses = '';
                if (step.labels != null) { crumbClasses = map(step.labels, label => `icon-${label}`); }
                const iconClasses = cn(`icon-${step.type}`, crumbClasses);
                return (
                  <th
                    rowspan="2"
                    className="icons"
                    onClick={() => ux.goToStep(stepIndex, step)}>
                    <i className={`icon-lg ${iconClasses}`} />
                  </th>
                );
              }
            })
          }
          <th>Total</th>
        </tr>
        <tr>
          <th>Available Points</th>
          {
            ux.steps.map((step, stepIndex) => {
              if(!step.isInfo) {
                progressIndex += 1;
                return <td>{progressIndex}</td>;
              }
            })
          }
          <td><strong>1000</strong></td>
        </tr>
      </StyledTable>
    );
    
  }

}

export default TaskProgress;

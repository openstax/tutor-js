import { React, PropTypes, observer, cn, styled } from 'vendor';
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
        color: ${colors.neutral.thin};
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
    steps: PropTypes.array.isRequired,
    stepIndex: PropTypes.oneOfType([
      PropTypes.number, PropTypes.string,
    ]).isRequired,
    goToStep: PropTypes.func.isRequired,
    currentStep: PropTypes.object.isRequired,
  };

  render() {
    const { steps, currentStep, goToStep } = this.props;
    

    let progressIndex = 0;
    return (
      <StyledTable bordered responsive>
        <tr>
          <th>Question Number</th>
          {
            steps.map((step, stepIndex) => {
              if (!step.isInfo) {
                progressIndex += 1;
                return (
                  <td
                    key={stepIndex}
                    className={cn({ 'current-step': step === currentStep })}
                    onClick={() => goToStep(stepIndex, step)}>
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
                    key={stepIndex}
                    rowSpan="3"
                    className="icons"
                    onClick={() => goToStep(stepIndex, step)}>
                    <i className={`icon-lg ${iconClasses}`} />
                  </th>
                );
              }
              return null;
            })
          }
          <th>Total</th>
        </tr>
        <tr>
          <th>Available Points</th>
          {
            steps.map((step, stepIndex) => {
              if(!step.isInfo) {
                progressIndex += 1;
                return <td key={stepIndex}>{progressIndex}</td>;
              }
              return null;
            })
          }
          <td><strong>1000</strong></td>
        </tr>
        {/** TODO: wait for points from BE to see if student got full, partial points */}
        {/* <tr>
          <th>Points scored</th>
          {
            ux.steps.map((step, stepIndex) => {
              if(!step.isInfo) {
                let isCorrect = false;
                if (step.isCorrect) 
                  isCorrect = true;
                progressIndex += 1;
                return <td key={stepIndex} className={cn({ isCorrect })}>{progressIndex}</td>;
              }
              return null;
            })
          }
          <td><strong>1000</strong></td>
        </tr> */}
      </StyledTable>
    );
    
  }

}

export default TaskProgress;

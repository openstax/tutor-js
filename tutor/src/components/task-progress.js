import { React, PropTypes, observer, cn, styled } from 'vendor';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import { map } from 'lodash';
import { colors } from 'theme';

const StyledStickyTable = styled(StickyTable)`
  padding-bottom: 5px;

  .sticky-table-cell {
    min-height: 40px;
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
                return <Cell key={stepIndex}>{progressIndex}</Cell>;
              }
              return <Cell key={stepIndex}></Cell>;
            })
          }
          <Cell>1000</Cell>
        </Row>
        {/* <Row>
          <Cell>Points Scored</Cell>
          {
            range(100).map((step, stepIndex) => {
              if(!step.isInfo) {
                progressIndex += 1;
                return <Cell key={stepIndex}>{progressIndex}</Cell>;
              }
              return <Cell key={stepIndex}></Cell>;
            })
          }
          <Cell>1000</Cell>
        </Row> */}
      </StyledStickyTable>
    );
    
    
  }

}

export default TaskProgress;
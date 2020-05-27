import { React, PropTypes, observer, styled, css } from 'vendor';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { colors } from 'theme';
import OXQuestionPreview from '../../components/question-preview';
import { StickyTable, Row, Cell } from 'react-sticky-table';
import S from '../../helpers/string';
import CheckboxInput from '../../components/checkbox-input';
import RadioInput from '../../components/radio-input';

// https://projects.invisionapp.com/d/main#/console/18937568/401942279/preview

const Instructions = styled.h2`
  font-size: 1.4rem;
  line-height: 2rem;
  font-weight: bold;
  margin: 0 0 1.6rem;
`;

const disabledCSS = css`
  color: ${colors.neutral.std};
`;

const QuestionRowWrapper = styled(Row)`
  ${({ disabled }) => disabled && disabledCSS}
`;

const Reallocate = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  > * {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-around;
    margin: 0;
    &:last-child {
      height: 100%;
      border-left: 1px solid lightGrey;
    }
  }
`;

const ReallocateHeader = styled(Cell)`
  &.sticky-table-cell {
    padding: 0 !important;
  }
  > div {
    display: flex;
    flex-direction: column;
    > div {
      flex: 1;
      align-self: stretch;
      &:first-child {
        border-bottom: 1px solid ${colors.neutral.pale};
        padding: 0.75rem 0 0.5rem;
      }
      &:last-child {
        display: flex;
        align-items: stretch;
        font-size: 1rem;
        div {
          flex: 1;
          padding: 0.25rem 0;
          &:last-child {
            border-left: 1px solid ${colors.neutral.pale};
          }
        }
      }
    }
  }
`;

const QuestionPreview = styled(OXQuestionPreview)`
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
`;

const Table = styled(StickyTable)`
  .sticky-table-table {
    width: 100%;
  }
  .sticky-table-cell {
    border: 1px solid lightGrey;
    background-color: ${colors.neutral.lightest};
    padding: 0;
    height: 38px;
    vertical-align: middle;
    text-align: center;
    border-width: 0 1px 1px 0;

    &:first-child {
      border-width: 0 1px 1px 1px;
    }
  }
`;

const DetailsCell = styled(Cell)`
  &.sticky-table-cell {
    padding: 0.5rem 0.75rem;
    text-align: left;
  }
`;

const LeftCell = styled(Cell)`
  text-align: left;
`;

const Question = observer(({ heading, ...props }) => {
  const RowType = heading.isCore ? CoreQuestion : TutorQuestion;
  return <RowType heading={heading} {...props} />;
});

const TutorQuestion = observer(({ heading }) => {
  return (
    <QuestionRowWrapper disabled>
      <Cell>
        <CheckboxInput type="checkbox" standalone={true} disabled />
      </Cell>
      <Cell>
        {heading.title}
      </Cell>
      <DetailsCell>
        OpenStax Tutor Beta selection
      </DetailsCell>
      <Cell>
        {S.numberWithOneDecimalPlace(heading.points)}
      </Cell>
      <Cell>
        <Reallocate>
          <div><input type="radio" disabled /></div>
          <div><input type="radio" disabled /></div>
        </Reallocate>
      </Cell>
      <Cell>
        1.0
      </Cell>
    </QuestionRowWrapper>
  );
});

const CoreQuestion = observer(({ ux, heading }) => {
  const drop = ux.droppedQuestionRecord(heading);

  return (
    <QuestionRowWrapper
      disabled={!!heading.dropped}
      data-test-id="drop-question-row"
      data-exercise-id={heading.exercise_id}
      data-question-id={heading.question_id}
    >
      <Cell>
        <CheckboxInput
          type="checkbox"
          name={heading.title}
          checked={!!drop}
          onChange={({ target: { checked } }) => ux.toggleDropQuestion(checked, heading)}
          standalone={true}
        />
      </Cell>
      <Cell>
        {heading.title}
      </Cell>
      <DetailsCell>
        <QuestionPreview question={heading.question} />
      </DetailsCell>
      <Cell>
        {S.numberWithOneDecimalPlace(heading.points_without_dropping)}
      </Cell>
      <Cell>
        <Reallocate>
          <label>
            <RadioInput
              type="radio"
              name={`${heading.question_id}`}
              value="full_credit"
              disabled={!drop}
              onChange={({ target: { checked } }) => { checked && (drop.setDropMethod('full_credit')); }}
              checked={Boolean(drop && drop.drop_method == 'full_credit')}
              standalone={true}
            /></label>
          <label>
            <RadioInput
              type="radio"
              name={`${heading.question_id}`}
              value="zeroed"
              disabled={!drop}
              onChange={({ target: { checked } }) => { checked && (drop.setDropMethod('zeroed')); }}
              checked={Boolean(drop && drop.drop_method == 'zeroed')}
              standalone={true}
            />
          </label>
        </Reallocate>
      </Cell>
      <Cell>
        {drop && drop.drop_method == 'zeroed' ?
          '0.0' : S.numberWithOneDecimalPlace(heading.points_without_dropping)}
      </Cell>
    </QuestionRowWrapper>
  );
});


const DropQuestionsModal = styled(Modal)`
  .modal-dialog {
    max-width: 975px;

    .modal-content, .modal-body {
      background-color: ${colors.neutral.lightest};
    }

    .modal-body {
      padding: 1.9rem 2.6rem 2.6rem;
    }

    .modal-footer {
      padding: 0 2.6rem 2.6rem;
    }
  }

  .modal-header {
    font-weight: bold;
    .close {
      font-size: 3rem;
    }
  }
`;

const TableHeaderWrapper = styled(Row)`
  .sticky-table-cell {
    padding: 0 0.5rem;
    background-color: ${colors.neutral.thin};
    color: white;
  }
`;

const TableHeader = () => (
  <TableHeaderWrapper>
    <Cell>Select</Cell>
    <Cell>
      <div>Question</div>
      <div>number</div>
    </Cell>
    <LeftCell>Question details</LeftCell>
    <Cell>
      <div>Available</div>
      <div>points</div>
    </Cell>
    <ReallocateHeader>
      <div>
        <div>Reallocate points</div>
        <div>
          <div>Give full credit</div>
          <div>Assign '0' points</div>
        </div>
      </div>
    </ReallocateHeader>
    <Cell>
      <div>Updated</div>
      <div>Points</div>
    </Cell>
  </TableHeaderWrapper>
);

const DropQuestion = observer(({ ux }) => {
  if (!ux.planScores.isHomework || !ux.exercisesHaveBeenFetched) {
    return null;
  }

  return (
    <>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>Select and drop question(s) from assignment</Tooltip>}
      >
        <Button
          variant="light"
          className="btn-standard"
          data-test-id="drop-questions-btn"
          onClick={() => ux.isDisplayingDropQuestions=true}
        >
          Drop questions
        </Button>
      </OverlayTrigger>
      <DropQuestionsModal
        show={ux.isDisplayingDropQuestions}
        data-test-id="drop-questions-modal"
        backdrop="static"
        onHide={ux.cancelDisplayingDropQuestions}
      >
        <Modal.Header closeButton>
          Drop question for {ux.selectedPeriod.name}
        </Modal.Header>
        <Modal.Body>
          <Instructions>Select question(s) to drop:</Instructions>
          <Table>
            <TableHeader />
            {ux.scores.question_headings.map((heading, i) => <Question key={i} ux={ux} heading={heading} />)}
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="default"
            className="btn-standard"
            data-test-id="cancel-btn"
            onClick={ux.cancelDisplayingDropQuestions}
          >Cancel</Button>
          <Button
            variant="primary"
            className="btn-standard"
            data-test-id="save-btn"
            disabled={!ux.canSubmitDroppedQuestions}
            onClick={ux.saveDropQuestions}
          >Save</Button>
        </Modal.Footer>
      </DropQuestionsModal>
    </>
  );
});
DropQuestion.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default DropQuestion;

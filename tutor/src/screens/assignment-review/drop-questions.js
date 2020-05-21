import { React, PropTypes, observer, styled, css } from 'vendor';
import { ToolbarButton } from 'primitives';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { colors } from 'theme';
import OXQuestionPreview from '../../components/question-preview';
import { StickyTable, Row, Cell } from 'react-sticky-table';

// https://projects.invisionapp.com/d/main#/console/18937568/401942279/preview

const disabledCSS = css`
  color: ${colors.neutral.std};
`;

const QuestionRowWrapper =styled(Row)`
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
    text-align: center;
  }
  text-align: center;
`;

const Question = observer(({ heading, ...props }) => {
  const RowType = heading.isCore ? CoreQuestion : TutorQuestion;
  return <RowType heading={heading} {...props} />;
});

const TutorQuestion = observer(({ heading }) => {
  return (
    <QuestionRowWrapper disabled>
      <Cell>
        <input type="checkbox" disabled />
      </Cell>
      <Cell>
        {heading.title}
      </Cell>
      <DetailsCell>
        OpenStax Tutor Beta selection
      </DetailsCell>
      <Cell>
        {heading.points}
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
        <input
          type="checkbox"
          name={heading.title}
          checked={!!drop}
          onChange={({ target: { checked } }) => ux.toggleDropQuestion(checked, heading)}
        />
      </Cell>
      <Cell>
        {heading.title}
      </Cell>
      <DetailsCell>
        <QuestionPreview question={heading.question} />
      </DetailsCell>
      <Cell>
        {heading.points}
      </Cell>
      <Cell>
        <Reallocate>
          <label>
            <input
              type="radio"
              name={`${heading.question_id}`}
              value="full_credit"
              disabled={!drop || heading.dropped}
              onChange={({ target: { checked } }) => { checked && (drop.drop_method = 'full_credit'); }}
              checked={Boolean(drop && drop.drop_method == 'full_credit')}
            /></label>
          <label>
            <input
              type="radio"
              name={`${heading.question.id}`}
              value="zeroed"
              disabled={!drop || heading.dropped}
              onChange={({ target: { checked } }) => { checked && (drop.drop_method = 'zeroed'); }}
              checked={Boolean(drop && drop.drop_method == 'zeroed')}
            />
          </label>
        </Reallocate>
      </Cell>
      <Cell>
        1.0
      </Cell>
    </QuestionRowWrapper>
  );
});


const DropQuestionsModal = styled(Modal)`
  .modal-dialog {
    max-width: 800px;

    .modal-content, .modal-body {
      background-color: ${colors.neutral.lightest};
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
    <Cell>Question details</Cell>
    <Cell>
      <div>Assigned</div>
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
        <ToolbarButton
          data-test-id="drop-questions-btn"
          onClick={() => ux.isDisplayingDropQuestions=true}
        >
          Drop questions
        </ToolbarButton>
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
          <Table>
            <TableHeader />
            {ux.scores.question_headings.map((heading, i) => <Question key={i} ux={ux} heading={heading} />)}
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="default"
            data-test-id="cancel-btn"
            onClick={ux.cancelDisplayingDropQuestions}
          >Close</Button>
          <Button
            variant="primary"
            data-test-id="save-btn"
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

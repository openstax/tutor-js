import { React, PropTypes, observer, styled, css } from 'vendor';
import { ToolbarButton } from 'primitives';
import { Modal, Button } from 'react-bootstrap';
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
    height: 50%;
    &:last-child {
      display: flex;
      font-size: 1rem;
      border-top: 1px solid lightGrey;
      > div {
        height: 100%;
        width: 80px;
        &:last-child {
          border-left: 1px solid lightGrey;
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
  .sticky-table-cell {
    border: 1px solid lightGrey;
    padding: 0;
    height: 30px;
    vertical-align: middle;
    text-align: center;
  }
`;

const DetailsCell = styled(Cell)`
  &.sticky-table-cell {
    padding: 0.5rem 0.75rem;
    text-align: left;
  }
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
    <QuestionRowWrapper disabled={!!heading.dropped}>
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
              name={`${heading.question.id}`}
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
  }
`;

const TableHeaderWrapper = styled(Row)`
  .sticky-table-cell {
    padding: 0.5rem;
    background-color: ${colors.neutral.lite};
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
      <div>reallocate points</div>
      <div>
        <div>Give full credit</div>
        <div>Assign '0' points</div>
      </div>
    </ReallocateHeader>
    <Cell>
      <div>Updated</div>
      <div>Points</div>
    </Cell>
  </TableHeaderWrapper>
);


const DropQuestion = observer(({ ux }) => {
  if (ux.planScores.type != 'homework') {
    return null;
  }

  return (
    <>
      <ToolbarButton onClick={() => ux.isDisplayingDropQuestions=true}>Drop questions</ToolbarButton>
      <DropQuestionsModal
        show={ux.isDisplayingDropQuestions}
        backdrop="static"
        onHide={ux.cancelDisplayingDropQuestions}
      >
        <Modal.Header>
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
            onClick={ux.cancelDisplayingDropQuestions}
          >Close</Button>
          <Button
            variant="primary"
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

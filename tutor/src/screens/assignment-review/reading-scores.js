import { React, PropTypes, styled, observer, css } from 'vendor';
import { StickyTable, Row } from 'react-sticky-table';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import LoadingScreen from 'shared/components/loading-animation';
import { colors } from 'theme';
import ScoresHelper from '../../helpers/scores';
import ExtensionIcon from '../../components/icons/extension';
import InfoIcon from '../../components/icons/info';
import SortIcon from '../../components/icons/sort';
import SearchInput from '../../components/search-input';
import TutorLink from '../../components/link';
import GrantExtension from './grant-extension';
import { EIcon } from '../../components/icons/extension';

import {
  StyledStickyTable, Cell,
  CellContents as BasicCellContents,
  Heading, HeadingTop, HeadingMiddle, HeadingBottom,
  ColumnHeading as BasicColumnHeading,
  SplitCell, ColumnFooter, Total,
  LateWork, ControlsWrapper, ControlGroup,
  OrderIcon, NameWrapper,
} from './table-elements';

// https://projects.invisionapp.com/d/main#/console/18937568/401942280/preview

const CellContents = styled(BasicCellContents)`
  .data-heading {
    height: 110px;
  }
`;

const ExtIcon = styled(EIcon)`
  display: inline-block;
`;

const ColumnHeading = styled(BasicColumnHeading)`
  border-top-color: ${props => props.variant === 'q' ? colors.templates.reading.border : colors.neutral.std};
  background: ${props => props.variant === 'q' ? colors.templates.reading.background : colors.neutral.lighter};
  .middle-data-heading {
    padding-top: 15px;
  }
  .bottom-data-heading {
    height: 40px;
  }
`;

const StyledCompleteInfoCell = styled(Cell)`
  ${props => !props.isComplete && css`
  &&&& {
      background-color: ${colors.neutral.pale};
      border-top: 1px solid ${colors.neutral.std};

      /* check if next student did complete assignment. Otherwise we would ended up with a 2px border */
      ${props => (props.didNextStudentComplete || props.isLastRow) && css`
          border-bottom: 1px solid ${colors.neutral.std};
      `}
  }`
}
`;

const StyledTotal = styled(Total)`
   ${props => !props.isAboveFiftyPercentage && css`
    background-color: ${colors.states.trouble};
    border-top: 1px solid ${colors.danger};

      /* check if next student has above 50%. Otherwise we would ended up with a 2px border */
      ${props => (props.isNextStudentAboveFiftyPercentage || props.isLastRow) && css`
          border-bottom: 1px solid ${colors.danger};
      `}
  `}
`;

const Legend = styled.div`
  > div {
    display: flex;
    margin-bottom: 7px;

    & div {
      margin-right: 9px;
    }

    & span {
      font-size: 1.2rem;
      color: ${colors.neutral.thin};
    }
  }

  .extension-legend {
    .extension-icon {
      margin-left: 8px;
      margin-right: 18px;
    }
  }

  .incomplete-questions-legend-box {
    border: 1px solid ${colors.neutral.std};
    background-color: ${colors.neutral.pale};
    padding: 8px 15px;
  }

  .needs-attention-legend-box {
    border: 1px solid ${colors.danger};
    background-color: ${colors.states.trouble};
    padding: 8px 15px;
  }
`;


const popover = (gradingTemplate) => (
  <Popover className="scores-popover">
    <StickyTable id="reading-scores-weight">
      <Row>
        <Cell>Weight for correctness</Cell>
        <Cell>{gradingTemplate.humanCorrectnessWeight} of question's point value</Cell>
      </Row>
      <Row>
        <Cell>Weight for completion</Cell>
        <Cell>{gradingTemplate.humanCompletionWeight} of question's point value</Cell>
      </Row>
      <Row>
        <Cell>Total</Cell>
        <Cell>{gradingTemplate.humanTotalWeight}</Cell>
      </Row>
    </StickyTable>
  </Popover>
);

const StudentColumnHeader = observer(({ ux }) => (
  <Cell leftBorder={true}>
    <CellContents>
      <ColumnHeading first={true}>
        <HeadingTop
          onClick={() => ux.changeRowSortingOrder(0, ux.reverseNameOrder ? 'first_name' : 'name')}
          aria-label="Sort by student name"
          role="button"
        >
          Student Name
          <SortIcon sort={ux.sortForColumn(0, ux.reverseNameOrder ? 'first_name' : 'name')} />
        </HeadingTop>
        <HeadingMiddle>
          {ux.nameOrderHeader}
          <OrderIcon
            variant="toggleOrder"
            onClick={ux.toggleNameOrder}
            aria-label="Toggle firstname lastname order"
          />
        </HeadingMiddle>
        <HeadingBottom style={{ padding: '19px' }} />
      </ColumnHeading>
      <ColumnHeading>
        <HeadingTop
          onClick={() => ux.changeRowSortingOrder(0, 'total')}
          aria-label="Sort by student total"
          role="button"
        >
          Total
          <SortIcon sort={ux.sortForColumn(0, 'total')} />
        </HeadingTop>
        <HeadingMiddle>
          <SplitCell
            variant={!ux.displayTotalInPercent ? 'active' : ''}
            onClick={() => ux.displayTotalInPercent = false}
            aria-label="Display total in points"
            role="button"
          >
            #
          </SplitCell>
          <SplitCell variant="divider">
            |
          </SplitCell>
          <SplitCell
            variant={ux.displayTotalInPercent ? 'active' : ''}
            onClick={() => ux.displayTotalInPercent = true}
            aria-label="Display total in percent"
            role="button"
          >
            %
          </SplitCell>
        </HeadingMiddle>
        <HeadingBottom>
          <OverlayTrigger placement="right" overlay={popover(ux.planScores.grading_template)} trigger="hover">
            <InfoIcon
              color={colors.bright_blue}
              style={{ marginTop: '2px' }}
            />
          </OverlayTrigger>
        </HeadingBottom>
      </ColumnHeading>
      <ColumnHeading>
        <HeadingTop>
          Late work
        </HeadingTop>
        <HeadingMiddle>
          {ux.planScores.grading_template.humanLateWorkPenaltyApplied}
        </HeadingMiddle>
        <HeadingBottom>
          {ux.planScores.grading_template.humanLateWorkPenalty}
        </HeadingBottom>
      </ColumnHeading>
    </CellContents>
  </Cell>
));

const StudentCell = observer(({ ux, student, striped, didNextStudentComplete, isNextStudentAboveFiftyPercentage, isLastRow }) => {
  const countData = ux.getReadingCountData(student);
  return (
    <>
      <Cell striped={striped}>
        <CellContents>

          <NameWrapper first>
            <TutorLink
              to="viewTask"
              params={{
                courseId: ux.course.id,
                id: student.task_id,
              }}
            >
              {ux.reverseNameOrder ? student.reversedName : student.name}
            </TutorLink>
          </NameWrapper>

          <StyledTotal
            isAboveFiftyPercentage={ux.isStudentAboveFiftyPercentage(student)}
            isNextStudentAboveFiftyPercentage={isNextStudentAboveFiftyPercentage}
            isLastRow={isLastRow}
          >
            {ux.displayTotalInPercent ?
              `${ScoresHelper.asPercent(student.total_fraction || 0)}%` :
              ScoresHelper.formatPoints(student.total_points)}
          </Total>
          <LateWork>
            {student.late_work_point_penalty ? ScoresHelper.formatLatePenalty(student.late_work_point_penalty) : '0'}
            {ux.wasGrantedExtension(student.role_id) && <ExtensionIcon />}
          </LateWork>
        </CellContents>
      </Cell>
      <StyledCompleteInfoCell
        striped={striped}
        isComplete={ux.didStudentComplete(student)}
        didNextStudentComplete={didNextStudentComplete}
        isLastRow={isLastRow}
      >
        <CellContents>
          {countData.complete} of {countData.total}
        </CellContents>
      </StyledCompleteInfoCell>
      <Cell striped={striped}>
        <CellContents>
          {countData.correct} of {countData.complete}
        </CellContents>
      </Cell>
      <Cell striped={striped}>
        <CellContents>
          {countData.incorrect} of {countData.complete}
        </CellContents>
      </Cell>
    </>
  );
});


const AssignmentHeading = ({ headingName }) => (
  <Cell>
    <ColumnHeading className="data-heading" variant="q">
      <HeadingTop>
        {headingName}
      </HeadingTop>
      <HeadingMiddle className="middle-data-heading" />
      <HeadingBottom className="bottom-data-heading" />
    </ColumnHeading>
  </Cell>
);
AssignmentHeading.propTypes = {
  headingName: PropTypes.string.isRequired,
};

const AverageScoreHeader = observer(({ ux }) => (
  <Cell borderTop>
    <CellContents>
      <ColumnFooter first>
        <Heading first noBorder>
          Average score
        </Heading>
      </ColumnFooter>
      <ColumnFooter>
        <Heading>
          {ux.scores.totalAverageScoreInPercent}
        </Heading>
      </ColumnFooter>
      <ColumnFooter />
    </CellContents>
  </Cell>
));


const TableHeader = observer(({ ux }) => {
  return (
    <ControlsWrapper>
      <ControlGroup>
        <SearchInput onChange={ux.onSearchStudentChange} />
        <GrantExtension ux={ux} />
      </ControlGroup>
    </ControlsWrapper>
  );
});
TableHeader.propTypes = {
  ux: PropTypes.object.isRequired,
};

const ReadingScores = observer(({ ux }) => {
  const { scores } = ux;

  if (!ux.isExercisesReady) {
    return <LoadingScreen message="Loading Assignment…" />;
  }

  return (
    <>
      <TableHeader ux={ux} />
      <StyledStickyTable data-test-id="scores" borderWidth={'0px'}>
        <Row>
          <StudentColumnHeader scores={scores} ux={ux} />
          {['Completed', 'Correct', 'Incorrect'].map((h, hi) => <AssignmentHeading headingName={h} key={hi} />)}
        </Row>
        {ux.sortedStudents.map((student,sIndex) => (
          <Row key={sIndex}>
            <StudentCell
              ux={ux}
              student={student}
              striped={0 === sIndex % 2}
              didNextStudentComplete={ux.didStudentComplete(ux.sortedStudents[sIndex + 1])} 
              isNextStudentAboveFiftyPercentage={ux.isStudentAboveFiftyPercentage(ux.sortedStudents[sIndex + 1])}
              isLastRow={sIndex === ux.sortedStudents.length - 1}
            />
          </Row>))}
        <Row>
          <AverageScoreHeader ux={ux} />
          <Cell borderTop />
          <Cell borderTop />
          <Cell borderTop />
        </Row>
      </StyledStickyTable>
      <Legend>
        <div>
          <div className="incomplete-questions-legend-box"></div><span>All or some questions not attempted</span>
        </div>
        <div>
          <div className="needs-attention-legend-box"></div><span>Score less than 50% of total available points</span>
        </div>
        <div className="extension-legend">
          <ExtIcon></ExtIcon><span>Extension granted</span>
        </div>
        
      </Legend>
    </>
  );
});

ReadingScores.title = 'Assignment Scores';

ReadingScores.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default ReadingScores;

import { React, PropTypes, observer, styled, useObserver } from 'vendor';
import { Icon } from 'shared';
import { Button } from 'react-bootstrap';
import { colors } from 'theme';
import TutorLink from '../../components/link';
import moment from 'moment';
import Loading from 'shared/components/loading-animation';
import HomeworkQuestions, { ExerciseNumber } from '../../components/homework-questions';
import S from '../../helpers/string';
import { isEmpty } from 'lodash';
import PreviewTooltip from '../assignment-edit/preview-tooltip';
import DeleteModal from './delete-modal';
import EditModal from './edit-modal';

const DetailsWrapper = styled.div`

`;

const Section = styled.section`
  background: ${colors.neutral.lightest};
  padding: 3.4rem 2.4rem;

  h6 {
    text-transform: uppercase;
    font-weight: bold;
    flex: 1;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: stretch;
  margin: 3.6rem 0 2rem;
  font-size: 1.6rem;
  line-height: 3rem;

  > section {
    &:first-child {
      flex: 1;
      margin-right: 2rem;
    }
    &:last-child {
      flex-basis: 35%;
    }
  }

  dl {
    display: flex;
    align-items: center;
    max-width: 43.2rem;

    > * {
      width: 100%;
      &:not(:first-child) {
        dt, dd {
          text-align: center;
        }
      }
    }

    dt, dd {
      border-bottom: 1px solid ${colors.neutral.pale};
      padding-right: 1.6rem;
    }
    dt {
      font-size: 1.4rem;
    }
  }
`;

const Table = styled.div`
  display: table;
  width: 100%;
`;

const Row = styled.div`
  display: table-row;

  > * {
    display: table-cell;
    padding-bottom: 0.7rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const Controls = styled.div`
  align-self: flex-end;
  display: flex;
  .btn.btn-icon {
    min-width: 0;
    width: 5.5rem;
    height: 4rem;
  }
  .btn + .btn {
    margin-left: 1.6rem;
  }
`;

const Title = styled.div`
  width: 18rem;
  margin-right: 3.3rem;
  color: ${colors.neutral.thin};
`;

const Item = styled.div`

`;

const StyledHomeworkQuestions = styled(HomeworkQuestions)`

`;

const StyledTutorLink = styled(TutorLink)`
  margin-bottom: 2.5rem;
  &.btn.btn-standard {
    min-width: 16.7rem;
  }
`;

const QuestionHeader = ({ styleVariant, label, info }) => useObserver(() => {
  return (
    <>
      <ExerciseNumber variant={styleVariant}>
        {label}
      </ExerciseNumber>
      <div>{S.numberWithOneDecimalPlace(info.points)} Points</div>
    </>
  );
});

const TemplateInfoWrapper = styled.span`
  & .btn.btn-primary {
    border-color: ${colors.link};
    background: ${colors.link};
    &:hover, &:not(:disabled):active, &:focus {
      background: ${colors.link_active};
      border-color: ${colors.link};
    }
    color: #fff;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.2rem;
    border-radius: 0.8rem;
    padding: 0.1rem 0.8rem;
  }
`;

QuestionHeader.propTypes = {
  styleVariant: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  info:  PropTypes.object.isRequired,
};

const Questions = ({ ux, questionsInfo }) => useObserver(() => {
  if (ux.isExercisesReady && isEmpty(questionsInfo)) { return null; }
  return (
    <Section>
      <Header>
        <h6>Questions Assigned</h6>
        <Controls>
          <Button variant="icon">
            <Icon type="edit" />
          </Button>
        </Controls>
      </Header>

      {ux.isExercisesReady ? (
        <StyledHomeworkQuestions
          questionsInfo={questionsInfo}
          headerContentRenderer={(props) => <QuestionHeader ux={ux} {...props} />}
          styleVariant="submission"
        />) : <Loading message="Loading Questions…"/>}
    </Section>
  );
});

const TemplateInfo = ({ template }) => useObserver(() => {
  if (!template) { return null; }
  return (
    <TemplateInfoWrapper>
      {template.name}
      <PreviewTooltip template={template} variant="primary" />
    </TemplateInfoWrapper>
  );
});

const Details = observer(({ ux, ux: {
  scores, planScores, taskingPlan, isDisplayingConfirmDelete, isDisplayingEditAssignment,
} }) => {
  const format = 'MMM D, h:mm a';

  return (
    <DetailsWrapper>
      <Top>
        <Section>
          <Header>
            <h6>Details</h6>
            <Controls>
              <button
                className="btn btn-standard btn-icon"
                onClick={ux.onEdit}
                data-test-id="edit-assignment"
              >
                <Icon type="edit" />
              </button>
              <button
                className="btn btn-standard btn-icon"
                onClick={ux.onDelete}
                data-test-id="delete-assignment"
              >
                <Icon type="trash" />
              </button>
            </Controls>
          </Header>
          <Table>
            <Row>
              <Title>Assignment name</Title>
              <Item>
                <strong data-test-id="assignment-name">{planScores.title}</strong>
              </Item>
            </Row>
            <Row>
              <Title>Additional note</Title>
              <Item>
                {planScores.description}
              </Item>
            </Row>
            <Row>
              <Title>Assignment settings</Title>
              <Item>
                <TemplateInfo template={planScores.grading_template} />
              </Item>
            </Row>
            <Row>
              <Title>Assigned to</Title>
              <Item>
                All sections
              </Item>
            </Row>
            <Row>
              <Title></Title>
              <dl>
                <div>
                  <dt>Open date</dt>
                  <dd>{moment(taskingPlan.opens_at).format(format)}</dd>
                </div>
                <div>
                  <dt>Due date</dt>
                  <dd>{moment(taskingPlan.due_at).format(format)}</dd>
                </div>
                <div>
                  <dt>Close date</dt>
                  <dd>{moment(taskingPlan.closes_at).format(format)}</dd>
                </div>
              </dl>
            </Row>
          </Table>
        </Section>
        <Section>
          <Header>
            <h6>Grading</h6>
          </Header>
          <div>
            <p>This assignment is now open for grading.</p>
            <StyledTutorLink
              className="btn btn-standard btn-primary btn-new-flag btn-inline"
              to="gradeAssignment"
              params={{ id: ux.planId, periodId: taskingPlan.target_id, courseId: ux.course.id }}
            >
              <span className="flag">72 New</span>
              <span>Grade answers</span>
            </StyledTutorLink>
          </div>
          <div>
            <p>View scores for auto-graded questions</p>
            <StyledTutorLink
              className="btn btn-standard btn-inline"
              to=""
            >
              View scores
            </StyledTutorLink>
          </div>
        </Section>
      </Top>
      {scores && <Questions ux={ux} questionsInfo={scores.questionsInfo} />}
      {isDisplayingConfirmDelete && <DeleteModal ux={ux} />}
      {isDisplayingEditAssignment && <EditModal ux={ux} />}
    </DetailsWrapper>
  );

});

Details.title = 'Assignment Details';

Details.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Details;

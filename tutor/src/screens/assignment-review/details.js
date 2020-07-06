import { React, PropTypes, observer, styled } from 'vendor';
import { Icon } from 'shared';
import { colors } from 'theme';
import moment from 'moment';
import Loading from 'shared/components/loading-animation';
import HomeworkQuestions, { ExerciseNumber } from '../../components/homework-questions';
import S from '../../helpers/string';
import { isEmpty } from 'lodash';
import PreviewTooltip from '../assignment-edit/preview-tooltip';
import DeleteModal from './delete-modal';
import EditModal from './edit-modal';
import GradingBlock from './grading-block';
import ExternalLink from '../../components/new-tab-link';
import { TruncatedText } from '../../components/text';
import TimeHelper from '../../helpers/time';

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

export const Header = styled.div`
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

const Item = ({ children }) => (
  <div><TruncatedText maxWidth="40rem">{children}</TruncatedText></div>
);
Item.propTypes = {
  children: PropTypes.node.isRequired,
};

const TaskingDefinitionList = styled.div`
  dl {
    display: flex;
    align-items: center;
    max-width: 64rem;

    > * {
      width: 100%;
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

const StyledHomeworkQuestions = styled(HomeworkQuestions)`
  .question-header {
    border-left: 1rem solid ${colors.templates.homework.border};
    font-size: 1.6rem;
  }
  && .card-body {
    background: #fff;

    .question-stem {
      font-size: 1.4rem;
      font-weight: bold;
      line-height: 1.7rem;
    }
  }
`;

const StyledExerciseNumber = styled(ExerciseNumber)`
  font-size: 1.6rem;
`;

const StyledReadingNotice = styled.p`
  text-align: center;
`;

const QuestionHeader = observer(({ styleVariant, label, info }) => {
  return (
    <>
      <StyledExerciseNumber variant={styleVariant}>
        {label}
      </StyledExerciseNumber>
      <strong>{S.numberWithOneDecimalPlace(info.availablePoints)} Points</strong>
    </>
  );
});

QuestionHeader.propTypes = {
  styleVariant: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  info:  PropTypes.object.isRequired,
};

const Questions = observer(({ ux, questionsInfo }) => {
  if (ux.isExercisesReady && isEmpty(questionsInfo)) { return null; }
  let Content;
  if(ux.planScores.isReading) {
    Content = (
      <>
        <Header><h6>Questions Assigned</h6></Header>
        <StyledReadingNotice>Questions for reading assignments are automatically assigned by OpenStax Tutor Beta</StyledReadingNotice>
      </>
    );
  }
  else {
    Content = (
      <>
        <Header>
          <h6>Questions Assigned</h6>
          <Controls>

            <Icon
              className="btn btn-standard btn-icon"
              onClick={ux.taskPlan.isOpen ? undefined : ux.onEditAssignedQuestions}
              data-test-id="edit-assigned-questions"
              type="edit"
              tooltip={ux.taskPlan.isOpen ? 'Questions cannot be edited after the Open date.' : ''}
            />

          </Controls>
        </Header>

        {ux.isExercisesReady ? (
          <StyledHomeworkQuestions
            questionsInfo={questionsInfo}
            headerContentRenderer={(props) => <QuestionHeader ux={ux} {...props} />}
            styleVariant="submission"
          />) : <Loading message="Loading Questions…"/>}
      </>
    );
  }
  return (
    <Section data-test-id="questions-block">
      {Content}
    </Section>
  );
});

const TemplateInfo = observer(({ template }) => {
  if (!template) { return null; }
  return (
    <TemplateInfoWrapper>
      {template.name}
      <PreviewTooltip template={template} variant="primary" />
    </TemplateInfoWrapper>
  );
});

const dateFormat = 'ddd, MMM D';
const timeFormat = 'hh:mma z';

const TaskingDates = observer(({ ux, tasking, title }) => {

  return (
    <TaskingDefinitionList>
      <div>{title}</div>
      <dl>
        <div>
          <dt>Open date</dt>
          <dd>
            <div>{tasking.opensAtMoment.format(dateFormat)}</div>
            <div>{tasking.opensAtMoment.format(timeFormat)}</div>
          </dd>
        </div>
        <div>
          <dt>Due date</dt>
          <dd>
            <div>{tasking.dueAtMoment.format(dateFormat)}</div>
            <div>{tasking.dueAtMoment.format(timeFormat)}</div>
          </dd>
        </div>
        {!tasking.plan.isEvent && (
          <div>
            <dt>Close date</dt>
            <dd>
              <div>{tasking.closesAtMoment.format(dateFormat)}</div>
              <div>{tasking.closesAtMoment.format(timeFormat)}</div>
            </dd>
          </div>)}
      </dl>
    </TaskingDefinitionList>
  );
});


const Details = observer(({ ux }) => {

  if (!ux.exercisesHaveBeenFetched) { return <Loading />; }
  if (ux.isDeleting) { return null; }
  const {
    scores, planScores, taskPlan, isDisplayingConfirmDelete, isDisplayingEditAssignment, taskingPlanDetails,
  } = ux;
  return (
    <DetailsWrapper>
      <Top>
        <Section>
          <Header>
            <h6>Details</h6>
            <Controls>
              <Icon
                asButton type="edit"
                busy={ux.taskPlan.api.isPending}
                onClick={ux.onEdit}
                data-test-id="edit-assignment"
              />
              <Icon
                asButton type="trash"
                onClick={ux.onDelete}
                data-test-id="delete-assignment"
              />
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
            {planScores.isExternal && (
              <Row>
                <Title>Assignment URL</Title>
                <Item>
                  <ExternalLink href={taskPlan.settings.external_url}>
                    {taskPlan.settings.external_url}
                  </ExternalLink>
                </Item>
              </Row>)}
            {(planScores.isHomework || planScores.isReading) &&
              <Row>
                <Title>Grading template</Title>
                <Item>
                  <TemplateInfo template={planScores.grading_template} />
                </Item>
              </Row>
            }
            <Row>
              <Title>Assigned to</Title>
              <div>
                {taskingPlanDetails.map(tasking => (
                  <TaskingDates
                    tasking={tasking}
                    title={ux.areTaskingDatesSame ? 'All sections' : tasking.period.name}
                    key={tasking.period.id}
                    ux={ux}
                  />))}
              </div>
            </Row>
          </Table>
        </Section>
        {ux.canDisplayGradingBlock &&
          <Section data-test-id="grading-block">
            <GradingBlock ux={ux} />
          </Section>
        }
      </Top>
      {scores && <Questions ux={ux} questionsInfo={scores.coreQuestionsInfo} />}
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

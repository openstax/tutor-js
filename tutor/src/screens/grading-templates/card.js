import { React, styled, PropTypes, observer } from 'vendor';
import { GradingTemplate } from '../../models/grading/templates';
import { Col, Card } from 'react-bootstrap';
import moment from 'moment';
import Theme from '../../theme';
import { Icon } from 'shared';

const CardWrapper = styled.div`
  flex: 1;
  margin-top: 2.4rem;
  color: ${Theme.colors.neutral.darker};
  line-height: 2rem;

  .card {
    border: 1px solid #d5d5d5;
  }
  .card-header {
    border: 0;
    border-left: 8px solid ${props => props.templateColors.border};
    background: ${props => props.templateColors.background};
    font-size: 1.6rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btn-link {
      color: ${Theme.colors.neutral.darker};
      padding: 0;
    }
  }
`;

const SectionTitle = styled.h4`
  font-size: 1rem;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 0.8rem;
`;

const SettingName = styled.div`
  color: ${Theme.colors.neutral.lite};
`;

const SettingValue = styled.div`
  color: ${Theme.colors.neutral.dark};
  font-weight: bold;
  margin-bottom: 0.8rem;
`;

const Line = styled.div`
  border-bottom: 1px solid ${Theme.colors.paleLine};
  margin-bottom: 0.8rem;
`;

const autoGradedExplanation = (tmpl) => {
  switch (tmpl.auto_grading_feedback_on) {
    case 'answer':
      return 'Immediately after student answers';
    case 'due':
      return 'After assignment is due';
    case 'publish':
      return 'After I publish the scores'; // TODO this doesn't seem right?
    default:
      return 'invalid value';
  }
};

const manuallyGradedExplanation = (tmpl) => {
  switch (tmpl.auto_grading_feedback_on) {
    case 'publish':
      return 'After I publish the scores';
    case 'grade':
      return 'After I grade the assignment';
    case 'answer':
      return 'Immediately after student answers';
    default:
      return 'invalid value';
  }
};

const CardInfo = observer(({ template, children, onEdit, onDelete }) => {
  return (
    <CardWrapper
      data-test-id="grading-template-card"
      data-type={template.task_plan_type}
      templateColors={Theme.colors.templates[template.task_plan_type]}
    >
      <Card>
        <Card.Header>
          {template.name}
          <div>
            <Icon type="edit" onClick={() => onEdit(template)}  />
            {template.canRemove && <Icon type="trash" onClick={() => onDelete(template)}  />}
          </div>
        </Card.Header>
        <Card.Body>

          {children}

          <Line />

          <SectionTitle>LATE WORK POLICY</SectionTitle>

          <SettingName>Accept late work?</SettingName>
          <SettingValue>{template.isLateWorkAccepted ? 'Yes' : 'No'}</SettingValue>

          {template.isLateWorkAccepted && (
            <>
              <SettingName>Late work penalty:</SettingName>
              <SettingValue>Deduct {template.late_work_per_day_penalty}% for each late day</SettingValue>
            </>)}

          <Line />

          <SectionTitle>DEFAULT DATE AND TIME</SectionTitle>

          <SettingName>Due date for assignments:</SettingName>
          <SettingValue>
            {template.default_due_date_offset_days} days after open date
          </SettingValue>

          <SettingName>Due time for assignments:</SettingName>
          <SettingValue>
            {moment(template.default_due_time, 'HH:mm').format('h:mm A')}
          </SettingValue>

          <SettingName>Close date for assignments:</SettingName>
          <SettingValue>
            {template.default_close_date_offset_days} days after due date
          </SettingValue>

        </Card.Body>
      </Card>
    </CardWrapper>
  );
});
CardInfo.displayName = 'TemplateCard';
CardInfo.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};


const ReadingCard = ({ template, ...cardProps }) => {
  return (
    <CardInfo template={template} {...cardProps}>
      <SectionTitle>SCORE CALCULATION FOR QUESTIONS</SectionTitle>

      <SettingName>Weight for correctness:</SettingName>
      <SettingValue>{template.correctness_weight}% of question’s point value</SettingValue>

      <SettingName>Weight for completion:</SettingName>
      <SettingValue>{template.completion_weight}% of question’s point value</SettingValue>
    </CardInfo>
  );
};
ReadingCard.propTypes = {
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};


const HomeworkCard = ({ template, ...cardProps }) => {
  return (
    <CardInfo template={template} {...cardProps}>

      <SectionTitle>SHOW SCORES & FEEDBACK TO STUDENTS</SectionTitle>

      <SettingName>For auto-graded questions:</SettingName>
      <SettingValue>{autoGradedExplanation(template)}</SettingValue>

      <SettingName>For manually-graded questions:</SettingName>
      <SettingValue>{manuallyGradedExplanation(template)}</SettingValue>
    </CardInfo>
  );
};
HomeworkCard.propTypes = {
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};

export { ReadingCard, HomeworkCard };


const Unknown = ({ template }) => (
  <CardWrapper templateColors={Theme.colors.templates.neutral}>
    <Card>
      <Card.Header>
        {template.name}
      </Card.Header>
      <Card.Body>
        <h3>Unknown template type {template.task_plan_type}</h3>
      </Card.Body>
    </Card>
  </CardWrapper>
);
Unknown.propTypes = {
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};


const CardTypes = {
  reading: ReadingCard,
  homework: HomeworkCard,
  unknown: Unknown,
};

const TemplateCard = ({ template, ...cardProps }) => {
  const CardForTemplate = CardTypes[template.task_plan_type] || CardTypes.unknown;
  return (
    <Col key={template.id} lg={4} md={6} sm={12} xs={12}>
      <CardForTemplate template={template} {...cardProps} />
    </Col>
  );
};
TemplateCard.propTypes = {
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};


export default TemplateCard;

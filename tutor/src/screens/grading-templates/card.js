import { React, styled, PropTypes, observer } from 'vendor';
import { GradingTemplate } from '../../models';
import { Col, Card } from 'react-bootstrap';
import moment from 'moment';
import Theme from '../../theme';
import { Icon } from 'shared';

const CardWrapper = styled.div`
  flex: 1;
  color: ${Theme.colors.neutral.darker};
  line-height: 2rem;
  height: 100%;
  .card {
    border: 1px solid #d5d5d5;
    height: 100%;
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

    /** Fix issue when clicking on the edit or delete button will stay on focus after the modal is closed  */
    & .btn:not(.btn-link):focus {
      box-shadow: none;
    }

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

const StyledCol = styled(Col)`
  margin-top: 3rem;
`;

const toPerc = (n) => `${Math.round(n * 100)}%`;

const gradedExplanation = (gradingType) => {
    switch (gradingType) {
        case 'publish':
            return 'After I publish the scores';
        case 'grade':
            return 'Immediately after I grade';
        case 'answer':
            return 'Immediately after student answers';
        case 'due':
            return 'After the due date';
        default:
            return 'invalid value';
    }
};

const CardHeader = observer(({ template, onEdit, onDelete }) => {
    return (
        <Card.Header>
            {template.name}
            <div>
                {template.canEdit && <Icon type="edit" onClick={() => onEdit(template)}  />}
                {template.canRemove && <Icon type="trash" onClick={() => onDelete(template)}  />}
            </div>
        </Card.Header>
    );
});
CardHeader.propTypes = {
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    template: PropTypes.instanceOf(GradingTemplate).isRequired,
};

const CardInfo = observer(({ template, header, children }) => {
    return (
        <CardWrapper
            data-id={template.id}
            data-test-id="grading-template-card"
            data-type={template.task_plan_type}
            templateColors={Theme.colors.templates[template.task_plan_type]}
        >
            <Card>
                {header}

                <Card.Body>

                    {children}

                    <Line />

                    <SectionTitle>ALLOW MULTIPLE-ATTEMPTS</SectionTitle>

                    <SettingName>For auto-graded questions</SettingName>
                    <SettingValue>{template.allow_auto_graded_multiple_attempts ? 'Yes' : 'No'}</SettingValue>

                    <Line />

                    <SectionTitle>LATE WORK POLICY</SectionTitle>

                    <SettingName>Accept late work?</SettingName>
                    <SettingValue>{template.isLateWorkAccepted ? 'Yes' : 'No'}</SettingValue>

                    {template.isLateWorkAccepted && (
                        <>
                            <SettingName>Late work penalty:</SettingName>
                            <SettingValue>
                                Deduct {toPerc(template.late_work_penalty)} for
                                each {template.late_work_penalty_applied == 'daily' ? 'day' : 'assignment'}
                            </SettingValue>
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
    template: PropTypes.instanceOf(GradingTemplate).isRequired,
};


const ReadingCard = ({ template, ...cardProps }) => {
    return (
        <CardInfo template={template} {...cardProps}>
            <SectionTitle>SCORE CALCULATION FOR QUESTIONS</SectionTitle>

            <SettingName>Weight for correctness:</SettingName>
            <SettingValue>{toPerc(template.correctness_weight)} of question’s point value</SettingValue>

            <SettingName>Weight for completion:</SettingName>
            <SettingValue>{toPerc(template.completion_weight)} of question’s point value</SettingValue>
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
            <SettingValue>{gradedExplanation(template.auto_grading_feedback_on)}</SettingValue>

            <SettingName>For manually-graded questions:</SettingName>
            <SettingValue>{gradedExplanation(template.manual_grading_feedback_on)}</SettingValue>
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

const TemplateBody = ({ template, ...cardProps }) => {
    const CardForTemplate = CardTypes[template.task_plan_type] || CardTypes.unknown;
    return (
        <CardForTemplate
            template={template}
            {...cardProps}
        />
    );
};
TemplateBody.propTypes = {
    template: PropTypes.instanceOf(GradingTemplate).isRequired,
};

export { TemplateBody };

const TemplateCard = ({ template, ...cardProps }) => {
    return (
        <StyledCol key={template.id} lg={4} md={6} sm={12} xs={12}>
            <TemplateBody
                template={template}
                header={<CardHeader template={template} {...cardProps} />}
                {...cardProps}
            />
        </StyledCol>
    );
};
TemplateCard.propTypes = {
    template: PropTypes.instanceOf(GradingTemplate).isRequired,
};


export default TemplateCard;

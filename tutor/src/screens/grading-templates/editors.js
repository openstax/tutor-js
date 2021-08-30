import { React, PropTypes, action, observer, styled, modelize } from 'vendor';
import { Button, Modal, Alert } from 'react-bootstrap';
import { isEmpty, range, map } from 'lodash';
import { GradingTemplate } from '../../models';
import { colors, fonts } from '../../theme';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import NumberInput from '../../components/number-input';
import RadioInput from '../../components/radio-input';
import TimeInput from '../../components/time-input';
import Select from '../../components/select';
import TemplateModal from '../../components/course-modal';
import InfoIcon from '../../components/icons/info';

const propTypes = {
    template: PropTypes.instanceOf(GradingTemplate).isRequired,
};


const isValidPercentNumber = (v) => (v < 0 || v > 100) && 'must be between 0 & 100';

const StyledTemplateModal = styled(TemplateModal)`
  .modal-dialog {
    margin-top: 3rem;
    max-width: 680px;

    .modal-body {
      background: ${colors.neutral.bright};

      .btn-default {
        border-color: ${colors.neutral.pale};
        background: #FFFFFF;
      }
    }
  }

  strong {
      font-weight: bold;
  }

  .warning {
      border: 1px solid ${colors.soft_red};
      background: ${colors.gray_red};
      color: ${colors.strong_red};
      padding: 8px;
      margin: -18px 0 16px;
  }
`;

// Inheriting the modal-dialog max-width
// We don't want to override the styles of the next modals
const StyledSelectAssignmentModal = styled(StyledTemplateModal)`
  .modal-dialog {
    margin-top: 135px;
    .btn + .btn {
      margin-left: 4rem;
    }
  }
`;

const Row = styled.div`
  margin-bottom: 2.4rem;
`;

const SplitRow = styled.div`
  display: flex;
  margin-bottom: 2.4rem;
  > *:first-child {
    flex-basis: 40%;
  }
  > *:last-child {
    flex-basis: 60%;
  }
`;

const CenteredRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ControlsWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  > *:first-child {
    flex-basis: 50%;
  }
`;

const Controls = styled.div`
  .btn + .btn {
    margin-left: 1.5rem;
  }
`;

const Label = styled.label`
  font-weight: bold;
`;

const Legend = styled.legend`
  font-size: 1.4rem;
  font-weight: bold;
`;

const LargeText = styled.span`
  font-size: 1.8rem;
`;

const HintText = styled.div`
  color: ${colors.neutral.dark};
  ${fonts.faces.light};
`;

const TextInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextInputError = styled.div`
  color: red;
  margin: 1rem 0;
`;

const StyledNumberInput = styled(NumberInput)`
  max-width: 6rem;
  max-height: 3.3rem;
`;

const AdjacentNumberInput = styled(StyledNumberInput)`
  margin-left: 1rem;
`;

const Setting = styled.div`
  margin-bottom: 0.5rem;
`;

const SettingLabel = styled.label`
  margin-left: 0.75rem;
`;

const StyledTextInput = styled(Field).withConfig({
    shouldForwardProp: (prop) => prop != 'hasError',
}).attrs({
    type: 'text',
})`
  padding: 0.8rem 1rem;
  border-radius: 4px;
  border: 1px solid ${colors.forms.borders.light};
  font-size: 1.2rem;
  /** styling errors when template name is invalid */
  background: ${props => props.hasError ? colors.states.trouble : colors.white};
  color: ${props => props.hasError ? colors.red : colors.black};
  border-color: ${props => props.hasError ? colors.states.border_trouble : colors.neutral.pale};
  border-width: ${props => props.hasError ? '2px' : '1px'};

  &:focus {
    outline: 0;
    border-color: ${colors.forms.borders.focus};
    box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
  }

  &::placeholder {
    font-size: inherit;
  }
`;

const TextInput = (props) => (
    <TextInputWrapper>
        <StyledTextInput {...props} />
        <ErrorMessage name={props.name} render={msg => <TextInputError>{msg}</TextInputError>} />
    </TextInputWrapper>
);
TextInput.propTypes = {
    name: PropTypes.string.isRequired,
};

const Line = styled.div`
  margin-bottom: 2.4rem;
  border-top: 1px solid ${colors.forms.borders.light};
`;

const Error = styled(Alert).attrs({
    variant: 'danger',
})`

`;

const wholePercent = {
    fromNumber(v) {
        return Math.round(v * 100);
    },
    toNumber(v) {
        return (v / 100).toFixed(2);
    },
};

const enforceNumberInput = (ev) => {
    if (ev.key.length === 1 && /\D/.test(ev.key)) {
        ev.preventDefault();
    }
};

const FieldsetRow = observer(({ legend, legendHint, hint, children, ...fieldsetProps }) => {
    return (
        <fieldset {...fieldsetProps}>
            <legend className="sr-only">{legend} {hint}</legend>
            <SplitRow>
                <Legend aria-hidden="true" role="presentation">
                    {legend}
                    {legendHint && <HintText>{legendHint}</HintText>}
                </Legend>
                <div>
                    {children}
                </div>
            </SplitRow>
        </fieldset>
    );
});

FieldsetRow.propTypes = {
    legend: PropTypes.string.isRequired,
    legendHint: PropTypes.string,
};

@observer
class TemplateForm extends React.Component {
    static propTypes = {
        onComplete: PropTypes.func.isRequired,
        body: PropTypes.func.isRequired,
        ...propTypes,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound async onSubmit(values) {
        this.props.template.update(values);
        await this.props.template.save();

        this.props.onComplete();
    }

    componentDidMount() {
        //Focus on the template name when modal is opened
        this.templateName.focus();
    }

    renderLateWorkFields(form) {
        const applied = form.values.late_work_penalty_applied;

        return (
            <FieldsetRow
                legend="Late work penalty"
                legendHint="Penalty is applied to questions answered after the due date."
                data-test-id="late-work-penalty"
            >
                <Setting>
                    <RadioInput
                        name="late_work_penalty_applied"
                        label="Deduct"
                        value="daily"
                        defaultChecked={applied === 'daily'}
                        aria-labelledby="late_work_penalty_day_label late_day_deduction_label"
                    />
                    <AdjacentNumberInput
                        name="late_work_penalty"
                        id="late_day_deduction"
                        translate={wholePercent}
                        min={0} max={100}
                        step={5}
                        disabled={applied !== 'daily'}
                        onKeyDown={enforceNumberInput}
                        validate={isValidPercentNumber}
                    />
                    <SettingLabel
                        id="late_day_deduction_label"
                        htmlFor="late_day_deduction"
                    >
                        % for each late day
                    </SettingLabel>
                </Setting>
                <Setting>
                    <RadioInput
                        name="late_work_penalty_applied"
                        label="Deduct"
                        value="immediately"
                        defaultChecked={applied === 'immediately'}
                        id="late_work_penalty_assignment"
                        aria-labelledby="late_work_penalty_assignment_label late_assignment_deduction_label"
                    />
                    <AdjacentNumberInput
                        name="late_work_penalty"
                        id="late_assignment_deduction"
                        translate={wholePercent}
                        min={0} max={100}
                        step={5}
                        disabled={applied !== 'immediately'}
                        onKeyDown={enforceNumberInput}
                        validate={isValidPercentNumber}
                    />
                    <SettingLabel
                        id="late_assignment_deduction_label"
                        htmlFor="late_assignment_deduction"
                    >
                        % for each late assignment
                    </SettingLabel>
                </Setting>
            </FieldsetRow>
        );
    }

    renderMultipleAttemptsFields(form, template) {
        const header = (
            <>
                <Line />
                <Row>
                    Allow multiple-attempts
                    <HintText>
                        To enable, feedback must be set to <i>‘immediately after student answers’</i>.
                    </HintText>
                </Row>
            </>
        );

        const iconText = (
            <>
                <strong>Example:</strong>
                <div>MCQ with 4 choices, students get 2 (4-2) attempts.</div>
                <div>MCQ with 3 choices, students get 1 (3-2) attempt.</div>
                <div>MCQ with 2 choices, students get 1 attempt only.</div>
            </>
        );

        const body = (
            <>
                <FieldsetRow
                    legend="For auto-graded questions"
                    legendHint={
                        <>
                            Attempts allowed is equal to no. of choices ‘minus’ 2
                            <InfoIcon tooltip={iconText} />
                        </>
                    }
                >
                    <div>
                        <Setting>
                            <RadioInput
                                name="allow_auto_graded_multiple_attempts"
                                label="Yes"
                                onChange={() => form.setFieldValue('allow_auto_graded_multiple_attempts', true)}
                                defaultChecked={template.allow_auto_graded_multiple_attempts == true}
                            />
                        </Setting>
                        <Setting>
                            <RadioInput
                                name="allow_auto_graded_multiple_attempts"
                                label="No"
                                onChange={() => form.setFieldValue('allow_auto_graded_multiple_attempts', false)}
                                defaultChecked={template.allow_auto_graded_multiple_attempts == false}
                            />
                        </Setting>
                    </div>
                </FieldsetRow>
                <Row>
                    {form.values.allow_auto_graded_multiple_attempts &&
                    <div className="warning">
                        <strong>Note:</strong> The correct solution may sometimes be included in the choice-level feedback. You can review and edit choice-level feedback for questions in the Question Library.
                    </div>
                    }
                    <HintText>
                        Students can make <strong>unlimited attempts on a written-response question</strong> until that question is graded by the teacher or the assignment close date passes. <strong>No penalty</strong> on multiple attempts.
                    </HintText>
                </Row>
            </>
        );

        return (
            <>
                {header}
                {form.values.isFeedbackImmediate && body}
            </>
        );
    }

    renderForm = (form) => {
        const { body, template } = this.props;
        const namePlaceholder = template.task_plan_type == 'reading' ?
            'Pre-class reading, Reading-Thursday, etc.' : 'Homework, Short-essay, etc.';

        return (
            <Form>
                <SplitRow>
                    <Label htmlFor="template_name">Template name</Label>
                    <TextInput
                        name="name"
                        id="template_name"
                        // Check if the name is empty or is duplicated
                        validate={(name) => {
                            if (isEmpty(name) || !name.match(/\w+/)) return 'The name cannot be empty.';
                            if (this.props.template.isDuplicateName(template.id, name)) return 'This name is already in use. Enter a different name.';
                            return null;
                        }}
                        placeholder={namePlaceholder}
                        innerRef={(ref) => this.templateName = ref}
                        // Check if field is on focused ('touched') first and then check for any errors.
                        // Validate then happens when the field is out of focus for the first time.
                        // After, it validates as the user types.
                        hasError={Boolean(form.touched.name && form.errors.name)}
                    />
                </SplitRow>

                <Line />

                {body({ form })}

                {map(form.errors.common, (value, key) =>
                    <Error key={key}>{value}</Error>)}

                {template.task_plan_type == 'homework' && this.renderMultipleAttemptsFields(form, template)}

                <Line />
                <Row>Set the late work policy</Row>
                <FieldsetRow legend="Accept late work?">
                    <Setting>
                        <RadioInput
                            name="late_work_penalty_toggle"
                            label="Yes"
                            onChange={() => form.setFieldValue('late_work_penalty_applied', 'daily')}
                            checked={form.values.late_work_penalty_applied !== 'not_accepted'}
                        />
                    </Setting>
                    <Setting>
                        <RadioInput
                            name="late_work_penalty_applied"
                            label="No"
                            value="not_accepted"
                            checked={!form.values.isLateWorkAccepted}
                        />
                    </Setting>
                </FieldsetRow>

                {form.values.isLateWorkAccepted && this.renderLateWorkFields(form)}

                <Line />

                <Row>
                    Set up your preferred due dates and time as defaults
                    <HintText>(You can change this while building an assignment)</HintText>
                </Row>
                <FieldsetRow legend="Due date for assignments">
                    <Setting>
                        <Select name="default_due_date_offset_days">
                            {range(1, 16).map((v) =>
                                <option value={v} key={v}>{v}</option>
                            )}
                        </Select>
                        <SettingLabel htmlFor="due_date_count">days after open date</SettingLabel>
                    </Setting>
                </FieldsetRow>
                <FieldsetRow legend="Due time for assignments">
                    <TimeInput
                        name="default_due_time"
                        minutes={[...range(0, 56, 5), 59]}
                    />
                </FieldsetRow>
                <FieldsetRow legend="Close date for assignments">
                    <Setting>
                        <Select name="default_close_date_offset_days">
                            {[...range(1, 16), 30, 60, 90, 120].map((v) =>
                                <option key={'closedate' + v} value={v}>{v}</option>
                            )}
                        </Select>
                        <SettingLabel htmlFor="close_date_count">days after due date</SettingLabel>
                    </Setting>
                </FieldsetRow>
                <Line />
                <ControlsWrapper>
                    <HintText>
                        (You can manage this template in <a>Grading Templates</a> under the 'Add assignment' menu)
                    </HintText>
                    <Controls>
                        <Button variant="default" onClick={this.props.onComplete} size="lg">
                            Cancel
                        </Button>
                        <Button type="submit" size="lg" disabled={!form.isValid}>
                            Save
                        </Button>
                    </Controls>
                </ControlsWrapper>
            </Form>
        );
    }

    render() {
        const { template, onComplete } = this.props;

        return (
            <StyledTemplateModal
                show={true}
                backdrop="static"
                onHide={onComplete}
                templateType={template.task_plan_type}
            >
                <Modal.Header closeButton>
                    {template.isNew ? 'Add' : 'Edit'} {template.task_plan_type} grading template
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={template}
                        validateOnMount={true}
                        validate={GradingTemplate.validate}
                        onSubmit={this.onSubmit}
                    >
                        {this.renderForm}
                    </Formik>
                </Modal.Body>

            </StyledTemplateModal>
        );
    }
}


const reading = observer((props) => {

    return (
        <TemplateForm
            {...props}
            body={({ form }) => (
                <>
                    <Row>
                        Score calculations for questions
                        <HintText>
                            (OpenStax Tutor encourages grading for completion, not correctness. <a href="https://openstax.org/blog/new-openstax-tutor-scoring-feature" target="_blank">Learn why</a>)
                        </HintText>
                    </Row>

                    <SplitRow>
                        <Label>Weight for correctness</Label>
                        <Setting>
                            <StyledNumberInput
                                name="correctness_weight"
                                min={0} max={100}
                                translate={wholePercent}
                                validate={isValidPercentNumber}
                                onChange={(ev) => form.setFieldValue('completion_weight', (1 - ev.target.value).toFixed(2))}
                                onKeyDown={enforceNumberInput}
                            />
                            <SettingLabel>% of questions point value</SettingLabel>
                        </Setting>
                    </SplitRow>
                    <SplitRow>
                        <Label>Weight for completion</Label>
                        <Setting>
                            <StyledNumberInput
                                name="completion_weight"
                                min={0} max={100}
                                translate={wholePercent}
                                onChange={(ev) => form.setFieldValue('correctness_weight', (1 - ev.target.value).toFixed(2))}
                                onKeyDown={enforceNumberInput}
                                validate={isValidPercentNumber}
                            />
                            <SettingLabel>% of questions point value</SettingLabel>
                        </Setting>
                    </SplitRow>
                    <Line />
                    <Row>
                        Reading assignments are auto-graded by OpenStax Tutor. Scores and feedback are visible to students
                        immediately after they answer a question.
                    </Row>
                </>
            )}
        />
    );
});

reading.displayName = 'ReadingTemplateEditForm';
reading.propTypes = propTypes;

const homework = observer((props) => {
    const { template } = props;

    return (
        <TemplateForm
            {...props}
            body={() => (
                <>
                    <Row>
                        Select when students can see their scores and feedback
                    </Row>
                    <FieldsetRow
                        legend="For auto-graded questions"
                        legendHint="(Multiple choice question-MCQs, 2-Step questions)"
                    >
                        <div>
                            <Setting>
                                <RadioInput
                                    name="auto_grading_feedback_on"
                                    value="answer"
                                    label="Immediately after student answers"
                                    defaultChecked={template.auto_grading_feedback_on == 'answer'}
                                />
                            </Setting>
                            <Setting>
                                <RadioInput
                                    name="auto_grading_feedback_on"
                                    value="due"
                                    label="After the due date"
                                    defaultChecked={template.auto_grading_feedback_on == 'due'}
                                />
                            </Setting>
                            <Setting>
                                <RadioInput
                                    name="auto_grading_feedback_on"
                                    value="publish"
                                    label="After I publish the scores"
                                    defaultChecked={template.auto_grading_feedback_on == 'publish'}
                                />
                            </Setting>
                        </div>
                    </FieldsetRow>
                    <FieldsetRow
                        legend="For manually-graded questions"
                        legendHint="(Written response questions-WRQs)"
                    >
                        <div>
                            <Setting>
                                <RadioInput
                                    name="manual_grading_feedback_on"
                                    label="Immediately after I grade"
                                    value="grade"
                                    defaultChecked={template.manual_grading_feedback_on == 'grade'}
                                />
                            </Setting>
                            <Setting>
                                <RadioInput
                                    name="manual_grading_feedback_on"
                                    label="After I publish the scores"
                                    value="publish"
                                    defaultChecked={template.manual_grading_feedback_on == 'publish'}
                                />
                            </Setting>
                        </div>
                    </FieldsetRow>
                    <Row>
                        <HintText>
                            For assignments with both auto and manually graded questions, students
                            will see a <strong>provisional score</strong> until scores for <strong>
                                                                                                      ALL</strong> the manually-graded questions are published.
                        </HintText>
                    </Row>
                </>
            )}
        />
    );
});
homework.displayName = 'HomeworkTemplateEditForm';
homework.propTypes = propTypes;


const create = observer((props) => {
    const { onComplete, onCreateTypeSelection: onSelection } = props;

    return (
        <StyledSelectAssignmentModal
            show={true}
            backdrop="static"
            onHide={onComplete}
            templateType="neutral"
        >
            <Modal.Header closeButton>
                Select assignment type
            </Modal.Header>
            <Modal.Body>
                <CenteredRow>
                    <Row>
                        <LargeText>
                            To make a grading template, select an assignment category
                        </LargeText>
                    </Row>
                </CenteredRow>
                <CenteredRow>
                    <Row>
                        <Button variant="default" onClick={() => onSelection('homework')} size="lg">
                            Homework
                        </Button>
                        <Button variant="default" onClick={() => onSelection('reading')} size="lg">
                            Reading
                        </Button>
                    </Row>
                </CenteredRow>
            </Modal.Body>
        </StyledSelectAssignmentModal>
    );

});
homework.displayName = 'HomeworkTemplateCreate';
homework.propTypes = propTypes;

export { reading, homework, create };

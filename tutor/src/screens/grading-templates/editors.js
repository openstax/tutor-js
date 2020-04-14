import { React, PropTypes, action, observer, styled } from 'vendor';
import { Button, Modal, Alert } from 'react-bootstrap';
import { isEmpty, range, map } from 'lodash';
import { GradingTemplate } from '../../models/grading/templates';
import { colors, fonts } from '../../theme';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import NumberInput from '../../components/number-input';
import RadioInput from '../../components/radio-input';
import TimeInput from '../../components/time-input';
import Select from '../../components/select';
import TemplateModal from '../../components/template-modal';

const propTypes = {
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};

const StyledTemplateModal = styled(TemplateModal)`
  .modal-dialog {
    max-width: 680px;
  }
`;

const Row = styled.div`
  margin: 2.4rem 0;
`;

const SplitRow = styled.div`
  display: flex;
  margin-bottom: 2.4rem;
  > * {
    flex-basis: 50%;
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

const StyledTextInput = styled(Field).attrs({
  type: 'text',
})`
  padding: 0.8rem 1rem;
  border-radius: 4px;
  border: 1px solid ${colors.forms.borders.light};
  font-size: 1.4rem;

  &:focus {
    border-color: ${colors.forms.borders.focus};
    box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
  }

  &::placeholder {
    font-size: inherit;
  }
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
  margin: 2.4rem 0;
  border-top: 1px solid ${colors.forms.borders.light};
`;

const Error = styled(Alert).attrs({
  variant: 'danger',
})`

`;

const isRequired = (value) => isEmpty(value) && 'Cannot be blank';
const wholePercent = {
  fromNumber(v) {
    return Math.round(v * 100);
  },
  toNumber(v) {
    return (v / 100).toFixed(2);
  },
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

  @action.bound async onSubmit(values) {

    this.props.template.update(values);
    await this.props.template.save();

    this.props.onComplete();
  }

  renderLateWorkFields(form) {
    const applied = form.values.late_work_penalty_applied;

    return (
      <FieldsetRow legend="Late work penalty" data-test-id="late-work-penalty">
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
          />
          <SettingLabel
            id="late_assignment_deduction_label"
            htmlFor="late_assignment_deduction"
          >
            % for late assignment
          </SettingLabel>
        </Setting>
      </FieldsetRow>
    );
  }

  renderForm = (form) => {
    const { body } = this.props;
    const namePlaceholder = this.props.template.task_plan_type == 'reading' ?
      'Pre-class reading, Reading-Thursday, etc.' : 'Homework, Short-essay, etc.';

    return (
      <Form>
        <SplitRow>
          <Label htmlFor="template_name">Template name</Label>
          <TextInput
            name="name"
            id="template_name"
            validate={isRequired}
            placeholder={namePlaceholder}
          />
        </SplitRow>

        <Line />

        {body({ form })}

        {map(form.errors.common, (value, key) =>
          <Error key={key}>{value}</Error>)}
        <Line />
        <Row>Set the late work policy</Row>
        <FieldsetRow legend="Accept late work?">
          <Setting>
            <RadioInput
              name="late_work_penalty_toggle"
              label="Yes"
              onChange={() => form.setFieldValue('late_work_penalty_applied', 'daily')}
              checked={form.values.late_work_penalty_applied !== 'never'}
            />
          </Setting>
          <Setting>
            <RadioInput
              name="late_work_penalty_applied"
              label="No"
              value="never"
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
                <option key={'closedate' + v}>{v}</option>
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
              (OpenStax Tutor encourages grading for completion, not correctness. <a href="" target="_blank">Learn why</a>)
            </HintText>
          </Row>

          <SplitRow>
            <Label>Weight for correctness</Label>
            <Setting>
              <StyledNumberInput
                name="correctness_weight"
                min={0} max={100}
                translate={wholePercent}
                onChange={(ev) => form.setFieldValue('completion_weight', (1 - ev.target.value).toFixed(2))}
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
              will see a <strong>provisional score</strong> until scores for <strong>ALL</strong>
              the manually-graded questions are published.
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
    <StyledTemplateModal
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
          <LargeText>
            To make an assignment settings template, select an assignment category
          </LargeText>
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
    </StyledTemplateModal>
  );

});
homework.displayName = 'HomeworkTemplateCreate';
homework.propTypes = propTypes;

export { reading, homework, create };

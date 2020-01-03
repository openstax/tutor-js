import { React, PropTypes, action, observer, styled } from 'vendor';
import { Button, Modal, Alert, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { isEmpty, map, omit } from 'lodash';
import { GradingTemplate } from '../../models/grading/templates';
import { colors, fonts } from '../../theme';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import NumberInput from '../../components/number-input';
import RadioInput from '../../components/radio-input';
import Select from '../../components/select';

const propTypes = {
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};

const StyledModal = styled((props) => <Modal {...omit(props, StyledModal.OmitProps)} />)`
  .modal-dialog {
    max-width: 680px;

    .modal-header {
      border-left: 8px solid ${props => props.templateColors.border};
      background-color: ${props => props.templateColors.background};
      font-size: 1.8rem;
      font-weight: bold;
      border-bottom: 0;
      border-radius: 0;
    }

    .modal-body {
      line-height: 2rem;
    }

    .close {
      font-size: 3rem;
      margin-top: -1.5rem;
    }
  }
`;

StyledModal.OmitProps = [
  'templateColors',
];

const StyledToggleButtonGroup = styled(ToggleButtonGroup)`
  margin-left: 1.4rem;
  border: 1px solid ${colors.forms.borders.light};
  border-radius: 4px;

  &.btn-group {
    vertical-align: initial;
  }

  .btn:not(.btn-link) {
    font-size: 1.4rem;
    height: 3.1rem;
    background-color: #fff;

    &:not(.disabled) {
      &.active {
        background: ${colors.neutral.light};
        border-color: ${colors.neutral.light};
      }

      &.focus {
        border-color: ${colors.forms.borders.focus};
        box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
      }
    }
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

const TimeSeparator = styled.span `
  margin: 0 0.5rem;
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

const FieldsetRow = observer((props) => {
  return (
    <fieldset>
      <legend className="sr-only">{props.legend} {props.hint}</legend>
      <SplitRow>
        <Legend aria-hidden="true" role="presentation">
          {props.legend}
          {props.legendHint && <HintText>{props.legendHint}</HintText>}
        </Legend>
        <div>
          {props.children}
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
    children: PropTypes.node.isRequired,
    ...propTypes,
  }

  @action.bound async onSubmit(values) {
    this.props.template.update(values);
    await this.props.template.save();
    this.props.onComplete();
  }

  renderForm = (form) => {
    this.form = form;

    return (
      <Form>
        <SplitRow>
          <Label htmlFor="template_name">Template name</Label>
          <TextInput
            name="name"
            id="template_name"
            validate={isRequired}
            placeholder="Pre-class reading, Reading-Thursday, etc."
          />
        </SplitRow>
        <Line />
        {this.props.children}
        {map(form.errors.common, (value, key) =>
          <Error key={key}>{value}</Error>)}
        <Line />
        <Row>
          Reading assignments are auto-graded by OpenStax Tutor. Scores and feedback are visible to students
          immediately after they answer a question.
        </Row>
        <Line />
        <Row>Set the late work policy</Row>
        <FieldsetRow legend="Accept late work?">
          <Setting>
            <RadioInput
              name="accept_late_work"
              label="Yes"
              id="late_work_yes"
              defaultChecked={true}
            />
          </Setting>
          <Setting>
            <RadioInput
              name="accept_late_work"
              label="No"
              id="late_work_no"
              defaultChecked={false}
            />
          </Setting>
        </FieldsetRow>
        <FieldsetRow legend="Late work penalty">
          <Setting>
            <RadioInput
              name="late_work_penalty"
              label="Deduct"
              id="late_work_penalty_day"
              defaultChecked={false}
              aria-labelledby="late_work_penalty_day_label late_day_deduction_label"
            />
            <AdjacentNumberInput
              name="late_work_per_day_penalty"
              id="late_day_deduction"
              min={0} max={100}
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
              name="late_work_immediate_penalty"
              label="Deduct"
              id="late_work_penalty_assignment"
              defaultChecked={true}
              aria-labelledby="late_work_penalty_assignment_label late_assignment_deduction_label"
            />
            <AdjacentNumberInput
              name="late_assignment_deduction"
              id="late_assignment_deduction"
              min={0} max={100}
            />
            <SettingLabel
              id="late_assignment_deduction_label"
              htmlFor="late_assignment_deduction"
            >
              % for late assignment
            </SettingLabel>
          </Setting>
        </FieldsetRow>
        <Line />
        <Row>
          Set up your preferred due dates and time as defaults
          <HintText>(You can change this while building an assignment)</HintText>
        </Row>
        <FieldsetRow legend="Due date for assignments">
          <Setting>
            <Select name="due_date_count" id="due_date_count">
              {Array.from(Array(7), (v, i) =>
                <option>{i + 1}</option>
              )}
            </Select>
            <SettingLabel htmlFor="due_date_count">days after open date</SettingLabel>
          </Setting>
        </FieldsetRow>
        <FieldsetRow legend="Due time for assignments">
          <Setting>
            <Select name="due_time_hour">
              {Array.from(Array(12), (v, i) =>
                <option>{(i + 1).toString().padStart(2, '0')}</option>
              )}
            </Select>
            <TimeSeparator>:</TimeSeparator>
            <Select name="due_time_minute">
              {Array.from(Array(60), (v, i) =>
                <option>{i.toString().padStart(2, '0')}</option>
              )}
            </Select>
            <StyledToggleButtonGroup type="radio" name="due_time_ampm" defaultValue={2}>
              <ToggleButton value={1} variant="light">AM</ToggleButton>
              <ToggleButton value={2} variant="light">PM</ToggleButton>
            </StyledToggleButtonGroup>
          </Setting>
        </FieldsetRow>
        <FieldsetRow legend="Close date for assignments">
          <Setting>
            <Select name="close_date_count" id="close_date_count">
              {Array.from(Array(7), (v, i) =>
                <option>{i + 1}</option>
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
            <Button type="submit" size="lg">
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
      <StyledModal
        show={true}
        backdrop="static"
        onHide={onComplete}
        templateColors={colors.templates[template.task_plan_type]}
      >
        <Modal.Header closeButton>
          {template.isNew ? 'Add' : 'Edit'} {template.task_plan_type} grading template
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={template}
            validate={GradingTemplate.validate}
            onSubmit={this.onSubmit}
          >
            {this.renderForm}
          </Formik>
        </Modal.Body>

      </StyledModal>
    );
  }

}


const reading = observer((props) => {
//  const { template } = props;

  return (
    <TemplateForm
      {...props}
    >
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
          />
          <SettingLabel>% of questions point value</SettingLabel>
        </Setting>
      </SplitRow>
    </TemplateForm>
  );
});
reading.displayName = 'ReadingTemplateEditForm';
reading.propTypes = propTypes;

const homework = observer((props) => {
  //const { template } = props;

  return (
    <TemplateForm
      {...props}
    >
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
              name="auto_graded_qs"
              label="Immediately after student answers"
              id="auto_graded_qs_immediate"
              defaultChecked={true}
            />
          </Setting>
          <Setting>
            <RadioInput
              name="auto_graded_qs"
              label="After the due date"
              id="auto_graded_qs_due"
              defaultChecked={false}
            />
          </Setting>
          <Setting>
            <RadioInput
              name="auto_graded_qs"
              label="After I publish the scores"
              id="auto_graded_qs_publish"
              defaultChecked={false}
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
              name="manual_graded_qs"
              label="Immediately after I grade"
              id="manual_graded_qs_immediate"
              defaultChecked={false}
            />
          </Setting>
          <Setting>
            <RadioInput
              name="manual_graded_qs"
              label="After I publish the scores"
              id="manual_graded_qs_publish"
              defaultChecked={true}
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
    </TemplateForm>
  );

});
homework.displayName = 'HomeworkTemplateEditForm';
homework.propTypes = propTypes;


const create = observer((props) => {
  const { onComplete, onCreateTypeSelection: onSelection } = props;

  return (
    <StyledModal
      show={true}
      backdrop="static"
      onHide={onComplete}
      templateColors={colors.templates.neutral}
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
    </StyledModal>
  );

});
homework.displayName = 'HomeworkTemplateCreate';
homework.propTypes = propTypes;

export { reading, homework, create };

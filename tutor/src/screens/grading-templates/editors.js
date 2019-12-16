import { React, PropTypes, action, observer, styled } from 'vendor';
import { Button, Modal } from 'react-bootstrap';
import { GradingTemplate } from '../../models/grading/templates';
import { colors } from '../../theme';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import NumberInput from '../../components/number-input';

const propTypes = {
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};

const Row = styled.div`

`;

const SplitRow = styled.div`
  display: flex;
  > * {
    flex-basis: 50%;
  }
`;

const Controls = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${colors.line};
`;

const Label = styled.span`
  font-weight: bold;
`;

const TextInput = styled(Field).attrs({
  type: 'text',
})`


`;

const Line = styled.div`
  border-top: 1px solid ${colors.line};
`;

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
          <Label>Template name</Label>
          <TextInput
            name="name"
            placeholder="Pre-class reading, Reading-Thursday, etc."
          />
        </SplitRow>
        <Line />
        {this.props.children}
        <ErrorMessage name="common" />
        <Controls>
          <Button
            type="submit"

          >
            Save
          </Button>
          <Button variant="default" onClick={this.props.onComplete}>
            Cancel
          </Button>
        </Controls>
      </Form>
    );
  }

  render() {
    const { template, onComplete } = this.props;

    return (
      <Modal
        show={true}
        backdrop="static"
        onHide={onComplete}
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

      </Modal>
    );
  }

}


const reading = observer((props) => {
//  const { template } = props;

  return (
    <TemplateForm
      {...props}
    >
      <Row>Score calculations for questions</Row>
      <Row>(OpenStax Tutor encourages grading for completion, not correctness. <a>Learn why</a>)</Row>

      <SplitRow>
        <Label>Weight for correctness</Label>
        <div>
          <NumberInput
            name="correctness_weight"
            min={0} max={100}
          /> % of questions point value
        </div>
      </SplitRow>
      <SplitRow>
        <Label>Weight for completion</Label>
        <div>
          <NumberInput
            name="completion_weight"
            min={0} max={100}
          /> % of questions point value
        </div>
      </SplitRow>
    </TemplateForm>
  );
});
reading.displayName = 'ReadingTemplateEditForm';
reading.propTypes = propTypes;


const homework = observer((props) => {
  const { template } = props;

  return (
    <TemplateForm
      {...props}
    >
      <p>homework: {template.name}</p>
    </TemplateForm>
  );

});
homework.displayName = 'HomeworkTemplateEditForm';
homework.propTypes = propTypes;


const create = observer((props) => {
  const { onComplete, onCreateTypeSelection: onSelection } = props;

  return (
    <Modal
      show={true}
      backdrop="static"
      onHide={onComplete}
    >
      <Modal.Header closeButton>
        Type of template:
      </Modal.Header>
      <Modal.Body>
        <Button variant="default" onClick={() => onSelection('homework')}>
          Homework
        </Button>
        <Button variant="default" onClick={() => onSelection('reading')}>
          Reading
        </Button>
      </Modal.Body>
    </Modal>
  );

});
homework.displayName = 'HomeworkTemplateCreate';
homework.propTypes = propTypes;

export { reading, homework, create };

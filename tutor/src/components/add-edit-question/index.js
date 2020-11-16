import { React, PropTypes, observer } from 'vendor';
import { Button } from 'react-bootstrap';
import AddEditQuestionForm from './form';
import AddEditQuestionUX from './ux';

const AddEditQuestionButton = observer((props) => {
  if(props.exerciseType !== 'homework') {
    return null;
  }
  const ux = new AddEditQuestionUX(props);
  
  return (
    <>
      <Button
        variant="primary"
        onClick={() => ux.setShowForm(true)}>
        Create question
      </Button>
      <AddEditQuestionForm ux={ux} />
    </>
  );
});

AddEditQuestionButton.propTypes = {
  exerciseType: PropTypes.string.isRequired,
};

export default AddEditQuestionButton;

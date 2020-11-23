import { React, PropTypes, observer } from 'vendor';
import { Button } from 'react-bootstrap';
import AddEditQuestionUX from './ux';
import AddEditQuestionForm from './form';
import AddEditQuestionTermsOfUse from './terms-of-use';

const AddEditQuestionButton = observer((props) => {
  if(props.exerciseType !== 'homework') {
    return null;
  }
  const ux = new AddEditQuestionUX(props);

  const onOpenForm = () => {
    //TODO: if user did not sign yet (get from BE), show terms of use
    const didUserAgreed = false;
    if(!didUserAgreed) {
      ux.setShowAddEditTermsOfUse(true);
    }
    else {
      ux.setShowAddEditForm(true);
    }
  };
  
  return (
    <>
      <Button
        variant="primary"
        onClick={onOpenForm}>
        Create question
      </Button>
      <AddEditQuestionForm ux={ux} />
      <AddEditQuestionTermsOfUse ux={ux} />

    </>
  );
});

AddEditQuestionButton.propTypes = {
  exerciseType: PropTypes.string.isRequired,
  book: PropTypes.object.isRequired,
  pageIds: PropTypes.array.isRequired,
  course: PropTypes.object.isRequired,
};

export default AddEditQuestionButton;

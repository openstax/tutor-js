import { React, PropTypes, observer } from 'vendor';
import AddEditQuestionUX from './ux';
import AddEditQuestionForm from './form';
import AddEditQuestionTermsOfUse from './terms-of-use';

const AddEditQuestionModals = observer(({ ux }) => {
  if(ux.didUserAgreeTermsOfUse) {
    return <AddEditQuestionForm ux={ux}/>;
  }
  return <AddEditQuestionTermsOfUse ux={ux}/>;
});

const AddEditQuestion = observer((props) => {
  if(props.exerciseType !== 'homework') {
    return null;
  }
  const ux = new AddEditQuestionUX(props);
  
  if(!props.showModal) return null;
  return <AddEditQuestionModals ux={ux} />;
});
AddEditQuestion.propTypes = {
  exerciseType: PropTypes.string.isRequired,
  book: PropTypes.object.isRequired,
  pageIds: PropTypes.array.isRequired,
  course: PropTypes.object.isRequired,
  showModal: PropTypes.bool.isRequired,
  onDisplayModal: PropTypes.func.isRequired,
};

export default AddEditQuestion;

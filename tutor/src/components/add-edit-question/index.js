import { React, PropTypes, observer } from 'vendor';
import AddEditQuestionUX from './ux';
import AddEditQuestionForm from './form';
import AddEditQuestionTermsOfUse from './terms-of-use';
import {
    FeedbackTipModal,
    ExitWarningModal,
    CoursePreviewOnlyModal,
    QuestionPreviewModal } from './modals';

const AddEditQuestionModals = observer(({ ux }) => {
    if(!ux.didUserAgreeTermsOfUse) {
        return <AddEditQuestionTermsOfUse
            onClose={() => ux.onDisplayModal(false)}
            show={true} />;
    }
    return (
        <>
            <AddEditQuestionForm ux={ux} />
            <FeedbackTipModal ux={ux} />
            <ExitWarningModal ux={ux} />
            <QuestionPreviewModal ux={ux} />
            <AddEditQuestionTermsOfUse
                onClose={() => ux.showTermsOfUse = false}
                show={ux.showTermsOfUse}
                displayOnly />;
        </>
    );
});

const AddEditQuestion = observer((props) => {
    if(props.exerciseType !== 'homework' || !props.showModal) {
        return null;
    }
    if(props.course.is_preview) {
        return <CoursePreviewOnlyModal onDisplayModal={props.onDisplayModal} />;
    }

    const ux = new AddEditQuestionUX(props);
    return <AddEditQuestionModals ux={ux} />;
});
AddEditQuestion.propTypes = {
    exerciseType: PropTypes.string.isRequired,
    exercise: PropTypes.object,
    book: PropTypes.object.isRequired,
    pageIds: PropTypes.array.isRequired,
    course: PropTypes.object.isRequired,
    showModal: PropTypes.bool.isRequired,
    onDisplayModal: PropTypes.func.isRequired,
};

export default AddEditQuestion;

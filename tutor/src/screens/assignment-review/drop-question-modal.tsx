import { React, observer, styled } from 'vendor';
import { Modal, Button } from 'react-bootstrap';
import { colors } from '../../theme';
import type UX from './ux'
import TutorLink from '../../components/link'
import { Icon, AsyncButton } from 'shared';
import { Exercise  } from 'tutor/src/models';

const DetailsLink = styled(TutorLink)`
    color: ${colors.link};
`


const StyledModal = styled(Modal)`

`;

interface DropQuestionModelProps {
    ux: UX
}

export
const DropQuestionModel:React.FC<DropQuestionModelProps> = observer(({ ux }) => {
    const { displayingDropQuestion: question } = ux
    if (!question) {
        return null
    }
    const exercise = question?.exercise.wrapper as Exercise
    return (
        <StyledModal
            show={true}
            data-test-id="drop-questions-modal"
            backdrop="static"
            onHide={ux.cancelDisplayingDropQuestions}
        >
            <Modal.Header closeButton>
                Drop question ID: #{question.id}
            </Modal.Header>
            <Modal.Body>
                <DetailsLink targetNewTab to="viewQuestionsLibrary" params={{ courseId: ux.course.id }}
                    query={{
                        exerciseId: exercise.id,
                        pageIds: exercise.page.id,
                    }}
                >
                    Question ID: #{question?.id}
                    <Icon type="external-link-square" />
                </DetailsLink>

            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant={'default' as any}
                    className="btn-standard"
                    data-test-id="cancel-btn"
                    onClick={ux.cancelDisplayingDropQuestions}
                >Cancel</Button>
                <AsyncButton
                    variant="primary"
                    className="btn-standard"
                    data-test-id="save-btn"
                    disabled={!ux.canSubmitDroppedQuestions || ux.isDroppedQuestionsSaving}
                    isWaiting={ux.isDroppedQuestionsSaving}
                    waitingText="Dropping…"
                    onClick={ux.saveDropQuestions}
                >Save</AsyncButton>
            </Modal.Footer>
        </StyledModal>
    )
})

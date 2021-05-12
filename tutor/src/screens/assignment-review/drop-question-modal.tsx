import { React, observer, observable, action, modelize, styled } from 'vendor';
import { Modal, Button } from 'react-bootstrap';
import { colors } from '../../theme';
import type UX from './ux'
import TutorLink from '../../components/link'
import { Icon, AsyncButton } from 'shared';
import { Exercise  } from 'tutor/src/models';
import { Box } from 'boxible'


const DetailsLink = styled(TutorLink)`
    color: ${colors.link};
`


const StyledModal = styled(Modal)`

`;

interface DropQuestionModelProps {
    ux: UX
}

const Light = styled.div`
font-size: 1.2rem;
color: #6F6F6F;
`

@observer
export
class DropQuestionModel extends React.Component<DropQuestionModelProps> {

    @observable selection?: string

    constructor(props) {
        super(props)
        modelize(this)
    }

    @action.bound onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        this.selection = ev.target.value
    }

    render() {
        const { ux, ux: { displayingDropQuestion: question } } = this.props;
        if (!question) {
            return null;
        }
        const exercise = question?.exercise.wrapper as Exercise;
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
                    <p>
                        Drop question for all students in all sections. Question will be marked
                        as dropped but remain available to students.
                    </p>
                    <Box>
                        <b>Reallocate Points</b>
                        <Box direction="column" margin={{ left: '35px' }}>
                            <Box margin={{ bottom: 'large' }}>
                                <Box pad="top" margin="right">
                                    <input
                                        type="radio" name="type"
                                        id="full-credit" value="full"
                                    />
                                </Box>
                                <Box as="label" htmlFor="full-credit" direction="column">
                                    Give full credit (#.# points)
                                    <Light>Students must attempt the question to get credit</Light>
                                </Box>
                            </Box>
                            <Box as="label">
                                <Box pad="top" margin="right">
                                    <input type="radio" id="zero-credit" name="type" value="zero" />
                                </Box>
                                <Box direction="column">
                                    Make the question worth zero points
                                    <Light>Available points will change.</Light>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
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
    }
}

import { React, observer, observable, action, modelize, styled } from 'vendor'
import { Modal, Button } from 'react-bootstrap'
import { colors } from '../../theme'
import type UX from './ux'
import TutorLink from '../../components/link'
import { Icon, AsyncButton } from 'shared'
import { Exercise } from 'tutor/src/models'
import RadioInput from '../../components/radio-input'
import CheckboxInput from '../../components/checkbox-input'
import { Box } from 'boxible'
import S from '../../helpers/string'


const DetailsLink = styled(TutorLink)`
    color: ${colors.link};
`


const StyledModal = styled(Modal)`

`

interface DropQuestionModalProps {
    ux: UX
}

const Light = styled.div`
    font-size: 1.2rem;
    color: #6F6F6F;
`

@observer
export class DropQuestionModal extends React.Component<DropQuestionModalProps> {
    @observable selection?: string

    constructor(props: any) {
        super(props)
        modelize(this)
    }

    @action.bound onChange(ev: React.ChangeEvent<HTMLInputElement>) {
        this.selection = ev.target.value
    }

    render() {
        const { ux, ux: { displayingDropQuestion: question, droppedHeading, droppedQuestion } } = this.props
        const heading = droppedHeading
        const drop = droppedQuestion

        if (!question || !drop || !heading) {
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
                    <p>
                        Drop question for all students in all sections. Question will be marked
                        as dropped but remain available to students.
                    </p>
                    <Box margin={{ bottom: 'large' }}>
                        <b>Reallocate Points</b>
                        <Box direction="column" margin={{ left: '40px' }}>
                            <Box margin={{ bottom: 'large' }}>
                                <Box pad="top" margin="right">
                                    <RadioInput standalone name="type"
                                        id="full-credit" value="full"
                                        checked={drop.drop_method == 'full_credit'}
                                        onChange={({ target: { checked } }: { target: { checked: boolean } }) => {
                                            checked && (drop.setDropMethod('full_credit'))
                                        }} />
                                </Box>
                                <Box as="label" htmlFor="full-credit" direction="column" margin={{ left: '8px' }}>
                                    Give full credit ({S.numberWithOneDecimalPlace(heading.points_without_dropping)} points)
                                    <Light>Students must attempt the question to get credit</Light>
                                </Box>
                            </Box>
                            <Box>
                                <Box pad="top" margin="right">
                                    <RadioInput standalone name="type"
                                        id="zero-credit" value="zero"
                                        checked={drop.drop_method == 'zeroed'}
                                        onChange={({ target: { checked } }: { target: { checked: boolean } }) => {
                                            checked && (drop.setDropMethod('zeroed'))
                                        }} />
                                </Box>
                                <Box as="label" htmlFor="zero-credit" direction="column" margin={{ left: '8px' }}>
                                    Make the question worth zero points
                                    <Light>Available points will change.</Light>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box>
                        <b>Updated Points</b>
                        <Box direction="column" margin={{ left: '80px' }}>
                            <Box margin={{ bottom: 'large' }}>
                                Original points: {S.numberWithOneDecimalPlace(heading.points_without_dropping)}
                            </Box>
                            <Box margin={{ bottom: 'large' }}>
                                Updated points: {drop.drop_method == 'zeroed' ?
                                    '0.0' : S.numberWithOneDecimalPlace(heading.points_without_dropping)}
                            </Box>
                        </Box>
                    </Box>
                    <hr />
                    <Box>
                        <Box pad="top" margin="right">
                            <CheckboxInput standalone name="type"
                                id="exclude" checked={Boolean(drop && drop.excluded)}
                                onChange={({ target: { checked } }: { target: { checked: boolean } }) => {
                                    drop.setExcluded(checked)
                                }} />
                        </Box>
                        <Box as="label" htmlFor="exclude" direction="column" margin={{ left: '8px' }}>
                            Exclude this question from my Question Library
                            <Light>This question may still appear in other assignments that have already been created.</Light>
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
            </StyledModal >
        )
    }
}

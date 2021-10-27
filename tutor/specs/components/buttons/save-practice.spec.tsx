import { React, Factory } from '../../helpers'
import { mount } from 'enzyme'
import SavePracticeButton from '../../../src/components/buttons/save-practice'
import { PracticeQuestions } from '../../../src/models'

describe('SavePracticeButton', () => {
    let props: any, course, practiceQuestions: PracticeQuestions

    beforeEach(() => {
        course = Factory.course()
        practiceQuestions = Factory.practiceQuestions({ course })

        props = {
            practiceQuestions: practiceQuestions,
            taskStep: {
                exercise_id: -1,
                tasked_id: -1,
            },
        }
    })

    it('renders and matches snapshot', () => {
        expect.snapshot(<SavePracticeButton {...props} />).toMatchSnapshot()
    })

    it('can render a disabled fake button without a taskStep', () => {
        props.taskStep = null
        const button = mount(<SavePracticeButton disabled {...props} />)
        expect(button).toHaveRendered('[disabled=true]')
        expect(button.text()).toContain('Save to practice')
    })

    it('renders default state for unsaved questions', () => {
        const button = mount(<SavePracticeButton {...props} />)
        expect(button.text()).toContain('Save to practice')
        button.unmount()
    })

    // The expected case for practice questions that are in a fixed ecosystem
    it('finds existing practice question by exercise id', () => {
        const { exercise_id, tasked_exercise_id } = practiceQuestions.array[0]
        props.taskStep = {
            exercise_id: exercise_id,
            tasked_id: tasked_exercise_id,
        }
        const button = mount(<SavePracticeButton {...props} />)
        expect(button.text()).toContain('Remove from practice')
        button.unmount()
    })

    describe('after an ecosystem update has changed exercise ids', () => {
        it('finds existing practice question by tasked id', () => {
            props.taskStep.tasked_id = practiceQuestions.array[0].tasked_exercise_id
            const button = mount(<SavePracticeButton {...props} />)
            expect(button.text()).toContain('Remove from practice')
            button.unmount()
        })

        it('finds existing practice question for a multiPartGroup', () => {
            const tasked_id = practiceQuestions.array[1].tasked_exercise_id
            props.taskStep = {
                multiPartGroup: {
                    steps: [
                        { exercise_id: -4, tasked_id: tasked_id },
                        { exercise_id: -5, tasked_id: tasked_id },
                        { exercise_id: -6, tasked_id: tasked_id },
                    ],
                },

                exercise_id: -2,
                tasked_id: tasked_id,
            }
            const button = mount(<SavePracticeButton {...props} />)
            expect(button.text()).toContain('Remove from practice')
            button.unmount()
        })
    })
})

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
                exercise_uuid: '-1',
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

    it('finds existing practice question by exercise uuid', () => {
        const { exercise_uuid } = practiceQuestions.array[0]
        props.taskStep = {
            exercise_uuid: exercise_uuid
        }
        const button = mount(<SavePracticeButton {...props} />)
        expect(button.text()).toContain('Remove from practice')
        button.unmount()
    })
})

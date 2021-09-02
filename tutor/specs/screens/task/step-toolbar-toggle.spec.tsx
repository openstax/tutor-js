import React from 'react'
import UX from '../../../src/screens/task/ux'
import StepToolbarToggle from '../../../src/screens/task/step-toolbar-toggle'
import { Factory, C, TestRouter, TimeMock, ApiMock } from '../../helpers'

describe('Step Toolbar Toggle', () => {
    let props: { ux: UX }
    let task: any
    TimeMock.setTo('2017-10-14T12:00:00.000Z')

    ApiMock.intercept({
        'steps': () => task.steps[0].toJSON(),
        'courses/\\d+/practice_questions': [],
    } as any)

    beforeEach(() => {
        task = Factory.studentTasks({
            count: 1,
            attributes: { type: 'homework' },
        }).array[0]

        props = {
            ux: new UX({
                task,
                stepId: task.steps[0].id,
                history: new TestRouter().history,
            } as any),
        }
    })

    it('matches snapshot', () => {
        expect(<StepToolbarToggle {...props} />).toMatchSnapshot()
    })

    it('toggles', () => {
        const { ux } = props
        expect(ux.hideToolbar).toEqual(false)
        // @ts-ignore-next-line
        mount(<C><StepToolbarToggle {...props} /></C>).find('button').simulate('click')
        expect(ux.hideToolbar).toEqual(true)
    })
})

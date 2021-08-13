import { renderPointsScoredCell } from '../../src/components/task-progress'

describe('Task Progress', () => {
    describe('renderPointsScoredCell', () => {
        it('renders ungraded icon and popover if the step is completed and points are null', () => {
            const step = { is_completed: true, pointsScored: null, isLate: false }

            expect(renderPointsScoredCell(step)).toMatchSnapshot()
        })

        it('renders late icon and score popover if the step is late', () => {
            const step = { is_completed: true, pointsScored: 0.0, isLate: true }

            expect(renderPointsScoredCell(step)).toMatchSnapshot()
        })

        it('does not render a popover for incomplete steps', () => {
            const step = { is_completed: false, pointsScored: null, isLate: false }

            expect(renderPointsScoredCell(step)).toMatchSnapshot()
        })

        it('does not render a popover for graded steps completed on time', () => {
            const step = { is_completed: true, pointsScored: 0.0, isLate: false }

            expect(renderPointsScoredCell(step)).toMatchSnapshot()
        })
    })
})

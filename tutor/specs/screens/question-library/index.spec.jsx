import { ApiMock, Factory } from '../../helpers'
import { currentExercises } from '../../../src/models';
import QA from '../../../src/screens/question-library';
import mockFactory from '../../factories';

jest.mock('../../../src/models/exercises')
jest.mock('../../../src/models/courses-map', () => ({
    currentCourses: {
        get: () => mockFactory.course(),
    },
}))

describe('Questions Library Screen', function() {

    ApiMock.intercept({
        'ecosystems/\\d+/readings': [ Factory.data('Book') ],
    })

    it('clears exercises', () => {
        const qa = shallow(<QA />)
        expect(currentExercises.clear).toHaveBeenCalled()
        qa.unmount();
    })

})

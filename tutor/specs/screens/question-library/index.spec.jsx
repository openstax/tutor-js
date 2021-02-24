import Exercises from '../../../src/models/exercises';
import QA from '../../../src/screens/question-library';
import mockFactory from '../../factories';

jest.mock('../../../src/models/exercises')
jest.mock('../../../src/models/courses-map', () => ({
    get: () => mockFactory.course(),
}))

describe('Questions Library Screen', function() {

    it('clears exercises', () => {
        const qa = shallow(<QA />)
        expect(Exercises.clear).toHaveBeenCalled()
        qa.unmount();
    })

})

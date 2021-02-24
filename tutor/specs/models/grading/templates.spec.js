import { Factory } from '../../helpers';


describe('Grading Templates', () => {
    let course, store;

    beforeEach(() => {
        course = Factory.course();
        store = Factory.gradingTemplates({ course });
    });

    it('creates a store with models', () => {
        expect(store.array).toHaveLength(2);
        expect(store.array[0].serialize()).toMatchSnapshot();
    });
});

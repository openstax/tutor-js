import { Factory } from '../../helpers';
import { CourseUX }from '../../../src/models'

describe('Course UX Model', () => {
    let ux:CourseUX;
    beforeEach(() => {
        ux = new CourseUX(Factory.course({ type: 'physics', name: 'Local Test Course One' }))
    });

    it('#dataProps', () => {
        expect(ux.dataProps).toMatchObject({
            'data-appearance': 'college_physics',
            'data-book-title': 'College Physics',
            'data-is-preview': false,
            'data-term': 'Spring 2017',
            'data-title': 'Local Test Course One',
        });
    });

    it('#formattedStudentCost', () => {
        expect(ux.formattedStudentCost).toEqual('$10');
    });
});

import { CourseInformation } from '../../../src/models'

describe('Course Information lookup', function() {

    it('returns info for a valid appearance_code', function() {
        expect(CourseInformation.information('college_biology')).toEqual({
            title: 'College Biology',
            subject: 'Biology',
            code: 'college_biology',
        });
        return undefined;
    });

    it('returns a default values for unknown codes', function() {
        expect(CourseInformation.information('yo_yo_yo')).toEqual({
            title: 'Yo Yo Yo',
            subject: '',
            code: 'yo_yo_yo',
        });
        return undefined;
    });
});

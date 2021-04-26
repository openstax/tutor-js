import CourseInfo from '../../../src/models/course/information';

describe('Course Information lookup', function() {

    it('returns info for a valid appearance_code', function() {
        expect(CourseInfo.information('college_biology')).toEqual({
            title: 'College Biology',
            subject: 'Biology',
            code: 'college_biology',
        });
        return undefined;
    });

    it('returns a default values for unknown codes', function() {
        expect(CourseInfo.information('yo_yo_yo')).toEqual({
            title: 'Yo Yo Yo',
            subject: '',
            code: 'yo_yo_yo',
        });
        return undefined;
    });
});

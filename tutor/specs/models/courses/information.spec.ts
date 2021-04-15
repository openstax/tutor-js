import { CourseInformation } from '../../../src/models'

describe('Course Information lookup', function() {

    it('returns info for a valid appearance_code', function() {
        expect(CourseInformation.information('college_biology')).toEqual({
            title: 'College Biology',
            subject: 'Biology',
            bp_doc: 'biology',
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

    it('calculates url for best practices doc', () => {
        expect(CourseInformation.bestPracticesDocumentURLFor('bad')).toEqual('');
        expect(CourseInformation.bestPracticesDocumentURLFor('college_biology')).toEqual(
            'https://s3-us-west-2.amazonaws.com/openstax-assets/oscms-prodcms/media/documents/oxt-biology-best-practices.pdf'
        );
    });
});

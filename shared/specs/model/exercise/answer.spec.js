import Factories from '../../factories';

describe('Exercise Question', () => {
    let answer;

    beforeEach(() => {
        answer = Factories.exercise().questions[0].answers[0];
    });

    it('validates', () => {
        expect(answer.validity.valid).toBe(true);
        answer.content_html = '';
        expect(answer.validity).toEqual({ 'part': 'Answer Distractor', 'valid': false });
    });

});

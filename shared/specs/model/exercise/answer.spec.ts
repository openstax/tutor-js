import Answer from '../../../src/model/exercise/answer'

describe('Exercise Question', () => {

    it('validates', () => {
        const answer = new Answer()
        expect(answer.validity).toEqual({ 'part': 'Answer Distractor', 'valid': false });
        answer.content_html = 'a choice';
        expect(answer.validity.valid).toBe(true)
    });

});

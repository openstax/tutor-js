import { map } from 'lodash';
import ExerciseQuestion from 'shared/model/exercise/question';
import Factories from '../../factories';
import { serialize } from 'modeled-mobx'

describe('Exercise Question', () => {
    let question: ExerciseQuestion;

    beforeEach(() => question = Factories.exercise().questions[0]);

    it('has an updatable format', () => {
        expect(map(question.formats, 'value')).toEqual(['free-response', 'multiple-choice']);
        question.setExclusiveFormat('true-false');
        expect(map(question.formats, 'value')).toEqual(['true-false']);
        question.setExclusiveFormat('multiple-choice');
        expect(map(question.formats, 'value')).toEqual(['free-response', 'multiple-choice']);
        question.setExclusiveFormat('multiple-choice');
        expect(map(question.formats, 'value')).toEqual(['free-response', 'multiple-choice']);
        question.setExclusiveFormat('true-false');
        expect(map(question.formats, 'value')).toEqual(['true-false']);
        question.setExclusiveFormat('open-ended');
        expect(map(question.formats, 'value')).toEqual(['free-response']);
        question.setExclusiveFormat('open-ended');
        expect(map(question.formats, 'value')).toEqual(['free-response']);
    });

    it('can toggle formats', () => {
        expect(map(question.formats, 'value')).toEqual(['free-response', 'multiple-choice']);
        question.toggleFormat('free-response', false);
        expect(map(question.formats, 'value')).toEqual(['multiple-choice']);
        question.toggleFormat('free-response', true);
        expect(map(question.formats, 'value')).toEqual(['multiple-choice', 'free-response']);
        question.toggleFormat('free-response', true);
        expect(map(question.formats, 'value')).toEqual(['multiple-choice', 'free-response']);
        question.toggleFormat('free-response', true); // doesn't add twice
        expect(map(question.formats, 'value')).toEqual(['multiple-choice', 'free-response']);
    });

    it('can move answers up/down', () => {
        const second = question.answers[1];
        question.moveAnswer(second, -1);
        expect(question.answers[0]).toBe(second);
        expect(() =>
            question.moveAnswer(second, -1)
        ).toThrow();

        const nextToLast = question.answers[question.answers.length - 2];
        question.moveAnswer(nextToLast, 1);
        expect(question.answers[question.answers.length - 1]).toBe(nextToLast);
        expect(() =>
            question.moveAnswer(nextToLast, 1)
        ).toThrow();
    });

    it('can serialize formats', () => {
        expect(serialize(question)).toMatchObject({
            formats: [ 'free-response', 'multiple-choice' ],
        });
    });

    it('validates', () => {
        question.formats = ['free-response'] as any;
        expect(question.validity.valid).toBe(true);
        question.formats = ['free-response', 'multiple-choice'] as any;
        question.answers = []
        expect(question.validity.valid).toBe(false);
        question.formats = ['free-response'] as any;
        expect(question.isOpenEnded).toBe(true);
        expect(question.validity.valid).toBe(true);
    });

    it('#collaborator_solution_html', () => {
        question.collaborator_solutions = [];
        expect(question.collaborator_solutions).toHaveLength(0);
        question.collaborator_solution_html = 'one, two, three';
        expect(question.collaborator_solutions).toHaveLength(1);
        expect(question.collaborator_solutions[0].content_html).toEqual('one, two, three');
        question.collaborator_solution_html = 'four';
        expect(question.collaborator_solutions[0].content_html).toEqual('four');
        question.collaborator_solution_html = '';
        expect(question.collaborator_solutions).toHaveLength(0);
    });
    it('uses answers for detecting multi-choice', () => {
        expect(question.isMultipleChoice).toBe(true);
        question.answers = [];
        expect(question.isMultipleChoice).toBe(false);
    });
});

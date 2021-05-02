import type Exercise from '../exercise'
import { uniq, map, remove, keys, inRange, find, reduce, isEmpty, without, every, omit } from 'lodash';
import {
    BaseModel, array, modelize, field, model, computed, action, getParentOf, hydrateModel, ID, NEW_ID,
} from '../../model';
import Answer from './answer';
import Solution from './solution';
import Format from './format';
import invariant from 'invariant';

export { Answer, Solution, Format }

export class ReviewQuestion {
    q: any

    constructor(question: ExerciseQuestion) {
        modelize(this)
        this.q = question;
    }
    get id() { return this.q.question_id; }
    @computed get answers() { return this.q.answer_stats; }
    @computed get formats() { return this.q.content.formats; }
    @computed get stem_html(){ return this.q.content.stem_html; }
    @computed get stimulus_html() { return this.q.content.stimulus_html; }
}


export default
class ExerciseQuestion extends BaseModel {

    static FORMAT_TYPES = {
        'open-ended': 'Open Ended',
        'multiple-choice': 'Multiple Choice',
        'true-false': 'True/False',
    };
    @field id: ID = NEW_ID
    @field question_id:ID = NEW_ID
    @field is_answer_order_important = false;
    @field stem_html = '';
    @field stimulus_html = '';
    @field title = '';
    @field hints: string[] = [];
    @model(Format) formats = array<Format>()
    @model(Answer) answers = array<Answer>()
    @model(Solution) collaborator_solutions = array<Solution>()

    get exercise() { return getParentOf<Exercise>(this) }

    constructor() {
        super()
        modelize(this)
    }

    @computed get allowedFormatTypes() {
        const type = this.exercise.tags.withType('type');
        if (type && type.value != 'practice') {
            return omit(ExerciseQuestion.FORMAT_TYPES, 'open-ended');
        }
        return ExerciseQuestion.FORMAT_TYPES;
    }

    @computed get isMultipleChoice() {
        return this.answers.length > 0;
    }

    @computed get isOpenEnded(): boolean {
        return Boolean(this.hasFormat('free-response') && !this.isMultipleChoice);
    }

    //WRM is OpenEnded and have no answers
    @computed get isWrittenResponse() {
        return this.isOpenEnded && this.answers.length === 0;
    }

    hasFormat(value: string) {
        if (value == 'open-ended') { return this.isOpenEnded; }
        return Boolean(find(this.formats, { value }));
    }

    @computed get index() {
        return this.exercise.questions.indexOf(this);
    }

    set uniqueFormatType(type: string) {
        if (this.formats.length) {
            this.formats[0].value;
        } else {
            this.formats.push(new Format(type));
        }
    }

    @computed get collaborator_solution_html() {
        return this.collaborator_solutions.length ?
            this.collaborator_solutions[0].content_html : '';
    }

    set collaborator_solution_html(val) {
        if (!val) {
            if (this.collaborator_solutions.length) {
                this.collaborator_solutions.clear()
            }
        } else {
            if (!this.collaborator_solutions.length) {
                this.collaborator_solutions.push(new Solution);
            }
            this.collaborator_solutions[0].content_html = val;
        }
    }

    @computed get formatId() {
        if (this.isMultipleChoice) {
            return 'MC';
        }
        return 'UNK';
    }

    @computed get requiresChoicesFormat() {
        return !this.hasFormat('free-response');
    }

    @computed get isTwoStep() {
        return Boolean(this.isMultipleChoice && this.hasFormat('free-response'));
    }

    @action setExclusiveFormat(name:string) {
        if (name == 'open-ended') { name = 'free-response'; }

        let formats = without(map(this.formats, 'value'), ...keys(ExerciseQuestion.FORMAT_TYPES));
        formats.push(name);
        if ('true-false' === name) {
            formats = without(formats, 'free-response');
            if (this.answers.length == 0) {
                this.answers.push(hydrateModel(Answer, { content_html: 'True' }));
                this.answers.push(hydrateModel(Answer, { content_html: 'False' }));
            }
        } else if ('multiple-choice' === name && !formats.includes('free-response')) {
            formats = formats.concat('free-response');
        } else if (name == 'free-response') {
            this.exercise.onQuestionFreeResponseSelected();
        }
        this.formats.replace( map(uniq(formats).sort(), nm => new Format(nm)) );
    }

    @action toggleFormat(value: string, selected: boolean) {
        invariant(!ExerciseQuestion.FORMAT_TYPES[value], 'cannot toggle exclusive formats');

        if (selected && !this.hasFormat(value)) {
            this.formats.push(new Format(value));
        } else if (!selected) {
            remove(this.formats, f => f.value == value)
        }
    }

    @computed get validity() {

        if (isEmpty(this.formats)) {
            return { valid: false, part: 'Question Format' };
        }
        if (isEmpty(this.stem_html)){
            return { valid: false, part: 'Question Stem' };
        }
        if(this.hasFormat('multiple-choice')) {
            if (isEmpty(this.answers)) { return { valid: false, part: 'Answer' }; }
            // make sure that one correct answer is selected
            if (every(this.answers, a => !a.isCorrect)) {return { valid: false, part: 'Correct Answer' }; }
        }
        return reduce(this.answers, (memo: { valid:boolean, part: string|undefined}, answer) => ({
            valid: memo.valid && answer.validity.valid,
            part: memo.part || answer.validity.part,
        }) , { valid: true, part: '' });
    }

    @action setCorrectAnswer(correctAnswer: Answer) {
        this.answers.forEach((a) => {
            a.correctness = ( (a === correctAnswer) ? '1.0' : '0.0' );
        });
    }

    @action moveAnswer(answer:Answer, offset:number) {
        const index = this.answers.indexOf(answer);
        invariant((index !== -1) && inRange(index+offset, 0, this.answers.length),
            'question not found or cannot move past bounds');
        this.answers.splice(index+offset, 0, this.answers.splice(index, 1)[0]);
    }

}

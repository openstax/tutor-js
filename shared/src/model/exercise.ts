import {
    BaseModel, field, computed, hydrate, action, observable, model, modelize, ID, NEW_ID,
} from '../model';
import { reduce, map, filter, inRange, merge, every, some, isNil } from 'lodash';
import invariant from 'invariant';
import TagsAssociation, { Tag } from './exercise/tags-association';
import Question from './exercise/question'
import Attachment from './exercise/attachment'
import Author from './exercise/author'
import DateTime from './date-time'

export { Attachment, Author, Question, Tag };

export default class Exercise extends BaseModel {

    static build(attrs: any) {
        return hydrate(Exercise, merge(attrs, {
            questions: [{
                formats: [],
            }],
        }));
    }
    @field id: ID = NEW_ID
    @field uuid = '';
    @field uid = '';
    @field nickname = '';
    @field versions: string[] = [];
    @field is_vocab = '';

    @field stimulus_html = '';

    @model(DateTime) published_at?: DateTime | Date
    @observable wrapper = '';

    @model(Attachment) attachments:Attachment[] = [];
    @model(Author) authors:Author[] = [];
    @model(Author) copyright_holders:Author[] = [];
    @model(Question) questions:Question[] = [];
    @model(TagsAssociation) tags = new TagsAssociation()

    constructor() {
        super()
        modelize(this, {})
    }

    @computed get pool_types() {
        return [];
    }

    @computed get number() {
        const n = this.uid.split('@')[0];
        return isNil(n) ? n : Number(n);
    }

    @computed get version() {
        const n = this.uid.split('@')[1];
        return isNil(n) ? n : Number(n);
    }

    @computed get cnxModuleUUIDs() {
        return map(filter(this.tags, { type: 'context-cnxmod' }), 'value');
    }

    @computed get validity() {
        return reduce(([] as any[]).concat(this.questions, this.tags.all), (memo, model) => ({
            valid: memo.valid && model.validity.valid,
            part: memo.part || model.validity.part,
        }), { valid: true, part: true });
    }

    @action toggleMultiPart() {
        if (this.isMultiPart) {
            this.questions = [this.questions[0]];
            this.stimulus_html = '';
        } else {
            this.questions.push({} as any);
        }
    }

    @action moveQuestion(question: Question, offset: number) {
        const index = this.questions.indexOf(question);
        invariant((index !== -1) && inRange(index + offset, 0, this.questions.length),
            'question not found or cannot move past bounds');
        this.questions.splice(index + offset, 0, this.questions.splice(index, 1)[0]);
    }

    @computed get hasStimulus() {
        return Boolean(this.stimulus_html);
    }

    @computed get isMultiPart() { return this.questions.length > 1; }
    @computed get isSinglePart() { return this.questions.length == 1; }
    @computed get isMultiChoice() { return every(this.questions, 'isMultipleChoice'); }
    @computed get isOpenEnded() { return some(this.questions, 'isOpenEnded'); }
    //WRM is OpenEnded and have no answers
    @computed get isWrittenResponse() { return every(this.questions, (q) => q.isOpenEnded && q.answers.length === 0); }

    @computed get isPublishable() {
        return Boolean(!this.isNew && this.validity.valid && !this.published_at);
    }

    @action onQuestionFreeResponseSelected() {
        this.tags.findOrAddWithType('type').value = 'practice';
    }

}

import {
    BaseModel, field, computed, action, observable, model, modelize, ID, NEW_ID, array,
} from '../model';
import { reduce, map, filter, inRange, every, some, isNil } from 'lodash';
import invariant from 'invariant';
import TagsAssociation, { Tag } from './exercise/tags-association';
import Question from './exercise/question'
import Attachment from './exercise/attachment'
import Author from './exercise/author'
import Time from './time'

export { Attachment, Author, Question, Tag };

export default class SharedExercise extends BaseModel {

    static idField = 'uid'
    id = NEW_ID;
    @field uuid = '';
    @field uid = '';
    @field nickname = '';
    @field versions: string[] = [];
    @field is_vocab = false;

    @field stimulus_html = '';

    @field published_at?: Time | Date
    @field stem_html = ''

    @model(Attachment) attachments = array<Attachment>()
    @model(Author) authors = array<Author>()
    @model(Author) copyright_holders = array<Author>()
    @model(Question) questions = array<Question>()
    @model(TagsAssociation) tags = new TagsAssociation()

    @observable wrapper = '';

    constructor() {
        super()
        modelize(this)
        // , {
        //     uuid: field,
        //     uid: field,
        //     nickname: field,
        //     versions: field,
        //     is_vocab: field,
        //     stimulus_html: field,
        //     published_at: model(Time),
        //     attachments: model(Attachment),
        //     authors: model(Author),
        //     copyright_holders: model(Author),
        //     questions: model(Question),
        //     tags: model(TagsAssociation),
        //     wrapper: observable,
        //     pool_types: computed,
        //     cnxModuleUUIDs: computed,
        //     validity: computed,
        //     toggleMultiPart: action,
        //     onQuestionFreeResponseSelected: action,
        //     moveQuestion: action,
        // })
    }

    get pool_types() {
        return [];
    }

    get number() {
        const n = this.uid.split('@')[0];
        return isNil(n) ? n : Number(n);
    }
    set number(n:ID) { this.uid = `${n}@${this.version}` }

    get version() {
        const n = this.uid.split('@')[1];
        return isNil(n) ? n : Number(n);
    }
    set version(v:ID) { this.uid = `${this.number}@${v}` }

    get cnxModuleUUIDs() {
        return map(filter(this.tags, { type: 'context-cnxmod' }), 'value');
    }

    get validity() {
        return reduce(([] as any[]).concat(this.questions, this.tags.all), (memo, model) => ({
            valid: memo.valid && model.validity.valid,
            part: memo.part || model.validity.part,
        }), { valid: true, part: true });
    }

    @action toggleMultiPart() {
        if (this.isMultiPart) {
            this.questions.replace([this.questions[0]])
            this.stimulus_html = '';
        } else {
            this.questions.push({} as any);
        }
    }

    moveQuestion(question: Question, offset: number) {
        const index = this.questions.indexOf(question);
        invariant((index !== -1) && inRange(index + offset, 0, this.questions.length),
            'question not found or cannot move past bounds');
        this.questions.splice(index + offset, 0, this.questions.splice(index, 1)[0]);
    }

    @computed get hasStimulus() {
        return Boolean(this.stimulus_html);
    }

    get isMultiPart() { return this.questions.length > 1; }
    isSinglePart() { return this.questions.length == 1; }
    get isMultiChoice() { return every(this.questions, 'isMultipleChoice'); }
    get isOpenEnded() { return some(this.questions, 'isOpenEnded'); }
    //WRM is OpenEnded and have no answers
    get isWrittenResponse() { return every(this.questions, (q) => q.isOpenEnded && q.answers.length === 0); }

    get isPublishable() {
        return Boolean(!this.isNew && this.validity.valid && !this.published_at);
    }

    @action onQuestionFreeResponseSelected() {
        this.tags.findOrAddWithType('type').value = 'practice';
    }

}

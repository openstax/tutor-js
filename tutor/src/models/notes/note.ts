import { isString, get, pick, extend } from 'lodash';
import ChapterSection from '../chapter-section';
import { SerializedHighlight } from '@openstax/highlighter';
import { intercept, runInAction, toJS } from 'mobx'
import Api from '../../api'
import {
    BaseModel,
    field,
    computed,
    action,
    model,
    modelize,
    NEW_ID,
    ID,
} from 'shared/model';
import DateTime from 'shared/model/date-time';
import type { PageNotes } from '../notes'

export default class Note extends BaseModel {

    static MAX_TEXT_LEN = 500

    @field id = NEW_ID;
    @field annotation = '';
    @field anchor = '';
    @field course_id: ID = NEW_ID;
    @field contents: any = {};
    @field page_id: ID = NEW_ID;
    @model(ChapterSection) chapter_section?: ChapterSection;
    @model(DateTime) created_at = DateTime.unknown;
    @model(DateTime) updated_at = DateTime.unknown;

    page!: PageNotes

    constructor() {
        super();
        modelize(this);
        intercept(this, 'annotation', this.validateTextLength);
    }

    @computed get highlight() {
        return new SerializedHighlight(
            extend(toJS(this.contents), pick(this, 'id')),
        );
    }

    get course() {
        return this.page?.notes.course;
    }

    get pageTopPosition():number {
        return get(this, 'contents.rect.top', 0);
    }

    validateTextLength(change: any) {
        if (isString(change.newValue) && change.newValue.length > Note.MAX_TEXT_LEN) {
            change.newValue = change.newValue.slice(0, Note.MAX_TEXT_LEN);
        }
        return change;
    }

    @computed get content() {
        return this.contents.content;
    }

    async save() {
        const update = await this.api.request(
            this.isNew ? Api.createNote({ pageUUID: this.page.uuid }) : Api.saveNote({ noteId: this.id }),
            { course_id: this.course.id, ...pick(this, 'id', 'anchor', 'contents', 'annotation') },
        )
        this.onUpdated(update)
    }

    async destroy() {
        await this.api.request(Api.deleteNote({ noteId: this.id }))
        runInAction(() => this.page.onNoteDeleted(this))
    }

    @action onUpdated(data: any) {
        this.update(data);
        this.page.set(this.id, this);
    }

}

import { isString, get, pick, extend } from 'lodash';
import { ChapterSection } from '../../models'
import { SerializedHighlight } from '@openstax/highlighter';
import { intercept, runInAction, toJS } from 'mobx'
import urlFor from '../../api'
import { BaseModel, field, computed, action, model, modelize, NEW_ID, ID, getParentOf } from 'shared/model';
import Time from 'shared/model/time';
import type { PageNotes } from '../notes'

export class Note extends BaseModel {

    static MAX_TEXT_LEN = 500

    @field id = NEW_ID;
    @field annotation = '';
    @field anchor = '';
    @field course_id: ID = NEW_ID;
    @field contents: any = {};
    @field page_id: ID = NEW_ID;
    @model(ChapterSection) chapter_section?: ChapterSection;
    @model(Time) created_at = Time.unknown;
    @model(Time) updated_at = Time.unknown;

    get page() { return getParentOf<PageNotes>(this) }

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
            this.isNew ? urlFor('createNote', { pageUUID: this.page.uuid }) : urlFor('saveNote', { noteId: this.id }),
            { data: { course_id: this.course.id, ...pick(this, 'id', 'anchor', 'contents', 'annotation') } },
        )
        this.onUpdated(update)
    }

    async destroy() {
        await this.api.request(urlFor('deleteNote', { noteId: this.id }))
        runInAction(() => this.page.onNoteDeleted(this))
    }

    @action onUpdated(data: any) {
        this.update(data);
        this.page.set(this.id, this);
    }

}

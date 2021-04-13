import type Course from './course'
import { sortBy, values } from 'lodash';
import {
    BaseModel, model, action, observable, computed, field, modelize, ID, array,
} from 'shared/model'
import ChapterSection from './chapter-section';
import Map, { getParentOf, hydrateModel } from 'shared/model/map';
import Note from './notes/note';
import urlFor from '../api'
import { HighlightedPageObj } from './types'
import Page from './reference-book/node'

class HighlightedSection extends BaseModel {
    @field uuid: string = ''
    @observable title = ''
    @model(ChapterSection) chapter_section!: ChapterSection

    constructor() {
        super();
        modelize(this);
    }
}

class Notes extends BaseModel {
    uuid: string = ''
    pages = observable.map<ID, PageNotes>();


    @model(HighlightedSection) summary = array((a: HighlightedSection[]) => ({
        sorted() { return sortBy(a, 'chapter_section.asNumber'); },
        forPage(page: Page) {
            return a.find(s => s.uuid == page.uuid);
        },
    }))

    constructor() {
        super();
        modelize(this);
    }

    get course() { return getParentOf<Course>(this) }

    hasNotesForPage(page: Page) {
        return Boolean(this.pages.get(page.uuid));
    }

    @computed get isAnyPagePending() {
        return Boolean(Array.from(this.pages.values()).find(pg => pg.api.isPending));
    }

    forPage(page: Page) {
        return this.pages.get(page.uuid);
    }

    @action ensurePageExists(page: Page): PageNotes {
        if (!this.hasNotesForPage(page)) {
            const notes = new PageNotes({ page, notes: this });
            this.pages.set(page.uuid, notes);
            return notes
        }
        return this.forPage(page) as PageNotes;
    }

    async fetchHighlightedPages() {
        const data = await this.api.request<{ pages: HighlightedPageObj[] }>(
            urlFor('fetchHighlightedPages', { bookUUID: this.course.ecosystem_book_uuid })
        )
        this.onHighlightedPagesLoaded(data.pages)
    }

    onHighlightedPagesLoaded(pages: HighlightedPageObj[]) {
        const summary:Record<string, HighlightedPageObj> = {};
        pages.forEach(pg => {
            const key = pg.uuid;
            if (!summary[key]) { summary[key] = pg; }
        });
        this.summary = values(summary) as any;
    }

    @action onNoteDeleted(page: PageNotes) {
        if (page.isEmpty) {
            const pg = this.summary.find(s => s.uuid == page.uuid)
            if (pg) {
                this.summary.remove(pg);
            }
        }
    }

}

class PageNotes extends Map<ID, Note> {
    keyType = Number

    static Model = Note
    notes: Notes
    page: Page
    constructor({ page, notes }: { page: Page, notes: Notes }) {
        super();
        modelize(this);
        this.notes = notes;
        this.page = page;
        this.fetch();
    }

    @computed get uuid() {
        return this.page.uuid;
    }

    @computed get byPagePosition() {
        return sortBy(this.array, 'pageTopPosition');
    }

    async fetch() {
        const notes = await this.api.request(urlFor('fetchPageNotes', { pageUUID: this.page.uuid }));
        this.onLoaded(notes)
    }

    @action onLoaded(notes: any) {
        this.mergeModelData(notes);
    }

    @action onNoteDeleted(note: Note) {
        this.delete(note.id);
        this.notes.onNoteDeleted(this);
    }

    async create({ anchor, page, ...contents }: { anchor: string, page: Page, contents: any }) {
        const note = hydrateModel(Note, {
            anchor,
            chapter_section: page.chapter_section,
            page_id: page.id,
            contents,
        }, this)
        await note.save();
        if (!this.notes.summary.forPage(page)) {
            this.notes.summary.push(page);
        }
        return note;
    }

}


export { Note, Notes, PageNotes };

import { sortBy, values } from 'lodash';
import { BaseModel, model, action, observable, computed, identifier, modelize } from 'shared/model';
import ChapterSection from './chapter-section';
import Map from 'shared/model/map';
import Note from './notes/note';

class PageNotes extends Map {
  keyType = Number

  static Model = Note

  constructor({ page, notes }) {
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

  fetch() {
      return { pageUuid: this.page.uuid };
  }

  @action onLoaded({ data: notes }) {
      this.mergeModelData(notes);
  }

  @action onNoteDeleted(note) {
      this.delete(note.id);
      this.notes.onNoteDeleted(note, this);
  }

  async create({ anchor, page, ...attrs }) {
      const note = new Note({
          anchor,
          chapter_section: page.chapter_section,
          page_id: page.id,
          contents: attrs,
      }, this);
      await note.save();
      if (!this.notes.summary.forPage(page)) {
          this.notes.summary.push(page);
      }
      return note;
  }

}

class HighlightedSection extends BaseModel {
    @identifier uuid;
    @observable title;
    @model(ChapterSection) chapter_section;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }
}

class Notes extends BaseModel {

  pages = observable.map();

  @model(HighlightedSection) summary; /* extend: {
      sorted() { return sortBy(this, 'chapter_section.asNumber'); },
      forPage(page) {
          return this.find(s => s.uuid == page.uuid);
      },
  } */


  constructor({ course }) {
      super();
      modelize(this);
      this.course = course;
      this.fetchHighlightedPages();
  }

  hasNotesForPage(page) {
      return Boolean(this.pages.get(page.uuid));
  }

  @computed get isAnyPagePending() {
      return Boolean(Array.from(this.pages.values()).find(pg => pg.api.isPending));
  }

  @action forPage(page) {
      return this.pages.get(page.uuid);
  }

  @action ensurePageExists(page) {
      if (!this.hasNotesForPage(page)) {
          const notes = new PageNotes({ page, notes: this });
          this.pages.set(page.uuid, notes);
      }
      return this.forPage(page);
  }

  fetchHighlightedPages() {
      return { bookUuid: this.course.ecosystem_book_uuid };
  }

  onHighlightedPagesLoaded({ data: { pages } }) {
      const summary = {};
      pages.forEach(pg => {
          const key = pg.uuid;
          if (!summary[key]) { summary[key] = pg; }
      });
      this.summary = values(summary);
  }

  @action onNoteDeleted(note, page) {
      if (page.isEmpty) {
          this.summary.remove(this.summary.find(s => s.uuid == page.uuid));
      }
  }

}

export { Note, Notes, PageNotes };

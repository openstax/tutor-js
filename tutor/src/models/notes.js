import { action, observable, computed } from 'mobx';
import { sortBy, values } from 'lodash';
import {
  BaseModel, identifiedBy, hasMany, session, identifier,
} from 'shared/model';
import ChapterSection from './chapter-section';
import Map from 'shared/model/map';
import { chapterSectionToNumber } from '../helpers/content';
import Note from './notes/note';

class PageNotes extends Map {
  keyType = Number

  static Model = Note

  constructor({ notes, chapterSection }) {
    super();
    this.notes = notes;
    this.chapterSection = chapterSection;
    this.fetch();
  }

  @computed get notesByPagePosition() {
    return sortBy(this.array, 'pageTopPosition');
  }

  fetch() {
    return {
      chapterSection: this.chapterSection,
      courseId: this.notes.course.id,
    };
  }

  @action onLoaded({ data: notes }) {
    this.mergeModelData(notes);
  }

  @action onNoteDeleted(note) {
    this.delete(note.id);
    this.notes.onNoteDeleted(note, this);
  }

  create({ anchor, page, ...attrs }) {
    const note = new Note({
      anchor,
      chapter_section: page.chapter_section,
      contents: attrs,
    }, this);

    return note.save().then(() => {
      if (!this.notes.sections.forChapterSection(page.chapter_section.key)) {
        this.notes.sections.push(page);
      }
      return note;
    });
  }

}

@identifiedBy('notes/highlighted-section')
class HighlightedSection extends BaseModel {

  @identifier id;
  @session title;
  @session({ model: ChapterSection }) chapter_section;

}

@identifiedBy('notes')
class Notes extends BaseModel {

  pages = observable.map();

  @hasMany({ model: HighlightedSection, extend: {
    sorted() { return sortBy(this, 'chapter_section.asNumber'); },
    forChapterSection(cs) {
      return this.find(s => s.chapter_section.matches(cs));
    },
  } }) sections = [];

  constructor({ course }) {
    super();
    this.course = course;
    this.fetchHighlightedSections();
  }

  @action forChapterSection(chapterSection) {
    chapterSection = String(chapterSection);
    let pages = this.pages.get(chapterSection);
    if (!pages) {
      pages = new PageNotes({ chapterSection, notes: this });
    }
    this.pages.set(chapterSection, pages);
    return pages;
  }

  fetchHighlightedSections() {
    return { courseId: this.course.id };
  }

  onHighlightedSectionsLoaded({ data: { pages } }) {
    const sections = {};
    pages.forEach(pg => {
      const key = pg.chapter_section.join('.');
      if (!sections[key]) { sections[key] = pg; }
    });
    this.sections = values(sections);
  }

  @action onNoteDeleted(note, page) {
    if (page.isEmpty) {
      const section = this.sections.forChapterSection(note.chapter_section);
      if (section) {
        this.sections.remove(section);
      }
    }
  }

  find(chapterSection) {
    chapterSection = String(chapterSection);
    const section = this.sections.forChapterSection(chapterSection);
    if (section) {
      return {
        section,
        notes: this.forChapterSection(chapterSection),
      };
    }
    return null;
  }
}

export { Note, Notes, PageNotes };

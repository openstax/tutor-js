import { action, observable } from 'mobx';
import { includes } from 'lodash';
import {
  BaseModel, identifiedBy, hasMany, session, identifier,
} from 'shared/model';
import ChapterSection from './chapter-section';
import Map from 'shared/model/map';
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

  fetch() {
    return {
      chapterSection: this.chapterSection,
      courseId: this.notes.course.id,
    };
  }

  @action onLoaded({ data: notes }) {
    this.mergeModelData(notes);
  }

  create({ anchor, page, ...attrs }) {
    const note = new Note({
      anchor,
      chapter_section: page.chapter_section,
      contents: attrs,
    }, this);

    return note.save().then(() => {
      if (!includes(this.notes.sections, page.chapter_section.key)) {
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

  @hasMany({ model: HighlightedSection }) sections;

  constructor({ course }) {
    super();
    this.course = course;
    this.fetchHighlightedSections();
  }

  @action forChapterSection(chapterSection) {
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
    this.sections = pages;
  }

  find(chapterSection) {
    const section = this.sections.find(s =>
      s.chapter_section.matches(chapterSection)
    );
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

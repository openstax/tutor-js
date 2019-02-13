import { action, computed, observable } from 'mobx';
import { sortBy, groupBy, mapValues } from 'lodash';
import Map from 'shared/model/map';
import Note from './notes/note';
import FeatureFlags from './feature_flags';

export { Note };

export
class PageNotes extends Map {
  keyType = Number

  static Model = Note

  constructor({ notes, chapterSection }) {
    super();
    this.notes = notes;
    this.chapterSection = chapterSection;
    if (FeatureFlags.is_highlighting_allowed) {
      this.fetch();
    }
  }

  @computed get notesBySection() {
    return mapValues(
      groupBy(this.array, 'chapter_section.asString'),
      (notes) => sortBy(
        notes,
        ['contents.selection.rect.top', 'contents.selection.start']
      )
    );
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

  create({ anchor, chapter_section, ...attrs }) {
    const note = new Note({
      anchor,
      chapter_section,
      contents: attrs,
    }, this);
    return note.save().then(() => note);
  }

}

export default
class Notes {

  pages = observable.map();

  constructor({ course }) {
    this.course = course;
  }

  forChapterSection(chapter, section) {
    const chapterSection = `${chapter}.${section}`;
    let pages = this.pages.get(chapterSection);
    if (!pages) {
      pages = new PageNotes({ chapterSection, notes: this });
    }
    this.pages.set(chapterSection, pages);
    return pages;
  }

}

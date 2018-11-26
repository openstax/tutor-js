import { action, computed } from 'mobx';
import { get, sortBy, groupBy, mapValues, isArray } from 'lodash';
import Map from 'shared/model/map';
import lazyGetter from 'shared/helpers/lazy-getter';
import { chapterSectionToNumber } from '../helpers/content';
import Hypothesis from './notes/hypothesis';
import Note from './notes/note';
import FeatureFlags from './feature_flags';
import NotesUX from './notes/ux';

export default class Notes extends Map {

  keyType = String

  constructor() {
    super();
    if (FeatureFlags.is_highlighting_allowed) {
      this.api.requestsInProgress.set('fetch', true);
      Hypothesis.fetchUserInfo().then(this.updateNotes);
    }
  }

  @lazyGetter ux = new NotesUX();

  @computed get byCourseAndPage() {
    return mapValues(
      groupBy(this.array, 'courseId'),
      (cpgs) => mapValues(
        groupBy(
          sortBy(cpgs, c=>chapterSectionToNumber(c.chapter_section)),
          a => a.chapter_section.join('.')
        ),
        (notes) => sortBy(notes, ['rect.top', 'selection.rect.top', 'selection.start'])
      )
    );
  }

  @action.bound updateNotes(notes) {
    this.api.requestsInProgress.delete('fetch');
    this.api.requestCounts.read += 1;
    if (isArray(notes)) {
      notes.forEach(document => {
        const note = this.get(document.id);
        const data = document.target[0].selector[0];
        data.id = document.id;
        data.text = document.text;
        data.listing = this;
        note ? note.update(data) : this.set(data.id, new Note(data));
      });
    }
  }

  update(note) {
    this.api.requestsInProgress.set('update', true);
    return Hypothesis.request({
      method: 'PATCH',
      service: `annotations/${note.id}`,
      data: { text: note.text },
    }).then(() => {
      this.api.requestsInProgress.delete('update');
      this.api.requestCounts.update += 1;
      return note;
    });
  }

  create(options) {
    this.api.requestsInProgress.set('create', true);
    return Hypothesis.create(
      options.documentId,
      options.selection, '', options
    ).then(document => {
      const data = get(document, 'target.0.selector.0');
      if (!data || !document.id) {
        throw new Error('server returned malformed response from create');
      }
      this.api.requestsInProgress.delete('create');
      this.api.requestCounts.create += 1;

      data.id = document.id;
      data.text = document.text;
      data.listing = this;
      const note = new Note(data);
      this.set(note.id, note);
      return note;
    });
  }

  destroy(note) {
    this.api.requestsInProgress.set('delete', true);
    return Hypothesis.request({
      method: 'DELETE',
      service: `annotations/${note.id}`,
    }).then(() => {
      note.isDeleted = true;
      this.api.requestsInProgress.delete('delete');
      this.api.requestCounts.delete += 1;
      this.delete(note.id);
      return note;
    });
  }

}

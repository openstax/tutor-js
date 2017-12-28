import { readonly } from 'core-decorators';
import { last } from 'lodash';
import { action, observable, computed } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, session, hasMany,
} from './base';
import ChapterSection from './chapter-section';
import ReferenceBookPage from './reference-book/page';

@identifiedBy('reference-book/part')
class ReferenceBookPart extends BaseModel {
  @identifier id;
  @field title;
  @field type;
  @field({ model: ChapterSection }) chapter_section;
  @session book;
  @hasMany({ model: ReferenceBookPage, inverseOf: 'part' }) children;
  @readonly depth = 1;
}

function mapPages(section, map) {
  if (section.isPage) {
    const lastPage = last(map.values());
    if (lastPage) { lastPage.linkNextPage(section); }
    map.set(section.chapter_section.asString, section);
  }
  (section.children || []).forEach(child => {
    mapPages(child, map);
  });
  return map;
}

@identifiedBy('reference-book')
export default class ReferenceBook extends BaseModel {

  @belongsTo({ model: 'course' }) course;

  @identifier id;
  @field archive_url;
  @field webview_url;
  @field({ model: ChapterSection }) chapter_section
  @readonly pages = observable.map();
  @hasMany({ model: ReferenceBookPart, inverseOf: 'book' }) children;
  @field cnx_id;
  @field short_id;
  @field title;
  @field type;
  @field uuid;

  fetch() {
    return { id: this.course.ecosystem_id };
  }

  @action onApiRequestComplete({ data }) {
    this.update(data[0]);
    mapPages(this, this.pages);
  }

}

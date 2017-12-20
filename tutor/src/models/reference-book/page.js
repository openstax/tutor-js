import { readonly } from 'core-decorators';
import { merge, extend, defer, last, get } from 'lodash';
import htmlparser from 'htmlparser2';
import { action, observable, when,computed } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, session, hasMany,
} from '../base';
import ChapterSection from '../chapter-section';
import {StepTitleActions} from '../../flux/step-title';

const isLearningObjectives = (element) => {
  console.log(element);
  return (get(element, 'attribs.class') &&
    element.attribs.class.search(/learning-objectives/) > -1) ||
    'abstract' === element.attribs['data-type'];
}

@identifiedBy('reference-book/page')
export default class ReferenceBookPage extends BaseModel {
  @identifier id;
  @field title;
  @field type;
  @field cnx_id;
  @field short_id;
  @field uuid;
  @field({ model: ChapterSection }) chapter_section;
  @session part;
  @readonly depth = 2;
  @field content_html = '';
  @readonly isPage = true;

  @observable nextPage;
  @observable prevPage;

  linkNextPage(pg) {
    this.nextPage = pg;
    pg.prevPage = this;
    return pg;
  }

  ensureLoaded() {
    if (!this.hasBeenFetched) { this.fetchContent(); }
  }

  @computed get contents() {
    // FIXME the BE sends HTML with head and body
    // Fixing it with nasty regex for now
    return this.content_html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '');
  }

  // @computed get completeTitle() {
  //   return `${this.chapter_section.format()} ${this.title}`;
  // }

  fetchContent() {}

  @action onContentFetchComplete({ data }) {
    this.update(data);
    StepTitleActions.parseMetaOnly(this.cnx_id, this.content_html);
  }

}

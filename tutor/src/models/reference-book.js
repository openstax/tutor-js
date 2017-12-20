import { readonly } from 'core-decorators';
import { merge, extend, defer, last } from 'lodash';
import { action, observable, when,computed } from 'mobx';
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

@identifiedBy('reference-book')
export default class ReferenceBook extends BaseModel {

  @belongsTo({ model: 'course' }) course;

  @identifier id;
  @field archive_url;
  @field webview_url;
  @field({ model: ChapterSection }) chapter_section

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
  }

}
  //
  //   /*
  //    * decaffeinate suggestions:
  //    * DS101: Remove unnecessary use of Array.from
  //    * DS102: Remove unnecessary code created because of implicit returns
  //    * DS103: Rewrite code to no longer use __guard__
  //    * DS207: Consider shorter variations of null checks
  //    * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
  //    */
  //   import { CrudConfig, makeSimpleStore, extendConfig } from './helpers';
  //   import _ from 'underscore';
  //
  //   var findAllPages = function(section) {
  //     const pages = [];
  //     if (section.cnx_id && ('page' === section.type)) {
  //       pages.push(section);
  //     }
  //     if (section.children) {
  //       for (let child of Array.from(section.children)) {
  //         for (let page of Array.from(findAllPages(child))) {
  //           pages.push(page);
  //         }
  //       }
  //     }
  //     return pages;
  //   };
  //
  //   var findChapterSection = function(section, chapter_section) {
  //     if (_.isEqual(section.chapter_section, chapter_section)) {
  //       return section;
  //     }
  //     if (section.children) {
  //       for (let child of Array.from(section.children)) {
  //         var found;
  //         if (found = findChapterSection(child, chapter_section)) { return found; }
  //       }
  //     }
  //     return null;
  //   };
  //
  //   let defaultExport = {};
  //   const ReferenceBookConfig = {
  //
  //     defaultExport: {
  //       getToc(ecosystemId) {
  //         return __guard__(this._get(ecosystemId), x => x['0']);
  //       },
  //
  //       getFirstSection(ecosystemId) {
  //         const toc = __guard__(this._get(ecosystemId), x => x['0']);
  //         if ((toc != null ? toc.children : undefined) == null) { return null; }
  //
  //         const { children } = toc;
  //         return __guard__(_.chain(children)
  //           .sortBy(child => child.chapter_section)
  //           .first()
  //           .value(), x1 => x1.chapter_section);
  //       },
  //
  //       // Takes a ecosystemId and a chapter_section specifier
  //       // which is a string joined with dots i.e. "1.2.3"
  //       getChapterSectionPage({ ecosystemId, section }) {
  //         const parts = _.isArray(section) ? section :
  //           _.map(section.split('.'), part => parseInt(part, 10));
  //         const toc = __guard__(this._get(ecosystemId), x => x['0']);
  //         section = findChapterSection(toc, parts);
  //         if (section) {
  //           if (section.type === 'part') {
  //             return _.first(section != null ? section.children : undefined);
  //           } else {
  //             return section;
  //           }
  //         } else {
  //           return null;
  //         }
  //       },
  //
  //       getPageTitle({ ecosystemId, section }) {
  //         if (section == null) { return null; }
  //         if (!_.isArray(section)) { section = section.split('.'); }
  //         const toc = __guard__(this._get(ecosystemId), x => x['0']);
  //         section = _.map(section, n => parseInt(n));
  //         return __guard__(findChapterSection(toc, section), x1 => x1.title);
  //       },
  //
  //       getPages(ecosystemId) {
  //         const toc = __guard__(this._get(ecosystemId), x => x['0']);
  //         if (!toc) { return []; }
  //         return findAllPages(toc);
  //       },
  //
  //       // We might consider caching this
  //       getPageInfo({ ecosystemId, cnxId }) {
  //         const toc = __guard__(this._get(ecosystemId), x => x['0']);
  //         if (!toc) { return {}; }
  //         const pages = findAllPages(toc);
  //         let lastPage = null;
  //         for (let index = 0; index < pages.length; index++) {
  //           const page = pages[index];
  //           if (-1 !== page.cnx_id.indexOf(cnxId)) {
  //             return _.extend(_.clone(page), { prev: lastPage, next: pages[index + 1] });
  //           }
  //           lastPage = page;
  //         }
  //       },
  //     },
  //   };
  //
  //   extendConfig(ReferenceBookConfig, new CrudConfig());
  // const { actions, store } = makeSimpleStore(ReferenceBookConfig);
  // defaultExport = { ReferenceBookActions: actions, ReferenceBookStore: store };
  // export default defaultExport;
  //
  // function __guard__(value, transform) {
  //   return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
  // }

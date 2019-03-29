import _ from 'underscore';
import { CrudConfig, makeSimpleStore, extendConfig } from './helpers';
import PeriodHelper from '../helpers/period';

const DEFAULT_COURSE_TIMEZONE = 'US/Central';

const DashboardConfig = {
  exports: {
    isBlank(courseId) {
      return !_.any(__guard__(__guard__(this._get(courseId), x1 => x1.course), x => x.periods));
    },

    getPeriods(courseId) { return PeriodHelper.sort(__guard__(__guard__(this._get(courseId), x1 => x1.course), x => x.periods)); },

    chaptersForDisplay(courseId, periodId) {
      const period = _.findWhere( __guard__(__guard__(this._get(courseId), x1 => x1.course), x => x.periods), { id: periodId });
      if (!period) { return []; }
      for (let chapter of period.chapters) {
        for (let page of chapter.pages) {
          const total = page.completed + page.in_progress + page.not_started;
          page.completed_percentage = page.completed / total;
        }
        chapter.valid_sections = _.sortBy(chapter.pages, page => page.chapter_section[1] || 0).reverse();
        chapter;
      }

      return _.select(period.chapters.reverse(), chapter => chapter.valid_sections != null ? chapter.valid_sections.length : undefined);
    },
  },
};


extendConfig(DashboardConfig, new CrudConfig());
const { actions, store } = makeSimpleStore(DashboardConfig);
export { actions as CCDashboardActions, store as CCDashboardStore };

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}

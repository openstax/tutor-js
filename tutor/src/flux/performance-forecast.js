import { CrudConfig, makeSimpleStore, extendConfig } from './helpers';
import { find, orderBy, sortBy, take, filter, map, flatten, uniq } from 'lodash';

// Unlike other stores defined in TutorJS, this contains three separate stores that have very similar capabilities.
// They're combined in one file because they're pretty lightweight and share helper methods.
// If and when any of them grow larger they could be broken out into separate files that are required and re-exported here

// Common helper method to find all the sections contained in a learning guide response
const findAllSections = function(section) {
  if (!section) { return []; }
  const sections = [];
  if (section.chapter_section != null && section.chapter_section.length > 1) {
    sections.push(section);
  }
  if (section.children) {
    for (let child of section.children) {
      for (section of findAllSections(child)) {
        sections.push(section);
      }
    }
  }
  return sections;
};


// learning guide data for a teacher.
// It's loaded by the teacher and contains consolidated data for all the students in the course
const Teacher = makeSimpleStore(extendConfig({
  exports: {
    getChaptersForPeriod(courseId, periodId) {
      const period = find(this._get(courseId), { period_id: periodId });
      return (period != null ? period.children : undefined) || [];
    },

    getSectionsForPeriod(courseId, periodId) {
      const period = find(this._get(courseId), { period_id: periodId });
      return findAllSections(period);
    },
  },
}, new CrudConfig)
);


// learning guide data for a student.
const Student = makeSimpleStore(extendConfig({
  exports: {
    getSortedSections(courseId) {
      const sections = findAllSections(this._get(courseId));
      return sortBy(sections, s => s.clue.most_likely);
    },

    getAllSections(courseId) {
      return findAllSections(this._get(courseId));
    },
  },
}, new CrudConfig)
);


// learning guide data for a teacher's student.
// It's loaded by the teacher and contains data for an individual student in a course they're teaching
// Unlike other stores, it needs two ids; courseId & roleId.
// roleId is passed as an object so it can be set as the options property in the LoadableItem component
const TeacherStudent = makeSimpleStore(extendConfig({
  // modify the value that will be stored to be a object with role id's for keys
  loaded(obj, id, { roleId }) {
    if (!this._asyncStatus[id]) { this._asyncStatus[id] = {}; }
    this._asyncStatus[id][roleId] = 'LOADED';
    if (!this._local[id]) { this._local[id] = {}; }
    this._local[id][roleId] = obj;
    return this.emitChange();
  },

  load(id, { roleId }) {
    if (!this._asyncStatus[id]) { this._asyncStatus[id] = {}; }

    if (!this._reload[id]) { this._reload[id] = {}; }
    this._reload[id][roleId] = false;

    this._asyncStatus[id][roleId] = 'LOADING';
    return this.emitChange();
  },

  exports: {
    getSortedSections(courseId, roleId, property = 'current_level') {
      const sections = findAllSections(this._get(courseId));
      return sortBy(sections, property);
    },

    get(courseId, { roleId }) {
      return (this._local[courseId] != null ? this._local[courseId][roleId] : undefined);
    },

    getChapters(courseId, { roleId }) {
      const guide = this._local[courseId] != null ? this._local[courseId][roleId] : undefined;
      return (guide != null ? guide.children : undefined) || [];
    },

    getAllSections(courseId, { roleId }) {
      return findAllSections((this._local[courseId] != null ? this._local[courseId][roleId] : undefined) || {});
    },

    reload(id, { roleId }) {
      return (this._reload[id] != null ? this._reload[id][roleId] : undefined);
    },

    isLoading(id, { roleId }) {
      return (this._asyncStatus[id] != null ? this._asyncStatus[id][roleId] : undefined) === 'LOADING';
    },

    isLoaded(id, { roleId }) {
      return (this._asyncStatus[id] != null ? this._asyncStatus[id][roleId] : undefined) === 'LOADED';
    },
  },
}, new CrudConfig)
);

const Helpers = {
  recentSections(sections, limit = 4) {
    return take(orderBy(filter(sections, s => s.last_worked_at), 'last_worked_at', 'desc'), limit);
  },

  canDisplayForecast(clue) { return clue.is_real; },

  filterForecastedSections(sections) {
    return filter(sections, s => Helpers.canDisplayForecast(s.clue));
  },

  weakestSections(sections, displayCount = 4) {
    const validSections = this.filterForecastedSections(sections);
    // weakestSections are only selected if there's at least two sections with forecasts
    if (validSections.length < 2) { return []; }
    // Select at least one, but no more than displayCount(4)
    displayCount = Math.min(
      Math.max(1, Math.floor(validSections.length / 2))
      , displayCount);

    return take(sortBy(validSections, s => s.clue.most_likely), displayCount);
  },

  canPracticeWeakest({ sections, displayCount, minimumSectionCount }) {
    if (!displayCount) { displayCount = 4; }
    if (!minimumSectionCount) { minimumSectionCount = 1; }
    return this.weakestSections(sections, displayCount).length >= minimumSectionCount;
  },

  canDisplayWeakest({ sections }) {
    return this.filterForecastedSections(sections).length > 1;
  },

  pagesForSections(sections) {
    return uniq(flatten(map(sections, 'page_ids')));
  },
};


export { Student, Teacher, TeacherStudent, Helpers };

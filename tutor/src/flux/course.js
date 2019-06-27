// Generated by CoffeeScript 1.11.1
(function() {
  let CourseConfig, CourseInformation, CrudConfig, DEFAULT_TIME_ZONE, PeriodHelper, STATES, TaskActions, TaskStore, actions, capitalize, extend, extendConfig, find, isEmpty, makeSimpleStore, pick, ref, ref1, ref2, store, values;

  capitalize = require('lodash/capitalize');

  extend = require('lodash/extend');

  find = require('lodash/find');

  values = require('lodash/values');

  pick = require('lodash/pick');

  isEmpty = require('lodash/isEmpty');

  ref = require('./task'), TaskActions = ref.TaskActions, TaskStore = ref.TaskStore;

  ref1 = require('./helpers'), CrudConfig = ref1.CrudConfig, makeSimpleStore = ref1.makeSimpleStore, extendConfig = ref1.extendConfig, STATES = ref1.STATES;

  PeriodHelper = require('../helpers/period')['default'];

  CourseInformation = require('../models/course/information')['default'];

  DEFAULT_TIME_ZONE = 'Central Time (US & Canada)';

  CourseConfig = {
    _loaded: function(obj, id) {
      return this.emit('course.loaded', obj.id);
    },

    _saved: function(result, id) {
      this.emit('saved', result);
      return extend({}, this._local[id], result);
    },

    exports: {
      getBookName: function(courseId) {
        let appearance_code, ref2;
        appearance_code = this._local[courseId].appearance_code;
        return ((ref2 = CourseInformation.information(appearance_code)) != null ? ref2.title : void 0) || '';
      },

      getBookUUID: function(courseId) {
        let ref2;
        return (ref2 = this._local[courseId]) != null ? ref2.ecosystem_book_uuid : void 0;
      },

      getSubject: function(courseId) {
        let appearance_code, ref2;
        appearance_code = this._local[courseId].appearance_code;
        return ((ref2 = CourseInformation.information(appearance_code)) != null ? ref2.subject : void 0) || '';
      },

      isConceptCoach: function(courseId) {
        let ref2;
        return !!((ref2 = this._local[courseId]) != null ? ref2.is_concept_coach : void 0);
      },

      isCollege: function(courseId) {
        let ref2;
        return !!((ref2 = this._local[courseId]) != null ? ref2.is_college : void 0);
      },

      isHighSchool: function(courseId) {
        let ref2;
        return !((ref2 = this._local[courseId]) != null ? ref2.is_college : void 0);
      },

      validateCourseName: function(name, courses, active) {
        let course, i, len;
        for (i = 0, len = courses.length; i < len; i++) {
          course = courses[i];
          if (course.name === name) {
            if (name !== active) {
              return ['courseNameExists'];
            }
          }
          if ((name == null) || name === '') {
            return ['required'];
          }
        }
      },

      getAppearanceCode: function(courseId) {
        let ref2;
        return ((ref2 = this._get(courseId)) != null ? ref2.appearance_code : void 0) || 'default';
      },

      getName: function(courseId) {
        let ref2;
        return ((ref2 = this._get(courseId)) != null ? ref2.name : void 0) || '';
      },

      getTerm: function(courseId) {
        let course;
        course = this._get(courseId);
        if (course) {
          return capitalize((course != null ? course.term : void 0) + ' ' + (course != null ? course.year : void 0));
        }
      },

      getPeriods: function(courseId, options) {
        let course, periods, sortedPeriods;
        if (options == null) {
          options = {
            includeArchived: false,
          };
        }
        course = this._get(courseId);
        periods = options.includeArchived ? course.periods : PeriodHelper.activePeriods(course);
        return sortedPeriods = periods ? PeriodHelper.sort(periods) : [];
      },

      getTimeDefaults: function(courseId) {
        return pick(this._get(courseId), 'default_due_time', 'default_open_time');
      },

      getTimezone: function(courseId) {
        let ref2;
        return ((ref2 = this._get(courseId)) != null ? ref2.time_zone : void 0) || DEFAULT_TIME_ZONE;
      },

      isTeacher: function(courseId) {
        let ref2;
        return !!find(
          (ref2 = this._get(courseId)) != null ? ref2.roles : void 0,
          {
            type: 'teacher',
          },
        );
      },

      isStudent: function(courseId) {
        let ref2;
        return !!find(
          (ref2 = this._get(courseId)) != null ? ref2.roles : void 0,
          {
            type: 'student',
          },
        );
      },

      getByEcosystemId: function(ecosystemId) {
        return find(
          values(this._local),
          {
            ecosystem_id: ecosystemId,
          },
        );
      },

      getStudentId: function(courseId) {
        let course, role;
        course = this._get(courseId);
        role = find(
          course != null ? course.roles : void 0,
          {
            type: 'student',
          },
        );
        if (role) {
          return find(
            course.students,
            {
              role_id: role.id,
            },
          ).student_identifier;
        } else {
          return null;
        }
      },

      isCloned: function(courseId) {
        let ref2;
        return !!((ref2 = this._get(courseId)) != null ? ref2.cloned_from_id : void 0);
      },
    },
  };

  extendConfig(CourseConfig, new CrudConfig());

  ref2 = makeSimpleStore(CourseConfig), actions = ref2.actions, store = ref2.store;

  module.exports = {
    CourseActions: actions,
    CourseStore: store,
  };

}).call(this);

//# sourceMappingURL=course.js.map

import React from 'react';
import { pick, extend, each, get } from 'lodash';

import { CCDashboardStore, CCDashboardActions } from '../../../src/flux/cc-dashboard';
import Courses from '../../../src/models/courses-map';

import BaseModel from '../../../api/courses/1/cc/dashboard.json';

import Context from '../helpers/enzyme-context';

import Dashboard from '../../../src/components/cc-dashboard/dashboard';
import Chapter from '../../../src/components/cc-dashboard/chapter';
import Section from '../../../src/components/cc-dashboard/section';
import SectionProgress from '../../../src/components/cc-dashboard/section-progress';
import SectionPerformance from '../../../src/components/cc-dashboard/section-performance';
import PeriodHelper from '../../../src/helpers/period';

const COURSE_ID = '0';
const BLANK_PERIOD = 0;
const ACTIVE_PERIOD = 1;

let props = {};

describe('Concept Coach Dashboard', function() {

  beforeEach(function() {
    const CourseObj = extend({}, pick(BaseModel.course, 'name', 'teachers'), {id: COURSE_ID, is_concept_coach: true});
    BaseModel.course.periods = PeriodHelper.sort(get(BaseModel.course, 'periods'));

    BaseModel.course.periods[BLANK_PERIOD].chapters = [];
    CCDashboardActions.loaded(BaseModel, COURSE_ID);
    Courses.bootstrap([CourseObj]);
    props = {
      courseId: COURSE_ID,
      initialActivePeriod: BLANK_PERIOD,
      chapters: [],
    };
  });

  describe('Dashboard', function() {
    it('shows the help page for blank periods', function() {
      const wrapper = shallow(<Dashboard {...props} />, Context.build());
      expect(wrapper).toHaveRendered(`CCDashboardEmptyPeriod[courseId=\"${props.courseId}\"]`);
    });

    it('show the right amount of chapters for non-empty periods', function() {
      props.initialActivePeriod = ACTIVE_PERIOD;
      const periodId = BaseModel.course.periods[props.initialActivePeriod].id;
      const chapters = CCDashboardStore.chaptersForDisplay(COURSE_ID, periodId);
      const wrapper = shallow(<Dashboard {...props} />, Context.build());
      expect(wrapper.find('DashboardChapter').length).to.equal(chapters.length);
      for (let chapter of Array.from(chapters)) {
        expect(wrapper).toHaveRendered(`DashboardChapter[id=\"${chapter.id}\"]`);
      }
    });
  });

  describe('Chapter', () =>
    it('shows the right amount of sections for chapters', function() {
      const chapters = CCDashboardStore.chaptersForDisplay(COURSE_ID,
        BaseModel.course.periods[ACTIVE_PERIOD].id
      );
      for(const chapter of chapters) {
        const wrapper = shallow(<Chapter {...props} chapter={chapter} />);
        Array.from(chapter.valid_sections).map((section) =>
          expect(wrapper).toHaveRendered(`Section[id=\"${section.id}\"]`));
      }
    })
  );

  describe('Section', function() {
    beforeEach(function() {
      props = {
        section: {
          chapter_section: [1, 2],
          completed_percentage: 1.0,
          original_performance: 0.5,
        },
      };
    });

    it('shows a section without spaced practice', function() {
      const wrapper = shallow(<Section {...props} />);
      expect(wrapper).toHaveRendered('.empty-spaced-practice');
    });

    it('shows a section with spaced practice', function() {
      props.section.spaced_practice_performance = 0.5;
      const wrapper = shallow(<Section {...props} />);
      expect(wrapper).not.toHaveRendered('.empty-spaced-practice');
    });
  });


  describe('Section Progress Bars', function() {
    beforeEach(function() {
      props = {
        section: {
          completed_percentage: 1.10,
        },
      };
    });

    it('displays as 100%', function() {
      const wrapper = shallow(<SectionProgress {...props} />);
      expect(wrapper).toHaveRendered('ProgressBar[now=100][label="100% completed"]');
    });

    it('hides complete progress bar when 0% complete', function() {
      props.section.completed_percentage = 0.0;
      const wrapper = shallow(<SectionProgress {...props} />);
      expect(wrapper).toHaveRendered('ProgressBar.none-completed');
    });
  });

  describe('Section Performance Bars', function() {
    it('hides incorrect progress bar when all correct', function() {
      const wrapper = shallow(<SectionPerformance performance={1.0} />);
      expect(wrapper).toHaveRendered('ProgressBar[now=100][label="100% correct"]');
      expect(wrapper).not.toHaveRendered('ProgressBar.progress-bar-incorrect');
    });

    it('hides correct progress bar when all incorrect', function() {
      const wrapper = shallow(<SectionPerformance performance={0} />);
      expect(wrapper).not.toHaveRendered('ProgressBar.progress-bar-correct');
      expect(wrapper).toHaveRendered('ProgressBar[now=100][label="100% incorrect"]');
    });

    it('renders both when a mix of of correct/incorrect', function() {
      const wrapper = shallow(<SectionPerformance performance={0.3} />);
      expect(wrapper).toHaveRendered('ProgressBar.progress-bar-correct[now=30][label="30%"]');
      expect(wrapper).toHaveRendered('ProgressBar.progress-bar-incorrect[now=70][label=""]');
    });
  });
});

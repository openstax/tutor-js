React = require 'react'
_ = require 'underscore'

{CCDashboardStore, CCDashboardActions} = require '../../../src/flux/cc-dashboard'
{CourseStore, CourseActions} = require '../../../src/flux/course'

BaseModel = require '../../../api/courses/1/cc/dashboard.json'

Context = require '../helpers/enzyme-context'

Dashboard          = require '../../../src/components/cc-dashboard/dashboard'
Chapter            = require '../../../src/components/cc-dashboard/chapter'
Section            = require '../../../src/components/cc-dashboard/section'
SectionProgress    = require '../../../src/components/cc-dashboard/section-progress'
SectionPerformance = require '../../../src/components/cc-dashboard/section-performance'
PeriodHelper       = require '../../../src/helpers/period'


COURSE_ID = '0'
BLANK_PERIOD = 0
ACTIVE_PERIOD = 1

describe 'Concept Coach Dashboard', ->

  beforeEach ->
    CourseObj = _.extend {}, _.pick(BaseModel.course, 'name', 'teachers'), {is_concept_coach: true}
    BaseModel.course.periods = PeriodHelper.sort(BaseModel.course?.periods)

    BaseModel.course.periods[BLANK_PERIOD].chapters = []
    CCDashboardActions.loaded(BaseModel, COURSE_ID)
    CourseActions.loaded(CourseObj, COURSE_ID)
    @props =
      courseId: COURSE_ID
      initialActivePeriod: BLANK_PERIOD
      chapters: []

  describe 'Dashboard', ->
    it 'shows the help page for blank periods', ->
      wrapper = shallow(<Dashboard {...@props} />, Context.build())
      expect(wrapper).toHaveRendered("CCDashboardEmptyPeriod[courseId=\"#{@props.courseId}\"]")
      undefined

    it 'show the right amount of chapters for non-empty periods', ->
      @props.initialActivePeriod = ACTIVE_PERIOD
      periodId = BaseModel.course.periods[@props.initialActivePeriod].id
      chapters = CCDashboardStore.chaptersForDisplay(COURSE_ID, periodId)
      wrapper = shallow(<Dashboard {...@props} />, Context.build())
      expect(wrapper.find('DashboardChapter').length).to.equal(chapters.length)
      for chapter in chapters
        expect(wrapper).toHaveRendered("DashboardChapter[id=\"#{chapter.id}\"]")
      undefined

  describe 'Chapter', ->
    it 'shows the right amount of sections for chapters', ->
      chapters = CCDashboardStore.chaptersForDisplay(COURSE_ID,
        BaseModel.course.periods[ACTIVE_PERIOD].id
      )
      _.each chapters, (chapter, i) =>
        wrapper = shallow(<Chapter {...@props} chapter={chapter} />)
        for section in chapter.valid_sections
          expect(wrapper).toHaveRendered("Section[id=\"#{section.id}\"]")
      undefined

  describe 'Section', ->
    beforeEach ->
      @props =
        section:
          chapter_section: [1, 2]
          completed_percentage: 1.0
          original_performance: 0.5

    it 'shows a section without spaced practice', ->
      wrapper = shallow(<Section {...@props} />)
      expect(wrapper).toHaveRendered('.empty-spaced-practice')
      undefined

    it 'shows a section with spaced practice', ->
      @props.section.spaced_practice_performance = 0.5
      wrapper = shallow(<Section {...@props} />)
      expect(wrapper).not.toHaveRendered('.empty-spaced-practice')
      undefined


  describe 'Section Progress Bars', ->
    beforeEach ->
      @props =
        section:
          completed_percentage: 1.10

    it 'displays as 100%', ->
      wrapper = shallow(<SectionProgress {...@props} />)
      expect(wrapper).toHaveRendered('ProgressBar[now=100][label="100% completed"]')

    it 'hides complete progress bar when 0% complete', ->
      @props.section.completed_percentage = 0.0
      wrapper = shallow(<SectionProgress {...@props} />)
      expect(wrapper).toHaveRendered('ProgressBar.none-completed')


  describe 'Section Performance Bars', ->
    it 'hides incorrect progress bar when all correct', ->
      wrapper = shallow(<SectionPerformance performance={1.0} />)
      expect(wrapper).toHaveRendered('ProgressBar[now=100][label="100% correct"]')
      expect(wrapper).not.toHaveRendered('ProgressBar.progress-bar-incorrect')

    it 'hides correct progress bar when all incorrect', ->
      wrapper = shallow(<SectionPerformance performance={0} />)
      expect(wrapper).not.toHaveRendered('ProgressBar.progress-bar-correct')
      expect(wrapper).toHaveRendered('ProgressBar[now=100][label="100% incorrect"]')

    it 'renders both when a mix of of correct/incorrect', ->
      wrapper = shallow(<SectionPerformance performance={0.3} />)
      expect(wrapper).toHaveRendered('ProgressBar.progress-bar-correct[now=30][label="30%"]')
      expect(wrapper).toHaveRendered('ProgressBar.progress-bar-incorrect[now=70][label=""]')

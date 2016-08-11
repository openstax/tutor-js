_ = require 'underscore'

{CCDashboardStore, CCDashboardActions} = require '../../../src/flux/cc-dashboard'
{CourseStore, CourseActions} = require '../../../src/flux/course'
{Testing} = require '../helpers/component-testing'

Dashboard = require '../../../src/components/cc-dashboard/dashboard'
Chapter = require '../../../src/components/cc-dashboard/chapter'
Section = require '../../../src/components/cc-dashboard/section'
SectionProgress = require '../../../src/components/cc-dashboard/section-progress'
SectionPerformance = require '../../../src/components/cc-dashboard/section-performance'
PeriodHelper = require '../../../src/helpers/period'

BaseModel = require '../../../api/courses/1/cc/dashboard.json'
ExtendBaseStore = (props) -> _.extend({}, BaseModel, props)

COURSE_ID = '0'
BLANK_PERIOD = 0
activePeriod = 1

RenderHelper = (component, courseId, initialPeriodIndex = 0, chapters = []) ->
  optionsWithParams =
    props:
      courseId: courseId
      initialActivePeriod: initialPeriodIndex
      chapters: chapters

  Testing.renderComponent(component, optionsWithParams)


describe 'Concept Coach', ->
  beforeEach ->
    CourseObj = _.extend {}, _.pick(BaseModel.course, 'name', 'teachers'), {is_concept_coach: true}
    BaseModel.course.periods = PeriodHelper.sort(BaseModel.course?.periods)

    BaseModel.course.periods[BLANK_PERIOD].chapters = []
    CCDashboardActions.loaded(BaseModel, COURSE_ID)
    CourseActions.loaded(CourseObj, COURSE_ID)

  describe 'Dashboard', ->
    it 'shows the help page for blank periods', ->
      periodId = BaseModel.course.periods[BLANK_PERIOD].id
      RenderHelper(Dashboard, COURSE_ID, BLANK_PERIOD).then ({dom}) ->
        expect(dom.querySelector('.empty-period.cc-dashboard-help')).to.exist

    it 'show the right amount of chapters for non-empty periods', ->
      periodId = BaseModel.course.periods[activePeriod].id
      numChapters = CCDashboardStore.chaptersForDisplay(COURSE_ID, periodId).length
      RenderHelper(Dashboard, COURSE_ID, activePeriod).then ({dom}) ->
        if (numChapters)
          expect(dom.querySelector('.empty-period.cc-dashboard-help')).not.to.exist
        expect(dom.querySelectorAll('.chapter').length).to.equal(numChapters)

  describe 'Chapter', ->
    it 'shows the right amount of sections for chapters', ->
      chapters = CCDashboardStore.chaptersForDisplay(COURSE_ID, activePeriod)
      validSectionArr = _.map(chapters, (chapter) -> chapter.valid_sections)

      _.each chapters, (chapter, i) ->
        RenderHelper(Chapter, COURSE_ID, activePeriod, chapter).then ({dom}) ->
          expect(dom.querySelectorAll('.chapter .section').length).to.equal(validSectionArr[i])

  describe 'Section', ->
    it 'shows a section without spaced practice', ->
      options =
        props:
          section:
            completed_percentage: 1.0
            original_performance: 0.5

      Testing.renderComponent(Section, options).then ({dom}) ->
        expect(dom.querySelector('.empty-spaced-practice')).to.not.be.null

    it 'shows a section with spaced practice', ->
      spacedPracticeOptions =
        props:
          section:
            completed_percentage: 1.0
            original_performance: 0.5
            spaced_practice_performance: 0.5

      zeroSpacedPracticeOptions =
        props:
          section:
            spaced_practice_performance: 0.0

      Testing.renderComponent(Section, spacedPracticeOptions).then ({dom}) ->
        expect(dom.querySelector('.empty-spaced-practice')).to.be.null

      Testing.renderComponent(Section, zeroSpacedPracticeOptions).then ({dom}) ->
        expect(dom.querySelector('.empty-spaced-practice')).to.be.null


  describe 'Section Progress Bars', ->
    #this is just in case the backend ever returns weird data
    it 'limits percentage at 100 percent', ->
      options =
        props:
          section:
            completed_percentage: 1.10

      Testing.renderComponent(SectionProgress, options).then ({dom}) ->
        expect(dom.querySelector('.reading-progress-bar span span').innerHTML).to.equal('100% completed')

    it 'hides complete progress bar when 0% complete', ->
      options =
        props:
          section:
            completed_percentage: 0.0

      Testing.renderComponent(SectionProgress, options).then ({dom}) ->
        expect(dom.querySelector('.reading-progress-bar')).to.be.null
        expect(dom.querySelector('.reading-progress-group.none-completed')).to.be.not.null


  describe 'Section Performance Bars', ->
    it 'hides incorrect progress bar when all correct', ->
      options =
        props:
          performance: 1.0

      Testing.renderComponent(SectionPerformance, options).then ({dom}) ->
        expect(dom.querySelector('.progress-bar-correct span span').innerHTML).to.be.equal('100% correct')
        expect(dom.querySelector('.progress-bar-incorrect')).to.be.null

    it 'hides correct progress bar when all incorrect', ->
      options =
        props:
          performance: 0.0

      Testing.renderComponent(SectionPerformance, options).then ({dom}) ->
        expect(dom.querySelector('.progress-bar-incorrect span span').innerHTML).to.be.equal('100% incorrect')
        expect(dom.querySelector('.progress-bar-correct')).to.be.null

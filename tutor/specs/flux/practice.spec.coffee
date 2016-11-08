_ = require 'lodash'

{expect} = require 'chai'
{CoursePracticeActions, CoursePracticeStore} = require '../../src/flux/practice'

COURSE_ID = '1'
PAGE_IDS_1 = ['1', '2', '3']
PAGE_IDS_2 = ['2', '3', '4']

COURSE_PRACTICE_1 = require '../../api/courses/1/practice/POST.json'
COURSE_PRACTICE_2 = _.extend(id: 'Practice-Course-2', COURSE_PRACTICE_1)

makePageIdParams = (pageIds) ->
  page_ids: pageIds

createPractice = (pageIds, practice) ->
  args = {courseId: COURSE_ID, query: makePageIdParams(pageIds)}
  CoursePracticeActions.create(args)
  CoursePracticeActions.created(practice, args)

failToCreatePractice = (pageIds) ->
  args = {courseId: COURSE_ID, query: makePageIdParams(pageIds)}
  CoursePracticeActions.create(args)
  CoursePracticeActions._failed({}, args)

describe 'CoursePractice Store', ->

  afterEach ->
    CoursePracticeActions.reset()

  it 'can get course practice specific to params', ->
    createPractice(PAGE_IDS_1, COURSE_PRACTICE_1)
    createPractice(PAGE_IDS_2, COURSE_PRACTICE_2)

    params1 = makePageIdParams(PAGE_IDS_1)
    params2 = makePageIdParams(PAGE_IDS_2)

    expect(CoursePracticeStore.get(COURSE_ID, params1).id)
      .to.be.equal(COURSE_PRACTICE_1.id)
    expect(CoursePracticeStore.get(COURSE_ID, params2).id)
      .to.be.equal(COURSE_PRACTICE_2.id)
    undefined

  it 'can get latest course practice specific to params', ->
    createPractice(PAGE_IDS_1, COURSE_PRACTICE_1)
    createPractice(PAGE_IDS_1, COURSE_PRACTICE_2)

    params1 = makePageIdParams(PAGE_IDS_1)

    expect(CoursePracticeStore.get(COURSE_ID, params1).id)
      .to.be.equal(COURSE_PRACTICE_2.id)
    undefined

  it 'is enabled for successfully created params', ->
    createPractice(PAGE_IDS_1, COURSE_PRACTICE_1)
    createPractice(PAGE_IDS_2, COURSE_PRACTICE_2)

    params1 = makePageIdParams(PAGE_IDS_1)
    params2 = makePageIdParams(PAGE_IDS_2)

    expect(CoursePracticeStore.isDisabled(COURSE_ID, params1))
      .to.be.false
    expect(CoursePracticeStore.isDisabled(COURSE_ID, params2))
      .to.be.false
    undefined

  it 'is disabled for failed params', ->
    failToCreatePractice(PAGE_IDS_1)
    failToCreatePractice(PAGE_IDS_2)

    params1 = makePageIdParams(PAGE_IDS_1)
    params2 = makePageIdParams(PAGE_IDS_2)

    expect(CoursePracticeStore.isDisabled(COURSE_ID, params1))
      .to.be.true
    expect(CoursePracticeStore.isDisabled(COURSE_ID, params2))
      .to.be.true
    undefined

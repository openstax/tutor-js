# For handling steps logic outside of breadcrumb and task review rendering.
_ = require 'underscore'
camelCase = require 'camelcase'

{TaskTeacherReviewStore} = require '../../../flux/task-teacher-review'

module.exports =
  _pages: ['current_pages', 'spaced_pages']

  _setChapterSectionOnQuestions: (page) ->
    chapter_section = page.chapter_section

    _.each page.exercises, (exercise) ->
      exercise.chapter_section = chapter_section

      _.each exercise.content.questions, (question) ->
        question.chapter_section = chapter_section

  _getStatsForPeriod: (review, period) ->
    # return overview stats for now
    review.stats.course

  _getExercisesFromStats: (stats) ->
    pagedExercises = _.map @_pages, (page) =>
      # exercises = _.clone(_.pluck(stats[page], 'exercises'))
      exercises = _.chain(stats[page])
        .clone()
        .each(@_setChapterSectionOnQuestions)
        .pluck('exercises')
        .flatten(true)
        .compact()
        .value()

      exercises.for = page
      exercises

    _.flatten(pagedExercises, true)

  _makeCrumb: (data) ->
    crumb =
      data: data
      type: 'step'
      listeners: @_getStepListeners('exercise')

    crumb.sectionLabel = @_buildSectionLabel(data[0].chapter_section) if data[0]?
    crumb

  _indexCrumb: (crumb, index) ->
    crumb.key = index
    crumb.crumb = @_shouldStepCrumb(index)

  _getCrumbsForHomework: (stats) ->
    exercises = @_getExercisesFromStats(stats)
    crumbs = _.chain(exercises)
      .pluck('content')
      .flatten(true)
      .map(@_makeCrumb)
      .each(@_indexCrumb)
      .value()

  _getCrumbsForReading: (stats) ->
    exercises = @_getExercisesFromStats(stats)
    crumbs = _.chain(exercises)
      .groupBy('chapter_section')
      .map(@_makeCrumb)
      .each(@_indexCrumb)
      .value()

    crumbs

  _getContentsForHomework: (crumbs) ->
    contents = _.pluck(crumbs, 'data')

  _getContentsForReading: (crumbs) ->
    contents = _.chain(crumbs)
      .pluck('data')
      .map((data) ->
        _.pluck(data, 'content')
      )
      .flatten(true)
      .value()

  _shouldStepCrumb: ->
    true

  _getStepListeners: (stepType) ->
    #   One per step for the crumb status updates
    #   Two additional listeners for step loading and completion
    #     if there are placeholder steps.
    listeners =
      placeholder: 3

    listeners[stepType] or 1

  _buildSectionLabel: (chapter_section) ->
    sectionLabel = @sectionFormat?(chapter_section, @state.sectionSeparator) if chapter_section?

  _generateCrumbsFromStats: (stats, type) ->
    getCrumbs = camelCase("get-crumbs-for-#{type}")

    crumbs = @["_#{getCrumbs}"](stats)

  _generateCrumbs: (id, period) ->
    review = TaskTeacherReviewStore.get(id)
    stats = @_getStatsForPeriod(review, period)

    crumbs = @_generateCrumbsFromStats(stats, review.type)

  generateCrumbs: ->
    {id, period} = @props
    @_generateCrumbs id, period

  getContents: ->
    {id, period} = @props
    review = TaskTeacherReviewStore.get(id)

    allCrumbs = @generateCrumbs()
    getContents = camelCase("get-contents-for-#{review.type}")

    contents = @["_#{getContents}"](allCrumbs)

  getCrumableCrumbs: ->
    # only return crumbables for breadcrumbs to render through
    allCrumbs = @generateCrumbs()
    crumbableCrumbs = _.where allCrumbs,
      crumb: true

  getMaxListeners: ->
    crumbs = @generateCrumbs()
    listeners = _.reduce crumbs, (memo, crumb) ->
      memo + crumb.listeners
    , 0

  getDefaultCurrentStep: ->
    0

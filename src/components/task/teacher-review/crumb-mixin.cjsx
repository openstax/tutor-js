# For handling steps logic outside of breadcrumb and task review rendering.
_ = require 'underscore'
camelCase = require 'camelcase'

{TaskTeacherReviewStore} = require '../../../flux/task-teacher-review'

module.exports =
  _pages: ['current_pages', 'spaced_pages']

  _setChapterSectionOnQuestions: (exercises, chapter_section) ->
    _.each exercises, (exercise) ->
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
        .pluck('exercises')
        .flatten(true)
        .compact()
        .value()

      chapter_section = stats[page].chapter_section

      @_setChapterSectionOnQuestions(exercises, chapter_section)
      exercises.for = page
      exercises.chapter_section

      exercises

    _.flatten(pagedExercises, true)

  _makeCrumb: (data, index) ->
    crumb =
      key: index
      data: data
      crumb: @_shouldStepCrumb(index)
      sectionLabel: @_buildSectionLabel(data.chapter_section)
      type: 'step'
      listeners: @_getStepListeners('exercise')

  _getCrumbsForHomework: (stats) ->
    exercises = @_getExercisesFromStats(stats)
    crumbs = _.chain(exercises)
      .pluck('content')
      .flatten(true)
      .map(@_makeCrumb)
      .value()

    console.log('homeoworkcrumbs')
    console.log(crumbs)
    crumbs

  _getCrumbsForReading: (stats) ->
    exercises = @_getExercisesFromStats(stats)
    crumbs = _.map exercises, @_makeCrumb

    crumbs

  _getContentsForHomework: (crumbs) ->
    contents = _.pluck(crumbs, 'data')

  _getContentsForReading: (crumbs) ->
    contents = _.chain(crumbs)
      .pluck('data')
      .pluck('content')
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
    getContents = camelCase("_get-contents-for-#{review.type}")

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

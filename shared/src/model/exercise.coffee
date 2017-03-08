qs = require 'qs'

# This list maps Tutor book UUID's to the their official OpenStax title.
# It's used to pre-fill the errata submission form on webview with
# the correct book title, which requires an exact title match
BOOK_UID_XREF =
  '27275f49-f212-4506-b3b1-a4d5e3598b99': 'College Physics' # CC Version
  'd52e93f4-8653-4273-86da-3850001c0786': 'Concepts of Biology'
  '947a1417-5fd5-4b3c-ac8f-bd9d1aedf2d2': 'Principles of Macroeconomics'
  'bf96bfc5-e723-46c2-9fa2-5a4c9294fa26': 'Concepts of Biology'
  '08df2bee-3db4-4243-bd76-ee032da173e8': 'Principles of Microeconomics'
  '4f86c023-a135-412a-9d96-dcbd1ca61e7d': 'Introduction to Sociology 2e'
  'd2fbadca-e4f3-4432-a074-2438c216b62a': 'Principles of Economics'
  '99e127f8-f722-4907-a6b3-2d62fca135d6': 'Anatomy and Physiology'
  '3402dc53-113d-45f3-954e-8d2ad1e73659': 'Concept of Biology'  # Mini CC test version
  '185cbf87-c72e-48f5-b51e-f14f21b5eabd': 'Biology'
  '405335a3-7cff-4df2-a9ad-29062a4af261': 'College Physics'

Exercises =

  troubleUrl: ({bookUUID, project, exerciseId}) ->
    # FIXME - get correct url
    Exercises.ERRATA_FORM_URL + '?' + qs.stringify(
      source: project, # either tutor or CC
      location: "Exercise: #{exerciseId}",
      book: BOOK_UID_XREF[bookUUID]
    )

  getParts: (exercise) ->
    exercise.content?.questions or []

  isMultipart: (exercise) ->
    @getParts(exercise).length > 1

  hasInteractive: (exercise) ->
    exercise.has_interactive

  hasVideo: (exercise) ->
    exercise.has_video


Exercises.ERRATA_FORM_URL = 'https://oscms-qa.openstax.org/errata/form'

module.exports = Exercises

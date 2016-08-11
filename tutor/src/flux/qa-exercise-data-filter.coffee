_ = require 'underscore'

{EcosystemsStore} = require './ecosystems'


# This exports a single function that will manipulate exercise data
# into the desired format for QA view.

# Currently it hides all LO and context-cnxmod tags that
# are not related to the given ecosystem


BOOK_UUID_MAPPINGS =
  '02040312-72c8-441e-a685-20e9333f3e1d': 'stax-soc'
  'a4579e90-f894-4438-88c3-14772d3da9ff': 'stax-phys'
  '334f8b61-30eb-4475-8e05-5260a4866b4b': 'stax-k12phys'
  '185cbf87-c72e-48f5-b51e-f14f21b5eabd': 'stax-bio'
  'd52e93f4-8653-4273-86da-3850001c0786': 'stax-apbio'
  'b3c1e1d2-839c-42b0-a314-e119a8aafbdd': 'stax-cbio'
  '69619d2b-68f0-44b0-b074-a9b2bf90b2c6': 'stax-econ'
  '4061c832-098e-4b3c-a1d9-7eb593a2cb31': 'stax-macro'
  'ea2f225e-6063-41ca-bcd8-36482e15ef65': 'stax-micro'
  '14fb4ad7-39a1-4eee-ab6e-3ef2482e3e22': 'stax-anp'

BOOK_CODE_MAPPINGS = _.invert(BOOK_UUID_MAPPINGS)


module.exports = (exercise, {ecosystemId} ) ->
  bookUuid = EcosystemsStore.getBook(ecosystemId)?.uuid
  bookCode = BOOK_UUID_MAPPINGS[ bookUuid ]
  return exercise unless bookCode

  exercise.tags = _.select exercise.tags, (tag) ->
    [prefix, value] = tag.id.split(':')
    switch prefix
      when 'lo'             then value is bookCode
      when 'context-cnxmod' then value is bookUuid
      else
        true # allow all other tags

  return exercise

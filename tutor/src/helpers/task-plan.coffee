moment = require 'moment'
_ = require 'underscore'

module.exports = {

  # returns the opens_at and due_at dates combined if they're identical,
  # separated by target_id if not
  dates: (plan, options = {}) ->
    return {} if _.isEmpty( plan?.tasking_plans )
    pickFn = if options.only
      (tp) -> _.pick(tp, options.only)
    else
      (tp) -> _.pick(tp, 'opens_at', 'due_at')

    first = _.first( plan.tasking_plans )
    isIdentical = _.every plan.tasking_plans, (tp) ->
      if options.only?
        tp[options.only] is first[options.only]
      else
        tp.opens_at is first.opens_at and tp.due_at is first.due_at

    if isIdentical
      all: pickFn(first)
    else
      _.reduce( plan.tasking_plans, (memo, tp) ->
        memo[tp.target_id] = pickFn(tp)
        memo
      , {})
}

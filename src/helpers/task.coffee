moment = require 'moment'

module.exports = {

  getLateness: ({due_at, last_worked_at}) ->

    result =
      is_late: false
      last_worked_at: null
      how_late: null

    result.last_worked_at = moment(last_worked_at)
    result.is_late = moment(due_at).isBefore(result.last_worked_at)
    result.how_late = moment(due_at).from(result.last_worked_at, true) if result.is_late
    result
}

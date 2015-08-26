moment = require 'moment'
_ = require 'underscore'
{TimeStore} = require '../flux/time'

module.exports = {

  getLateness: ({due_at, last_worked_at, status}) ->

    result =
      is_late: false
      last_worked_at: null
      how_late: null

    result.last_worked_at = moment(last_worked_at)
    result.is_late  = moment(due_at).isBefore(result.last_worked_at)
    result.how_late = moment(due_at).from(result.last_worked_at, true) if result.is_late
    result

  isDue: ({due_at}) ->
    moment(due_at).isBefore(TimeStore.getNow())

  # Convert each number to base 10 with it's position based on index.
  # If section is not present, 0 is set for it
  #   1 becomes 100, 1.1 becomes 101, 3.2 to 302, 3.2.1 -> 30201
  # Useful for sorting
  chapterSectionToNumber: (chapter_section) ->
    chapter_section.push(0) if chapter_section.length is 1 # add a section 0 if it has only a chapter
    position = -1
    _.reduceRight(chapter_section, (memo, num) ->
      memo + (num * Math.pow(100, position += 1))
    , 0)

}

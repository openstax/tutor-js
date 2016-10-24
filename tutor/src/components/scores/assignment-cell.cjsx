React = require 'react'

ReadingCell  = require './reading-cell'
HomeworkCell = require './homework-cell'
AbsentCell   = require './absent-cell'
ExternalCell = require './external-cell'
ConceptCoachCell = require './concept-coach-cell'

extend = require 'lodash/extend'


AssignmentCell = (props) ->
  student = props.rows[props.rowIndex]

  props = extend({}, props, {
    student,
    roleId: student.role
    task: student.data[props.columnIndex]
  })

  switch props.task?.type or 'null'
    when 'null'     then <AbsentCell   key='absent'   {...props} />
    when 'external' then <ExternalCell key='extern'   {...props} />
    when 'reading'  then <ReadingCell  key='reading'  {...props} />
    when 'homework' then <HomeworkCell key='homework' {...props} />
    else <ConceptCoachCell key='concept_coach'        {...props} />



module.exports = AssignmentCell

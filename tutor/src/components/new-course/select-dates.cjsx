React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'

QUARTERS =
  '2017Q4': 'Fall 2017'
  '2018Q1': 'Winter 2018'
  '2018Q2': 'Spring 2018'
  '2018Q3': 'Summer 2018'

KEY = "period"

SelectDates = React.createClass

  statics:
    title: "Choose when to teach the course"

  onSelect: (period) ->
    NewCourseActions.set({"#{KEY}": period})

  render: ->
    <BS.Table className="quarters" striped bordered >
      <tbody>
        {for code, name of QUARTERS
          <tr key={code}
            className={classnames(selected: NewCourseStore.get(KEY) is code)}
            onClick={_.partial(@onSelect, code)}
          >
            <td>{name}</td>
          </tr>}
      </tbody>
    </BS.Table>




module.exports = SelectDates

React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'
partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'
S = require '../../helpers/string'
{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{OfferingsStore} = require '../../flux/offerings'

QUARTERS =
  '2017Q4': 'Fall 2017'
  '2018Q1': 'Winter 2018'
  '2018Q2': 'Spring 2018'
  '2018Q3': 'Summer 2018'

KEY = "term"

SelectDates = React.createClass

  statics:
    title: "Choose when to teach the course"

  onSelect: (term) ->
    NewCourseActions.set({"#{KEY}": term})

  render: ->
    offering = OfferingsStore.get(NewCourseStore.get('offering_id'))

    <BS.Table className="quarters" striped bordered >
      <tbody>
        {for term, index in offering.active_term_years
          <tr key={index}
            className={classnames(selected: isEqual(NewCourseStore.get(KEY), term))}
            onClick={partial(@onSelect, term)}
          >
            <td>{S.capitalize(term.term)} {term.year}</td>
          </tr>}
      </tbody>
    </BS.Table>




module.exports = SelectDates

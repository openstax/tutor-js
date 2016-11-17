React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'
partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{OfferingsStore} = require '../../flux/offerings'
{CourseChoiceItem} = require './choice'

QUARTERS =
  '2017Q4': 'Fall 2017'
  '2018Q1': 'Winter 2018'
  '2018Q2': 'Spring 2018'
  '2018Q3': 'Summer 2018'

KEY = "term"

SelectDates = React.createClass

  statics:
    title: 'When will you teach this course?'

  onSelect: (term) ->
    NewCourseActions.set({"#{KEY}": term})

  render: ->
    offering = OfferingsStore.get(NewCourseStore.get('offering_id'))

    <BS.ListGroup>
      {for term, index in offering.active_term_years
        <CourseChoiceItem
          key={index}
          active={isEqual(NewCourseStore.get(KEY), term)}
          onClick={partial(@onSelect, term)}
        >
          {term.term} {term.year}
        </CourseChoiceItem>}
    </BS.ListGroup>




module.exports = SelectDates

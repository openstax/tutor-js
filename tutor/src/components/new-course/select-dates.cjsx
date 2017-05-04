React = require 'react'
BS = require 'react-bootstrap'

classnames = require 'classnames'
partial = require 'lodash/partial'
isEqual = require 'lodash/isEqual'

{NewCourseActions, NewCourseStore} = require '../../flux/new-course'
{OfferingsStore} = require '../../flux/offerings'
Choice = require './choice'

QUARTERS =
  '2017Q4': 'Fall 2017'
  '2018Q1': 'Winter 2018'
  '2018Q2': 'Spring 2018'
  '2018Q3': 'Summer 2018'

KEY = "term"

SelectDates = React.createClass
  displayName: 'SelectDates'
  statics:
    title: 'When will you teach this course?'

  onSelect: (term) ->
    NewCourseActions.set({"#{KEY}": term})

  componentWillMount: ->
    return if NewCourseStore.get(KEY)?

    offering = OfferingsStore.get(NewCourseStore.get('offering_id'))
    if offering.active_term_years? and offering.active_term_years[1]?
      @onSelect(offering.active_term_years[1])

  render: ->
    terms = OfferingsStore.getValidTerms(NewCourseStore.get('offering_id'))

    <BS.ListGroup>
      {for term, index in terms
        <Choice
          key={index}
          active={isEqual(NewCourseStore.get(KEY), term)}
          onClick={partial(@onSelect, term)}
        >
          <span className="term">{term.term}</span>
          <span className="year">{term.year}</span>
        </Choice>}
    </BS.ListGroup>




module.exports = SelectDates

React = require 'react'
BS = require 'react-bootstrap'

SectionPerformance = require './section-performance'
ChapterSection = require '../task-plan/chapter-section'

SectionProgress = require './section-progress'

Section = React.createClass
  displayName: 'Section'

  PropTypes:
    section: React.PropTypes.shape(
      id: React.PropTypes.string
      title: React.PropTypes.string
      chapter_section: React.PropTypes.array
      valid_sections: React.PropTypes.array
      original_performance: React.PropTypes.number
      spaced_practice_performance: React.PropTypes.spaced_practice_performance
    )



  render: ->
    if (typeof(@props.section.spaced_practice_performance) isnt 'undefined')
      spacedPractice = <SectionPerformance performance={@props.section.spaced_practice_performance} />
    else
      spacedPracticeClass = "empty-spaced-practice"
      spacedPractice = <i className="fa fa-ellipsis-h"/>

    <BS.Row className="section" key={@props.section.id}>
      <BS.Col xs={6}>
        <ChapterSection skipZeros={false} section={@props.section.chapter_section} />
        {@props.section.title}
      </BS.Col>
      <BS.Col xs={2}>
        <SectionProgress section={@props.section} />
      </BS.Col>
      <BS.Col xs={2}>
        <SectionPerformance performance={@props.section.original_performance} />
      </BS.Col>
      <BS.Col xs={2} className={spacedPracticeClass}>
        {spacedPractice}
      </BS.Col>
    </BS.Row>

module.exports = Section

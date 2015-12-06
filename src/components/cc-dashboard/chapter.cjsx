_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'

{CCDashboardStore} = require '../../flux/cc-dashboard'
ChapterSection = require '../task-plan/chapter-section'
Section = require './section'

DashboardChapter = React.createClass
  PropTypes:
    chapter: React.PropTypes.shape(
      id: React.PropTypes.string
      chapter_section: React.PropTypes.array
      valid_sections: React.PropTypes.array
    )


  render: ->
    <div className='chapter'>
      <BS.Row className="name" key={@props.chapter.id}>
        <BS.Col xs={12}>
          <ChapterSection section={@props.chapter.chapter_section} />
          {@props.chapter.title}
        </BS.Col>
      </BS.Row>
      {for section, index in @props.chapter.valid_sections
        <Section section={section} key={index} /> }
    </div>

module.exports = DashboardChapter

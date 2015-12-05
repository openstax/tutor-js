React = require 'react'
BS = require 'react-bootstrap'

ChapterSection = require '../task-plan/chapter-section'
Section = require './section'

DashboardChapter = React.createClass
  renderSection: (section, index) ->
    <Section section={section} key={index} />

  render: ->
    chapter = <BS.Row className="chapter-name-row" key={@props.chapter.id}>
      <BS.Col xs={12}>
        <ChapterSection section={@props.chapter.chapter_section} />
        . {@props.chapter.title}
      </BS.Col>
    </BS.Row>

    sections = _.map @props.chapter.pages, @renderSection
    <div>
      {chapter}
      {sections}
    </div>

module.exports = DashboardChapter

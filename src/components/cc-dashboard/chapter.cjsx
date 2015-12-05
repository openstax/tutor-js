React = require 'react'
BS = require 'react-bootstrap'

ChapterSection = require './chapter-section'

DashboardChapter = React.createClass
  renderSection: (section, index) ->
    <DashboardSection section={section} key={index} />

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

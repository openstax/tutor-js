_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'

{CCDashboardStore} = require '../../flux/cc-dashboard'
ChapterSection = require '../task-plan/chapter-section'
Section = require './section'

DashboardChapter = React.createClass

  render: ->
    <div>
      <BS.Row className="chapter-name-row" key={@props.chapter.id}>
      <BS.Col xs={12}>
        <ChapterSection section={@props.chapter.chapter_section} />
        . {@props.chapter.title}
        </BS.Col>
      </BS.Row>
      {for section, index in CCDashboardStore.sortSections(@props.chapter.pages).reverse()
        <Section section={section} key={index} /> }
    </div>

module.exports = DashboardChapter

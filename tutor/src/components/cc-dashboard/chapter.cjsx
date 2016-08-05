_ = require 'underscore'
React = require 'react'
BS = require 'react-bootstrap'
classnames = require 'classnames'

{CCDashboardStore} = require '../../flux/cc-dashboard'
ChapterSection = require '../task-plan/chapter-section'
Section = require './section'

DashboardChapter = React.createClass
  propTypes:
    chapter: React.PropTypes.shape(
      id: React.PropTypes.string
      chapter_section: React.PropTypes.array
      valid_sections: React.PropTypes.array
    )

  renderSections: ->
    _.map @props.chapter.valid_sections, (section, index) ->
      <Section section={section} key={index} />

  render: ->
    classes = classnames('chapter', empty: @props.chapter.valid_sections)
    <div className={classes}>
      <BS.Row className="name" key={@props.chapter.id}>
        <BS.Col xs={12}>
          <ChapterSection section={@props.chapter.chapter_section} />
          {@props.chapter.title}
        </BS.Col>
      </BS.Row>
      {@renderSections()}
    </div>

module.exports = DashboardChapter

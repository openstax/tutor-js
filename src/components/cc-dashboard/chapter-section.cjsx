React = require 'react'
BS = require 'react-bootstrap'

PerformanceBar = require './performance-bar'

DashboardSection = React.createClass
  render: ->
    <BS.Row className="section-info-row" key={@props.section.id}>
      <BS.Col xs={6}>
        <ChapterSection section={@props.section.chapter_section} />
        . {@props.section.title}
      </BS.Col>
      <BS.Col xs={2}>
        <DashboardSectionProgress section={@props.section} />
      </BS.Col>
      <BS.Col xs={2}>
        <DashboardSectionPerformance performance={@props.section.original_performance} />
      </BS.Col>
      <BS.Col xs={2}>
        <DashboardSectionPerformance performance={@props.section.spaced_practice_performance} />
      </BS.Col>
    </BS.Row>

module.exports = DashboardSection

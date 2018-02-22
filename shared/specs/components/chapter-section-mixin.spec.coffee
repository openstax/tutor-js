React = require 'react'
{Testing, expect, sinon, _} = require 'shared/specs/helpers'

ChapterSection = require 'components/chapter-section-mixin'

Component = React.createClass
  mixins: [ChapterSection]
  render: ->
    React.createElement('span', {},
      @sectionFormat(@props.section, @props.separator)
    )

describe 'Chapter Section Mixin', ->
  props = null

  beforeEach ->
    props =
      section: [1, 2]
      separator: '.'

  it 'can use custom separator', ->
    props.separator = '-'
    Testing.renderComponent( Component, props: props ).then ({dom}) ->
      expect(dom.textContent).equal('1-2')

  it 'can render chapter/section thats a string', ->
    props.section = '3.4'
    Testing.renderComponent( Component, props: props ).then ({dom}) ->
      expect(dom.textContent).equal('3.4')

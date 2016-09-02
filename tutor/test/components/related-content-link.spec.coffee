{Testing, expect, sinon, _, ReactTestUtils} = require './helpers/component-testing'
React = require 'react/addons'
RelatedContentLink = require '../../src/components/related-content-link'

describe 'Relalated Content Link Component', ->

  beforeEach ->
    @props =
      courseId: '1'
      content: [
        { chapter_section: [1, 1], title: 'What Is Sociology?' }
      ]

  it 'renders', ->
    Testing.renderComponent( RelatedContentLink, props: @props ).then ({dom}) ->
      expect(dom.textContent).to.equal('Comes from 1.1 What Is Sociology?')
      expect(dom.querySelector('a').getAttribute('target')).to.equal('_blank')

  it 'renders for multiple parts', ->
    @props.content.push({ chapter_section: [1, 2], title: 'Why Sociology is Awesome' })
    Testing.renderComponent( RelatedContentLink, props: @props ).then ({dom}) ->
      expect(dom.textContent).to.equal('Comes from 1.1 What Is Sociology?1.2 Why Sociology is Awesome')

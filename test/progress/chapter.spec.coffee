{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

{ChapterProgress} = require 'progress/chapter'

DASHBOARD = require '../../api/cc/dashboard/GET'

describe 'ChapterProgress Component', ->

  beforeEach ->
    @props =
      chapter: _.clone DASHBOARD.chapters[0]
      maxLength: 4

  it 'renders the title', ->
    Testing.renderComponent(ChapterProgress, props: @props).then ({dom}) =>
      expect(dom.querySelector('h3').textContent).equal(@props.chapter.title)

  it 'renders pages', ->
    Testing.renderComponent(ChapterProgress, props: @props).then ({dom}) =>
      pages = _.pluck dom.querySelectorAll('.concept-coach-progress-page-title'), 'textContent'
      expect(pages).to.deep.equal(_.pluck(@props.chapter.pages, 'title'))

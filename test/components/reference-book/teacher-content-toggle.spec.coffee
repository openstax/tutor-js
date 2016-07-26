{Testing, expect, sinon, _} = require '../helpers/component-testing'

Toggle = require '../../../src/components/reference-book/teacher-content-toggle'

describe 'Teacher Content Toggle', ->

  beforeEach ->
    @props =
      onChange: sinon.spy()
      isShowing: false
      windowImpl:
        document: document.createElement('div')

  it 'defaults to not showing teacher content', (done) ->
    Testing.renderComponent( Toggle, props: @props ).then ({element}) =>
      expect(element.getDOMNode().querySelector('.no-content')).to.exist
      Testing.actions.click(element.getDOMNode())
      _.defer =>
        expect(@props.onChange).not.to.have.been.called
        done()

  it 'can detect teacher selector', (done) ->
    @props.windowImpl.document.innerHTML = """
      <div><p class='os-teacher'>Hai I AM TEACHER</p></div>
    """
    Testing.renderComponent( Toggle, props: @props, unmountAfter: 10 ).then ({element}) ->
      _.defer ->
        expect(element.state.hasTeacherContent).to.be.true
        done()


  it 'calls callback when clicked and content is available', (done) ->
    @props.windowImpl.document.innerHTML = """
      <div><p class='os-teacher'>Hai I AM TEACHER</p></div>
    """
    Testing.renderComponent( Toggle, props: @props, unmountAfter: 10 ).then ({element}) =>

      Testing.actions.click(element.getDOMNode())
      _.defer =>
        expect(element.getDOMNode().textContent).to.include("Show")
        expect(@props.onChange).to.have.been.calledWith(true)
        done()

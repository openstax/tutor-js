{Testing, sinon, expect, _, React} = require './helpers/component-testing'

Dialog = require '../../src/components/tutor-dialog'

BODY_TXT = 'Some Testing Text'
describe 'Tutor Dialog', ->

  beforeEach ->
    @props = title: 'Testing Dialog', body: React.createElement('div', className:'body-content', BODY_TXT)


  it 'renders title', ->
    Dialog.show( @props )
    expect( document.body.querySelector('.tutor-dialog .modal-title').textContent ).to.equal(@props.title)

  it 'renders body', ->
    Dialog.show( @props )
    expect( document.body.querySelector('.tutor-dialog .body-content').textContent ).to.equal(BODY_TXT)

  it 'resolves promise when ok button is clicked', (done) ->
    ok = sinon.spy()
    Dialog.show( @props ).then(ok)
    Testing.actions.click( document.body.querySelector('.tutor-dialog .btn-primary') )
    _.delay ->
      expect(ok).to.have.been.called
      done()

  it 'rejects promise when cancel button is clicked', (done) ->
    cancel = sinon.spy()
    Dialog.show( @props ).then(_, cancel)
    Testing.actions.click( document.body.querySelector('.tutor-dialog .btn-default') )
    _.delay ->
      expect(cancel).to.have.been.called
      done()

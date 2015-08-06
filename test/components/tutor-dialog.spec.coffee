{Testing, sinon, expect, _, React} = require './helpers/component-testing'

Dialog = require '../../src/components/tutor-dialog'

BODY_TXT = 'Some Testing Text'
describe 'Tutor Dialog', ->

  beforeEach ->
    @props = title: 'Testing Dialog', body: React.createElement('div', className:'body-content', BODY_TXT)

  it 'renders title', ->
    Dialog.show( @props )
    dialog = document.querySelector('.tutor-dialog')
    expect(dialog).not.to.be.null
    expect( dialog.querySelector('.modal-title').textContent ).to.equal(@props.title)

  it 'renders body', ->
    Dialog.show( @props )
    expect( document.body.querySelector('.tutor-dialog .body-content').textContent ).to.equal(BODY_TXT)

  it 'resolves promise when ok button is clicked', (done) ->
    ok = sinon.spy()
    Dialog.show( @props ).then(ok)
    Testing.actions.click( document.body.querySelector('.tutor-dialog .ok') )
    _.delay ->
      expect(ok).to.have.been.called
      done()

  it 'rejects promise when cancel button is clicked', (done) ->
    cancel = sinon.spy()
    Dialog.show( @props ).then(_, cancel)
    Testing.actions.click( document.body.querySelector('.tutor-dialog .cancel') )
    _.delay ->
      expect(cancel).to.have.been.called
      done()

  it 'rejects promise when explicitly hidden', (done) ->
    cancel = sinon.spy()
    Dialog.show( @props ).then(_, cancel)
    Dialog.hide()
    _.delay ->
      expect(cancel).to.have.been.called
      done()

  it 'can be udpated', ->
    Dialog.show( @props )
    expect( document.querySelector('.modal-title').textContent ).to.equal(@props.title)
    Dialog.update(title: 'blarg')
    expect( document.querySelector('.modal-title').textContent ).to.equal('blarg')


  it 'can be rendered normally', (done) ->
    @props.children = @props.body
    @props.onProceed = sinon.spy()
    cancel = @props.onCancel  = sinon.spy()
    Testing.renderComponent( Dialog, {props: @props} ).then ({root, element, wrapper}) =>
      # dialog doesn't render as part of the same dom tree that the parent uses
      expect(root.querySelector('.tutor-dialog')).to.be.null
      expect(document.querySelector('.tutor-dialog .modal-title').textContent ).to.equal(@props.title)
      btn = document.body.querySelector('.tutor-dialog .cancel')
      Testing.actions.click( btn )
      _.delay ->
        expect(cancel).to.have.been.called
        done()

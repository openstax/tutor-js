{Testing, expect, sinon, _} = require './index'

{typesetMath} = require 'helpers/mathjax'
FakeWindow = require './fake-window'

callTypeset = (dom, window) ->
  new Promise( ( res, rej ) ->
    typesetMath(dom, window)
    _.delay ->
      res(dom)
    , 190
  )


describe 'Mathjax Helper', ->
  dom = null
  window = null

  beforeEach ->
    dom = document.createElement('div')
    window = new FakeWindow
    window.MathJax = { Hub: {Typeset: sinon.spy(), Queue: sinon.spy()} }
    window.document = dom

  it 'can typeset latex', ->
    dom.innerHTML = '<div data-math="\\pi">a pi symbol</div>'
    callTypeset(dom, window).then =>
      expect( window.MathJax.Hub.Typeset ).to.have.been.calledWith([dom.children[0]])
      expect( dom.textContent ).to.include('\\pi')

  # virtual dom doesn't seem to match mathjax processor's :not(.math-rendered)
  it 'typesets document with mathml is present', ->
    dom.innerHTML = '''
      <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
        <mrow>
          <mi>PI</mi>
        </mrow>
      </math>
    '''
    callTypeset(dom, window).then =>
      expect( window.MathJax.Hub.Typeset ).to.have.been.calledWith(window.document)
      expect( dom.textContent ).to.include('PI')

{Testing, expect, sinon, _} = require './index'

{typesetMath} = require 'helpers/mathjax'
FakeWindow = require './fake-window'

callTypeset = (dom, window) ->
  new Promise( ( res, rej ) ->
    typesetMath(dom, window)
    _.delay ->
      res(dom)
    , 110
  )


describe 'Mathjax Helper', ->

  beforeEach ->
    @dom = document.createElement('div')
    @window = new FakeWindow
    @window.MathJax = { Hub: {Typeset: sinon.spy(), Queue: sinon.spy()} }
    @window.document = @dom

  it 'can typeset latex', ->
    @dom.innerHTML = '<div data-math="\\pi">a pi symbol</div>'
    callTypeset(@dom, @window).then =>
      expect( @window.MathJax.Hub.Typeset ).to.have.been.calledWith([@dom.children[0]])
      expect( @dom.textContent ).to.include('\\pi')


  it 'typesets document with mathml is present', ->
    @dom.innerHTML = '''
      <math xmlns="http://www.w3.org/1998/Math/MathML"1
            display="inline">2
        <mrow>
          <mi>PI</mi>
        </mrow>
      </math>
    '''
    callTypeset(@dom, @window).then =>
      expect( @window.MathJax.Hub.Typeset ).to.have.been.calledWith(@window.document)
      expect( @dom.textContent ).to.include('PI')

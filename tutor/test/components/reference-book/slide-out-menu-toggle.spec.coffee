{Testing, expect, sinon, _} = require '../helpers/component-testing'

Toggle = require '../../../src/components/reference-book/slide-out-menu-toggle'

describe 'Reference Book Menu Toggle', ->

  it 'sets the width/height', ->
    Testing.renderComponent( Toggle, props: {width: 18, height: 42} ).then ({dom}) ->
      expect(dom.getAttribute('width')).to.equal('18')
      expect(dom.getAttribute('height')).to.equal('42')

  it 'renders with transform for closed', ->
    Testing.renderComponent( Toggle, props: {isVisible:false} ).then ({dom, element}) ->
      expect(
        dom.querySelector('#triangle').getAttribute('transform')
      ).to.equal('translate(-30 0)')
      expect(
        dom.querySelector('#line2').getAttribute('transform')
      ).to.equal('scale(2 1) translate(-50 0)')

  it 'renders with opened transforms', ->
    Testing.renderComponent( Toggle, props: {isVisible:true} ).then ({dom, element}) ->
      expect(
        dom.querySelector('#triangle').getAttribute('transform')
      ).to.equal('translate(0 0)')
      expect(
        dom.querySelector('#line3').getAttribute('transform')
      ).to.equal('scale(1 1) translate(0 0)')

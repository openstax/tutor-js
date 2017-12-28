/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Testing, expect, sinon, _ } from '../helpers/component-testing';

import Toggle from '../../../src/components/reference-book/slide-out-menu-toggle';

describe('Reference Book Menu Toggle', function() {

  it('sets the width/height', () =>
    Testing.renderComponent( Toggle, { props: { isMenuVisible: false, width: 18, height: 42 } } ).then(function({ dom }) {
      expect(dom.getAttribute('width')).to.equal('18');
      return expect(dom.getAttribute('height')).to.equal('42');
    })
  );

  it('renders with transform for closed', () =>
    Testing.renderComponent( Toggle, { props: { isMenuVisible: false } } ).then(function({ dom, element }) {
      expect(
        dom.querySelector('#triangle').getAttribute('transform')
      ).to.equal('translate(-30 0)');
      return expect(
        dom.querySelector('#line2').getAttribute('transform')
      ).to.equal('scale(2 1) translate(-50 0)');
    })
  );

  return it('renders with opened transforms', () =>
    Testing.renderComponent( Toggle, { props: { isMenuVisible: true } } ).then(function({ dom, element }) {
      expect(
        dom.querySelector('#triangle').getAttribute('transform')
      ).to.equal('translate(0 0)');
      return expect(
        dom.querySelector('#line3').getAttribute('transform')
      ).to.equal('scale(1 1) translate(0 0)');
    })
  );
});

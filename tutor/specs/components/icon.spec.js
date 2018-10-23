import { Testing, sinon, _, ReactTestUtils } from './helpers/component-testing';
import React from 'react';
import Icon from '../../src/components/icon';

describe('Icon Component', function() {
  let props = {};

  beforeEach(() => props = { type: 'test' });

  it('renders', () =>
    Testing.renderComponent( Icon, { props } ).then(function({ dom }) {
      expect(dom.tagName).to.equal('I');
      return expect(_.toArray(dom.classList)).to.include('fa-test', 'fa');
    })
  );

  it('renders with a tooltip', function() {
    props.tooltipProps = { placement: 'bottom' };
    props.tooltip = 'a testing tooltip';
    return Testing.renderComponent( Icon, { props } ).then(({ dom }) => {
      //icon should be a button so it's easy to tap and click when tooltip prop is defined
      expect(dom.tagName).to.equal('BUTTON');

      ReactTestUtils.Simulate.mouseOver(dom);
      const tooltipEl = document.querySelector('div[role="tooltip"]');
      return expect(tooltipEl.textContent).to.equal(props.tooltip);
    });
  });


  return it('sets on-navbar css class', function() {
    props.onNavbar = true;
    props.tooltipProps = { placement: 'bottom' };
    props.tooltip = 'a testing tooltip';
    return Testing.renderComponent( Icon, { props } ).then(function({ dom }) {
      ReactTestUtils.Simulate.mouseOver(dom);
      const tooltipEl = _.last(document.querySelectorAll('div[role="tooltip"]'));
      return expect(_.toArray(tooltipEl.classList)).to.include('on-navbar');
    });
  });
});

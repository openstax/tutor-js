import { React, _ } from '../../helpers/component-testing';
import Promise from 'es6-promise';
import HelpTooltip from '../../../../src/components/task-plan/footer/help-tooltip';

const displayPopover = props =>
  new Promise( function(resolve, reject) {
    const wrapper = mount(<HelpTooltip {...props} />);
    wrapper.simulate('click');
    resolve(_.last(document.querySelectorAll('#plan-footer-popover')))
  });


describe('Task Plan Builder: Help tooltip', function() {

  beforeEach(function() {
    return (
        this.props =
          {isPublished: false}
    );
  });

  it('displays popover that mentions publishing', function() {
    return (
        displayPopover(this.props).then(dom => expect(dom.textContent).to.include("Publish"))
    );
  });

  it('doesn’t mention publishing if task plan is published', function() {
    this.props.isPublished = true;
    return (
        displayPopover(this.props).then(dom => expect(dom.textContent).to.not.include("Publish"))
    );
  });


  it('doesn’t mention delete unless task plan is published', function() {
    displayPopover(this.props)
      .then(dom => expect(dom.textContent).not.to.include("Delete Assignment"));

    this.props.isPublished = true;
    displayPopover(this.props)
      .then(dom => expect(dom.textContent).to.include("Delete Assignment"));
  });
});

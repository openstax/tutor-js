import { React, ld } from '../../../helpers';
import HelpTooltip from '../../../../src/screens/assignment-builder/footer/help-tooltip';

const displayPopover = props =>
  new Promise( function(resolve) {
    const wrapper = mount(<HelpTooltip {...props} />);
    wrapper.simulate('mouseOver');
    setTimeout(() => {
      resolve(ld.last(document.querySelectorAll('#plan-footer-popover')));
    }, 10);
  });


// issues with popper & jsdom
xdescribe('Task Plan Builder: Help tooltip', function() {
  let props;

  beforeEach(function() {
    props = { isPublished: false };
  });

  it('displays popover that mentions publishing', function() {
    return (
      displayPopover(props).then(dom => expect(dom.textContent).to.include('Publish'))
    );
  });

  it('doesn’t mention publishing if task plan is published', function() {
    props.isPublished = true;
    return (
      displayPopover(props).then(dom => expect(dom.textContent).to.not.include('Publish'))
    );
  });


  it('doesn’t mention delete unless task plan is published', function() {
    displayPopover(props)
      .then(dom => expect(dom.textContent).not.to.include('Delete Assignment'));

    props.isPublished = true;
    displayPopover(props)
      .then(dom => expect(dom.textContent).to.include('Delete Assignment'));
  });
});

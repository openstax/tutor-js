import { React, ld } from '../../../helpers';
import Promise from 'es6-promise';
import HelpTooltip from '../../../../src/components/task-plan/footer/help-tooltip';

const displayPopover = props =>
  new Promise( function(resolve, reject) {
    const wrapper = mount(<HelpTooltip {...props} />);
    wrapper.simulate('click');
    resolve(_.last(document.querySelectorAll('#plan-footer-popover')));
  });


describe('Task Plan Builder: Help tooltip', function() {
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

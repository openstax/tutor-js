/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { Testing, expect, sinon, _ } from '../helpers/component-testing';

import Toggle from '../../../src/components/reference-book/teacher-content-toggle';

describe('Teacher Content Toggle', function() {

  beforeEach(function() {
    return this.props = {
      onChange: sinon.spy(),
      isShowing: false,
      windowImpl: {
        document: document.createElement('div'),
      },
    };
  });

  it('defaults to not showing teacher content', function(done) {
    return Testing.renderComponent( Toggle, { props: this.props } ).then(({ element }) => {
      expect(element.getDOMNode().querySelector('.no-content')).to.exist;
      Testing.actions.click(element.getDOMNode());
      return _.defer(() => {
        expect(this.props.onChange).not.to.have.been.called;
        return done();
      });
    });
  });

  it('can detect teacher selector', function(done) {
    this.props.windowImpl.document.innerHTML = '\
<div><p class=\'os-teacher\'>Hai I AM TEACHER</p></div>\
';
    return Testing.renderComponent( Toggle, { props: this.props, unmountAfter: 10 } ).then(({ element }) =>
      _.defer(function() {
        expect(element.state.hasTeacherContent).to.be.true;
        return done();
      })
    );
  });


  return it('calls callback when clicked and content is available', function(done) {
    this.props.windowImpl.document.innerHTML = '\
<div><p class=\'os-teacher\'>Hai I AM TEACHER</p></div>\
';
    return Testing.renderComponent( Toggle, { props: this.props, unmountAfter: 10 } ).then(({ element }) => {

      Testing.actions.click(element.getDOMNode());
      return _.defer(() => {
        expect(element.getDOMNode().textContent).to.include('Show');
        expect(this.props.onChange).to.have.been.calledWith(true);
        return done();
      });
    });
  });
});

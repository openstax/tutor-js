/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import { React, Testing, pause, sinon, _, ReactTestUtils } from '../helpers/component-testing';
import ld from 'lodash';
import Roster from '../../../src/components/course-roster/roster';
import { bootstrapCoursesList } from '../../courses-test-data';
import COURSE from '../../../api/user/courses/1.json';
import ROSTER from '../../../api/courses/1/roster.json';

const COURSE_ID = '1';

describe('Course Settings', function() {

  let props;

  beforeEach(function() {
    bootstrapCoursesList();
    props = {
      params: { courseId: COURSE_ID },
    };
  });

  fit('renders period panels', () => {
    const wrapper = mount(<Roster {...props} />);
    const iterable = ['1st', '2nd', '3rd', '5th', '6th', '10th'];
    for (let i = 0; i < iterable.length; i++) {
      const period = iterable[i];
      expect(wrapper.find('.periods .nav-tabs li').at(i).text())
        .to.equal(period);
    }

  });

  it('renders students in the panels', function() {
    const wrapper = mount(<Roster {...this.props} />);
    const iterable = ['Angstrom', 'Glass', 'Hackett', 'Jaskolski', 'Lowe', 'Tromp', 'Reilly'];
    for (let i = 0; i < iterable.length; i++) {
      const name = iterable[i];
      expect(wrapper.find('.roster tbody tr').at(i).find('td').at(1).text())
        .to.equal(name);
    }

  });

  it('switches roster when tab is clicked', function() {
    const wrapper = mount(<Roster {...this.props} />);
    const tab = wrapper.find('.periods .nav-tabs li').at(1).find('h2');
    tab.simulate('click');
    expect(wrapper.find('.roster tbody tr').at(0).find('td').at(1).text())
      .to.equal('Bloom');
    expect(wrapper.find('.roster tbody tr').at(1).find('td').at(1).text())
      .to.equal('Kirlin');
  });

  it('can archive periods', function() {
    const wrapper = mount(<Roster {...this.props} />);
    expect(wrapper.find('.nav-tabs .active').text()).to.equal('1st');
    wrapper.find('.control.delete-period').simulate('click');

    const modal = _.last(document.querySelectorAll('.settings-delete-period-modal'));
    expect(modal).to.exist;
    Testing.actions.click(modal.querySelector('button.delete'));
    expect(PeriodActions.delete).to.have.been.called;
    wrapper.update();
    expect(wrapper.find('.nav-tabs .active').text()).to.equal('2nd');
    expect(wrapper.find('.roster tbody tr').at(0).find('td').at(1).text())
      .to.equal('Bloom');
  });

  it('can view and unarchive periods', function() {
    const wrapper = mount(<Roster {...this.props} />)

    wrapper.find('.view-archived-periods button').simulate('click');
    const periods = _.pluck(document.querySelectorAll(
      '.settings-view-archived-periods-modal tbody td:first-child'), 'textContent'
    );

    expect(periods).to.deep.equal(['4th', '7th']);
    Testing.actions.click(
      document.querySelector('.settings-view-archived-periods-modal .restore-period .btn')
    );
    expect(PeriodActions.restore).to.have.been.called;

  });
});

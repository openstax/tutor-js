import Factory, { FactoryBot } from '../../factories';

import Dashboard from '../../../src/screens/question-library/dashboard';

//import { Testing, sinon, _, SnapShot, React, Wrapper, ReactTestUtils } from '../helpers/component-testing';

// jest.mock('react-dom');
// const ReactDOM = require('react-dom');
//
// const FakeDOMNode = require('shared/specs/helpers/fake-dom-node');
// const ld = require('lodash');
//
//
// const {TocStore, TocActions} = require('../../../src/flux/toc');
// const { default: Courses } = require('../../../src/models/courses-map');
// const COURSE = require('../../../api/user/courses/1.json');
// const TOC = require('../../../api/ecosystems/2/readings.json');
// const COURSE_ID = '1';
// const ECOSYSTEM_ID = '2';
//
describe('Questions Dashboard Component', function() {
  let props, course;

  beforeEach(function() {
    course = Factory.course();
    props = {
      course
    };

  });

  it('matches snapshot', function() {
    const dash = mount(<Dashboard {...props} />);
    //     ReactDOM.findDOMNode = jest.fn(() => new FakeDOMNode)
    //
    //     expect(SnapShot.create(
    //       <Wrapper _wrapped_component={Dashboard} noReference={true} {...props} />).toJSON()
    //     ).toMatchSnapshot();
    //     return (
    //         undefined
    //     );
  });
});

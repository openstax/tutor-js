import { React } from '../helpers/component-testing';
jest.mock('../../../src/models/loader');

import NewCourse from '../../../src/components/new-course';

describe('NewCourse wrapper', function() {

  it('loads offerings when created', function() {
    const wrapper = shallow(<NewCourse />);
    expect(wrapper.instance().loader.constructor)
      .toHaveBeenCalledWith(expect.objectContaining({ fetch: true }));
  });
});

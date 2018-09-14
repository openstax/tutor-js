import { React, SnapShot } from '../../components/helpers/component-testing';
import LmsPair from '../../../src/screens/lms-pair';
import UX from '../../../src/screens/lms-pair/ux';
import Factory from '../../factories';

jest.mock('../../../src/helpers/dom', () => ({
  readBootstrapData: jest.fn(() => ({

  })),
}));

describe('pairing a course', () => {

  let props;
  beforeEach(() => {
    props = {
      ux: new UX(),
    };
  });

  it('displays only create when no courses', () => {
    const component = SnapShot.create(<LmsPair {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays find or create when existing courses', () => {
    props.ux.courses = Factory.coursesMap();
    const component = SnapShot.create(<LmsPair {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays course listing', () => {
    props.ux.courses = Factory.coursesMap();
    props.ux.newOrExisting = 'existing';
    props.ux.stage = 1;
    const component = SnapShot.create(<LmsPair {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('displays create course', () => {
    props.ux.courses = Factory.coursesMap();
    props.ux.newOrExisting = 'new';
    props.ux.stage = 1;
    const component = SnapShot.create(<LmsPair {...props} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

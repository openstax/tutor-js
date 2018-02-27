import { SnapShot } from './helpers/component-testing';
import Factory, { FactoryBot } from '../factories';
import Chooser from '../../src/components/sections-chooser';

describe('Sections Chooser', () => {
  let book, props;

  beforeEach(() => {
    book = Factory.book();
    props = {
      book,
      onSelectionChange: jest.fn(),
      selectedSectionIds: [],
    };
  });

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(<Chooser {...props} />).toJSON()).toMatchSnapshot();

    // const chooser = mount(<Chooser {...props} />);
    // console.log(chooser.debug())

  })


})

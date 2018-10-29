import { Testing, ld } from './helpers';

import Name from '../../src/components/name';

describe('Name Component', function() {
  let props = {};
  beforeEach(() =>
    props = {
      name: 'Prince Humperdinck',
      first_name: 'Vincent',
      last_name: 'Adultman',
      tooltip: { enable: false },
    });

  it('renders using name if present and ignores first and last name', () =>
    Testing.renderComponent( Name, { props } ).then(({ dom }) => expect(dom.textContent).toEqual('Prince Humperdinck'))
  );

  return describe('when missing name', function() {
    it('doesn\'t use a undefined name', function() {
      delete props.name;
      return Testing.renderComponent( Name, { props } ).then(({ dom }) => expect(dom.textContent).toEqual('Vincent Adultman'));
    });

    it('doesn\'t use a null name', function() {
      props.name = null;
      return Testing.renderComponent( Name, { props } ).then(({ dom }) => expect(dom.textContent).toEqual('Vincent Adultman'));
    });

    return it('doesn\'t use an empty name', function() {
      props.name = '';
      return Testing.renderComponent( Name, { props } ).then(({ dom }) => expect(dom.textContent).toEqual('Vincent Adultman'));
    });
  });
});

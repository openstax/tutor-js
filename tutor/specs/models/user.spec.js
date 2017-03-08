import { autorun } from 'mobx';

import User from '../../src/models/user';

import USER_DATA from '../../api/user.json';

describe('Course Model', () => {

  it('can be bootstrapped', () => {
    const spy = jest.fn();
    autorun(() => spy(User.name));
    expect(spy).toHaveBeenCalledWith(undefined);
    User.bootstrap(USER_DATA);
    expect(spy).toHaveBeenCalledWith(USER_DATA.name);
  });

});

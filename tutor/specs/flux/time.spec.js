import { TimeActions, TimeStore } from '../../src/flux/time';

const SERVER_TIME = new Date('2000-02-02');
const LOCAL_TIME = new Date('2011-11-11');

describe('Server Time', function() {

  let consoleMock;

  beforeEach(() => {
    consoleMock = jest.spyOn(console, 'warn');
    consoleMock.mockImplementation(() => {});
  });

  afterEach(() => {
    TimeActions.reset();
    consoleMock.mockRestore();
  });

  it('returns the server time', function() {
    TimeActions.setNow(SERVER_TIME, LOCAL_TIME);
    const time = TimeStore.getNow(LOCAL_TIME);
    // Use strings so millisecs do not matter
    expect(`${time}`).toEqual(`${SERVER_TIME}`);
  });

  it('prevents invalid dates from being set', function() {
    const today = TimeStore.getNow().toDateString();
    TimeActions.setFromString('an invalid date');
    expect(TimeStore.getNow().toDateString()).toEqual(today);
  });

  it('can be set from string', function() {
    const now = new Date();
    const iso_string = 'Fri Nov 11 2011 00:00:00 GMT+0000 (UTC)';
    TimeActions.setFromString(iso_string, now);
    const time = TimeStore.getNow(now);
    expect( new Date(iso_string).toDateString() ).toEqual( time.toDateString() );
  });
});

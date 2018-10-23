jest.mock('model/networking');
jest.mock('loglevel');
jest.mock('lodash/debounce', () =>
  jest.fn(
    fn => () => fn())
);

const debounce = require('lodash/debounce');
const Networking = require('model/networking');
const ConsoleLogger = require('loglevel');

const URLs = require('model/urls');

const Log = require('helpers/logging');

jest.useFakeTimers();

describe('Loggging', function() {
  beforeEach(function() {
    this.urls = { tutor_api_url: 'http://foo.bar.com/' };
    return URLs.update(this.urls);
  });

  afterEach(function() {
    Log.clearPending();
    ConsoleLogger.error.mockClear();
    return Networking.perform.mockClear();
  });

  it('logs messages', function() {
    for (let level of Log.levels) {
      Log[level](`Testing ${level}`);
      expect(ConsoleLogger[level]).toHaveBeenLastCalledWith(`Testing ${level}`);
    }
    return undefined;
  });

  it('persists messages', function() {
    const msg = 'here\'s your info';
    Log.info(msg, { persist: true });
    expect(ConsoleLogger.info).toHaveBeenLastCalledWith(msg);
    jest.runAllTimers();
    return expect(Networking.perform).toHaveBeenLastCalledWith({
      data: { entries: [{ location: 'about:blank', level: 'info', message: msg }] },
      method: 'POST',
      url: 'http://foo.bar.com/log/entry',
    });
  });

  it('skips persisting if api host is missing', function() {
    URLs.reset();
    const msg = 'a debug msg';
    Log.info(msg, { persist: true });
    expect(ConsoleLogger.info).toHaveBeenLastCalledWith(msg);
    jest.runAllTimers();
    expect(Networking.perform).not.toHaveBeenCalled();
    return undefined;
  });

  it('defaults to persisting for warnings', function() {
    const msg = 'bang() goes the err';
    Log.error(msg);
    expect(ConsoleLogger.error).toHaveBeenLastCalledWith(msg);
    jest.runAllTimers();

    return expect(Networking.perform).toHaveBeenLastCalledWith({
      data: { entries: [{ location: 'about:blank', level: 'error', message: msg }] },
      method: 'POST',
      url: 'http://foo.bar.com/log/entry',
    });
  });

  it('can override persist', function() {
    const msg = 'warning you of things';
    Log.warn(msg, { persist: false });
    expect(ConsoleLogger.warn).toHaveBeenLastCalledWith(msg);
    return expect(Networking.perform).to.not.haveBeenCalled;
  });

  return it('transmits multiple messages together', function() {
    for (let num = 1; num <= 10; num++) {
      Log.error(`bang(${num}) goes the err`);
    }
    expect(
      ConsoleLogger.error
    ).toHaveBeenCalledTimes(10);
    expect(debounce).toHaveBeenCalled();
    return undefined;
  });
});

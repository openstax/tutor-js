import { autorun } from 'mobx';

import FeatureFlags, { FeatureFlagsApi, defaultValues } from '../../src/models/featureldflags';

describe('Feature Flags', () => {

  afterEach(() => {
    FeatureFlagsApi.bootstrap(defaultValues);
  });

  it('has defaults', () => {
    expect(FeatureFlags.is_highlighting_allowed).toBe(false);
    expect(FeatureFlags.is_payments_enabled).toBe(true);
  });

  it('bootstraping resets defaults', () => {
    FeatureFlagsApi.bootstrap({ is_highlighting_allowed: true, is_payments_enabled: false });
    expect(FeatureFlags.is_highlighting_allowed).toBe(true);
    expect(FeatureFlags.is_payments_enabled).toBe(false);
  });

  it('does not allow setting new values', () => {
    expect(() => {
      FeatureFlags.foo = 'bar';
    }).toThrow(TypeError);
  });

  it('does not allow changing flags', () => {
    expect(() => {
      FeatureFlags.is_highlighting_allowed = true;
    }).toThrow(TypeError);
  });

  it('is observable and fires when bootstrapped', () => {
    const changeSpy = jest.fn();
    autorun(() => changeSpy(FeatureFlags.is_highlighting_allowed));
    expect(changeSpy).toHaveBeenCalledTimes(1);
    FeatureFlagsApi.bootstrap({ is_highlighting_allowed: true });
    expect(changeSpy).toHaveBeenCalledTimes(2);
  });

});

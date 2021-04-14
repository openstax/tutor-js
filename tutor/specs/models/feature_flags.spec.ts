import { action, autorun, runInAction } from 'mobx';

import { FeatureFlags, FeatureFlagsApi, FeatureFlagDefaultValues } from '../../src/models'

describe('Feature Flags', () => {

    afterEach(action(() => {
        FeatureFlagsApi.bootstrap(FeatureFlagDefaultValues);
    }));

    it('has defaults', () => {
        expect(FeatureFlags.is_payments_enabled).toBe(true);
    });

    it('bootstraping resets defaults', () => {
        FeatureFlagsApi.bootstrap({ is_payments_enabled: false });
        expect(FeatureFlags.is_payments_enabled).toBe(false);
    });

    it('does not allow setting new values', () => {
        expect(() => {
            (FeatureFlags as any).foo = 'bar';
        }).toThrow(TypeError);
    });

    it('does not allow changing flags', () => {
        expect(() => {
            FeatureFlags.is_payments_enabled = true;
        }).toThrow(TypeError);
    });

    it('is observable and fires when bootstrapped', () => {
        const changeSpy = jest.fn();
        autorun(() => changeSpy(FeatureFlags.is_payments_enabled));
        expect(changeSpy).toHaveBeenCalledTimes(1);
        runInAction(()=> FeatureFlagsApi.bootstrap({ is_payments_enabled: false }) )
        expect(changeSpy).toHaveBeenCalledTimes(2);
    });

});

import loadjs from 'loadjs';
import { FeatureFlags, Raven } from '../../models'
import type { User } from '../../models'

export const PulseInsights = {
    boot(currentUser: User) {
        if (!FeatureFlags.pulse_insights) {
            return Promise.resolve({});
        }
        const w = window as any;
        w.pi = function() {
            w.pi.commands = (w.pi.commands || []);
            w.pi.commands.push(arguments);
        };
        w.pi('identify', 'PI-16384954');
        w.pi('identify_client', currentUser.account_uuid);
        w.pi('set_custom_data', currentUser.metrics);
        w.pi('pushBeforeGet', true);
        w.pi('get', 'surveys');
        return loadjs('//js.pulseinsights.com/surveys.js', {
            async: true,
            returnPromise: true,
            error: () => Raven.log('Failed to load PulseInsights script'),
        });
    },
};

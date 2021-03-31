import { observable, ObservableMap } from 'mobx';

export const defaultValues = {
    tours: true,
    is_payments_enabled: true,
    force_browser_reload: false,
    pulse_insights: false,
    teacher_student_enabled: false,
};

const FeatureFlags:ObservableMap<string, boolean> & { bootstrap(_v: any):void } = observable.map(defaultValues) as any

FeatureFlags.bootstrap = (values: any) => {
    FeatureFlags.merge(values);
};

const FlagsInterface: typeof defaultValues = {} as any;

FeatureFlags.forEach((_, name) => {

    Object.defineProperty(FlagsInterface, name, {

        get: () => FeatureFlags.get(name),

    });

});

Object.freeze(FlagsInterface);

export default FlagsInterface;
export { FeatureFlags as FeatureFlagsApi };

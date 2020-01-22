import { observable } from 'mobx';

export const defaultValues = {
  tours: true,
  is_payments_enabled: true,
  pulse_insights: false,
  teacher_student_enabled: false,
};

const FeatureFlags = observable.map(defaultValues);

FeatureFlags.bootstrap = (values) => {
  FeatureFlags.merge(values);
};

const FlagsInterface = {};

FeatureFlags.forEach((_, name) => {

  Object.defineProperty(FlagsInterface, name, {

    get: () => FeatureFlags.get(name),

  });

});

Object.freeze(FlagsInterface);

export default FlagsInterface;
export { FeatureFlags as FeatureFlagsApi };

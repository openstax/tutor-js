import { observable } from 'mobx';

export const defaultValues = {
  is_payments_enabled: true,
  pulse_insights: false,
  teacher_student_enabled: false,
};

const FeatureFlagValues = observable.map(defaultValues);

export const FeatureFlagsApi = {
  bootstrap(values) {
    FeatureFlagValues.merge(values);
  },
};

const FlagsInterface = {};

FeatureFlagValues.forEach((_, name) => {

  Object.defineProperty(FlagsInterface, name, {

    get: () => FeatureFlagValues.get(name),

  });

});

Object.freeze(FlagsInterface);

export default FlagsInterface;

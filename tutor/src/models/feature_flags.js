import { observable } from 'mobx';

export const defaultValues = {
  is_highlighting_allowed: true,
  is_payments_enabled: true,
};

const FeatureFlagValues = observable.map(defaultValues);

export const FeatureFlagsApi = {
  bootstrap(values) {
    FeatureFlagValues.merge(values);
    FeatureFlagValues.is_highlighting_allowed = true;
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

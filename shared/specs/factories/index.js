import Factory from 'object-factory-bot';
import { each } from 'lodash';
import Exercise from '../../src/model/exercise';
import './exercise';

const Factories = {};

each({
  Exercise,
}, (Model, name) => {
  Factories[name] = (attrs = {}) => {
    const o = Factory.create(name, attrs);
    return new Model(o);
  };
});

export { Factory };
export default Factories;

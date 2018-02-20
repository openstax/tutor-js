import Factory from 'object-factory-bot';
import { each } from 'lodash';
import Course from '../src/models/course';
import './course';


const Factories = {};

each({
  Course,
}, (Model, name) => {
  Factories[name] = (attrs = {}) => {
    const o = Factory.create(name, attrs);
    return new Model(o);
  };
});

export { Factory };
export default Factories;

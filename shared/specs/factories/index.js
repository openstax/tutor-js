import Factory from 'object-factory-bot';
import { each, camelCase } from 'lodash';
import Exercise from '../../src/model/exercise';
import './exercise';

const Factories = {};

each({
    Exercise,
}, (Model, name) => {
    Factories[camelCase(name)] = (attrs = {}) => {
        const o = Factory.create(name, attrs);
        return new Model(o);
    };
});

export { Factory };
export default Factories;

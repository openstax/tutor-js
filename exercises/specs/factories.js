import FactoryBot from 'object-factory-bot';
import { each, camelCase, times } from 'lodash';
import { ExercisesMap, Exercise } from '../src/models/exercises';
import '../../shared/specs/factories';

const Factories = {};
each({
    Exercise,
}, (Model, name) => {
    Factories[camelCase(name)] = (attrs = {}) => {
        const o = FactoryBot.create(name, attrs);
        return new Model(o);
    };
});

Factories.data = (...args) => FactoryBot.create(...args);


Factories.exercisesMap = ({ count = 4 } = {}) => {
    const map = new ExercisesMap();
    times(count, () => map.onLoaded({ data: FactoryBot.create('Exercise') }));
    return map;
};

export { FactoryBot };

export default Factories;

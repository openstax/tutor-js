import FactoryBot from 'object-factory-bot';
import { hydrate } from 'modeled-mobx'
import { times } from 'lodash';
import { ExercisesMap, Exercise } from '../src/models/exercises';
import '../../shared/specs/factories';

const Factories = {

    exercise: (attrs: any = {}) => hydrate(Exercise, FactoryBot.create('Exercise', attrs)),

    data: (name: string, attrs: any) => FactoryBot.create(name, attrs),

    exercisesMap: ({ count = 4 } = {}) => {
        const map = new ExercisesMap();
        times(count, () => map.onLoaded({ data: FactoryBot.create('Exercise') }));
        return map;
    }
}

export { FactoryBot };

export default Factories;

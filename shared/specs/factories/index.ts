import Factory from 'object-factory-bot';
import { hydrateModel } from 'modeled-mobx'
import Exercise from '../../src/model/exercise';
import './exercise';

const Factories = {

    exercise: (attrs: any = {}) => hydrateModel(Exercise, Factory.create('Exercise', attrs)),

}

export { Factory };
export default Factories;

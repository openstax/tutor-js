import { lazyGetter } from 'shared/model';
import Search from './models/search';

export default class ExerciseUX {

    @lazyGetter search = new Search();

}

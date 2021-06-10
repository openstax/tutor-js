import { lazyGetter } from 'shared/model';
import Search from './models/search';

export default class ExerciseUX {

    @lazyGetter get search() { return new Search() }

}

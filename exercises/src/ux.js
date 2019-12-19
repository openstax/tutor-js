import lazyGetter from 'shared/helpers/lazy-getter';
import Search from './models/search';

export default class ExerciseUX {

  @lazyGetter search = new Search();

}

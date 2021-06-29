import { lazyGetter, action } from 'shared/model';
import qs from 'qs';
import Search from './models/search';

export default class ExerciseUX {

    @lazyGetter get search() { return new Search() }

    @action setSearchDefault(queryString: string) {
        const { q: query } = qs.parse(queryString)
        if (query && typeof query == 'string') {
            this.search.update(query)
            this.search.execute()
        }
    }
}

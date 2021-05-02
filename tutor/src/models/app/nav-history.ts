import {
    observable, action, modelize,
} from 'shared/model';
import DestinationHelper from '../../helpers/routes-and-destinations'
import { last } from 'lodash'

export class NavHistory {

    history = observable.array()

    constructor() {
        modelize(this)
    }

    get latest() {
        return last(this.history)
    }

    @action record(path: string) {
        if (path !== this.latest && DestinationHelper.shouldRememberRoute(path)) {
            this.history.push(path)
        }
    }

}

export const navHistory = new NavHistory()

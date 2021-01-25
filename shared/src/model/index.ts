// will eventually hook into data loading/saving using the
// derived model's identifiedBy strings
import { computed, action } from 'mobx';
import { find, isNil, get } from 'lodash';
import { getSchema } from 'mobx-decorated-models';
const FLUX_NEW = /_CREATING_/;
import ModelApi from './api';
import './types';

export type ID = string | number

export class BaseModel {

    constructor(attrs: any) {
        if (attrs) { this.update(attrs); }
    }

    get api(): ModelApi {
        const api = new ModelApi();
        Object.defineProperty(this, 'api', { value: api, writable: false });
        return api
    }

    @computed get isNew() {
        const schema = getSchema(this.constructor);
        const idField: any = find(Array.from(schema.properties.values()), { type: 'identifier' });
        if (!idField) {
            return false;
        }
        const id = this[idField.name];
        return isNil(id) || FLUX_NEW.test(id);
    }

    @action ensureLoaded() {
        if (!this.api.isPending && !this.api.hasBeenFetched) {
            return this.fetch();
        }
        return Promise.resolve();
    }

    @action onApiRequestComplete({ data }: any) {
        this.api.errors = {};
        this.update(data);
    }
    // @ts-ignore
    update(args: any) { } // will be overwritten by mobx-decorated-models
    fetch() { } // will be overwritten by api

    @action
    setApiErrors(error: any) {
        error.isRecorded = true;
        const errors = get(error, 'response.data.errors');
        if (errors) {
            this.api.errors = {};
            errors.forEach((e: any) => this.api.errors[e.code] = e);
            this.api.errors.last = error;
        } else if (error) {
            this.api.errors = {
                error: error.toString(),
                last: error,
            };
        } else {
            this.api.errors = {};
        }
    }

}

// export decorators so they can be easily imported into model classes
export {
    identifiedBy, identifier, hasMany, belongsTo, field, session,
} from 'mobx-decorated-models';

export {
    computed,
    observable,
    action,
} from 'mobx';

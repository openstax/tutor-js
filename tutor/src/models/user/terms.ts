import { BaseModel, field, model, modelize, computed, action, array, NEW_ID, ID, getParentOf } from 'shared/model';
import { isProd } from '../../helpers/production'
import type { User } from '../../models'
import { UserTermData } from '../../models'
import urlFor from '../../api'

const REQUIRED_FOR_EVERYONE = [
    'general_terms_of_use',
    'privacy_policy',
];

export class UserTerm extends BaseModel {
    @field id = NEW_ID;
    @field title = '';
    @field content = '';
    @field has_signed_before = false;
    @field is_proxy_signed = false;
    @field is_signed = false;
    @field name = '';

    constructor() {
        super();
        modelize(this);
    }

    @computed get isRequired() {
        return !!REQUIRED_FOR_EVERYONE.includes(this.name);
    }

    @computed get hasAgreed() {
        return Boolean(this.is_signed || this.is_proxy_signed);
    }
}


export class UserTermsMap extends BaseModel {
    @model(UserTerm) terms = array<UserTerm>()

    constructor() {
        super();
        modelize(this);
    }

    get user() { return getParentOf<User>(this) }

    hasAgreedTo(name: string) {
        const term = this.get(name);
        // allow bypassing terms on local dev since the localBE will not have the terms loaded
        return term ? term.hasAgreed : !isProd;
    }

    @computed get areSignaturesNeeded() {
        return this.requiredAndUnsigned.length !== 0;
    }

    @computed get requiredAndUnsigned() {
        return this.user.available_terms.filter(t => t.isRequired && !t.hasAgreed);
    }

    @action.bound fetchIfNeeded() {
        if (this.areSignaturesNeeded) { this.fetch(); }
    }

    get(name: string): UserTerm | undefined {
        return this.user.available_terms.find(t => t.name == name);
    }

    // will be overwritten by api
    async fetch() {
        const terms = await this.api.request<UserTermData[]>(urlFor('fetchUserTerms'))
        this.onLoaded(terms)
    }

    @action onLoaded(terms: UserTermData[]) {
        terms.forEach((termData) => {
            const term = this.get(termData.name);
            if (term) {
                term.update(termData)
            } else {
                this.user.available_terms.push(termData as UserTerm)
            }
        });
    }

    // called by api
    async sign(termIds: ID[]) {
        await this.api.request(urlFor('signUserTerms', { termIds }))
        this.onSigned(termIds)
    }

    // called after signed api completes
    onSigned(ids: ID[]) {
        this.user.available_terms.forEach(t => {
            if (ids.includes(t.id)) {
                t.is_signed = true;
            }
        });

    }


}

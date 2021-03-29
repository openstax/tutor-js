import { BaseModel, field, model, modelize, computed, action, NEW_ID } from 'shared/model';
import { isProd } from '../../helpers/production';

const REQUIRED_FOR_EVERYONE = [
    'general_terms_of_use',
    'privacy_policy',
];

class Term extends BaseModel {
    @field id = NEW_ID;
    @field title;
    @field content;
    @field has_signed_before;
    @field is_proxy_signed;
    @field is_signed;
    @field name;

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
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


class UserTerms extends BaseModel {
    @model('user') user;
    @model(Term) terms = [];

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        modelize(this);
    }

    hasAgreedTo(name) {
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

    get(name) {
        return this.user.available_terms.find(t => t.name == name);
    }

    // will be overwritten by api
    fetch() { }

    onLoaded({ data }) {
        data.forEach((termData) => {
            const term = this.get(termData.name);
            if (term) {
                term.update(termData);
            } else {
                this.user.available_terms.push(termData);
            }
        });
    }

    // called after signed api completes
    onSigned(resp, [ids]) {
        this.user.available_terms.forEach(t => {
            if (ids.includes(t.id)) {
                t.is_signed = true;
            }
        });

    }

    // called by api
    sign(ids) {
        return { ids };
    }
}

export { Term, UserTerms };

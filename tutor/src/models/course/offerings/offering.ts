import { BaseModel, field, NEW_ID, array, modelize, model, computed } from 'shared/model';
import { filter, includes, first } from 'lodash';
import { readonly } from 'core-decorators';
import Term from './term';

export default class Offering extends BaseModel {
    @readonly static possibleTerms = [
        'spring', 'summer', 'fall', 'winter',
    ];

    @field id = NEW_ID;
    @field title = '';
    @field description = '';
    @field is_concept_coach = false;
    @field is_tutor = false;
    @field is_preview_available = true;
    @field is_available = true;
    @field preview_message = '';
    @field appearance_code = '';

    @model(Term) active_term_years = array<Term>()

    constructor() {
        super();
        modelize(this);
    }

    @computed get validTerms() {
        if (this.is_concept_coach){
            return filter(this.active_term_years, (t) => t.year == 2017 && includes(['spring', 'summer'], t.term));
        }
        return this.active_term_years;
    }

    @computed get currentTerm() {
        return first(this.validTerms);
    }
}

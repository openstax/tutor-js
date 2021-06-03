import { BaseModel, field, NEW_ID, array, modelize, model, computed } from 'shared/model';
import { filter, includes, first } from 'lodash';
import { readonly } from 'core-decorators';
import { CourseTerm } from '../../../models'

export class Offering extends BaseModel {
    @readonly static possibleTerms = [
        'spring', 'summer', 'fall', 'winter',
    ];

    readonly SOC2E_BOOK_ID = 'introduction-sociology-2e'
    readonly SOC3E_BOOK_ID = 'introduction-sociology-3e'

    @field id = NEW_ID;
    @field title = '';
    @field number = 0;
    @field description = '';
    @field is_concept_coach = false;
    @field is_tutor = false;
    @field is_preview_available = true;
    @field is_available = true;
    @field preview_message = '';
    @field appearance_code = '';
    @field subject = ''
    @field os_book_id = ''

    @model(CourseTerm) active_term_years = array<CourseTerm>()

    constructor() {
        super();
        modelize(this);
    }

    @computed get validTerms() {
        if (this.is_concept_coach) {
            return filter(this.active_term_years, (t) => t.year == 2017 && includes(['spring', 'summer'], t.term));
        }
        return this.active_term_years;
    }

    @computed get currentTerm() {
        return first(this.validTerms);
    }

    @computed get isSociology2e() {
        return this.os_book_id === this.SOC2E_BOOK_ID
    }

    @computed get isSociology3e() {
        return this.os_book_id === this.SOC3E_BOOK_ID
    }
}

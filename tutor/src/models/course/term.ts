import {
    BaseModel, field, modelize,
} from 'shared/model';

export class CourseTerm extends BaseModel {

    @field term = '';
    @field year = 0;

    constructor() {
        super();
        modelize(this);
    }

    is(term: string, year: number) {
        return this.term == term && this.year === year;
    }

    isEqual(other: CourseTerm) {
        return Boolean(other && this.is(other.term, other.year));
    }
}

import { orderBy, sortBy, take, filter, map, flatten, uniq } from 'lodash';
import {
    BaseModel, field, model, computed, array, observable,
    getParentOf, modelize, ID, NEW_ID, runInAction, action,
} from 'shared/model';
import urlFor from '../../api'
import { ChapterSection } from '../../models'
import type { Course  } from '../../models'

const findAllSections = function(section: PerformancePart): PerformancePart[] {
    if (!section) { return []; }
    const sections = [];
    if (section.chapter_section != null && section.chapter_section.section) {
        sections.push(section);
    }
    if (section.children) {
        for (let child of section.children) {
            for (section of findAllSections(child)) {
                sections.push(section);
            }
        }
    }
    return sections;
};

class PerformanceClue {
    @field minimum = 0
    @field most_likely = 0.5
    @field maximum = 1
    @field is_real = false

    constructor() {
        modelize(this)
    }

}

class PerformancePart {

    @model(ChapterSection) chapter_section = ChapterSection.blank
    @model(PerformancePart) children = array<PerformancePart>()
    @field clue: PerformanceClue = new PerformanceClue()
    @field page_ids: ID[] = []
    @field questions_answered_count = 0
    @field student_count = 0
    @field title = ''
    @field first_worked_at = ''
    @field last_worked_at = ''

    constructor() {
        modelize(this)
    }

    get canDisplayForecast() { return this.clue.is_real; }
}

class CoursePerformancePeriod {

    @field teach_url = '';

    @field page_ids: ID[] = []
    @field period_id: ID = NEW_ID
    @field title = ''
    @model(PerformancePart) children = array<PerformancePart>()

    constructor() {
        modelize(this);
    }


    @computed get allSections() {
        return findAllSections(this as any as PerformancePart)
    }

    recent(limit = 4) {
        return take(
            orderBy(
                filter(this.allSections, s => s.last_worked_at),
                (s:PerformancePart) => [s.canDisplayForecast, s.last_worked_at], ['desc', 'desc']
            ), limit
        );
    }

    filteredForecastedSections() {
        return filter(this.allSections, s => s.canDisplayForecast);
    }

    weakestSections(displayCount = 4) {
        const validSections = this.filteredForecastedSections();
        // weakestSections are only selected if there's at least two sections with forecasts
        if (validSections.length < 2) { return []; }
        // Select at least one, but no more than displayCount(4)
        displayCount = Math.min(
            Math.max(1, Math.floor(validSections.length / 2))
            , displayCount);

        return take(sortBy(validSections, s => s.clue.most_likely), displayCount);
    }

    canPracticeWeakest({ displayCount, minimumSectionCount }: { displayCount: number, minimumSectionCount: number }) {
        if (!displayCount) { displayCount = 4; }
        if (!minimumSectionCount) { minimumSectionCount = 1; }
        return this.weakestSections(displayCount).length >= minimumSectionCount;
    }

    get canDisplayWeakest() {
        return this.filteredForecastedSections().length > 1;
    }

    get pagesForSections() {
        return uniq(flatten(map(this.children, 'page_ids')));
    }

}


export class CoursePerformance extends BaseModel {

    constructor() {
        super()
        modelize(this);
    }

    @observable studentRoleId?: ID

    get course() { return getParentOf<Course>(this) }

    @model(CoursePerformancePeriod) periods = array<CoursePerformancePeriod>()

    get latestSections() {
        return flatten(this.periods.map(per => per.recent()))
    }

    @action async fetch() {
        const { type: role } = this.course.currentRole
        let url:any = 'getMyPerformance';
        if (this.studentRoleId) {
            url = 'getStudentPerformance'
        } else if (role == 'teacher') {
            url = 'getTeacherPerformance'
        }

        const periods = await this.api.request(urlFor(url, {
            courseId: this.course.id, roleId: this.studentRoleId,
        }));
        runInAction(() => {
            this.periods.replace(Array.isArray(periods) ? periods : [periods])
        })
    }

}

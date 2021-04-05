import { BaseModel, field, action, observable, computed, NEW_ID, getParentOf, ID, modelize, hydrateInstance } from 'shared/model';
import type TaskPlan from './plan'
import type Period from '../../course/period'
import type Course from '../../course'
import { pick, get, extend, find } from 'lodash';
import moment from 'moment';
import Toasts from '../../toasts';
import DateTime from 'shared/model/date-time';
import { GradingTemplate } from '../../grading/templates';

export default class TaskingPlan extends BaseModel {

    static hydrate(attrs: any) {
        const tasking = new TaskingPlan()
        hydrateInstance(tasking, attrs)
        tasking.originalDueAt = tasking.due_at;
        return tasking
    }

    @field id = NEW_ID;
    @field target_id:ID = NEW_ID;
    @field target_type?: 'course' | 'period';

    get plan() { return getParentOf<TaskPlan>(this) }

    // Note: These are deliberatly NOT set using @model(DateTime)
    // doing so causes strings in YYYY-MM-DD format to be converted to a date
    // that's in the user's timezone.  The date is later coverted to UTC causing
    // it to possibily refer to a different day.
    // To work around this the model makes no assumptions about the format of the "date" it's holding
    @field opens_at = ''
    @field due_at = ''
    @field closes_at = ''

    @computed get dueAt() { return new DateTime(this.due_at) }
    @computed get opensAt() { return new DateTime(this.opens_at) }
    @computed get closesAt() { return new DateTime(this.closes_at) }

    @observable originalDueAt?: string

    constructor() {
        super();
        modelize(this)
    }

    get course(): Course {
        return get(this.plan, 'course');
    }

    get period():Period | null {
        if (this.target_type !== 'period') { return null; }
        return this.course.periods.find(p => p.id == this.target_id) || null;
    }

    limitDateToCourse(date: DateTime) {
        if (date.isAfter(this.course.allowedAssignmentDateRange.end)) {
            return this.course.allowedAssignmentDateRange.end;
        }
        if (date.isBefore(this.course.allowedAssignmentDateRange.start)) {
            return this.course.allowedAssignmentDateRange.start;
        }
        return date;
    }

    @action onGradingTemplateUpdate(template: GradingTemplate, dueAt: DateTime, options: { dateWasManuallySet?: boolean } = {}) {
        const dueDateOffsetDays = template.default_due_date_offset_days;
        const closeDateOffsetDays = template.default_close_date_offset_days;
        const { opens, due } = template.defaultTimes

        let defaultOpensAt;
        if (dueAt) {
            defaultOpensAt = this.course.dateTimeInZone(dueAt).minus({ days: dueDateOffsetDays });
        } else if (this.opens_at) {
            defaultOpensAt = this.course.dateTimeInZone(new DateTime(this.opens_at));
        } else {
            defaultOpensAt = this.course.dateTimeInZone().plus({ days: 1 });
        }
        this.opens_at = this.limitDateToCourse(defaultOpensAt)
            .set({ hour: opens.hour, minute: opens.minute }).startOf('minute').toISOString();

        let defaultDueAt;
        if (dueAt) {
            defaultDueAt = this.course.dateTimeInZone(dueAt);
        } else {
            defaultDueAt = this.course.dateTimeInZone(defaultOpensAt).plus({ days: dueDateOffsetDays });
        }

        dueAt = this.limitDateToCourse(defaultDueAt);
        if (!options.dateWasManuallySet) {
            dueAt = dueAt.set({
                hour: due.hour, minute: due.minute,
                second: 0, millisecond: 0,
            })
        }
        this.due_at = dueAt.asISOString;

        this.closes_at = this.limitDateToCourse(
            defaultDueAt.plus({ days: closeDateOffsetDays })
        ).toISOString();
    }

    @action publishScores() {}
    @action onPublishScoresComplete() {
        Toasts.push({ handler: 'scoresPublished' });
    }

    @computed get isPastDue() {
        return this.dueAt.isInPast
    }

    @computed get isPastOpen() {
        return this.opensAt.isInPast
    }

    @computed get isBeforeDue() {
        return this.dueAt.isInFuture
    }

    @computed get isDueAfterOpen() {
        return this.dueAt.isAfter(this.opensAt)
    }

    @computed get isCloseAfterDue() {
        return this.closesAt.isAfter(this.dueAt)
    }

    @computed get isValid() {
        let isValid = this.target_id && this.target_type && this.opens_at && this.due_at && this.isDueAfterOpen;

        if(this.isNew || this.dueAtChanged) {
            isValid = isValid && this.isBeforeDue;
        }

        //event does not have a close date (visually)
        if(!this.plan.isEvent) {
            isValid = isValid && this.isCloseAfterDue;
        }

        return isValid;
    }

    @computed get dueAtChanged() {
        return !moment(this.originalDueAt).isSame(this.due_at);
    }

    @action async persistTime(type: 'opens' | 'due') {
        const { course } = this;
        if (type == 'opens') {
            course.default_open_time = this.opensAt.format('HH:mm');
        }
        if (type == 'due') {
            course.default_due_time = this.dueAt.format('HH:mm');
        }
        await course.save();
    }

    @computed get clonedAttributes() {
        return pick(this, 'target_id', 'target_type', 'opens_at', 'due_at', 'closes_at');
    }

    @computed get dataForSave() {
        return extend(pick(this, 'target_id', 'target_type'), {
            opens_at: this.opensAt.format('YYYY-MM-DD HH:mm'),
            due_at: this.dueAt.format('YYYY-MM-DD HH:mm'),
            closes_at: this.closesAt.format('YYYY-MM-DD HH:mm'),
        });
    }

    @computed get unmodified():TaskingPlan | null {
        return find(this.plan.unmodified_plans, {
            target_type: this.target_type, target_id: this.target_id,
        }) || null;
    }

    @computed get canEditOpensAt() {
        return Boolean(
            !this.plan.isPublished ||
                !this.unmodified ||
                new DateTime(this.unmodified.opens_at).isInFuture,
        );
    }

    // resets the due at time to course default
    // and sets opens at date to match the give due at
    initializeWithDueAt({ dueAt, defaultOpenTime, defaultDueTime }: { dueAt: DateTime, defaultOpenTime: string, defaultDueTime: string }) {
        dueAt = this.course.dateTimeInZone(dueAt)
        if(!dueAt.isValid) { return; }

        let [ hour, minute ] = defaultDueTime.split(':').map(Number);
        dueAt = dueAt.set({ hour, minute }).startOf('minute')

        const nearFuture = this.course.dateTimeInZone().plus({ minute: 30 })
        if (dueAt.isBefore(nearFuture)) {
            dueAt = nearFuture;
        }
        this.due_at = dueAt.toISOString()

        // is requested due at before opens?
        if (dueAt.isBefore(this.opensAt)) {
            [ hour, minute ] = defaultOpenTime.split(':').map(Number);
            const opensNow = this.course.dateTimeInZone().set({ hour, minute }).startOf('minute');
            if (dueAt.isSameOrBefore(opensNow)) {
                // set opens_at to just before due
                this.opens_at = dueAt.minus({ minute: 1 }).asISOString;
            } else {
                this.opens_at = opensNow.toISOString();
            }
        }
    }

    @action setOpensDate(date: DateTime) {
        this.opens_at = date.toISOString();
    }

    @action setDueDate(date: DateTime) {
        this.due_at = date.toISOString();
        if (this.plan.isEvent) { // closes_at === due_at for events
            this.closes_at = this.due_at;
        }
    }

    @action setClosesDate(date: DateTime) {
        this.closes_at = date.toISOString();
    }

}

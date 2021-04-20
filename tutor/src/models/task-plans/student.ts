import Map, { hydrateModel } from 'shared/model/map';
import Time from 'shared/model/time'
import { modelize, ID, getParentOf } from 'shared/model'
import { computed, action, observable } from 'mobx';
import { filter, groupBy, sortBy, pickBy } from 'lodash';
import urlFor from '../../api'

import { ResearchSurveysMap, Raven, StudentDashboardTask as StudentTask } from '../../models'
import type { Course, StudentTaskObj } from '../../models'

const MAX_POLLING_ATTEMPTS = 30;
const WEEK_FORMAT = 'kkkkWW';
const FETCH_INITIAL_TASKS_INTERVAL = 1000 * 10; // every 10 seconds
const REFRESH_TASKS_INTERVAL = 1000 * 60 * 60; // every hour

interface TasksPayload {
    tasks: StudentTaskObj[]
    all_tasks_are_ready: boolean
    research_surveys?: any
}

export
class StudentTaskPlans extends Map<ID, StudentTask> {
    static Model = StudentTask

    @observable researchSurveys: ResearchSurveysMap|null = null;
    @observable expecting_assignments_count = 0;
    @observable all_tasks_are_ready = false;
    @observable refreshTimer: number | null = null;
    @observable isPeriodicallyFetching = false;

    constructor() {
        super();
        modelize(this);
    }

    get course() { return getParentOf<Course>(this) }

    @computed get byWeek() {
        const weeks = groupBy(this.array, event => event.due_at.startOf('week').toFormat(WEEK_FORMAT));
        const sorted = {};
        for (let weekId in weeks) {
            const events = weeks[weekId];
            sorted[weekId] = sortBy(events, 'due_at');
        }
        return sorted;
    }

    @computed get pastTasksByWeek() {
        const thisWeek = Time.now.startOf('week').toFormat(WEEK_FORMAT);
        return pickBy(this.byWeek, (_events, week) => week < thisWeek);
    }

    weeklyTasksForDay(day: Time) {
        return this.byWeek[day.startOf('week').toFormat(WEEK_FORMAT)] || [];
    }

    @computed get startOfThisWeek() {
        return Time.now.startOf('week');
    }

    @computed get endOfThisWeek() {
        return this.startOfThisWeek.plus({ week: 1 }).minus({ second: 1 })
    }

    @computed get thisWeeksTasks() {
        return this.weeklyTasksForDay(this.startOfThisWeek);
    }

    // Returns events who's due after this week
    @computed get upcomingTasks() {
        const endOfWeek = this.endOfThisWeek;
        return sortBy(
            filter(
                this.array, event => endOfWeek.isBefore(event.due_at)
            ),
            ['due_at', 'type', 'title']
        );
    }

    // note: the response also contains limited course and role information but they're currently unused
    onLoaded({ tasks, research_surveys, all_tasks_are_ready }: TasksPayload) {
        if (research_surveys) {
            this.researchSurveys = hydrateModel(ResearchSurveysMap, {}, this)
            this.researchSurveys.mergeModelData(research_surveys)
        }
        this.mergeModelData(tasks);
        this.all_tasks_are_ready = !!all_tasks_are_ready;
    }

    @computed get isPendingTaskLoading() {
        return Boolean(false === this.all_tasks_are_ready);
    }

    @computed get taskReadinessTimedOut() {
        return Boolean(this.api.requestCounts.read >= 10); // 10 minutes
    }

    @action.bound fetchTaskPeriodically() {
        if (
            this.isPendingTaskLoading &&
                this.taskReadinessTimedOut &&
                this.api.requestCounts.read % MAX_POLLING_ATTEMPTS == 0
        ) {
            Raven.log(`Dashboard loading timed out waiting on Biglearn after ${
                this.api.requestCounts.read} attempts.`);
        } else if (!this.isPendingTaskLoading) {
            // reset our read count so it's ready to poll again if needed
            this.api.requestCounts.read = 1;
        }
        return this.fetch().then(() => {
            const interval = this.useFastPolling ?
                FETCH_INITIAL_TASKS_INTERVAL : REFRESH_TASKS_INTERVAL;
            this.refreshTimer = window.setTimeout(this.fetchTaskPeriodically, interval);
        });
    }

    @computed get useFastPolling() {
        return Boolean(this.isPendingTaskLoading || this.isTeacherWaitingForLatest);
    }

    @action refreshTasks() {
        // if we're fast polling, it'll fetch again in a few seconds
        if (!this.api.isPending || !this.isPeriodicallyFetching || !this.useFastPolling) {
            this.fetch();
        }
    }

    @action startFetching() {
        if (this.isPeriodicallyFetching) { return; }
        this.isPeriodicallyFetching = true;
        this.fetchTaskPeriodically();
    }

    @action stopFetching() {
        this.isPeriodicallyFetching = false;
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    @computed get isTeacherWaitingForLatest() {
        return Boolean(
            this.course.currentRole.isTeacherStudent && !this.isLatestPresent
        );
    }

    @computed get isLatestPresent() {
        const latest = this.course.teacherTaskPlans.lastPublished;
        return Boolean(!latest || !!this.array.find( tp => tp.task_plan_id == latest.id) );
    }

    // called from API
    async fetch() {
        const data = await this.api.request<TasksPayload>(urlFor('fetchStudentTasks', { courseId: this.course.id }))
        this.onLoaded(data)
    }

}

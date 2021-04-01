import type Course from '../course'
import Map from 'shared/model/map';
import Time from 'shared/model/time'
import moment from 'moment'
import { modelize, ID, getParentOf } from 'shared/model'
import { computed, action, observable } from 'mobx';
import { filter, groupBy, sortBy, pickBy } from 'lodash';
import StudentTask from './student/task';
import ResearchSurveys from '../research-surveys';
import Raven from '../app/raven';
import Api from '../../api'
import { StudentTaskObj } from '../types'

const MAX_POLLING_ATTEMPTS = 30;
const WEEK_FORMAT = 'GGGGWW';
const FETCH_INITIAL_TASKS_INTERVAL = 1000 * 10; // every 10 seconds
const REFRESH_TASKS_INTERVAL = 1000 * 60 * 60; // every hour

interface TasksPayload {
    tasks: StudentTaskObj[]
    all_tasks_are_ready: boolean
    research_surveys: any
}

export
class StudentTaskPlans extends Map<ID, StudentTask> {

    @observable researchSurveys: ResearchSurveys|null = null;
    @observable expecting_assignments_count = 0;
    @observable all_tasks_are_ready = false;
    @observable refreshTimer: number | null = null;
    @observable isPeriodicallyFetching = false;

    constructor() {
        super();
        modelize(this);
    }

    get course(): Course { return getParentOf(this) }

    @computed get byWeek() {
        const weeks = groupBy(this.array, event => event.due_at.asMoment.startOf('isoWeek').format(WEEK_FORMAT));
        const sorted = {};
        for (let weekId in weeks) {
            const events = weeks[weekId];
            sorted[weekId] = sortBy(events, 'due_at');
        }
        return sorted;
    }

    @computed get pastTasksByWeek() {
        const thisWeek = moment(Time.now).startOf('isoWeek').format(WEEK_FORMAT);
        return pickBy(this.byWeek, (_events, week) => week < thisWeek);
    }

    weeklyTasksForDay(day: moment.Moment) {
        return this.byWeek[moment(day).startOf('isoWeek').format(WEEK_FORMAT)] || [];
    }

    @computed get startOfThisWeek() {
        return moment(Time.now).startOf('isoWeek');
    }

    @computed get endOfThisWeek() {
        return this.startOfThisWeek.clone().add(1, 'week').subtract(1, 'second');
    }

    @computed get thisWeeksTasks() {
        return this.weeklyTasksForDay(this.startOfThisWeek);
    }

    // Returns events who's due after this week
    @computed get upcomingTasks() {
        const endOfWeek = this.endOfThisWeek;
        return sortBy(
            filter(
                this.array, event => endOfWeek.isBefore(event.due_at.asMoment)
            ),
            ['due_at', 'type', 'title']
        );
    }

    // note: the response also contains limited course and role information but they're currently unused
    onLoaded({ tasks, research_surveys, all_tasks_are_ready }: TasksPayload) {
        this.researchSurveys = research_surveys ? new ResearchSurveys(research_surveys) : null;
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
        const data = await this.api.request<TasksPayload>(Api.fetchStudentTasks({ courseId: this.course.id }))
        this.onLoaded(data)
    }

}

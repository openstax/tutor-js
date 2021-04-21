import {
    BaseModel, field, observable, computed, array, action, model, modelize,
    NEW_ID, lazyGetter, hydrateModel, getParentOf,
} from 'shared/model';
import S from '../../helpers/string';
import { pick, get, isNil, omit } from 'lodash';
import { extractCnxId } from '../../helpers/content';
import { MediaActions } from '../../flux/media';
import Time from 'shared/model/time';
import urlFor from '../../api';
import {
    ReferenceBookNode, RelatedContent, ChapterSection, Exercise, StudentTask, StudentTaskStepGroup,
} from '../../models';

class TaskStepContent extends BaseModel {
    update(data: any) {
        Object.assign(this, data);
    }
    requiresAnswerId = false;
}

class StudentTaskVideoStep extends TaskStepContent { }
class StudentTaskExternalStep extends TaskStepContent { }
class StudentTaskInteractiveStep extends TaskStepContent { }
class StudentTaskPlaceHolderStep extends TaskStepContent { }

class StudentTaskReadingStep extends TaskStepContent {
    title = '';
    content_url = ''
    html = ''
    chapter_section = ''

    constructor() {
        super()
        modelize(this)
    }

    @model(RelatedContent) related_content = array<RelatedContent>()

    @lazyGetter get chapterSection() { return new ChapterSection(this.chapter_section) }
    @lazyGetter get page() {
        return hydrateModel(ReferenceBookNode, {
            uuid: this.related_content[0].uuid,
            id: this.related_content[0].page_id,
            cnx_id: extractCnxId(this.content_url),
            content_html: this.html,
            title: this.related_content[0].title,
            chapter_section: this.chapterSection,
        })
    }

    @computed get pageTitle(): string {
        return this.title || get(this, 'related_content[0].title');
    }
}

export
class StudentTaskExerciseStep extends Exercise {
    constructor() {
        super()
        modelize(this)
    }
    get stem_html() { return this.content.stem_html; }
    get questions() { return this.content.questions; }
    get stimulus_html() { return this.content.stimulus_html; }
    get requiresAnswerId() { return this.content.isMultiChoice; }
}

const ContentClasses = {
    video: StudentTaskVideoStep,
    reading: StudentTaskReadingStep,
    exercise: StudentTaskExerciseStep,
    external_url: StudentTaskExternalStep,
    placeholder: StudentTaskPlaceHolderStep,
    interactive: StudentTaskInteractiveStep,
};

const UNSAVEABLE_TYPES = [
    'placeholder',
];

const NO_ADDITIONAL_CONTENT = [
    'external_url',
];

export class StudentTaskStep extends BaseModel {

    @field id = NEW_ID;
    @field uid = '';
    @field preview = '';
    @field available_points = 0;
    @field type = '';
    @field is_completed = false
    @field answer_id? = NEW_ID;
    @field free_response = '';
    @field feedback_html = '';
    @field correct_answer_id = NEW_ID;
    @model(Time) last_completed_at = Time.unknown
    @field response_validation?: any = {}
    @field spy?: any = {}
    @field external_url = ''
    @field labels?: any[];
    @field formats?: any[];
    @field group = ''
    @field can_be_updated = false
    @field dropped_method = ''
    @field is_feedback_available = false
    @field published_points = 0
    @field published_comments = ''
    @field published_points_without_lateness = 0
    @field published_late_work_point_penalty = 0
    @field tasked_id = NEW_ID
    @field exercise_id = NEW_ID

    @observable content?: any
    @observable isFetched = false

    @observable multiPartGroup?: StudentTaskStepGroup

    constructor() {
        super()
        modelize(this)
    }

    get task() { return getParentOf<StudentTask>(this) }

    @computed get canAnnotate() {
        return this.isReading;
    }

    @computed get chapterSection() {
        return this.content.related_content ?
            this.content.related_content[0].chapter_section : null;
    }

    @computed get isExercise() {
        return 'exercise' === this.type;
    }
    @computed get isReading() {
        return 'reading' === this.type;
    }
    @computed get isExternalUrl() {
        return 'external_url' === this.type;
    }
    @computed get isInteractive() {
        return 'interactive' === this.type;
    }
    @computed get isVideo() {
        return 'video' === this.type;
    }
    @computed get isPlaceHolder() {
        return 'placeholder' === this.type;
    }
    @computed get isDroppedQuestion() {
        return Boolean(this.dropped_method);
    }

    // read properties from content when it may not have been fetched yet
    readContentProperty(property: string) {
        if (!this.content) {
            return null;
        }
        return this.content[property];
    }

    @computed get isOpenEndedExercise() {
        return Boolean(this.isExercise && this.readContentProperty('isOpenEnded'));
    }

    @computed get isWrittenResponseExercise() {
        return Boolean(this.isExercise && this.readContentProperty('isWrittenResponse'));
    }

    @computed get isCorrect() {
        return Boolean(
            this.correct_answer_id && this.answer_id == this.correct_answer_id
        );
    }

    @computed get pointsScored() {
        if(!isNil(this.published_points)) return this.published_points;
        if (this.correct_answer_id) {
            return this.answer_id === this.correct_answer_id
                ? this.available_points
                : 0;
        }
        return null;
    }

    @computed get isTwoStep() {
        return Boolean(
            this.isExercise && this.readContentProperty('isMultiChoice') && this.formats?.includes('free-response'),
        )
    }

    @computed get isReview() {
        return this.labels?.includes('review');
    }

    @computed get isPersonalized() {
        return 'personalized' == this.group ;
    }

    @computed get isSpacedPractice() {
        return 'spaced practice' == this.group ;
    }

    @computed get canEditFreeResponse() {
        return Boolean(
            this.can_be_updated && !this.answer_id &&
                this.formats?.includes('free-response') &&
                (this.readContentProperty('isOpenEnded') || S.isEmpty(this.free_response))
        );
    }

    @computed get hasBeenAnswered() {
        return Boolean(this.answer_id);
    }

    @computed get canAnswer() {
        return Boolean(
            this.isExercise && this.can_be_updated
        );
    }

    @computed get needsFetched() {
        return Boolean(
            !NO_ADDITIONAL_CONTENT.includes(this.type) && !this.api.hasBeenFetched
        );
    }

    @computed get isLate() {
        return this.last_completed_at.isAfter(this.task.due_at)
    }

    @action fetchIfNeeded() {
        if (this.needsFetched && !this.api.isInProgress('fetchStudentTaskStep')) {
            this.fetch();
        }
    }

    @action markViewed() {
        if (this.can_be_updated && !this.isExercise && !this.isExternalUrl && !this.is_completed) {
            this.is_completed = true;
            this.save();
        }
    }

    // called when the task is reloaded and each step is reset
    @action setFromTaskFetch(data: any) {
        // the step is being re-used and it's type changed
        if (data.id != this.id || data.type != this.type) {
            this.content = null
            this.isFetched = false
        }
        this.api.reset();
        this.update(data);
    }

    // called by API
    async fetch(): Promise<void> {
        const data = await this.api.request(urlFor('fetchStudentTaskStep', { stepId: this.id }))
        this.onLoaded(data)
    }

    async save(): Promise<void> {
        if (UNSAVEABLE_TYPES.includes(this.type)) { return; }
        const data = await this.api.request(
            urlFor('saveStudentTaskStep', { stepId: this.id }),
            { data: pick(this, 'is_completed', 'answer_id', 'free_response', 'response_validation') }
        )
        this.onLoaded(data)
    }

    @action beginRecordingAnswer({ free_response }: { free_response: string }) {
        this.free_response = free_response;
        if (this.content.requiresAnswerId) {
            this.answer_id = undefined;
        } else {
            this.is_completed = true;
        }
    }

    @action onLoaded(data: any) {
        this.update(omit(data, 'id'))
        const Klass = ContentClasses[this.type];
        if (!Klass) {
            throw new Error(`Attempted to set content on unknown step type ${this.type}`);
        }
        this.content = hydrateModel(Klass, data, this)
        if (this.isReading) {
            MediaActions.parse(this.content.html);
        }
        this.isFetched = true;
    }

}

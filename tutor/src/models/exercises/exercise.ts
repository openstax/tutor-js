import { last, map, filter, reduce } from 'lodash';
import {
    BaseModel,
    model,
    field,
    computed,
    action,
    observable,
    model,
    modelize,
    NEW_ID,
} from 'shared/model';
import Tag from './tag';
import ExerciseContent from 'shared/model/exercise';
import ReferenceBookNode from '../reference-book/node';
import { getters } from '../../helpers/computed-property';
import ChapterSection from '../chapter-section';
import RelatedContent from '../related-content';

export default class TutorExercise extends BaseModel {

    constructor(attrs = {}) {
        super(attrs);
        modelize(this);
    }

  @field id = NEW_ID;
  @field ecosystem_id;

  @model(ExerciseContent) content;
  @model(ExerciseContent) book;
  @model(ExerciseContent) course;
  @field is_excluded = false;
  @field is_copyable = true;
  @field has_interactive = false;
  @field has_video = false;
  @field page_uuid = false;
  @field pool_types?: any[];
  @field url = '';
  @field context;
  @field preview;
  @field author?: any;

  @model(ExerciseContent) related_content;

  @model(Tag) tags; /* extend: getters({
      foo() { return 1234; },
      important() {
          return reduce(this, (o, t) => t.recordInfo(o), {});
      },
      chapterSection() {
          return new ChapterSection(this.important.chapterSection);
      },
  }) */

  @observable isSelected = false;

  @observable _page;
  @computed get page() {
      if (this._page) { return this._page; }
      if (!this.book && !this.course) { return ReferenceBookNode.UNKNOWN; }
      const book = this.book || this.course.referenceBook;
      return book.pages.byUUID.get(this.page_uuid) || ReferenceBookNode.UNKNOWN;
  }

  // below fields are set if read from stats
  set page(pg) {
      this._page = pg;
  }
  @model(ExerciseContent) question_stats;
  @observable average_step_number;

  @computed get isAssignable() { return !this.is_excluded; }
  @computed get isReading() { return this.pool_types.includes('reading_dynamic'); }
  @computed get isHomework() { return this.pool_types.includes('homework_core'); }
  @computed get isMultiChoice() { return this.content.isMultiChoice; }
  @computed get isOpenEnded() { return this.content.isOpenEnded; }
  @computed get isWrittenResponse() { return this.content.isWrittenResponse; }

  @computed get types() {
      return map(
          filter(this.tags, tag =>
              tag.id.startsWith('filter-type:') || tag.id.startsWith('type:')
          ),
          tag => last(tag.id.split(':'))
      );
  }

  @computed get typeAbbreviation() {
      if (this.isMultiChoice) {
          return 'MCQ';
      } else if (this.isOpenEnded) {
          return 'WRQ';
      }
      return 'UNK';
  }

  // called from api
  @action saveExclusion(course, is_excluded) {
      this.is_excluded = is_excluded;
      return { id: course.id, data: {} };
  }

  @computed get isMultiPart() {
      return this.content.isMultiPart;
  }

  @computed get canCopy() {
      return Boolean(this.is_copyable && !this.isMultiPart && this.isHomework);
  }

  @computed get hasInteractive() {
      return this.has_interactive;
  }
  @computed get hasVideo() {
      return this.has_video;
  }

  // Openstax exercises returns an id of 0;
  @computed get belongsToOpenStax() { return this.author.id === '0'; }
  belongsToUser(user) { return this.author.id == user.profile_id; }
  belongsToOtherUser(user) { return !this.belongsToOpenStax && !this.belongsToUser(user); }
}

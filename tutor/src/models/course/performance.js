import {
  BaseModel, identifiedBy, field, hasMany, computed, belongsTo,
} from 'shared/model';

@identifiedBy('course/performance/clue')
class CoursePerformanceClue extends BaseModel {
  @field({ type: 'number'}) minimum;
  @field({ type: 'number'}) most_likely;
  @field({ type: 'number'}) maximum;
  @field({ type: 'boolean'}) is_real;
  @field({ type: 'string'}) ecosystem_uuid;

  @belongsTo({ model: 'section' }) section;
}

@identifiedBy('course/performance/section')
class CoursePerformanceSection extends BaseModel {
  @field({ type: 'string'}) title;
  @field chapter_section = [];
  @field({ type: 'number'}) student_count;
  @field({ type: 'number'}) questions_answered_count;
  @field({ model : 'clue'}) clue;
  @field page_ids = [];
  @belongsTo({ model: 'course' }) course;

  @hasMany({ model: CoursePerformanceSection, inverseOf: 'performance' }) children;
}

@identifiedBy('course/performance')
export default class CoursePerformance extends BaseModel {

  @field({ type: 'string'}) period_id;
  @field({ type: 'string'}) title;
  @field page_ids = [];

  @belongsTo({ model: 'course' }) course;
  // @hasMany({ model: CoursePerformanceSection, inverseOf: 'performance' }) children;

  fetch() {
    return { url: `courses/${this.course.id}/teacher_guide` };
  }


    // getSortedSections: (courseId, roleId, property = 'current_level') ->
    //   sections = findAllSections(@_get(courseId))
    //   _.sortBy(sections, property)

    // getChapters: (courseId, {roleId}) ->
    //   guide = @_local[courseId]?[roleId]
    //   guide?.children or []

    // getAllSections: (courseId, {roleId}) ->
    //   findAllSections(@_local[courseId]?[roleId] or {})

    

}
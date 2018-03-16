import { action, computed } from 'mobx';
import { pick, sortBy, map, groupBy, mapValues, extend, isArray } from 'lodash';
import Map from 'shared/model/map';
import lazyGetter from 'shared/helpers/lazy-getter';
import { chapterSectionToNumber } from '../helpers/content';
import Hypothesis from './annotations/hypothesis';
import Annotation from './annotations/annotation';
import FeatureFlags from './feature_flags';
import AnnotationsUX from './annotations/ux';
export default class Annotations extends Map {

  constructor() {
    super();
    if (FeatureFlags.is_highlighting_allowed) {
      this.api.requestsInProgress.set('fetch', true);
      Hypothesis.fetchUserInfo().then(this.updateAnnotations);
    }
  }

  @lazyGetter ux = new AnnotationsUX();


  @computed get byCourseAndPage() {
    return mapValues(
      groupBy(this.array, 'courseId'),
      (cpgs) => mapValues(
        groupBy(
          sortBy(cpgs, c=>chapterSectionToNumber(c.chapter_section)),
          a => a.chapter_section.join('.')
        ),
        (annotations) => sortBy(annotations, ['selection.rect.top', 'selection.start'])
      )
    );
  }

  @action.bound updateAnnotations(annotations) {
    this.api.requestsInProgress.delete('fetch');
    this.api.requestCounts.read += 1;
    if (isArray(annotations)) {
      annotations.forEach((an) => {
        const note = this.get(an.id);
        an.listing = this;
        note ? note.update(an) : this.set(an.id, new Annotation(an));
      });
    }
  }

  update(annotation) {
    this.api.requestsInProgress.set('update', true);
    return Hypothesis.request({
      method: 'PATCH',
      service: `annotations/${annotation.id}`,
      data: { text: annotation.text },
    }).then((annotationData) => {
      annotation.updateAfterSave(annotationData);
      this.api.requestsInProgress.delete('update');
      this.api.requestCounts.update += 1;
      return annotation;
    });
  }

  create(options) {
    this.api.requestsInProgress.set('create', true);
    return Hypothesis.create(
      options.documentId,
      options.selection, '', options
    ).then((annotationData) => {
      this.api.requestsInProgress.delete('create');
      this.api.requestCounts.create += 1;
      annotationData.listing = this;
      const annotation = new Annotation(annotationData);
      this.set(annotation.id, annotation);
      return annotation;
    });
  }

  destroy(annotation) {
    this.api.requestsInProgress.set('delete', true);
    return Hypothesis.request({
      method: 'DELETE',
      service: `annotations/${annotation.id}`,
    }).then(() => {
      annotation.isDeleted = true;
      this.api.requestsInProgress.delete('delete');
      this.api.requestCounts.delete += 1;
      this.delete(annotation.id);
      return annotation;
    });
  }

}

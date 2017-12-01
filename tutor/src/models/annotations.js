import { action } from 'mobx';
import Map from './map';
import lazyGetter from '../helpers/lazy-getter';
import Hypothesis from './annotations/hypothesis';
import Annotation from './annotations/annotation';
import AnnotationsUX from './annotations/ux';

export default class Annotations extends Map {

  constructor() {
    super();
    this.api.requestsInProgress.set('fetch', true);
    Hypothesis.fetchUserInfo().then(this.updateAnnotations);
  }

  @lazyGetter ux = new AnnotationsUX();

  @action.bound updateAnnotations(annotations) {
    this.api.requestsInProgress.delete('fetch');
    this.api.requestCounts.read += 1;
    if (annotations) {
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
      annotation.update(annotationData);
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

import { action } from 'mobx';
import Map from './map';
import Hypothesis from './annotations/hypothesis';
import Annotation from './annotations/annotation';

export default class Annotations extends Map {

  constructor() {
    super();
    Hypothesis.fetchUserInfo().then(this.updateAnnotations);
  }

  @action.bound updateAnnotations(annotations) {
    annotations.forEach((an) => {
      const note = this.get(an.id);
      note ? note.update(an) : this.set(an.id, new Annotation(an));
    });
  }

  create(options) {
    return Hypothesis.create(
      options.documentId,
      options.selection, '', options
    ).then((annotationData) => {
      const annotation = new Annotation(annotationData);
      this.set(annotation.id, annotation);
      return annotation;
    });
  }

  destroy(annotation) {
    return annotation.destroy().then(() => {
      this.delete(annotation.id);
      return null;
    });
  }

}

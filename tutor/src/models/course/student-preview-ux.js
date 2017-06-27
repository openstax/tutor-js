import { computed, observable } from 'mobx';
import { readonly } from 'core-decorators';

const VIDEOS = {
  college_biology: {
    homework: 'kzvHLFsQDTM',
    reading: '4neNaHRyTUw',
  },
  college_physics: {
    homework: 'Ic2_9LYXY84',
    reading: 'tCocd4jCVCA',
  },
  intro_sociology: {
    homework: 'Ki-y2AywXlI',
    reading: 'GF05th84Bw8',
  },
};

export default class CourseStudentPreviewUX {

  @observable course;
  @observable planType;

  @readonly genericStudentDashboardVideoId = 'IbYU5py9YP8';

  constructor(course, planType) {
    this.course = course;
    this.planType = planType;
  }

  isPlanTypeValid(planType = this.planType) {
    return Boolean(
      this.course && VIDEOS[this.course.appearance_code] && ['reading', 'homework'].includes(planType)
    );
  }

  // while these two methods below really do the same thing they weren't in that past
  // and may not be in the future. Allows video's to be more specific
  @computed get builderVideoId() {
    if (this.isPlanTypeValid()) {
      return VIDEOS[this.course.appearance_code][this.planType];
    }
    return null;
  }

  studentPreviewVideoId(planType) {
    if (this.isPlanTypeValid(planType)) {
      return VIDEOS[this.course.appearance_code][planType];
    }
    return null;
  }


}

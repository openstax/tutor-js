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
      ['reading', 'homework'].includes(planType)
    );
  }

  @computed get builderVideoId() {
    if (VIDEOS[this.course.appearance_code] && this.isPlanTypeValid()) {
      return VIDEOS[this.course.appearance_code][this.planType];
    }
    return null;
  }

  studentPreviewVideoId(planType) {
    if (VIDEOS[this.course.appearance_code] && this.isPlanTypeValid(planType)) {
      return VIDEOS[this.course.appearance_code][planType];
    }
    return null;
  }


}

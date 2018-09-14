export default class Router {

  route = { match: { params: {} } };

  constructor(ux) {
    this.ux = ux;

    this.history = {
      replace(path) { console.warn(`moving to: ${path}`); },
      push() {
        ux.pairedCourse = ux.createCourseUX.newCourse.createdCourse;
        ux.startPairing();
      },
    };
  }
}

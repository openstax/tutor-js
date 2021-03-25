export default class Router {

    match = { params: {} };

    constructor(ux) {
        this.ux = ux;
        this.history = {
            // eslint-disable-next-line no-console
            replace(path) { console.warn(`moving to: ${path}`); },
            push() {
                ux.pairedCourse = ux.createCourseUX.newCourse.createdCourse;
                ux.startPairing();
            },
        };
    }
}

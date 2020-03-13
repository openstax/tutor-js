/* global require:true */

const TOURS = {};

[
  require('./gradebook.json'),
  require('./analytics-modal.json'),
  require('./teacher-calendar.json'),
  require('./performance-forecast.json'),
  require('./review-metrics.json'),
  require('./question-library.json'),
  require('./add-reading.json'),
  require('./add-homework.json'),
  require('./course-settings.json'),
  require('./my-courses.json'),
  require('./page-tips-reminder.json'),
  require('./new-enrollment-link.json'),
  require('./student-dashboard.json'),
  require('./student-highlighting.json'),
].forEach(tours => tours.forEach(tour => TOURS[tour.id] = tour));

export default TOURS;

/* global require:true */
import { extend, each } from 'lodash';

const TOURS = {};

[
  require('./analytics-modal.json'),
  require('./teacher-calendar.json'),
  require('./question-library.json'),
  require('./add-reading.json'),
  require('./add-homework.json'),
  require('./course-settings.json'),
].forEach(tours => tours.forEach(tour => TOURS[tour.id] = tour));

export default TOURS;

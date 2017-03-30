/* global require:true */
import { extend, each } from 'lodash';

const TOURS = {};

[
  require('./teacher-calendar.json'),
  require('./review-metrics.json'),
  require('./add-homework.json'),
].forEach(tours => tours.forEach(tour => TOURS[tour.id] = tour));

export default TOURS;

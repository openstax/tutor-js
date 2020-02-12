const Factory = require('object-factory-bot');

const BOOTSTRAP_DATA = require('./static-bootstra-data.json');
require('../../../specs/factories/user');
require('../../../specs/factories/course');
const { now } = require('../time-now');
const { fe_port, be_port } = require('../ports');

const { clone, merge, find } = require('lodash');

let ROLE = 'teacher';

function addCourses(courses, attrs) {
  courses.push(
    Factory.create('Course', merge(attrs, { id: 1, type: 'biology', months_ago: 1, now }
    )));
  courses.push(
    Factory.create('Course', merge(attrs, { id: 2, type: 'physics', months_ago: 2, now }))
  );
  courses.push(
    Factory.create('Course', merge(attrs, { id: 3, type: 'physics', months_ago: -6, now }))
  );
  courses.push(
    Factory.create('Course', merge(attrs, { id: 4, type: 'biology', months_ago: -7, now }))
  );
}

BOOTSTRAP_DATA.accounts_api_url = `http://localhost:${be_port}/api`;
BOOTSTRAP_DATA.tutor_api_url = `http://localhost:${be_port}/api`;

const student = clone(BOOTSTRAP_DATA);
student.user = Factory.create('User', { is_teacher: false });
student.courses = [];
addCourses(student.courses, { is_teacher: false });

const teacher = clone(BOOTSTRAP_DATA);
teacher.user = Factory.create('User', { is_teacher: true });
teacher.courses = [];
addCourses(teacher.courses, { is_teacher: true });

const PAYLOADS = {
  student, teacher,
};

module.exports = {
  getCourse(id) {
    return find(PAYLOADS[ROLE].courses, c => c.id == id);
  },

  data: {
    student, teacher,
  },

  setRole(role) {
    ROLE = role;
  },

  handler(req, res) {
    res.json(PAYLOADS[ROLE]);
  },

};

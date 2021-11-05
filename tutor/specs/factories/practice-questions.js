const {
    Factory, sequence, uuid,
} = require('./helpers');

Factory.define('PracticeQuestion')
    .id(sequence)
    .tasked_exercise_id(sequence)
    .exercise_id(sequence)
    .exercise_uuid(uuid)

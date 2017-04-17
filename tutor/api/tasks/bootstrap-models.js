import { each } from 'lodash';
import Task from '../../src/models/task';

export default function bootstrapTaskModels(ids) {
  each( ids, i => {
    const task = Task.forId(i);
    const data = require(`./${i}.json`); // eslint-disable-line no-undef
    task.update(data);
  });
}

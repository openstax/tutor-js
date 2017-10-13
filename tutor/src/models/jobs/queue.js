import { observable } from 'mobx';
import { readonly } from 'core-decorators';
import { createCollection } from 'mobx-decorated-models';
import { uniqueId } from 'lodash';

import {
  BaseModel, identifiedBy, session,
} from '../base';

@identifiedBy('jobs/queue')
export class JobCompletion extends BaseModel {

  @readonly id = uniqueId();

  @session succeeded;
  @session type;
  @session({ type: 'object' }) info;
  @session({ type: 'object' }) component;

}


const Completed = createCollection({ model: JobCompletion });

export { Completed };

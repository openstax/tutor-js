import Map, { ID } from 'shared/model/map';
import { readonly } from 'core-decorators';

import { ResearchSurvey } from '../models'

export class ResearchSurveysMap extends Map<ID, ResearchSurvey> {
    @readonly static Model = ResearchSurvey;


}

import Map, { ID } from 'shared/model/map';
import { readonly } from 'core-decorators';
import Survey from './research-surveys/survey';


export default class ResearchSurveys extends Map<ID, Survey> {
    @readonly static Model = Survey;


}

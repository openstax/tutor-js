import Map from './map';
import { readonly } from 'core-decorators';
import Survey from './research-surveys/survey';


export default class ResearchSurveys extends Map {
  @readonly static Model = Survey;


}

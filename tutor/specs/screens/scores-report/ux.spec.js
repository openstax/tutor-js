import ScoresUX from '../../../src/screens/scores-report/ux';
import bootstrapScores from '../../helpers/scores-data';
import { keys } from 'lodash';
import moment from 'moment';

describe('Scores Report UX', function() {

  let ux;

  beforeEach(() => {
    const { course } = bootstrapScores();
    ux = new ScoresUX(course);
  });

  it('returns tasks by type', () => {
    expect(keys(ux.allTasksByType)).toEqual([
      'homework', 'reading', 'external',
    ]);
    expect(keys(ux.periodTasksByType)).toEqual([
      'homework', 'reading', 'external',
    ]);
  });

  ['reading', 'homework', 'external'].forEach((type) => {
    it(`detects if average is unavailable for a ${type}`, () => {
      expect(ux.allTasksByType[type]).toHaveLength(1);
      expect(ux.periodTasksByType[type]).toHaveLength(1);

      expect(ux.isAverageUnavailableByType(type)).toBe(false);
      expect(ux.isAverageUnavailableByTypeForPeriod(type)).toBe(false);

      ux.allTasksByType[type].forEach(t => t.due_at = moment().add(1, 'day'));

      ux.allTasksByType[type].forEach(t => t.type = 'unknown');
      expect(ux.isAverageUnavailableByType(type)).toBe(true);
      expect(ux.isAverageUnavailableByTypeForPeriod(type)).toBe(true);
    });
  });

  it('detects when weighted ineffectually', () => {
    expect(ux.weightTypes).toEqual(['homework', 'reading']);
    expect(ux.areWeightsInUse).toBe(true);
    ux.allTasksByType['reading'].forEach(t => t.type = 'unknown');

    expect(ux.areWeightsInUse).toBe(false);

    ux.course.reading_score_weight = 0;
    ux.course.reading_progress_weight = 0;
    expect(ux.weightTypes).toEqual(['homework']);
    expect(ux.areWeightsInUse).toBe(true);
  });

  it('calculates period averages', () => {
    expect(ux.periodAverages).toEqual({
      overall_course_average: '17%',
      overall_homework_progress: '22%',
      overall_homework_score: '11%',
      overall_reading_progress: '16%',
      overall_reading_score: '15%',
    });

    ux.period.overall_reading_score = undefined;
    ux.allTasksByType['reading'].forEach(t => t.due_at = moment().add(1, 'day'));

    expect(ux.periodAverages).toEqual({
      overall_course_average: '17%',
      overall_homework_progress: '22%',
      overall_homework_score: '11%',
      overall_reading_progress: '16%',
      overall_reading_score: '---',
    });

    ux.allTasksByType['reading'].forEach(t => t.type = 'unknown');
    expect(ux.periodAverages).toEqual({
      overall_course_average: '17%',
      overall_homework_progress: '22%',
      overall_homework_score: '11%',
      overall_reading_progress: '16%',
      overall_reading_score: 'n/a',
    });

  });

  it('returns --- if overall values are missing from data', () => {
    Object.assign(ux.period, {
      overall_course_average: null,
      overall_homework_score: null,
      overall_homework_progress: null,
      overall_reading_score: null,
      overall_reading_progress: null,
    });
    expect(ux.periodAverages).toEqual({
      overall_course_average: '---',
      overall_homework_progress: '---',
      overall_homework_score: '---',
      overall_reading_progress: '---',
      overall_reading_score: '---',
    });

    // now make it so we have no readings
    ux.allTasksByType['reading'].forEach(t => t.type = 'unknown');

    expect(ux.periodAverages).toEqual({
      overall_course_average: 'n/a',
      overall_homework_progress: '---',
      overall_homework_score: '---',
      overall_reading_progress: 'n/a',
      overall_reading_score: 'n/a',
    });
  });
});

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

      expect(ux.isAveragePendingByType(type)).toBe(false);
      expect(ux.isAveragePendingByTypeForPeriod(type)).toBe(false);

      expect(ux.isAverageUnavailableByType(type)).toBe(false);
      expect(ux.isAverageUnavailableByTypeForPeriod(type)).toBe(false);

      ux.allTasksByType[type].forEach(t => t.due_at = moment().add(1, 'day'));

      expect(ux.isAveragePendingByType(type)).toBe(true);
      expect(ux.isAveragePendingByTypeForPeriod(type)).toBe(true);

      ux.allTasksByType[type].forEach(t => t.type = 'unknown');
      expect(ux.isAverageUnavailableByType(type)).toBe(true);
      expect(ux.isAverageUnavailableByTypeForPeriod(type)).toBe(true);
    });
  });

});

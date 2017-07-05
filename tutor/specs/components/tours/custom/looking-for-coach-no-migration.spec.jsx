import {SnapShot} from '../../helpers/component-testing'
import { LookingForCoachNoMigrationContent } from '../../../../src/components/tours/custom/looking-for-coach-no-migration';

describe('Looking for Coach no migration', () => {
  it('matches snapshot for looking for coach without migration', () => {
    expect(SnapShot.create(<LookingForCoachNoMigrationContent step={{ride:{}}} />).toJSON()).toMatchSnapshot();
  });

});

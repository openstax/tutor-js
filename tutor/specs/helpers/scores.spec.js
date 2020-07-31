import ScoresHelper from '../../src/helpers/scores';

describe('Scores helper', function() {

  it('formats points', function() {
    expect(ScoresHelper.formatPoints(0.0)).toEqual('0');
    expect(ScoresHelper.formatPoints(1)).toEqual('1.0');
    expect(ScoresHelper.formatPoints(2.50)).toEqual('2.5');
    expect(ScoresHelper.formatPoints(2.554)).toEqual('2.55');
    expect(ScoresHelper.formatPoints(2.559)).toEqual('2.56');
  });

  it('makes late penalty negative and rounds towards zero', function() {
    expect(ScoresHelper.formatLatePenalty(0.255)).toEqual('-0.25');
    expect(ScoresHelper.formatLatePenalty(0.126)).toEqual('-0.13');
    expect(ScoresHelper.formatLatePenalty(0.40)).toEqual('-0.4');
    expect(ScoresHelper.formatLatePenalty(1.0)).toEqual('-1.0');
  });

  it('rounds high precision numbers to percents', function() {
    const fraction = 0.55499999999999999;
    expect(ScoresHelper.asPercent(fraction)).toEqual(56);
  });

});

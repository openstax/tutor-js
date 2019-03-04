import ChapterSection from '../../src/models/chapter-section';

describe('ChapterSection Model', () => {

  it('accepts an array', () => {
    const cs = new ChapterSection([1,23]);
    expect(cs.asString).toEqual('1.23');
  });

  it('accepts an existing CS', () => {
    const cs1 = new ChapterSection([1,23]);
    const cs2 = new ChapterSection(cs1);
    expect(cs2.asString).toEqual('1.23');
  });
});

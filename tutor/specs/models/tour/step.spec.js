import TourStep from '../../../src/models/tour/step';

describe('TourStep Model', () => {

  it('can be created from JSON', () => {
    const step = new TourStep({ id: 1, title: 'a step', body: '# Step heading\n### Subheading' });
    expect(step).toBeInstanceOf(TourStep);
  });

  it('renders markdown', () => {
    const step = new TourStep({ id: 1, title: 'a step', body: '# Step heading\n### Subheading' });
    expect(step.HTML).toEqual('<h1>Step heading</h1>\n<h3>Subheading</h3>\n');
    step.body = '## <a href="/test">test</a>';
    expect(step.HTML).toEqual('<h2><a href="/test">test</a></h2>\n');
  });

  it('renders best practices', () => {
    const step = new TourStep({ id: 1, title: 'a step', body: 'you should :best-practices: take note' });
    expect(step.HTML).toEqual('<p>you should <i class="tour-step-best-practices"></i> take note</p>\n');
  });

});

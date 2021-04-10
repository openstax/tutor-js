import TourStep from '../../../src/models/tour/step';
import { hydrateModel } from 'modeled-mobx';
import { runInAction } from 'mobx';
import WindowSize from '../../../src/models/window-size';

describe('TourStep Model', () => {

    let step: TourStep;

    beforeEach(() => {
        step = hydrateModel(TourStep, { id: 1, title: 'a step', body: '# Step heading\n### Subheading' })
    });

    it('can be created from JSON', () => {
        expect(step).toBeInstanceOf(TourStep);
    });

    it('renders markdown', () => {
        expect(step.HTML).toEqual('<h1>Step heading</h1>\n<h3>Subheading</h3>\n');
        step.body = '## <a href="/test">test</a>';
        expect(step.HTML).toEqual('<h2><a href="/test">test</a></h2>\n');
    });

    it('renders best practices', () => {
        runInAction(() => {
            step.body = 'you should :best-practices: take note'
        })
        expect(step.HTML).toEqual('<p>you should <i class="tour-step-best-practices"></i> take note</p>\n');
    });

    it('calculates visibility', () => {
        expect(step.isViewable).toBe(true);
        step.anchor_id = '1234';
        expect(step.isViewable).toBe(false);
        jest.spyOn(document, 'querySelector').mockImplementation(() => '<div>hi</div>' as any as HTMLElement);
        expect(step.target).toBeTruthy();
        expect(step.element).toBeTruthy();
        expect(document.querySelector).toHaveBeenCalledWith(step.target);
        expect(step.isViewable).toBe(true);
    });

    it('is not viewable if the viewport matches a disabled breakpoint', () => {
        expect(step.isViewable).toBe(true);
        step.disabledBreakpoints = ['mobile', 'tablet'];
        step.windowSize = { currentBreakpoint: 'mobile' } as any as WindowSize;
        expect(step.isViewable).toBe(false);
    });

});

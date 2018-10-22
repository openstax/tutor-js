import { StepTitleActions, StepTitleStore } from '../../src/flux/step-title';

const STEP_ID = 'step-id-1-1';

describe('StepTitle', () => {


  it('parses step title with math', () => {
    const html = '<p>Which of the following quantities are of the same order of magnitude?</p>↵↵<ol>↵  <li>↵<span data-math="5">5</span> and <span data-math="50">50</span>↵</li>↵  <li>↵<span data-math="400">400</span> and <span data-math="500">500</span>↵</li>↵  <li>↵<span data-math="500">500</span> and <span data-math="500">500</span>↵</li>↵  <li>↵<span data-math="2 \times 10^2">2 \times 10^2</span> and <span data-math="3 \times 10^2">3 \times 10^2</span>↵</li>↵</ol>↵';
    StepTitleActions.parseExercise(STEP_ID, html);

    const title = StepTitleStore.getTitleForCrumb({ id: STEP_ID });
    expect(title).toEqual('Which of the following quantities are of the same order of magnitude?↵↵↵  ↵5 and 50↵↵  ↵400 and 500↵↵  ↵500 and 500↵↵  ↵2 	i…');
  });

});

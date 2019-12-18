import TutorDialog from '../../src/components/tutor-dialog';

describe('TutorDialog', () => {

  it('can be shown multiple times', function() {
    const promises = [1, 2, 3].map((i) =>
      new Promise( function(resolve) {
        const title = `dialog title ${i}`;
        const body  = `dialog body ${i}`;
        TutorDialog.show({ title, body }).then( () => resolve());
        const dialogs = document.body.querySelectorAll('.tutor-dialog');
        expect(dialogs).toHaveLength(1);
        const el = document.body.querySelector('.tutor-dialog');
        expect(el.querySelector('.modal-title').textContent).toEqual(title);
        expect(el.querySelector('.modal-body').textContent).toEqual(body);
        document.body.querySelector('.tutor-dialog button.ok').click();
      }));
    return Promise.all(promises);
  });
});

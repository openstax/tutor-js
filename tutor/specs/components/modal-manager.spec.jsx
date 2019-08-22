import { observable } from 'mobx';
import ModalManager from '../../src/components/modal-manager';

describe('ModalManager component', () => {
  it('displays modals in priority order, but does not interrupt running modals', () => {
    const modalManager = new ModalManager();
    const modal1 = observable({ isReady: false });
    const modal2 = observable({ isReady: true });
    const modal3 = observable({ isReady: true });

    modalManager.queue(modal3, 2);
    modalManager.queue(modal2, 1);
    modalManager.queue(modal1, 0);

    // only one modal can be set for a priority
    expect(() => {
      modalManager.queue(modal1, 0);
    }).toThrow(Error);

    modalManager.start();

    // Highest priority isReady modal is displayed
    expect(modalManager.canDisplay(modal1)).toBe(false);
    expect(modalManager.canDisplay(modal2)).toBe(true);
    expect(modalManager.canDisplay(modal3)).toBe(false);

    // Does not interrupt current modal if a higher priority modal becomes isReady
    modal1.isReady = true;
    expect(modalManager.canDisplay(modal1)).toBe(false);
    expect(modalManager.canDisplay(modal2)).toBe(true);
    expect(modalManager.canDisplay(modal3)).toBe(false);

    // Automatically switches to the highest priority isReady modal when the current modal is done
    modal2.isReady = false;
    expect(modalManager.canDisplay(modal1)).toBe(true);
    expect(modalManager.canDisplay(modal2)).toBe(false);
    expect(modalManager.canDisplay(modal3)).toBe(false);

    // Does not interrupt current modal if a lower priority modal becomes isReady
    modal2.isReady = true;
    expect(modalManager.canDisplay(modal1)).toBe(true);
    expect(modalManager.canDisplay(modal2)).toBe(false);
    expect(modalManager.canDisplay(modal3)).toBe(false);

    // Automatically switches to the highest priority isReady modal when the current modal is done
    modal2.isReady = false;
    modal1.isReady = false;
    expect(modalManager.canDisplay(modal1)).toBe(false);
    expect(modalManager.canDisplay(modal2)).toBe(false);
    expect(modalManager.canDisplay(modal3)).toBe(true);

    // Can go into a state where no modal isReady (we can finally use the actual site now)
    modal3.isReady = false;
    expect(modalManager.canDisplay(modal1)).toBe(false);
    expect(modalManager.canDisplay(modal2)).toBe(false);
    expect(modalManager.canDisplay(modal3)).toBe(false);

    // Automatically switches to a modal if any modal becomes isReady again
    modal2.isReady = true;
    expect(modalManager.canDisplay(modal1)).toBe(false);
    expect(modalManager.canDisplay(modal2)).toBe(true);
    expect(modalManager.canDisplay(modal3)).toBe(false);
  });

});

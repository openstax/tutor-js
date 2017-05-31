import { identifiedBy } from './base';
import OpenDowndownMenu from './open-dropdown-menu';

@identifiedBy('tour/action/open-user-menu')
export default class OpenUserMenu extends OpenDowndownMenu {

  get menu() {
    return document.querySelector('.user-actions-menu');
  }
}

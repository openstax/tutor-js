import { identifiedBy } from './base';
import OpenDowndownMenu from './open-dropdown-menu';

export default
@identifiedBy('tour/action/open-actions-menu')
class OpenActionsMenu extends OpenDowndownMenu {

  get menu() {
    return document.querySelector('button#actions-menu');
  }

}

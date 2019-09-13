import { identifiedBy } from './base';
import OpenDowndownMenu from './open-dropdown-menu';

export default
@identifiedBy('tour/action/open-support-menu')
class OpenSupportMenu extends OpenDowndownMenu {

  get menu() {
    return document.querySelector('button#support-menu');
  }

}

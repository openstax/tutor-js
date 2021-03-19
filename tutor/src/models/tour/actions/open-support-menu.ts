import { identifiedBy } from './base';
import OpenDowndownMenu from './open-dropdown-menu';

@identifiedBy('tour/action/open-support-menu')
export default class OpenSupportMenu extends OpenDowndownMenu {

    get menu() {
        return document.querySelector('button#support-menu');
    }

}

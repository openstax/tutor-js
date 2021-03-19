import { identifiedBy } from './base';
import OpenDowndownMenu from './open-dropdown-menu';

@identifiedBy('tour/action/open-actions-menu')
export default class OpenActionsMenu extends OpenDowndownMenu {

    get menu() {
        return document.querySelector('button#actions-menu');
    }

}

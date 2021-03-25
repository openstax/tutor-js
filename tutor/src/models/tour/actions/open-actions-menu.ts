import OpenDowndownMenu from './open-dropdown-menu';

export default class OpenActionsMenu extends OpenDowndownMenu {

    get menu() {
        return document.querySelector('button#actions-menu');
    }

}

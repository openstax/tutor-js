import OpenDowndownMenu from './open-dropdown-menu';

export default class OpenActionsMenu extends OpenDowndownMenu {

    get menu() {
        return document.querySelector<HTMLDivElement>('button#actions-menu');
    }

}

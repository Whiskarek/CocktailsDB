import {View} from '../view.js';

export class Page extends View {
    constructor(name, displayedName) {
        super(name, displayedName, View.PAGE);
    }
}
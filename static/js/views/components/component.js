import {View} from '../view.js';

export class Component extends View {
    constructor(name) {
        super(name, null, View.COMPONENT);
    }
}
import {View} from '../view.js';

export class Component extends View {
    constructor(name, element) {
        super(name, null, View.COMPONENT);

        this.element = element;
    }

    async render() {
        await super.renderComponent(this.element, this);
    }
}
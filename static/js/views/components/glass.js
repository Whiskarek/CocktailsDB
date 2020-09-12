import {Component} from './component.js';
import {getColorFromString} from '../../utils/strings.js';

export class Glass extends Component {
    static glassClass = '.cocktail-glass:not([id])';
    static contentClass = '.content';
    static defsTag = 'defs';

    constructor(id, ingredients) {
        super('glass');
        this.id = id;
        this.ingredients = ingredients;
    }

    async onRender(element) {
        await super.onRender(element);

        this._element = element.querySelector(Glass.glassClass);
        this._renderData(this._element);
    }

    _renderData(element) {
        element.id = "glass-" + this.id.toString();

        let defs = element.querySelector(Glass.defsTag);
        this._createGradient(defs);

        let content = element.querySelector(Glass.contentClass);
        content.setAttribute('fill', `url(#gradient-${this.id.toString()})`);
        content.style = `fill: url(#gradient-${this.id.toString()});`;
    }

    _createGradient(element) {
        const svgns = 'http://www.w3.org/2000/svg';
        let gradient = document.createElementNS(svgns, 'linearGradient');
        gradient.id = 'gradient-' + this.id.toString();
        gradient.setAttribute('x1', '0');
        gradient.setAttribute('x2', '0');
        gradient.setAttribute('y1', '0');
        gradient.setAttribute('y2', '1');

        let amounts = this.ingredients.map(ingredient => {
            return ingredient.amount;
        });

        let capacity = amounts.reduce((a, b) => a + b, 0) / 100;
        let step = 100 / capacity;
        let offset = 0;

        this.ingredients.forEach((element) => {
            let stop = document.createElementNS(svgns, 'stop');
            stop.setAttribute('offset', Math.floor(offset) + "%");
            stop.setAttribute('stop-color', getColorFromString(element.name));
            gradient.appendChild(stop);
            offset += step * (element.amount/100);
        })
        element.innerHTML = gradient.outerHTML;
    }
}
import {Page} from './page.js';
import {CocktailCard} from '../components/cocktail_card.js';
import {insertIdInObj} from '../../utils/map.js';

export class Feed extends Page {
    static cardContainerId = '#card-container';
    static searchId = '#search-cocktail';

    constructor() {
        super('feed', 'Feed');
    }

    async onPreRender(element) {
        await super.onPreRender(element);

        this._all_cards = await this._getCards();
        this._cards = this._all_cards.slice();
    }

    async onRender(element) {
        await super.onRender(element);

        this.cardContainer = element.querySelector(Feed.cardContainerId);
        await this._renderCards();
    }

    async onPostRender(element) {
        await super.onPostRender(element);

        this.search = element.querySelector(Feed.searchId);
        this.search.addEventListener('input', this._search);
    }

    async _renderCards() {
        for (const card of this._cards) {
            await this.renderComponent(this.cardContainer, card);
        }
    }

    _update() {
        this.cardContainer.innerHTML = '';
        this._renderCards().then();
    }

    async _getCards() {
        const snapshot = await firebase.database().ref('/cocktails').once('value');
        if (snapshot.exists()) {
            const data = snapshot.val();
            return insertIdInObj(data)
                .map(data => new CocktailCard(data));
        }
        return [];
    }

    _search = () => {
        let val = this.search.value;
        this._cards = this._all_cards.filter(card => {
            return card.cocktailName.includes(val) || card.cocktailDescription.includes(val);
        });
        this._update();
    }
}
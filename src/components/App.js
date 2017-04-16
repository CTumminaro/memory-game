import React from 'react';
import _ from 'lodash';

import Card from './Card';
import Header from './Header';

import sampleData from '../sample-data';

class App extends React.Component {
  constructor() {
    super();

    this.flipCard = this.flipCard.bind(this);

    let gameCards = [];

    sampleData.forEach((card) => {
      const id = card.id;
      const newId = id + 'a';
      const cardDefaults = {
        ref: id,
        flipped: false,
        matched: false,
        error: false
      };

      gameCards.push(Object.assign({}, card, cardDefaults));
      gameCards.push(Object.assign({}, card, cardDefaults, { id: newId }));
    });

    gameCards = _.shuffle(gameCards);

    //getinitialstate
    this.state = {
      cards: gameCards,
      flipCount: 0,
      playable: true,
      attempts: 0
    };
  }
  checkMatch() {
    const cards = [...this.state.cards];

    const matches = _.filter(cards, { flipped: true, matched: false });
    const card1 = _.find(cards, {id: matches[0].id });
    const card2 = _.find(cards, {id: matches[1].id });

    if (card1.ref === card2.ref) {
      card1.matched = true;
      card2.matched = true;
    }else {
      card1.error = true;
      card2.error = true;
    }

    this.setState({ cards: cards });
  }
  nextTurn() {
    //copy state
    const cards = [...this.state.cards];
    const flipCount = 0;
    const playable = true;

    _.forEach(cards, (card) => {
      if (!card.matched) {
        card.flipped = false;
        card.error = false;
      }
    });

    this.setState({ cards: cards, flipCount: flipCount, playable: playable });
  }
  flipCard(id) {
    if (this.state.playable) {
      //copy state
      const cards = [...this.state.cards];
      const card = _.find(cards, { id: id });
      let flipCount = this.state.flipCount + 1;
      let playable = true;
      let attempts = this.state.attempts;

      card.flipped = true;

      if (flipCount === 2) {
        this.checkMatch();

        playable = false;
        attempts = attempts + 1;
        setTimeout(() => {
          this.nextTurn()
        }, 1300);
      }

      //update state
      this.setState({ cards: cards, flipCount: flipCount, playable: playable, attempts: attempts });
    }
  }
  render() {
    return(
      <div>
        <Header attempts={this.state.attempts} />
        <div className="container">
          <div className="cards">
            {
              this.state.cards
              .map(card => <Card key={card.id} card={card} flipCard={this.flipCard}   />)
            }
          </div>
        </div>
      </div>
    )
  }
}

export default App;

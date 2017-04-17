import React from 'react';
import _ from 'lodash';

import Card from './Card';
import Header from './Header';

import sampleData from '../sample-data';

class App extends React.Component {
  constructor() {
    super();

    this.flipCard = this.flipCard.bind(this);

    const gameCards = _.chain(sampleData)
    .reduce((memo, card) => {
      const id = card.id;
      const newId = id + 'a';
      const cardDefaults = {
        ref: id,
        flipped: false,
        matched: false,
        error: false
      };

      memo.push(Object.assign({}, card, cardDefaults));
      memo.push(Object.assign({}, card, cardDefaults, { id: newId }));
      return memo;
    }, [])
    .shuffle()
    .value();


    //getinitialstate
    this.state = {
      cards: gameCards,
      flipCount: 0,
      playable: true,
      attempts: 0
    };
  }
  resetGame() {
    let cards = [...this.state.cards];

    cards.map((card) => {
      Object.assign(card, {
        flipped: false,
        matched: false,
        error: false
      });

      return card
    });

    //Flip Over
    this.setState({ cards: cards, flipCount: 0, playable: false, attempts: 0 });

    //Re-shuffle
    cards = _.shuffle(cards);
    setTimeout(() => {
      this.setState({ cards: cards, playable: true});
    }, 800);
  }
  checkMatch() {
    const cards = [...this.state.cards];
    const matches = _.filter(cards, { flipped: true, matched: false });

    if (matches.length < 2) {
      throw('Not enough cards to match');
    }

    const card1 = matches[0];
    const card2 = matches[1];

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

      //stop if card is already matched
      if (card.matched) { return };

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
    const cardHTML = this.state.cards
    .map(card => <Card key={card.id} card={card} flipCard={this.flipCard} />);

    return(
      <div>
        <Header attempts={this.state.attempts} />
        <div className="container">
          <div className="cards">
            { cardHTML }
          </div>
          <hr />
          <button className="button" onClick={() => { this.resetGame() }}>Reset</button>
        </div>
      </div>
    )
  }
}

export default App;

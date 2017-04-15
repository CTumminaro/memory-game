import React from 'react';

const Card= (props) => {
  const { card, flipCard } = props;
  let cardClass = (card.flipped) ? 'card -flip': 'card';

  if (card.matched) {
    cardClass += " -match";
  }else if (card.error) {
    cardClass += " -error";
  }

  return(
    <div className={cardClass} onClick={() => { flipCard(card.id) }}>
      <div className="flip-container">
        <div className="back">
          <img src="/images/peppa-pig/back.jpg" />
        </div>
        <div className="front">
          <img src={card.img} />
        </div>
      </div>
    </div>
  )
}

export default Card;

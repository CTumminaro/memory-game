import _ from 'lodash';
import { sampleData } from '$lib/sample-data';
import { persistValue, retrieveValue } from '$lib/local';

const defaultCard = {
	hasBeenSeen: false,
	flipped: false,
	matched: false,
	error: false
};

const defaultGame = {
	attempts: 0,
	cards: [],
	endTime: null,
	flipCount: 0,
	playable: true,
	sameCardFlips: 0,
	startTime: null,
	width: 274,
	height: 353,
	ratio: 0.7762,
	deckImage: '',
	logo: '',
	color: '#ccc'
};
var themeId = retrieveValue('themeId') || '0';

function createGame() {
	let game = { ...defaultGame, themeId };
	// Keep track of subscribers
	const subscribers = new Set();
	// Add subscriber
	function subscribe(subscriber) {
		subscribers.add(subscriber);
		//return () => subscribers.delete(subscriber);
	}

	const resetGame = () => {
		let cards = [...game.cards];

		cards.map((card) => {
			Object.assign(card, {
				flipped: false,
				matched: false,
				error: false
			});

			return card;
		});

		game = {
			...defaultGame,
			themeId,
			cards,
			deckImage: sampleData[themeId].image,
			logo: sampleData[themeId].logo,
			color: sampleData[themeId].color,
			width: sampleData[themeId].width,
			hieght: sampleData[themeId].height,
			ratio: sampleData[themeId].ratio,
			playable: false
		};
		subscribers.forEach((subscriber) => subscriber(game));

		setTimeout(() => {
			cards = _.chain(sampleData[themeId].cardCount)
				.times(_.identity)
				.reduce((memo, card, i) => {
					const id = i;
					const newId = i + 'a';
					const cardDefaults = {
						ref: i,
						index: i,
						...defaultCard
					};

					memo.push(Object.assign({}, card, cardDefaults, { id }));
					memo.push(Object.assign({}, card, cardDefaults, { id: newId }));
					return memo;
				}, [])
				.shuffle()
				.value();

			game = {
				...defaultGame,
				cards,
				deckImage: sampleData[themeId].image,
				logo: sampleData[themeId].logo,
				color: sampleData[themeId].color,
				width: sampleData[themeId].width,
				hieght: sampleData[themeId].height,
				ratio: sampleData[themeId].ratio,
				themeId
			};
			subscribers.forEach((subscriber) => subscriber(game));
		}, 800);
	};

	const start = () => {
		resetGame();
	};

	const changeTheme = (id) => {
		themeId = id;
		persistValue('themeId', id);

		game = {
			...game,
			themeId: id,
			deckImage: sampleData[id].image,
			logo: sampleData[id].logo,
			color: sampleData[id].color,
			width: sampleData[id].width,
			hieght: sampleData[id].height,
			ratio: sampleData[id].ratio
		};
		subscribers.forEach((subscriber) => subscriber(game));
	};

	const nextTurn = () => {
		//copy state
		const cards = [...game.cards];
		const flipCount = 0;
		const playable = true;

		_.forEach(cards, (card) => {
			if (!card.matched) {
				card.flipped = false;
				card.error = false;
			}
		});

		game = { ...game, cards: cards, flipCount: flipCount, playable: playable };
		subscribers.forEach((subscriber) => subscriber(game));
	};

	const flipCard = (id) => {
		if (game.playable) {
			//copy state
			var cards = [...game.cards];
			const card = _.find(cards, { id: id });

			const startTime = !game.startTime ? performance.now() : game.startTime;

			//stop if card is already matched
			if (card.matched) {
				return;
			}

			let flipCount = game.flipCount + 1;
			let playable = true;
			let attempts = game.attempts;
			let sameCardFlips = game.sameCardFlips;

			card.flipped = true;

			if (flipCount === 2) {
				const matches = _.filter(cards, { flipped: true, matched: false });

				if (matches.length < 2) {
					throw 'Not enough cards to match';
				}

				const card1 = matches[0];
				const card2 = matches[1];

				if (card1.ref === card2.ref) {
					card1.matched = true;
					card2.matched = true;
				} else {
					card1.error = true;
					card2.error = true;

					// Count the memory lapses
					if (card1.hasBeenSeen) {
						sameCardFlips = sameCardFlips + 1;
					} else {
						card1.hasBeenSeen = true;
					}
					if (card2.hasBeenSeen) {
						sameCardFlips = sameCardFlips + 1;
					} else {
						card2.hasBeenSeen = true;
					}
				}

				playable = false;
				attempts = attempts + 1;
				setTimeout(() => {
					nextTurn();
				}, 1300);
			}
			let endTime = null;
			if (_.filter(cards, { matched: true }).length === cards.length) {
				endTime = performance.now();
			}

			//update state
			game = { ...game, cards, flipCount, playable, attempts, startTime, sameCardFlips, endTime };
			subscribers.forEach((subscriber) => subscriber(game));
		}
	};

	return { subscribe, resetGame, start, flipCard, changeTheme };
}

export const game = createGame();

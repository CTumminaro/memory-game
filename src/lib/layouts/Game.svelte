<script>
	import Card from '$lib/components/Card.svelte';
	import { game } from '$lib/store/game';

	var cards = $state([]);
	var deckImage = $state('');
	var ratio = $state();
	var width = $state(0);

	const checkMatch = () => {};

	const nextTurn = () => {};
	const flipCard = (id) => {};
	game.subscribe((data) => {
		cards = data.cards;
		deckImage = data.deckImage;
		ratio = data.ratio * 100;
		width = data.width;
	});

	game.start();
</script>

<div class="container">
	<div class="cards">
		{#each cards as card}
			<Card {card} {deckImage} {ratio} {width} total={cards.length / 2} />
		{/each}
	</div>
</div>

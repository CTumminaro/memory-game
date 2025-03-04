<script>
	import { game } from '$lib/store/game';

	const { card, deckImage, ratio, width, total } = $props();
	const position = $derived(`${card.index * width}px 0`);

	const buildCardClass = (card) => {
		var classString = 'card';
		if (card.flipped) {
			classString += ' -flip';
		}
		if (card.matched) {
			classString += ' -match';
		} else if (card.error) {
			classString += ' -error';
		}
		return classString;
	};

	let cardClass = $derived(buildCardClass(card));
</script>

<button
	class={cardClass}
	aria-label="card"
	onclick={() => {
		game.flipCard(card.id);
	}}
>
	<div class="flip-container" style="padding-bottom: {ratio}%">
		<div
			class="back"
			style="background-image: url({deckImage}); background-position-x: 0%; background-size: {(total +
				1) *
				100}% 100.1%;"
		></div>
		<div
			class="front"
			style="background-image: url({deckImage}); background-position-x: {((card.index + 1) /
				total) *
				100}%; background-size: {(total + 1.1) * 100}% 100.1%;"
		></div>
	</div>
</button>

<style>
	/* Add these to your existing styles */
	.back,
	.front {
		background-size: 100% 1300%; /* 100% width, height = 100% * number of cards */
	}
</style>

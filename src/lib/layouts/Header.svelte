<script>
	import { game } from '$lib/store/game';
	import { onMount } from 'svelte';

	let attempts = $state(0);
	let sameCardFlips = $state(0);
	let logo = $state('');
	let color = $state('');
	let startTime = $state(null);
	let endTime = $state(null);
	let elapsed = $state(0);
	let themeId = $state('0');

	game.subscribe((data) => {
		attempts = data.attempts;
		endTime = data.endTime;
		sameCardFlips = data.sameCardFlips;
		startTime = data.startTime;
		logo = data.logo;
		color = data.color;
		themeId = data.themeId;
	});

	onMount(() => {
		let last_time = performance.now();

		let frame = requestAnimationFrame(function update(time) {
			frame = requestAnimationFrame(update);
			if (startTime && !endTime) {
				elapsed += Math.min(time - last_time);
			} else if (startTime && endTime) {
				elapsed = elapsed;
			} else {
				elapsed = 0;
			}
			last_time = time;
		});

		return () => {
			cancelAnimationFrame(frame);
		};
	});

	const onchange = (e) => {
		game.changeTheme(e.currentTarget.value);
	};
</script>

<header id="header" style="background-color: {color};">
	<div class="container">
		<div class="logo">
			<img src={logo} alt="Memory Matching!" />
		</div>
		<div class="settings">
			<button class="button" onclick={game.resetGame}>Reset</button>
			<select name="theme" placeholder="Label" bind:value={themeId} {onchange}>
				<option value="0">Peppa Pig</option>
				<option value="1">Dandy's World</option>
				<option value="2">The Inbestigators</option>
				<option value="3">Trucks</option>
			</select>
		</div>
		<div class="stats">
			<h4>
				Attempts: {attempts}
			</h4>
			<h4>
				Memory Lapses: {sameCardFlips}
			</h4>
			<h4>
				Timer: {(elapsed / 1000).toFixed(1)}s
			</h4>
		</div>
	</div>
</header>

<style>
	#header {
		background-color: #ccc;
		transition: background-color 800ms ease-in-out;
		.container {
			padding-top: 10px;
			padding-bottom: 10px;
			display: flex;
			justify-content: space-between;
		}
		.logo {
			flex-grow: 1;
		}
		.stats {
			margin-left: 20px;
			align-self: center;
		}
		.settings {
			margin-left: 20px;
			align-self: center;
			display: flex;
			flex-direction: column;
		}

		h4 {
			margin: 0;
			font-size: 16px;
			color: #ffffff;
			font-weight: bold;
		}
	}
</style>

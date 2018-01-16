<template>
	<div id="app" class="ca-wrapper">
		<top-bar/>

        <div class="puzzle-info">
            <puzzle-heading/>
            <word-column direction="across"/>
            <word-column direction="down"/>
        </div>

        <div class="puzzle-visualization">
            <puzzle-viz/>
            <word-suggestions/>
        </div>

        <bottom-bar/>
	</div>
</template>

<script>
import TopBar from './components/TopBar.vue'
import PuzzleHeading from './components/PuzzleHeading.vue'
import WordColumn from './components/WordColumn.vue'
import PuzzleViz from './components/PuzzleViz.vue'
import WordSuggestions from './components/WordSuggestions.vue'
import BottomBar from './components/BottomBar.vue'

export default {
	components: {
		TopBar, PuzzleHeading, WordColumn, PuzzleViz, WordSuggestions, BottomBar
	}
}
</script>

<style>
*, *::before, *::after {
	box-sizing: border-box;
}
</style>
<template>
	<div id="app">
		<top-bar/>

        <div class="puzzle-info-column">
            <puzzle-heading/>

            <div class="word-column">
                <word-column direction="across"/>
            </div>

            <div class="word-column">
                <word-column direction="down"/>
            </div>
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
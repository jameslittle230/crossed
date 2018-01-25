<template>
	<div id="app" class="ca-wrapper">
		<top-bar
            :user="ca_user"
        />

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

let data = {
	ca_puzzle_name: "Zigs and Zags",

	ca_selected_index: 0,
	ca_letter_input: "",
	ca_insert_direction: "right",

	ca_user: {
		name: "James Little",
		username: "james",
	},

	ca_board: {
		dimension: 15,
		spaces: [],
		words: []
	}
};

export default {
	components: {
        TopBar, PuzzleHeading, WordColumn, PuzzleViz,
        WordSuggestions, BottomBar
    },

    data: function() {
        return data
    }
}
</script>

<style>
*, *::before, *::after {
	box-sizing: border-box;
}
</style>
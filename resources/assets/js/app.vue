<template>
	<div id="app" class="ca-wrapper">
		<top-bar
            :user="ca_user"
        />

        <div class="puzzle-info">
            <puzzle-heading
                :puzzleName.sync="ca_puzzle_name"
                :inputDirection.sync="ca_input_direction"
            />
            <word-column direction="across"/>
            <word-column direction="down"/>
        </div>

        <div class="puzzle-visualization">
            <puzzle-viz
                :board.sync="ca_board"
                :inputDirection.sync="ca_input_direction"
            />
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
	ca_input_direction: "across",

	ca_user: {
		name: "James Little",
		username: "james",
	},

	ca_board: {
		size: 15,
		values: ["I", "C", "A", "R", "U", "S", " ", "F", "R", "E", "E", " ", "F", "A", "N",
		       "T", "H", "R", "U", "S", "T", " ", "R", "A", "D", "S", " ", "A", "D", "O", 
		       "S", "I", "M", "M", "E", "R", " ", "O", "D", "C", "T", "O", "J", "O", "E", 
		       "O", "L", "Y", " ", "S", "A", "N", "D", "A", "N", "D", "M", "E", "R", "O",
		       "P", "I", "M", "A", " ", "I", "N", "O", "R", " ", " ", "S", "T", "E", "M", 
		       "E", "D", "U", "C", "A", "T", "E", " ", "G", "I", "G", " ", "A", "D", "A", 
		       "N", "O", "L", "T", "E", " ", " ", "R", "U", "N", "I", "N", " ", " ", " ",
		       " ", "G", "E", "O", "R", "G", "E", "A", "N", "D", "J", "O", "A", "N", " ", 
		       " ", " ", " ", "R", "I", "T", "A", "S", " ", " ", "O", "U", "T", "E", "R", 
		       "O", "P", "P", " ", "E", "O", "S", " ", "O", "P", "E", "N", "T", "O", "E", 
		       "R", "O", "O", "T", " ", " ", "E", "A", "C", "H", " ", "S", "A", "P", "S", 
		       "B", "U", "S", "H", "A", "N", "D", "B", "A", "E", "Z", " ", "C", "R", "O", 
		       "I", "N", "E", "E", "D", "Y", "O", "U", " ", "N", "E", "T", "H", "E", "R", 
		       "T", "C", "U", " ", "D", "E", "F", "T", " ", "O", "R", "I", "E", "N", "T",
                "S", "E", "R", " ", "A", "R", "E", "S", " ", "M", "O", "S", "S", "E", "S"],
        blacks: [6, 11, 21, 26, 36, 48, 64, 69, 70, 82, 86, 95, 96],
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
    },

    created () {
        this.$bus.$on('switchInputDirection', ($event) => {
            this.ca_input_direction = this.ca_input_direction == "across" ? "down" : "across"
        })
    },

    ready: function () {
        window.addEventListener('resize', this.$bus.$emit('resizeCanvas'))
    },

    beforeDestroy: function () {
        window.removeEventListener('resize', this.$bus.$emit('resizeCanvas'))
    },
}
</script>

<style>
*, *::before, *::after {
	box-sizing: border-box;
}
</style>
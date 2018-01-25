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
	},

	ca_templates: [
		{
			name: "asdf",
			asciiRep: '...._....._........_....._.............._......._....._............__...._____..._............__....._......_......._......_.....__............_..._____....__............_....._......._.............._....._........_....._....',
			img: "http://via.placeholder.com/200x200",
			dimension: "15"
		},
		{
			name: "asdf",
			asciiRep: '...._....._........_....._.............._......._....._............__...._____..._............__....._......_......._......_.....__............_..._____....__............_....._......._.............._....._........_....._....',
			img: "http://via.placeholder.com/200x200",
			dimension: "15"
		},
		{
			name: "asdf",
			asciiRep: '...._....._........_....._.............._......._....._............__...._____..._............__....._......_......._......_.....__............_..._____....__............_....._......._.............._....._........_....._....',
			img: "http://via.placeholder.com/200x200",
			dimension: "15"
		},
		{
			name: "jkla",
			asciiRep: "...._....._........_....._........_................_.....___..........._...____...__......_..................__...__.................._......__...____..._...........___....._................_........_....._........_....._....",
			img: "http://via.placeholder.com/200x200",
			dimension: "15"
		}
	],

	// ca_import_string: function(string) {
	// 	if (Math.sqrt(string.length) % 1 !== 0) {
	// 	  return;
	// 	}

	// 	this.ca_board.dimension = Math.sqrt(string.length);
	// 	this.ca_board.letters = [];
	// 	this.ca_board.spaces = [];

	// 	if(Math.sqrt(string.length) !== this.ca_board.dimension) {
	// 	  return;
	// 	}

	// 	for (var i = 0; i < string.length; i++) {
	// 		if (string.charAt(i) === "_") {
	// 			this.ca_board.spaces[i] = {
	// 				letter: "",
	// 				isBlackSpace: true
	// 			}
	// 		} else if (string.charAt(i) === ".") {
	// 			this.ca_board.spaces[i] = {
	// 				letter: "",
	// 				isBlackSpace: false
	// 			}
	// 		} else if (string.charAt(i).match(/[a-z]/i)) {
	// 			this.ca_board.spaces[i] = {
	// 				letter: string.charAt(i).toUpperCase(),
	// 				isBlackSpace: false
	// 			}
	// 		}
	// 		ca_update_canvas();
	// 	}
	// },

	// ca_generate_word_list: function() {
	// 	var oldWords = this.ca_board.words;
	// 	var spaceCount = this.ca_board.spaces.length;
	// 	this.ca_board.words = [];

	// 	for (var i = 0; i < spaceCount; i++) {
	// 		var space = this.ca_board.spaces[i];
	// 		var spaces = this.ca_board.spaces;

	// 		if (space.isWordStart) {
	// 			for (var j = 0; j < space.wordStartDirections.length; j++) {
	// 				var word_array = [i];
	// 				if (space.wordStartDirections[j] === "h") {
	// 					var runner = i + 1;
	// 					while (
	// 						spaces[runner] &&
	// 						runner % this.ca_board.dimension != 0 &&
	// 						!spaces[runner].isBlackSpace
	// 					) {
	// 						word_array.push(runner);
	// 						runner++;
	// 					}
	// 				}

	// 				if (space.wordStartDirections[j] === "v") {
	// 					var runner = i + this.ca_board.dimension;
	// 					while (
	// 						spaces[runner] &&
	// 						runner < Math.pow(this.ca_board.dimension, 2) &&
	// 						!spaces[runner].isBlackSpace
	// 					) {
	// 						word_array.push(runner);
	// 						runner += this.ca_board.dimension;
	// 					}
	// 				}
	// 				this.ca_board.words.push({
	// 					startSpace: i,
	// 					wordStartIndex: space.wordStartIndex,
	// 					direction: space.wordStartDirections[j],
	// 					clue: "",
	// 					spaces: word_array
	// 				});

	// 				var latest_word_index = this.ca_board.words.length - 1;
	// 				var latest_word = this.ca_board.words[latest_word_index];
	// 				var latest_word_spaces_length = latest_word.spaces.length;

	// 				// for every space listed in the lastest word's spaces array
	// 				for (var p = 0; p < latest_word_spaces_length; p++) {
	// 					// get the space that the word lists
	// 					var spaceToConnectToWord = spaces[latest_word.spaces[p]];
	// 					// and push the latest word's index onto that space's word assoc array
	// 					spaceToConnectToWord.wordParts.push(latest_word_index);
	// 				}
	// 			}
	// 		}
	// 	}

	// 	if (oldWords.length == this.ca_board.words.length) {
	// 		var length = oldWords.length;
	// 		for (var i = 0; i < length; i++) {
	// 			this.ca_board.words[i].clue = oldWords[i].clue;
	// 		}
	// 	} else {
	// 		var length = oldWords.length;
	// 		for (var i = 0; i < length; i++) {
	// 			var oldValue = ca_value_from_word(oldWords[i]);
	// 			for (var j = 0; j < this.ca_board.words.length; j++) {
	// 				if (ca_value_from_word(this.ca_board.words[j]) == oldValue) {
	// 					this.ca_board.words[j].clue = oldWords[i].clue;
	// 				}
	// 			}
	// 		}
	// 	}
	// }
};

export default {
	components: {
		TopBar, PuzzleHeading, WordColumn, PuzzleViz, WordSuggestions, BottomBar
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
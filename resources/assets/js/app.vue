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
            <word-column direction="across" :words="wordObjects['across']" style="border-right: 1px solid gray"/>
            <word-column direction="down"  :words="wordObjects['down']"/>
        </div>

        <div class="puzzle-visualization">
            <puzzle-viz
                :board.sync="ca_board"
                :wordStartIndices.sync="wordObjects['indices']"
                :inputDirection.sync="ca_input_direction"
                :selectedSpace.sync="ca_selected_space"
            />
            <word-suggestions/>
        </div>

        <bottom-bar/>
	</div>
</template>

<script>

Array.prototype.last = function() {
    return this[this.length-1];
}

import TopBar from './components/TopBar.vue'
import PuzzleHeading from './components/PuzzleHeading.vue'
import WordColumn from './components/WordColumn.vue'
import PuzzleViz from './components/PuzzleViz.vue'
import WordSuggestions from './components/WordSuggestions.vue'
import BottomBar from './components/BottomBar.vue'

let data = {
	ca_puzzle_name: "Zigs and Zags",
    ca_input_direction: "across",
    ca_selected_space: 0,

	ca_user: {
		name: "James Little",
		username: "james",
	},

	ca_board: {
        version: 1,
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
        blacks: [6, 11, 21, 26, 36, 48, 64, 69, 70, 82, 86, 95, 96, 102, 103,
            104, 105, 119, 120, 121, 122, 128, 129, 138, 142],
		special: [5, 22, 129],
	    clues: {
		    across: [
			    "Clue stuff goes here",
			    "Another clue string",
			    "Yadda yadda"
		    ],
		    down: [
			    "Clue stuff goes here 2",
			    "Another clue string 2",
			    "Yadda yadda 2"
		    ]
        }
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

    computed: {
        wordObjects: function() {

            let board = this.ca_board;

            function beginningOfRow(index) {
                return index % board.size === 0;
            }

            function beginningOfCol(index) {
                return index < board.size;
            }

            function endOfRow(index) {
                return index % board.size === board.size - 1;
            }

            function endOfCol(index) {
                return index > board.size * (board.size - 1);
            }

            function previousInRowIsBlack(index) {
                return board.blacks.includes(index - 1);
            }

            function previousInColIsBlack(index) {
                return board.blacks.includes(index - board.size);
            }

            function endOfWord(index, direction) {
                return (board.blacks.includes(index) || (
                    direction === "across" && endOfRow(index)
                ) || (
                    direction === "down" && endOfCol(index)
                ));
            }

            function getValue(index, direction) {
                var output = [];
                var runner = index;
                while(output.length < 40) { // safeguard against infinite loops
                    if(!board.blacks.includes(runner)) {
                        if (board.values[runner] === "" | board.values[runner] === " ") {
                            output.push('_');
                        } else {
                            output.push(board.values[runner]);
                        }
                    }

                    if(endOfWord(runner, direction)) {
                        return output.join('');
                    }

                    switch(direction) {
                        case "across":
                            runner++;
                            break;
                        case "down":
                            runner += board.size;
                            break;
                    }
                }

                return output.join('');
            }

            /**
            Holds space indices that are word starts. If wordStartIndices =
            [0, 5, 9], then space 0 has word start number 1, space 5 has
            word start number 2, and space 9 has word start number 3.
            */
            var wordStartIndices = [];
            var acrossWordStartIndices = [];
            var downWordStartIndices = [];

            for (let index = 0; index < this.ca_board.values.length; index++) {

                let isBeginningOfRow = beginningOfRow(index);
                let isBeginningOfCol = beginningOfCol(index);
                let isPreviousInColBlack = previousInColIsBlack(index);
                let isPreviousInRowBlack = previousInRowIsBlack(index);
                let isBlackSpace = board.blacks.includes(index);

                let spaceIsWordStart = (isBeginningOfRow || isPreviousInRowBlack
                    || isBeginningOfCol || isPreviousInColBlack) && !isBlackSpace;

                if(spaceIsWordStart) {
                    wordStartIndices.push(index);
                } else {
                    continue;
                }

                if(isBeginningOfRow || isPreviousInRowBlack) {
                    acrossWordStartIndices.push(index);
                }

                if(isBeginningOfCol || isPreviousInColBlack) {
                    downWordStartIndices.push(index);
                }
            }

            var idCount = 0;
            var across = [];
            var down = [];

            acrossWordStartIndices.forEach(function(index) {
                across.push({
                    id: idCount,
                    number: wordStartIndices.indexOf(index),
                    value: getValue(index, "across"),
                    clue: board.clues.across[acrossWordStartIndices.indexOf(index)]
                });
                idCount++;
            });

            idCount = 0;

            downWordStartIndices.forEach(function(index) {
                down.push({
                    id: idCount,
                    number: wordStartIndices.indexOf(index),
                    value: getValue(index, "down"),
                    clue: board.clues.down[downWordStartIndices.indexOf(index)]
                });
                idCount++;
            });

            return {
                across: across,
                down: down,
                indices: wordStartIndices
            }
        }
    },

    created () {
        this.$bus.$on('switchInputDirection', () => {
            this.ca_input_direction = this.ca_input_direction == "across" ? "down" : "across"

            var theApp = this;
            Vue.nextTick(function() {
                theApp.$bus.$emit('updateCanvas');
            });
        });

        this.$bus.$on('updateClue', (index, direction, text) => {
            this.ca_board.clues[direction][index] = text;
            this.saveLocally();
        });

        this.$bus.$on('moveSelectedSpace', (direction) => {
            if (direction === "up") {
                let temp = this.ca_selected_space - this.ca_board.size
                if(temp >= 0) { this.ca_selected_space = temp }
            } else if (direction === "down") {
                let temp = this.ca_selected_space + this.ca_board.size
                if(temp <= this.ca_board.values.length - 1) { this.ca_selected_space = temp }
            } else if (direction === "left") {
                let temp = this.ca_selected_space - 1
                if(temp >= 0) { this.ca_selected_space = temp }
            } else if (direction === "right") {
                let temp = this.ca_selected_space + 1
                if(temp <= this.ca_board.values.length - 1) { this.ca_selected_space = temp }
            }

            // Not sure why the event emission has to be placed in a nextTick
            // closure, but there is a one-event delay if this isn't set up
            // like this. I should figure out why this is the case some day.
            var theApp = this;
            Vue.nextTick(function() {
                theApp.$bus.$emit('updateCanvas');
            });
        });

        this.$bus.$on('toggleBlackSpace', () => {
            var blacks = this.ca_board.blacks;
            var space = this.ca_selected_space;
            var oppositeSpace = this.ca_board.values.length - space - 1
            var index = blacks.indexOf(space);
            var oppositeIndex = blacks.indexOf(oppositeSpace);

            if (index === -1) {
                blacks.push(space);
                if (oppositeIndex === -1) {
                    blacks.push(oppositeSpace);
                }
            } else {
                blacks.splice(index, 1);
                if(oppositeIndex !== -1) {
                    oppositeIndex = blacks.indexOf(oppositeSpace);
                    blacks.splice(oppositeIndex, 1);
                }
            }

            this.saveLocally();
        });

        this.$bus.$on('toggleSpecialSpace', () => {
            var special = this.ca_board.special;
            var space = this.ca_selected_space;
            var index = special.indexOf(space);

            if (index === -1) {
                special.push(space);
            } else {
                special.splice(index, 1);
            }

            this.saveLocally();
        });

        this.$bus.$on('setSpaceToLetter', (newLetter) => {
            var space = this.ca_selected_space;
            this.ca_board.values[space] = newLetter;
            this.saveLocally();
        });

        this.$bus.$on('selectSpace', (index) => {
            this.ca_selected_space = index;

            var theApp = this;
            Vue.nextTick(function() {
                theApp.$bus.$emit('updateCanvas');
            });
        });

        this.loadLocally();
    },

    methods: {
        saveLocally: function() {
            localStorage.setItem('board', JSON.stringify(this.ca_board));
        },

        loadLocally: function() {
            if (localStorage.getItem('board') != null) {
                this.ca_board = JSON.parse(localStorage.getItem('board'));
            }
        },

        saveRemotely: function() {

        }
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
<template>
    <div class="puzzle-viz">
        <input type="text" class="hidden-input" id="hiddenInput" autofocus
             @keydown.tab.stop.prevent="$bus.$emit('switchInputDirection')"
             @keydown.up.stop.prevent="$bus.$emit('moveSelectedSpace', 'up')"
             @keydown.down.stop.prevent="$bus.$emit('moveSelectedSpace', 'down')"
             @keydown.left.stop.prevent="$bus.$emit('moveSelectedSpace', 'left')"
             @keydown.right.stop.prevent="$bus.$emit('moveSelectedSpace', 'right')"
             v-model="letterInput"
        >
        <label for="hiddenInput"><canvas id="puzzle-canvas"></canvas></label>
    </div>
</template>

<script>

export default {
    name: "puzzleViz",
    props: ['board', 'wordStartIndices', 'inputDirection', 'selectedSpace'],
    data: function() {
        return {
            letterInput: "",
        }
    },
    methods: {
        updateCanvas: function() {
            var canvas = document.getElementById("puzzle-canvas");
            var ctx = canvas.getContext("2d");
            var board = this.board;
            var ctxwidth = 1200; // width of canvas in points

            var dim_to_fonts = {
                5: 144,
                14: 52,
                15: 48,
                16: 44
            }

            canvas.width  = ctxwidth;
            canvas.height = ctxwidth;

            ctx.clearRect(0, 0, ctxwidth, ctxwidth);
            ctx.fillStyle = "black";
            ctx.font = "48px sans-serif";

            var dim = board.size;

            var spaceSize = ctxwidth / dim;

            for (var i = 0; i < board.values.length; i++) {
                var space = board.values[i];
                var xpos = Math.round((i % dim) * spaceSize);
                var ypos = Math.round(Math.floor(i / dim) * spaceSize);

                // Fill black space
                if (board.blacks.includes(i)) {
                    ctx.fillRect(xpos, ypos, spaceSize, spaceSize);
                }

                // Fill selected space with blue
                if (i == this.selectedSpace) {
                    ctx.fillStyle = "#65c6d7";
                    ctx.fillRect(xpos, ypos, spaceSize, spaceSize);

                    // Fill black selected space specially
                    ctx.fillStyle = "black";
                    if (board.blacks.includes(i)) {
                        ctx.fillRect(xpos + 3, ypos + 3, spaceSize - 6, spaceSize - 6);
                    }
                }

                // Draw special ring
                if (board.special.includes(i) && !board.blacks.includes(i)) {
                    ctx.beginPath();
                    if (!space.isWordStart) {
                        ctx.arc(
                            xpos + spaceSize / 2,
                            ypos + spaceSize / 2,
                            spaceSize / 2,
                            0,
                            2 * Math.PI,
                            false
                        );
                    } else {
                        ctx.arc(
                            xpos + spaceSize / 2,
                            ypos + spaceSize / 2,
                            spaceSize / 2,
                            Math.PI / 2 * 3,
                            Math.PI,
                            false
                        );
                    }
                    ctx.stroke();
                }

                if (this.wordStartIndices.includes(i)) {
                    ctx.font = "24px sans-serif";
                    ctx.fillText(this.wordStartIndices.indexOf(i), xpos + 2, ypos + 24, spaceSize);
                    ctx.font = "48px sans-serif";
                }

                ctx.strokeRect(xpos, ypos, spaceSize, spaceSize);
                ctx.fillText(
                    space.toUpperCase(),
                    xpos + spaceSize / 3,
                    ypos + spaceSize / 4 * 3,
                    spaceSize
                );
            }
        },

        resizeCanvas: function() {
            var canvas = document.getElementById('puzzle-canvas');
            canvas.height = canvas.width;
            this.updateCanvas()
        }
    },
    mounted() {
        this.resizeCanvas();
    },
    created () {
        this.$bus.$on('updateCanvas', ($event) => {
            this.updateCanvas();
        });

        this.$bus.$on('resizeCanvas', ($event) => {
            this.resizeCanvas();
        });
    },
    watch: {
        letterInput: function(newLetter) {
			if (this.letterInput.length > 1) {
				this.letterInput = this.letterInput.substring(1, 2);
			} else if (this.letterInput.length === 1) {
                var motionDirection = this.inputDirection === "across" ? "right" : "down";
				if (newLetter === " ") {
                    this.$bus.$emit('toggleBlackSpace');
                    this.$bus.$emit('moveSelectedSpace', motionDirection);
				} else if (newLetter === "`") {
					this.$bus.$emit('toggleSpecialSpace');
				} else if (newLetter.match(/[a-z]/i)) {
					newLetter = newLetter.toUpperCase();
                    this.$bus.$emit('setSpaceToLetter', newLetter);
                    this.$bus.$emit('moveSelectedSpace', motionDirection);
				}
			}

			this.updateCanvas();
		}
    }
}

</script>

<style lang="scss" scoped>

canvas {
    width: 100%;
    border: 1px solid black;
}

.hidden-input {
    position: absolute;
    opacity: 0;
    cursor: default;
}

</style>


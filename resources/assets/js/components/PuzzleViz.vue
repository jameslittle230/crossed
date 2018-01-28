<template>
    <div class="puzzle-viz">
        <input type="text" class="hidden-input" id="hiddenInput" autofocus
             @keydown.tab.stop.prevent="$bus.$emit('switchInputDirection')"
        >
        <label for="hiddenInput"><canvas id="puzzle-canvas"></canvas></label>
    </div>
</template>

<script>

export default {
    name: "puzzleViz",
    props: ['board', 'inputDirection'],
    data: function() {
        return {
            selectedIndex: 3
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

                if (board.blacks.includes(i)) {
                    ctx.fillRect(xpos, ypos, spaceSize, spaceSize);
                }

                if (i == this.selectedIndex) {
                    ctx.fillStyle = "#65c6d7";
                    ctx.fillRect(xpos, ypos, spaceSize, spaceSize);

                    ctx.fillStyle = "black";
                    if (board.blacks.includes(i)) {
                        ctx.fillRect(xpos + 3, ypos + 3, spaceSize - 6, spaceSize - 6);
                    }
                }

                if (space.isSpecial == true && !space.isBlackSpace) {
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

                if (space.isWordStart == true) {
                    ctx.font = "12px sans-serif";
                    ctx.fillText(space.wordStartIndex, xpos + 2, ypos + 12, spaceSize);
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
            console.log("Canvas updated");
            this.updateCanvas();
        });

        this.$bus.$on('resizeCanvas', ($event) => {
            this.resizeCanvas();
        });
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


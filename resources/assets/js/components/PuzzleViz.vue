<template>
    <div class="puzzle-viz">
        <input type="text" class="hidden-input" id="hiddenInput" autofocus
             @keydown.tab.stop.prevent="$bus.$emit('switchInputDirection')"
        >
        <label for="hiddenInput"><canvas id="puzzle-canvas"></canvas></label>
    </div>
</template>

<script>

document.addEventListener("DOMContentLoaded", function(event) {
    var canvas = document.getElementById('puzzle-canvas');
    canvas.height = canvas.width;
});

(function() {
    window.addEventListener("resize", resizeThrottler, false);

    var resizeTimeout;
    function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if ( !resizeTimeout ) {
            resizeTimeout = setTimeout(function() {
                resizeTimeout = null;
                actualResizeHandler();

                // The actualResizeHandler will execute at a rate of 15fps
            }, 66);
        }
    }

    function actualResizeHandler() {
        var canvas = document.getElementById('puzzle-canvas');
        canvas.height = canvas.width;
    }
}());

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


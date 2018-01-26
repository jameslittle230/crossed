<template>
    <div class="input-direction-switch" :class="{ 'switch-across': inputDirection == 'across' }" @click="switchDirection">
        <svg width="72px" height="34px" viewBox="0 0 72 34" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Desktop-HD" transform="translate(-662.000000, -63.000000)">
                    <g id="Puzzle-Heading" transform="translate(21.000000, 56.000000)">
                        <g id="Input-Dir-Toggle" transform="translate(641.000000, 7.000000)">
                            <rect id="Rectangle-3" fill="#68A6EF" x="0" y="0" width="72" height="34" rx="18"></rect>
                            <circle id="Oval" fill="#F8F8F8" cx="17.5" cy="17.5" r="14.5"></circle>
                            <g id="arrow">
                                <path d="M17,7.28333333 L17,23.7166667" id="Line-3" stroke="#737373" stroke-width="4" stroke-linecap="square"></path>
                                <path d="M11.2727273,20.2727273 L16.7272727,25.7552264" id="Line-3" stroke="#737373" stroke-width="4" stroke-linecap="square"></path>
                                <path d="M22.7412674,20.2866862 L17.2727273,25.7552264" id="Line-3" stroke="#737373" stroke-width="4" stroke-linecap="square"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </svg>

        <p class="puzzle-heading-control-text">Input Direction</p>
    </div>
</template>

<script>
export default {
    name: 'inputDirectionSwitch',
    data: function() {
        return {
            inputDirection: "across"
        }
    },
    methods: {
        switchDirection: function() {
            this.inputDirection = this.inputDirection == "across" ? "down" : "across"
        }
    }
}
</script>

<style lang="scss" scoped>

.input-direction-switch {
    text-align: center;

    &:hover {
        #arrow path {
            stroke: black;
        }
    }
}

svg * {
    transition: 0.4s ease all;
}

#arrow {
    transform-origin: 16.8px 16.8px;

    path {
        transition-duration: 0ms;
    }
}

.switch-across {
    #arrow {
        transform: translateX(37.5px) rotate(-90deg);
    }

    #Oval {
        transform: translateX(37px)
    }

    #Rectangle-3 {
        fill: green;
    }
}

</style>

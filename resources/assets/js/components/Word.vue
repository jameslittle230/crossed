<template>
    <div class="word">
        <div class="word-number">{{ number }}</div>
        <div style="width: 100%">
            <div class="word-value">{{ value }} ({{ id }})</div>
            <!-- <div class="word-clue">{{ clue }}</div> -->

            <input type="text" class="word-clue" placeholder="No clue yet" 
            v-bind:value="clue"
            @blur="$bus.$emit('updateClue', id, direction, $event.target.value)"/>
        </div>
    </div>
</template>

<script>

export default {
    name: "Word",
    props: ['id', 'direction', 'number', 'value', 'clue'],
    data () {
        return {

        }
    },
    methods: {
        hideUserDropdown: function() {
            if(this.userDropdownVisible) {
                this.userDropdownVisible = false;
            }
        }
    }
}

</script>

<style lang="scss" scoped>

.word {
    display: flex;
    padding: 8px;
    border-bottom: 1px dotted gray;
}

.word-number {
    font-weight: 900;
    width: 40px;
    margin-right: 18px;
    font-size: 36px;
    text-align: center;
    letter-spacing: -0.2%;
}

.word-value {
    font-weight: 700;
    font-size: 20px;
    color: #000000;
    margin-bottom: 0.3em;
}

.word-clue {
    font-family: "Inter UI"; // override input styles
    width: 100%; // gets the input to fit .title-column, its container. Makes working with flexbox a lot easier.
    // font-style: italic;
    // font-size: 36px;
    color: #333;
    border: 1px solid transparent;

    &:hover {
        border: 1px solid gray;
    }

    &:focus {
        border: 1px solid black;
    }
}

</style>

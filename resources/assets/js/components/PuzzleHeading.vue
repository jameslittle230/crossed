<template>
    <div class="puzzle-heading">
        <div class="settings-column">

        </div>

        <div class="title-column">
            <input type="text" class="puzzle-title"
            v-bind:value="puzzleName"
            @blur="$emit('update:puzzleName', $event.target.value)"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.puzzle-heading {
    border-bottom: 2px solid #979797;
}

</style>


<script>

export default {
    name: "puzzleHeading",
    props: ['puzzleName'],
    data: function() {
        return {

        }
    },
    methods: {
    }
}

</script>

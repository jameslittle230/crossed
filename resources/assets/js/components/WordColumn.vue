<template>
    <div class="word-column">
        <header>{{ direction }}</header>

        <word
            v-for="word of words" :key="word.id"
            :id="word.id"
            :number="word.number"
            :direction="direction"
            :value="word.value"
            :clue="word.clue"
        />
    </div>
</template>

<script>

import Word from './Word.vue'

export default {
    name: "wordColumn",
    components: {
        Word
    },
    props: ['direction', 'words'],
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

.word-column {
    
}

</style>
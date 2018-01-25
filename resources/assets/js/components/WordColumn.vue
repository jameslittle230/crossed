<template>
    <div class="word-column">
        <header>{{ direction }}</header>

        <word
            :number="word.number"
            :value="word.value"
            :clue="word.clue"
            v-for="word of words[direction]" :key="word.id"
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
    props: ['direction'],
    data () {
        return {
            words: {
                across: [
                    {
                        id: 1,
                        number: 1,
                        value: "A_B_C",
                        clue: "I really don't know what's going on here."
                    }
                ],
                down: [
                    {
                        id: 2,
                        number: 1,
                        value: "E_F_G",
                        clue: "You think I've gotten any more knowledgeable about my situation since we last spoke??"
                    }
                ]
            }
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

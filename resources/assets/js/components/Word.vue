<template>
    <div class="word">
        <div class="word-number">{{ number }}</div>
        <div class="word-value">{{ value }}</div>
        <div class="word-clue">{{ clue }}</div>
    </div>
</template>

<script>

export default {
    name: "Word",
    props: ['number', 'value', 'clue'],
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
    padding: 8px;
    border-bottom: 1px dotted gray;
}

</style>

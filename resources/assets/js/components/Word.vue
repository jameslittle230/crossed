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

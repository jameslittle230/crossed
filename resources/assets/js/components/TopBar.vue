<template>

    <div class="top-bar">
        <div class="app-name">crossed.io</div>

        <div class="user-dropdown-trigger"
            v-on:click="userDropdownVisible = !userDropdownVisible"
            v-bind:class="{ 'dropdown-active': userDropdownVisible }"
        >{{ user.username }}

        <svg version="1.1" id="Chevron_down" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
            y="0px" width="27" height="27" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
        <path d="M4.516,7.548c0.436-0.446,1.043-0.481,1.576,0L10,11.295l3.908-3.747c0.533-0.481,1.141-0.446,1.574,0
            c0.436,0.445,0.408,1.197,0,1.615c-0.406,0.418-4.695,4.502-4.695,4.502C10.57,13.888,10.285,14,10,14s-0.57-0.112-0.789-0.335
            c0,0-4.287-4.084-4.695-4.502C4.107,8.745,4.08,7.993,4.516,7.548z"/>
        </svg>

    </div>

        <div class="user-dropdown"
            v-if="userDropdownVisible"
            v-click-outside="hideUserDropdown"
        >
            <li><a href="#">{{ user.name }}</a></li>
            <li><a href="#">Something else</a></li>
        </div>
    </div>

</template>



<style lang="scss" scoped>

.top-bar {
    position: relative;
}

.user-dropdown-trigger {
    vertical-align: text-top;
    font-weight: bold;
}

.dropdown-active {
    font-style: italic;

    svg {
        transform: rotate(180deg)
    }
}

.user-dropdown {
    position: absolute;
    top: 35px;
    right: 20px;
    width: 140px;
    background: white;
    border: 1px solid black;
    border-radius: 5px;
    padding: 5px;
    box-shadow: 0 0 5px hsla(0, 0%, 0%, 0.6);

    li {
        padding: 5px 0;
        border-bottom: 1px solid #CCC;
        list-style-type: none;
    }
}

</style>



<script>

export default {
    name: "topBar",
    props: ['user'],
    data: function() {
        return {
            userDropdownVisible: false
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

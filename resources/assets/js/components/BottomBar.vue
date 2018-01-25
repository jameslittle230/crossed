<template>
    <div class="bottom-bar">
        <div class="left">
            <a href="#" class="bottom-bar__button">Share</a>
            <a href="#" class="bottom-bar__button">Embed</a>
            <a href="#" class="bottom-bar__button">Export</a>
            <a href="#" class="bottom-bar__button">Help</a>
        </div>

        <div class="right">
            <a href="#" class="bottom-bar__warning-icon">
                <svg version="1.1" id="Warning" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                    width="20px" height="20px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
                    <path fill="#FF8D9B" d="M19.511,17.98L10.604,1.348C10.48,1.133,10.25,1,10,1C9.749,1,9.519,1.133,9.396,1.348L0.49,17.98
                        c-0.121,0.211-0.119,0.471,0.005,0.68C0.62,18.871,0.847,19,1.093,19h17.814c0.245,0,0.474-0.129,0.598-0.34
                        C19.629,18.451,19.631,18.191,19.511,17.98z M11,17H9v-2h2V17z M11,13.5H9V7h2V13.5z"/>
                </svg>
            </a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'bottomBar'
}
</script>

<style lang="scss">

.bottom-bar__button {
    background: rgba(0,0,0,0.69);
    border-radius: 8px;
    color: #FFFFFF;
    padding: 5px 12px;
    margin-right: 6px;
    text-decoration: none;

    &:hover {
        background: rgba(0,0,0,0.93);
    }
}

</style>

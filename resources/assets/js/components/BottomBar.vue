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
                <!-- <svg width="22px" height="20px" viewBox="0 0 29 27">
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Desktop-HD" transform="translate(-1396.000000, -991.000000)" fill="#FF8D9B" fill-rule="nonzero">
                            <g id="Bottom-Bar" transform="translate(0.000000, 982.000000)">
                                <g id="Warning" transform="translate(1396.000000, 9.000000)">
                                    <path d="M28.8662835,25.47 L15.4122442,0.522 C15.224942,0.1995 14.8775266,0 14.4999012,0 C14.1207652,0 13.7733498,0.1995 13.5875581,0.522 L0.135029416,25.47 C-0.0477412969,25.7865 -0.0447202934,26.1765 0.142581925,26.49 C0.331394646,26.8065 0.674278546,27 1.04586198,27 L27.9539404,27 C28.3240133,27 28.6699182,26.8065 28.8572204,26.49 C29.0445227,26.1765 29.0475437,25.7865 28.8662835,25.47 Z M16,24 L13,24 L13,21 L16,21 L16,24 Z M16,19 L13,19 L13,9 L16,9 L16,19 Z" id="Shape"></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </svg> -->

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

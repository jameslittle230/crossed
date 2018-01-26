<template>
    <div class="apply-template-button">
    <svg width="36px" height="36px" viewBox="0 0 36 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Desktop-HD" transform="translate(-570.000000, -62.000000)">
                <g id="Puzzle-Heading" transform="translate(21.000000, 56.000000)">
                    <g id="Template-Button" transform="translate(549.000000, 6.000000)">
                        <rect id="Rectangle-4" stroke="#525252" stroke-width="2" x="1" y="1" width="34" height="34"></rect>
                        <rect id="Rectangle-4-Copy" fill="#000000" x="0" y="0" width="18" height="18"></rect>
                        <rect id="Rectangle-4-Copy-2" fill="#000000" x="18" y="18" width="18" height="18"></rect>
                    </g>
                </g>
            </g>
        </g>
    </svg>

    <p class="puzzle-heading-control-text">Apply Template</p>
    </div>
</template>

<script>
export default {
    name: 'applyTemplateButton'
}
</script>

<style lang="scss" scoped>

.apply-template-button {
    text-align: center;

    &:hover {
        cursor: pointer;
        
        svg {
            box-shadow: 0 0 4px rgba($color: #000000, $alpha: 0.7);
        }
    }
}

</style>

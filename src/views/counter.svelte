<script lang="ts">
    import { Counter } from "src/models";
    import { ICONS } from "src/utils/icons";

    export let props: Counter;
    export let decreaseButtonClicked: (e: MouseEvent) => void;
    export let increaseButtonClicked: (e: MouseEvent) => void;
    export let resetButtonClicked: (e: MouseEvent) => void;

    function generateCss(css: string | undefined): string {
        if (css) return "rpg-counter " + css;
        else return "rpg-counter";
    }
</script>

<div class={generateCss(props.css).trim()}>
    <button class="btn decrease-btn" disabled={props.min != null && props.value != null && props.value <= props.min} on:click={decreaseButtonClicked}>
        {#if props.decreaseText}
            {@html props.decreaseText}
        {:else}
            {@html ICONS["minus"]}
        {/if}
    </button>
    <div class="value">{props.value}</div>
    <button class="btn increase-btn" disabled={props.max != null && props.value != null && props.value >= props.max} on:click={increaseButtonClicked}>
        {#if props.increaseText}
            {@html props.increaseText}
        {:else}
            {@html ICONS["plus"]}
        {/if}
    </button>
    <button class="btn reset-btn" on:click={resetButtonClicked}>
        {#if props.resetText}
            {props.resetText}
        {:else}
            RESET
        {/if}
    </button>
</div>

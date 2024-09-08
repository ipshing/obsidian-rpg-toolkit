<script lang="ts">
    import RpgToolkit from "src/main";

    export let heading: string;
    export let paragraphs: string[];
    export let plugin: RpgToolkit;
    export let sourcePath: string;
</script>

<p class="monster-header">{heading}</p>
{#each paragraphs as paragraph}
    <p>{@html plugin.convertMarkdown(paragraph, sourcePath)}</p>
{/each}

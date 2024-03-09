<script lang="ts">
    import RpgToolkit from "src/main";

    export let heading: string | null;
    export let paragraphs: string[];
    export let plugin: RpgToolkit;
    export let sourcePath: string;
</script>

<div class="stat-block-body-section">
    {#if heading}
        <div class="stat-block-body-section-heading">{heading}</div>
    {/if}
    {#each paragraphs as paragraph}
        <div class="stat-block-body-section-content">{@html plugin.convertMarkdown(paragraph, sourcePath)}</div>
    {/each}
</div>

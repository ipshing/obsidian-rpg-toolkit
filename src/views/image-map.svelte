<script lang="ts">
    import { MarkdownRenderer } from "obsidian";
    import RpgToolkit from "src/main";
    import { MapModel, MapAreaModel } from "src/models";

    export let imageMap: MapModel;
    export let plugin: RpgToolkit;
    export let sourcePath: string;

    let figure: HTMLElement;

    function generateCss(css: string | undefined): string {
        if (css) return "rpg-map " + css;
        else return "rpg-map";
    }
    function generateAreaLink(area: MapAreaModel): string {
        // Create temporary container
        const container = createDiv();
        // Convert the link to html
        MarkdownRenderer.render(plugin.app, area.link, container, sourcePath, plugin);
        // Get the anchor element...
        const anchor = container.querySelector("a");
        if (anchor) {
            // Clear the anchor
            anchor.empty();
            // Add css
            anchor.addClass("map-area");
            // Add a div to be a clickable area
            const div = anchor.createDiv();
            div.style.top = `${area.coords[0]}%`;
            div.style.left = `${area.coords[1]}%`;
            div.style.width = `${area.coords[2]}%`;
            div.style.height = `${area.coords[3]}%`;

            return anchor.outerHTML;
        }
        return "";
    }
</script>

<figure class={generateCss(imageMap.css).trim()} bind:this={figure}>
    {@html plugin.convertMarkdown(imageMap.map, sourcePath)}
    {#if imageMap.caption}
        <figcaption>{imageMap.caption}</figcaption>
    {/if}
    {#if imageMap.areas}
        {#each imageMap.areas as area}
            {@html generateAreaLink(area)}
        {/each}
    {/if}
</figure>

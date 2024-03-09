<script lang="ts">
    import RpgToolkit from "src/main";
    import AbilityScore from "./ability-score.svelte";
    import StatBlockBody from "./stat-block-body.svelte";
    import { Vehicle } from "src/models";

    export let vehicle: Vehicle;
    export let plugin: RpgToolkit;
    export let sourcePath: string;

    function generateCss(css: string | undefined): string {
        if (css) return "vehicle-stat-block " + css;
        else return "vehicle-stat-block";
    }
    function generateMetadata(size: string, dimensions: string): string {
        let metadata = `${size} Vehicle`;
        if (dimensions) metadata += ` (${dimensions})`;

        return metadata;
    }
</script>

<div class={generateCss(vehicle.css).trim()}>
    {#if vehicle.image && vehicle.imageFirst}
        <div class="stat-block-image">
            {@html plugin.convertMarkdown(vehicle.image, sourcePath)}
        </div>
    {/if}
    <div class="stat-block-title">
        <div class="stat-block-name">{@html plugin.convertMarkdown(vehicle.name, sourcePath)}</div>
        <div class="stat-block-metadata">
            {@html plugin.convertMarkdown(generateMetadata(vehicle.size, vehicle.dimensions), sourcePath)}
        </div>
    </div>
    <div class="stat-block-attributes">
        <div class="stat-block-data">
            <span class="stat-block-data-label">Creature Capacity</span>
            <span class="stat-block-data-value">{@html plugin.convertMarkdown(vehicle.creatureCapacity, sourcePath)}</span>
        </div>
        <div class="stat-block-data">
            <span class="stat-block-data-label">Cargo Capacity</span>
            <span class="stat-block-data-value">{@html plugin.convertMarkdown(vehicle.cargoCapacity, sourcePath)}</span>
        </div>
        <div class="stat-block-data">
            <span class="stat-block-data-label">Travel Pace</span>
            <span class="stat-block-data-value">{@html plugin.convertMarkdown(vehicle.travelPace, sourcePath)}</span>
        </div>
    </div>
    <div class="stat-block-ability-scores">
        <div class="stat-block-ability-score-group">
            <AbilityScore ability={"STR"} score={vehicle.abilityScores[0]} />
            <AbilityScore ability={"DEX"} score={vehicle.abilityScores[1]} />
            <AbilityScore ability={"CON"} score={vehicle.abilityScores[2]} />
        </div>
        <div class="stat-block-ability-score-group">
            <AbilityScore ability={"INT"} score={vehicle.abilityScores[3]} />
            <AbilityScore ability={"WIS"} score={vehicle.abilityScores[4]} />
            <AbilityScore ability={"CHA"} score={vehicle.abilityScores[5]} />
        </div>
    </div>
    <div class="stat-block-details">
        {#if vehicle.damageImmunities}
            <div class="stat-block-data">
                <span class="stat-block-data-label">Damage Immunities</span>
                <span class="stat-block-data-value">{@html plugin.convertMarkdown(vehicle.damageImmunities, sourcePath)}</span>
            </div>
        {/if}
        {#if vehicle.conditionImmunities}
            <div class="stat-block-data">
                <span class="stat-block-data-label">Condition Immunities</span>
                <span class="stat-block-data-value">{@html plugin.convertMarkdown(vehicle.conditionImmunities, sourcePath)}</span>
            </div>
        {/if}
    </div>
    <div class="stat-block-body">
        {#if vehicle.actions}
            <StatBlockBody heading="Actions" paragraphs={vehicle.actions} {plugin} {sourcePath} />
        {/if}
        {#if vehicle.components}
            {#each vehicle.components as component}
                <StatBlockBody heading={component.name} paragraphs={component.attributes} {plugin} {sourcePath} />
            {/each}
        {/if}
    </div>
    {#if vehicle.image && !vehicle.imageFirst}
        <div class="stat-block-image">
            {@html plugin.convertMarkdown(vehicle.image, sourcePath)}
        </div>
    {/if}
</div>

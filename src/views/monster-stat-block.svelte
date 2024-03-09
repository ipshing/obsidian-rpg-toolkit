<script lang="ts">
    import { Monster } from "src/models";
    import AbilityScore from "./ability-score.svelte";
    import StatBlockBody from "./stat-block-body.svelte";
    import RpgToolkit from "src/main";

    export let monster: Monster;
    export let plugin: RpgToolkit;
    export let sourcePath: string;

    function generateCss(css: string | undefined): string {
        if (css) return "monster-stat-block " + css;
        else return "monster-stat-block";
    }
    function generateMetadata(size: string, creatureType: string, alignment: string): string {
        let metadata = size;
        if (creatureType) metadata += " " + creatureType;
        if (alignment) metadata += ", " + alignment;

        return metadata;
    }
</script>

<div class={generateCss(monster.css).trim()}>
    {#if monster.image && monster.imageFirst}
        <div class="stat-block-image">
            {@html plugin.convertMarkdown(monster.image, sourcePath)}
        </div>
    {/if}
    <div class="stat-block-title">
        <div class="stat-block-name">{@html plugin.convertMarkdown(monster.name, sourcePath)}</div>
        <div class="stat-block-metadata">
            {@html plugin.convertMarkdown(generateMetadata(monster.size, monster.creatureType, monster.alignment), sourcePath)}
        </div>
    </div>
    {#if monster.armorClass || monster.hitPoints || monster.speed}
        <div class="stat-block-attributes">
            {#if monster.armorClass}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Armor Class</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.armorClass, sourcePath)}</span>
                </div>
            {/if}
            {#if monster.hitPoints}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Hit Points</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.hitPoints, sourcePath)}</span>
                </div>
            {/if}
            {#if monster.speed}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Speed</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.speed, sourcePath)}</span>
                </div>
            {/if}
        </div>
    {/if}
    {#if monster.abilityScores}
        <div class="stat-block-ability-scores">
            <div class="stat-block-ability-score-group">
                <AbilityScore ability={"STR"} score={monster.abilityScores[0]} />
                <AbilityScore ability={"DEX"} score={monster.abilityScores[1]} />
                <AbilityScore ability={"CON"} score={monster.abilityScores[2]} />
            </div>
            <div class="stat-block-ability-score-group">
                <AbilityScore ability={"INT"} score={monster.abilityScores[3]} />
                <AbilityScore ability={"WIS"} score={monster.abilityScores[4]} />
                <AbilityScore ability={"CHA"} score={monster.abilityScores[5]} />
            </div>
        </div>
    {/if}
    {#if monster.savingThrows || monster.skills || monster.damageVulnerabilities || monster.damageResistances || monster.conditionImmunities || monster.senses || monster.languages || monster.challenge || monster.proficiencyBonus}
        <div class="stat-block-details">
            {#if monster.savingThrows}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Saving Throws</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.savingThrows, sourcePath)}</span>
                </div>
            {/if}
            {#if monster.skills}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Skills</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.skills, sourcePath)}</span>
                </div>
            {/if}
            {#if monster.damageVulnerabilities}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Damage Vulnerabilities</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.damageVulnerabilities, sourcePath)}</span>
                </div>
            {/if}
            {#if monster.damageResistances}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Damage Resistances</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.damageResistances, sourcePath)}</span>
                </div>
            {/if}
            {#if monster.damageImmunities}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Damage Immunities</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.damageImmunities, sourcePath)}</span>
                </div>
            {/if}
            {#if monster.conditionImmunities}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Condition Immunities</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.conditionImmunities, sourcePath)}</span>
                </div>
            {/if}
            {#if monster.senses}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Senses</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.senses, sourcePath)}</span>
                </div>
            {/if}
            {#if monster.languages}
                <div class="stat-block-data">
                    <span class="stat-block-data-label">Languages</span>
                    <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.languages, sourcePath)}</span>
                </div>
            {/if}
            {#if monster.challenge || monster.proficiencyBonus}
                <div class="stat-block-data-last">
                    {#if monster.challenge}
                        <div class="stat-block-data">
                            <span class="stat-block-data-label">Challenge</span>
                            <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.challenge, sourcePath)}</span>
                        </div>
                    {/if}
                    {#if monster.proficiencyBonus}
                        <div class="stat-block-data">
                            <span class="stat-block-data-label">Proficiency Bonus</span>
                            <span class="stat-block-data-value">{@html plugin.convertMarkdown(monster.proficiencyBonus, sourcePath)}</span>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
    {#if monster.feats || monster.actions || monster.bonusActions || monster.reactions || monster.legendaryActions || monster.mythicActions}
        <div class="stat-block-body">
            {#if monster.feats}
                <StatBlockBody heading={null} paragraphs={monster.feats} {plugin} {sourcePath} />
            {/if}
            {#if monster.actions}
                <StatBlockBody heading="Actions" paragraphs={monster.actions} {plugin} {sourcePath} />
            {/if}
            {#if monster.bonusActions}
                <StatBlockBody heading="Bonus Actions" paragraphs={monster.bonusActions} {plugin} {sourcePath} />
            {/if}
            {#if monster.reactions}
                <StatBlockBody heading="Reactions" paragraphs={monster.reactions} {plugin} {sourcePath} />
            {/if}
            {#if monster.legendaryActions}
                <StatBlockBody heading="Legendary Actions" paragraphs={monster.legendaryActions} {plugin} {sourcePath} />
            {/if}
            {#if monster.mythicActions}
                <StatBlockBody heading="Mythic Actions" paragraphs={monster.mythicActions} {plugin} {sourcePath} />
            {/if}
        </div>
    {/if}
    {#if monster.image && !monster.imageFirst}
        <div class="stat-block-image">
            {@html plugin.convertMarkdown(monster.image, sourcePath)}
        </div>
    {/if}
</div>

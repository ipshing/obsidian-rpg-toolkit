<script lang="ts">
    import { Monster } from "src/models";
    import AbilityScore from "./ability-score-2024.svelte";
    import StatBlockSection from "./stat-block-section.svelte";
    import RpgToolkit from "src/main";

    export let monster: Monster;
    export let plugin: RpgToolkit;
    export let sourcePath: string;

    function generateCss(css: string | undefined): string {
        if (css) return "monster-stat-block-2024 " + css;
        else return "monster-stat-block-2024";
    }
    function generateMetadata(size: string, creatureType: string, alignment: string): string {
        let metadata = size;
        if (creatureType) metadata += " " + creatureType;
        if (alignment) metadata += ", " + alignment;

        return metadata;
    }
    function generateXP(xp: number | undefined, pb: string | undefined) {
        let str = "(";
        if (xp) {
            str += `XP ${xp.toString()}`;
        }
        if (pb) {
            if (xp) str += "; ";
            str += `PB ${pb}`;
        }
        str += ")";
        return str;
    }
</script>

<div class={generateCss(monster.css).trim()}>
    {#if monster.image && monster.imageFirst}
        <div class="stat-block-image">
            {@html plugin.convertMarkdown(monster.image, sourcePath)}
        </div>
    {/if}
    <h2>{@html plugin.convertMarkdown(monster.name, sourcePath)}</h2>
    <p>{@html plugin.convertMarkdown(generateMetadata(monster.size, monster.creatureType, monster.alignment), sourcePath)}</p>
    {#if monster.armorClass}
        <p>
            <strong>AC</strong>
            {@html plugin.convertMarkdown(monster.armorClass, sourcePath)}
            {#if monster.initiative}
                <strong>Initiative</strong>
                {@html plugin.convertMarkdown(monster.initiative, sourcePath)}
            {/if}
        </p>
    {/if}
    {#if monster.hitPoints}
        <p>
            <strong>HP</strong>
            {@html plugin.convertMarkdown(monster.hitPoints, sourcePath)}
        </p>
    {/if}
    {#if monster.speed}
        <p>
            <strong>Speed</strong>
            {@html plugin.convertMarkdown(monster.speed, sourcePath)}
        </p>
    {/if}
    {#if monster.abilityScores}
        <div class="ability-scores">
            <table class="physical abilities-saves">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Mod</th>
                        <th>Save</th>
                    </tr>
                </thead>
                <tbody>
                    <AbilityScore ability={"STR"} score={monster.abilityScores[0]} />
                    <AbilityScore ability={"DEX"} score={monster.abilityScores[1]} />
                    <AbilityScore ability={"CON"} score={monster.abilityScores[2]} />
                </tbody>
            </table>
            <table class="mental abilities-saves">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Mod</th>
                        <th>Save</th>
                    </tr>
                </thead>
                <tbody>
                    <AbilityScore ability={"INT"} score={monster.abilityScores[3]} />
                    <AbilityScore ability={"WIS"} score={monster.abilityScores[4]} />
                    <AbilityScore ability={"CHA"} score={monster.abilityScores[5]} />
                </tbody>
            </table>
        </div>
    {/if}
    {#if monster.savingThrows}
        <p>
            <strong>Saves</strong>
            {@html plugin.convertMarkdown(monster.savingThrows, sourcePath)}
        </p>
    {/if}
    {#if monster.skills}
        <p>
            <strong>Skills</strong>
            {@html plugin.convertMarkdown(monster.skills, sourcePath)}
        </p>
    {/if}
    {#if monster.damageVulnerabilities}
        <p>
            <strong>Vulnerabilities</strong>
            {@html plugin.convertMarkdown(monster.damageVulnerabilities, sourcePath)}
        </p>
    {/if}
    {#if monster.damageResistances}
        <p>
            <strong>Resistances</strong>
            {@html plugin.convertMarkdown(monster.damageResistances, sourcePath)}
        </p>
    {/if}
    {#if monster.damageImmunities}
        <p>
            <strong>Immunities</strong>
            {@html plugin.convertMarkdown(monster.damageImmunities, sourcePath)}
        </p>
    {/if}
    {#if monster.senses}
        <p>
            <strong>Senses</strong>
            {@html plugin.convertMarkdown(monster.senses, sourcePath)}
        </p>
    {/if}
    {#if monster.languages}
        <p>
            <strong>Languages</strong>
            {@html plugin.convertMarkdown(monster.languages, sourcePath)}
        </p>
    {/if}
    {#if monster.challenge || monster.xp || monster.proficiencyBonus}
        <p>
            {#if monster.challenge}
                <strong>CR</strong>
                {@html plugin.convertMarkdown(monster.challenge, sourcePath)}
                {#if monster.xp || monster.proficiencyBonus}
                    {@html plugin.convertMarkdown(generateXP(monster.xp, monster.proficiencyBonus), sourcePath)}
                {/if}
            {/if}
        </p>
    {/if}
    {#if monster.feats}
        <StatBlockSection heading="Traits" paragraphs={monster.feats} {plugin} {sourcePath} />
    {/if}
    {#if monster.actions}
        <StatBlockSection heading="Actions" paragraphs={monster.actions} {plugin} {sourcePath} />
    {/if}
    {#if monster.bonusActions}
        <StatBlockSection heading="Bonus Actions" paragraphs={monster.bonusActions} {plugin} {sourcePath} />
    {/if}
    {#if monster.reactions}
        <StatBlockSection heading="Reactions" paragraphs={monster.reactions} {plugin} {sourcePath} />
    {/if}
    {#if monster.legendaryActions}
        <StatBlockSection heading="Legendary Actions" paragraphs={monster.legendaryActions} {plugin} {sourcePath} />
    {/if}
    {#if monster.mythicActions}
        <StatBlockSection heading="Mythic Actions" paragraphs={monster.mythicActions} {plugin} {sourcePath} />
    {/if}
    {#if monster.image && !monster.imageFirst}
        <div class="stat-block-image">
            {@html plugin.convertMarkdown(monster.image, sourcePath)}
        </div>
    {/if}
</div>

<script lang="ts">
    import { Spell } from "src/models";
    import { ICONS } from "src/utils/icons";

    export let spell: Spell;
</script>

<div class="spell-table">
    <div class="spell-table-property">
        <div class="spell-table-property-name">Level</div>
        <div class="spell-table-property-value">{spell.level}</div>
    </div>
    <div class="spell-table-property">
        <div class="spell-table-property-name">Casting Time</div>
        <div class="spell-table-property-value">
            {spell.castingTime}
            {#if spell.isRitual}
                <div class="rpg-icon rpg-icon-small">
                    {@html ICONS["ritual"]}
                </div>
            {/if}
        </div>
    </div>
    <div class="spell-table-property">
        <div class="spell-table-property-name">Range/Area</div>
        <div class="spell-table-property-value">
            {spell.range}
            {#if spell.area}
                / {spell.area}
            {/if}
            {#if spell.areaIcon && ICONS[spell.areaIcon]}
                <div class="rpg-icon rpg-icon-small">
                    {@html ICONS[spell.areaIcon]}
                </div>
            {/if}
        </div>
    </div>
    <div class="spell-table-property">
        <div class="spell-table-property-name">Components</div>
        <div class="spell-table-property-value">{spell.components}</div>
    </div>
    <div class="spell-table-property">
        <div class="spell-table-property-name">Duration</div>
        <div class="spell-table-property-value">
            {spell.duration}
            {#if spell.needsConcentration}
                <div class="rpg-icon rpg-icon-small">
                    {@html ICONS["concentration"]}
                </div>
            {/if}
        </div>
    </div>
    <div class="spell-table-property">
        <div class="spell-table-property-name">School</div>
        <div class="spell-table-property-value">{spell.school}</div>
    </div>
    <div class="spell-table-property">
        <div class="spell-table-property-name">Attack/Save</div>
        <div class="spell-table-property-value">
            {#if spell.attackIcon && ICONS[spell.attackIcon]}
                <div class="rpg-icon rpg-icon-small">
                    {@html ICONS[spell.attackIcon]}
                </div>
            {/if}
            {#if spell.attack}
                {spell.attack}
            {/if}
            {#if spell.save}
                {spell.save}
            {/if}
        </div>
    </div>
    <div class="spell-table-property">
        <div class="spell-table-property-name">Damage/Effect</div>
        <div class="spell-table-property-value">
            {#if spell.damage}
                {#if spell.damageIcon && ICONS[spell.damageIcon]}
                    <div class="rpg-icon rpg-icon-small">
                        {@html ICONS[spell.damageIcon]}
                    </div>
                {/if}
                {spell.damage}
            {:else if spell.condition}
                {#if spell.conditionIcon && ICONS[spell.conditionIcon]}
                    <div class="rpg-icon rpg-icon-small">
                        {@html ICONS[spell.conditionIcon]}
                    </div>
                {/if}
                {spell.condition}
            {:else if spell.effect}
                {spell.effect}
            {/if}
        </div>
    </div>
</div>

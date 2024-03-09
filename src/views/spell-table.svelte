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
            {spell.rangeArea}
            {#if spell.rangeAreaIcon && ICONS[spell.rangeAreaIcon]}
                <div class="rpg-icon rpg-icon-small">
                    {@html ICONS[spell.rangeAreaIcon]}
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
            {#if spell.attackSaveIcon && ICONS[spell.attackSaveIcon]}
                <div class="rpg-icon rpg-icon-small">
                    {@html ICONS[spell.attackSaveIcon]}
                </div>
            {/if}
            {spell.attackSave}
        </div>
    </div>
    <div class="spell-table-property">
        <div class="spell-table-property-name">Damage/Effect</div>
        <div class="spell-table-property-value">
            {#if spell.damageEffectIcon && ICONS[spell.damageEffectIcon]}
                <div class="rpg-icon rpg-icon-small">
                    {@html ICONS[spell.damageEffectIcon]}
                </div>
            {/if}
            {spell.damageEffect}
        </div>
    </div>
</div>

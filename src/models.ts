export interface Monster {
    css?: string;
    name: string;
    size: string;
    creatureType: string;
    alignment: string;
    armorClass?: string;
    hitPoints?: string;
    speed?: string;
    abilityScores?: [number, number, number, number, number, number];
    savingThrows?: string;
    skills?: string;
    damageVulnerabilities?: string;
    damageResistances?: string;
    damageImmunities?: string;
    conditionImmunities?: string;
    senses?: string;
    languages?: string;
    challenge?: string;
    proficiencyBonus?: string;
    feats?: string[];
    spells?: string[];
    actions?: string[];
    bonusActions?: string[];
    reactions?: string[];
    legendaryActions?: string[];
    mythicActions?: string[];
    image?: string;
    imageFirst: boolean;
}

export interface Vehicle {
    css?: string;
    name: string;
    size: string;
    dimensions: string;
    creatureCapacity: string;
    cargoCapacity: string;
    travelPace: string;
    abilityScores: [number, number, number, number, number, number];
    damageImmunities?: string;
    conditionImmunities?: string;
    actions?: string[];
    components?: VehicleComponent[];
    image?: string;
    imageFirst: boolean;
}

export interface VehicleComponent {
    name: string;
    attributes: string[];
}

export interface Spell {
    level: string;
    castingTime: string;
    rangeArea: string;
    components: string;
    duration: string;
    school: string;
    attackSave: string;
    damageEffect: string;

    isRitual: boolean;
    needsConcentration: boolean;
    rangeAreaIcon?: string;
    attackSaveIcon?: string;
    damageEffectIcon?: string;
}

export interface Counter {
    css?: string;
    min?: number;
    max?: number;
    default?: number;
    value?: number;
    decreaseText?: string;
    increaseText?: string;
    resetText?: string;
}

export interface MapModel {
    css?: string;
    map: string;
    caption?: string;
    areas?: MapAreaModel[];
}

export interface MapAreaModel {
    name: string;
    // top, left, width, height (percentages)
    coords: [number, number, number, number];
    link: string;
}

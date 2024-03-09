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

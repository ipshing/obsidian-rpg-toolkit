import { MarkdownPostProcessorContext, MarkdownRenderer, Plugin, parseYaml } from "obsidian";
import { valid, lt } from "semver";
import { Monster, Spell, Vehicle } from "./models";
import MonsterStatBlock from "./views/monster-stat-block.svelte";
import VehicleStatBlock from "./views/vehicle-stat-block.svelte";
import SpellTable from "./views/spell-table.svelte";

interface RpgToolkitSettings {
    version: string;
    previousVersion: string;
}

const DEFAULT_SETTINGS: RpgToolkitSettings = {
    version: "",
    previousVersion: "",
};

export default class RpgToolkit extends Plugin {
    settings: RpgToolkitSettings;

    async onload() {
        // Load settings
        await this.loadSettings();
        // Check version
        await this.runVersionCheck();

        // Register processors
        this.registerMarkdownCodeBlockProcessor("monster-stat-block", this.processMonster.bind(this));
        this.registerMarkdownPostProcessor((container, context) => {
            const child = container.querySelector(".callout[data-callout='monster-stat-block'") as HTMLElement;
            if (child) {
                const info = context.getSectionInfo(container);
                if (info) {
                    // Convert text to lines
                    const lines = info.text.split(/\r?\n/);
                    // Skip first line and remove leading '>' characters
                    let yaml = "";
                    for (let i = info.lineStart + 1; i <= info.lineEnd; i++) {
                        const line = lines[i].replace(/^>+/, "").trim();
                        if (line.length > 0) {
                            yaml += line + "\n";
                        }
                    }
                    // Process stat block
                    this.processMonster(yaml, child, context);
                }
            }
        });
        this.registerMarkdownCodeBlockProcessor("vehicle-stat-block", this.processVehicle.bind(this));
        this.registerMarkdownCodeBlockProcessor("spell-table", this.processSpellTable.bind(this));

        console.log("RPG Toolkit plugin loaded");
    }

    onunload() {
        console.log("RPG Toolkit plugin unloaded");
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async runVersionCheck() {
        // Check previous version
        if (!valid(this.settings.version)) this.settings.version = "1.0.0";
        if (lt(this.settings.version, this.manifest.version)) {
            // Run updates here

            // Update version properties in settings
            this.settings.previousVersion = this.settings.version;
            this.settings.version = this.manifest.version;
            await this.saveSettings();
        }
    }

    /**
     * Converts markdown string to HTML
     * @param markdown The markdown source code
     * @param sourcePath The normalized path of this markdown file, used to resolve relative internal links
     */
    convertMarkdown(markdown: string, sourcePath: string): string {
        // Create temporary container
        const container = createDiv();
        // Convert the markdown to html
        MarkdownRenderer.render(this.app, markdown, container, sourcePath, this);
        // Get the child element...
        if (container.childElementCount === 1) {
            const child = container.children[0];
            // ...and return it
            return child.innerHTML;
        }

        return "";
    }

    processMonster(markdown: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
        const sourcePath = typeof context == "string" ? context : context?.sourcePath ?? this.app.workspace.getActiveFile()?.path ?? "";

        // Remove 'element' and load the view into the parent container
        let dest = element.parentElement;
        if (dest) {
            dest.removeChild(element);
        } else {
            // Unless there is no parent, then load into 'element'
            dest = element;
        }

        // Parse the stat block
        const monster: Monster = parseYaml(markdown);

        // Create the view and load into 'dest' container
        new MonsterStatBlock({
            target: dest,
            props: {
                monster,
                plugin: this,
                sourcePath,
            },
        });
    }

    processVehicle(markdown: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
        const sourcePath = typeof context == "string" ? context : context?.sourcePath ?? this.app.workspace.getActiveFile()?.path ?? "";

        // Remove 'element' and load the view into the parent container
        let dest = element.parentElement;
        if (dest) {
            dest.removeChild(element);
        } else {
            // Unless there is no parent, then load into 'element'
            dest = element;
        }

        // Parse the stat block
        const vehicle: Vehicle = parseYaml(markdown);

        // Create the view and load into 'dest' container
        new VehicleStatBlock({
            target: dest,
            props: {
                vehicle,
                plugin: this,
                sourcePath,
            },
        });
    }

    processSpellTable(markdown: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
        // Remove 'element' and load the view into the parent container
        let dest = element.parentElement;
        if (dest) {
            dest.removeChild(element);
        } else {
            // Unless there is no parent, then load into 'element'
            dest = element;
        }

        // Parse the spell data
        const spell: Spell = parseYaml(markdown);

        // Put into SpellTable view
        new SpellTable({
            target: dest,
            props: {
                spell,
            },
        });
    }
}

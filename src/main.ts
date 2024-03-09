import { Plugin } from "obsidian";
import { valid, lt } from "semver";

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
}

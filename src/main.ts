import { MarkdownPostProcessorContext, MarkdownRenderer, Plugin, parseYaml } from "obsidian";
import { valid, lt } from "semver";
import { Counter, Monster, Spell, Vehicle, MapModel } from "./models";
import MonsterStatBlock from "./views/monster-stat-block.svelte";
import VehicleStatBlock from "./views/vehicle-stat-block.svelte";
import SpellTable from "./views/spell-table.svelte";
import CounterView from "./views/counter.svelte";
import ImageMap from "./views/image-map.svelte";

interface RpgToolkitSettings {
    version: string;
    previousVersion: string;
}

const DEFAULT_SETTINGS: RpgToolkitSettings = {
    version: "",
    previousVersion: "",
};

const CSS_TOKEN = "css:";
const CLS_TOKEN = "cls:";
const ALT_TOKEN = "alt:";
const CAPTION_TOKEN = "caption:";
const CAP_TOKEN = "cap:";

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
        this.registerMarkdownCodeBlockProcessor("rpg-counter", this.processCounter.bind(this));
        this.registerMarkdownCodeBlockProcessor("rpg-map", this.processMap.bind(this));

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

        // Locate embed containers. They should be loaded in by now.
        dest.findAll(".internal-embed.image-embed.is-loaded").forEach((container) => {
            this.renderEmbeddedImage(container);
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

    processCounter(markdown: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
        // Remove 'element' and load the view into the parent container
        let dest = element.parentElement;
        if (dest) {
            dest.removeChild(element);
        } else {
            // Unless there is no parent, then load into 'element'
            dest = element;
        }

        // Get properties from the markdown
        const props: Counter = parseYaml(markdown);
        // Verify properties
        if (props.min != null && props.max != null && props.min > props.max) {
            // Have to pick one: prioritize the max over the min
            props.min = props.max - 1;
        }
        if (props.min != null && props.min > 0) {
            props.default = props.min;
        } else if (props.max != null && props.max < 0) {
            props.default = props.max;
        } else {
            props.default = 0;
        }
        if (props.value == null) {
            props.value = props.default;
        }

        // Put into Counter view
        new CounterView({
            target: dest,
            props: {
                props,
                decreaseButtonClicked: async (e: MouseEvent) => {
                    if (props.min == null || (props.value && props.value > props.min)) {
                        await this.updateCounter(props.value! - 1, dest!, context);
                    }
                },
                increaseButtonClicked: async (e: MouseEvent) => {
                    if (props.max == null || (props.value && props.value < props.max)) {
                        await this.updateCounter(props.value! + 1, dest!, context);
                    }
                },
                resetButtonClicked: async (e: MouseEvent) => {
                    await this.updateCounter(props.default!, dest!, context);
                },
            },
        });
    }

    processMap(markdown: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
        const sourcePath = typeof context == "string" ? context : context?.sourcePath ?? this.app.workspace.getActiveFile()?.path ?? "";

        // Remove 'element' and load the view into the parent container
        let dest = element.parentElement;
        if (dest) {
            dest.removeChild(element);
        } else {
            // Unless there is no parent, then load into 'element'
            dest = element;
        }

        const map: MapModel = parseYaml(markdown);

        new ImageMap({
            target: dest,
            props: {
                imageMap: map,
                plugin: this,
                sourcePath,
            },
        });
    }

    async updateCounter(newValue: number, element: HTMLElement, context: MarkdownPostProcessorContext) {
        const filePath = typeof context == "string" ? context : context?.sourcePath ?? this.app.workspace.getActiveFile()?.path ?? "";
        const sectionInfo = context.getSectionInfo(element);

        const file = this.app.vault.getFileByPath(filePath);
        if (file && sectionInfo) {
            // Read in the file text
            const contents = await this.app.vault.read(file);
            const lines = contents.split(/\r?\n/);
            // Check that start line lines up
            if (!lines[sectionInfo.lineStart].startsWith("```rpg-counter")) return;

            // Look for value line
            let isDirty = false;
            for (let i = sectionInfo.lineStart; i <= sectionInfo.lineEnd; i++) {
                if (lines[i].startsWith("value:")) {
                    // Replace value
                    lines[i] = `value: ${newValue}`;

                    isDirty = true;
                }
            }
            if (!isDirty) {
                // No "value:" line was found, need to add one
                lines.splice(sectionInfo.lineEnd, 0, `value: ${newValue}`);

                isDirty = true;
            }

            if (isDirty) {
                // Write the contents back out
                const updated = lines.join("\n");
                this.app.vault.modify(file, updated);
            }
        }
    }

    //
    // Taken from https://github.com/ipshing/obsidian-markdown-extended
    //
    /**
     * Replaces the default image rendering functionality by extracting
     * css classes and captions from the 'alt' text of an <img> and
     * adding it to the element.
     * @param embedContainer The HTMLElement containing the <img> tag.
     */
    renderEmbeddedImage(embedContainer: HTMLElement) {
        // Get the "alt" value and parse for properties
        const alt = embedContainer.getAttribute("alt");
        if (!alt) return;

        // Get image
        const img = embedContainer.querySelector("img");
        if (!img) return;

        const cssClasses: string[] = [];
        let caption = "";
        let newAltValue = "";
        let replaceAlt = false;

        if (alt.contains(CSS_TOKEN) || alt.contains(CLS_TOKEN) || alt.contains(ALT_TOKEN) || alt.contains(CAPTION_TOKEN) || alt.contains(CAP_TOKEN)) {
            // Split using a semi-colon, trim, then filter out empty entries
            const altLines = alt
                .split(";")
                .map((line) => line.trim())
                .filter((line) => line);
            altLines.forEach((line) => {
                // Check for custom css styling
                if (line.startsWith(CSS_TOKEN)) {
                    const cssClassStr = line.slice(CSS_TOKEN.length).trim();
                    // Parse into array of classes
                    if (cssClassStr) {
                        cssClasses.push(...cssClassStr.split(/,| /).filter((s) => s));
                        replaceAlt = true;
                    }
                } else if (line.startsWith(CLS_TOKEN)) {
                    const cssClassStr = line.slice(CLS_TOKEN.length).trim();
                    // Parse into array of classes
                    if (cssClassStr) {
                        cssClasses.push(...cssClassStr.split(/,| /).filter((s) => s));
                        replaceAlt = true;
                    }
                }
                // Look for alt text that should stay when processing is done
                else if (line.startsWith(ALT_TOKEN)) {
                    newAltValue = line.slice(ALT_TOKEN.length).trim();
                    replaceAlt = true;
                }
                // Look for caption to be placed after image
                else if (line.startsWith(CAPTION_TOKEN)) {
                    caption += ` ${line.slice(CAPTION_TOKEN.length).trim()}`;
                    replaceAlt = true;
                } else if (line.startsWith(CAP_TOKEN)) {
                    caption += ` ${line.slice(CAP_TOKEN.length).trim()}`;
                    replaceAlt = true;
                }
            });
        } else {
            // No tokens, check if alt is just the file name
            let fileName = img.src;
            // Remove '?' if it's present
            const qMark = fileName.indexOf("?");
            if (qMark > -1) {
                fileName = fileName.slice(0, qMark);
            }
            if (!fileName.endsWith(alt)) {
                // process as caption, but leave alt
                caption = alt;
            }
        }

        // Replace alt if necessary
        if (replaceAlt) {
            // Replace the img[alt] with the new value
            img.removeAttribute("alt");
            if (newAltValue) {
                img.setAttribute("alt", newAltValue);
            }
        }

        // Default to embedContainer
        let containerToReplace = embedContainer;
        // Check the parent. If it's a <p> with no other children
        // than the image, switch to replacing it instead.
        const parent = embedContainer.parentElement;
        if (parent && parent.matches("p") && parent.children.length == 1) {
            containerToReplace = parent;
        }

        // Create the figure and add the image
        const figure = createEl("figure", { cls: cssClasses });
        figure.appendChild(img);
        // Add the caption
        if (caption) {
            figure.createEl("figcaption", {
                text: caption.trim(),
            });
        }
        // Set figure width if image has width
        if (img.hasAttribute("width")) {
            figure.style.width = img.getAttribute("width") + "px";
        }

        if (caption) {
            // Replace with the <figure>
            containerToReplace.replaceWith(figure);
        } else {
            // Add css classes to the <img>
            img.addClasses(cssClasses);
            // Replace with the <img>
            containerToReplace.replaceWith(img);
        }
    }
}

import {configDir} from "@tauri-apps/api/path";
import {createDir, readTextFile, writeFile} from "@tauri-apps/api/fs";
import {writable} from "svelte/store";

const settingsDirectoryName = "tech.tanay.freemind";
const settingsFileName = "settings.json";

export type Website = {
  name: string,
  enabled: boolean,
}

export type WebsiteBlockList = {
  enabled: boolean,
  websites: Website[]
}

export type Settings = {
  timerValue: number,
  websiteBlockList: Record<string, WebsiteBlockList>
}

const defaultSettings: Settings = {
  timerValue: 25,
  websiteBlockList: {
    "Social Media": {
      enabled: true, websites: [
        {name: "facebook.com", enabled: true},
        {name: "twitter.com", enabled: true},
        {name: "instagram.com", enabled:true}
      ]
    },
    "Shopping": {
      enabled: true, websites: [{name: "amazon.com", enabled: true}, {name: "flipkart.com", enabled: true}]
    },
    "Work": {
      enabled: true, websites: [{name: "slack.com", enabled: true}, {name: "github.com", enabled: true}]
    },
    "News": {
      enabled: true, websites: [{name: "nytimes.com", enabled: true}, {name: "cnn.com", enabled: true}]
    },
    "Entertainment": {
      enabled: true, websites: [{name: "netflix.com", enabled: true}, {name: "youtube.com", enabled: true}]
    },
    "Games": {
      enabled: true, websites: [{name: "steam.com", enabled: true}, {name: "epicgames.com", enabled: true}]
    },
  }
}

const mergeSettings = (oldSettings: Settings, newSettings: Settings): Settings => {
  return {
    timerValue: newSettings.timerValue,
    websiteBlockList: {...oldSettings.websiteBlockList, ...newSettings.websiteBlockList},
  }
}

const saveSettings = async (settings: Settings) => {
  console.log(`saving settings`)
  const configBase = await configDir();
  const settingsStem = `${configBase}${settingsDirectoryName}`;
  await createDir(settingsStem, {recursive: true});
  const settingsPath = `${configBase}${settingsDirectoryName}/${settingsFileName}`;
  await writeFile(settingsPath, JSON.stringify(settings));
}

const loadSettings = async (): Promise<Settings> => {
  const configBase = await configDir();
  const settingsPath = `${configBase}${settingsDirectoryName}/${settingsFileName}`;
  try {
    await readTextFile(settingsPath);
  } catch (e) {
    await saveSettings(defaultSettings);
    return defaultSettings;
  }
  const existingSettings: Settings = JSON.parse(await readTextFile(settingsPath));
  const settings = mergeSettings(defaultSettings, existingSettings);
  console.log(`loaded settings ${JSON.stringify(settings)}`)
  return settings
}

const settingsStore = writable<Settings>(defaultSettings)

loadSettings().then((settings) => {
  settingsStore.set(settings)
  settingsStore.subscribe(async (settings) => {
    await saveSettings(settings)
  });
})

export {
  saveSettings,
  loadSettings,
  settingsStore
}

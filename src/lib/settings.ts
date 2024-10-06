import {configDir} from "@tauri-apps/api/path";
import {createDir, readTextFile, writeFile} from "@tauri-apps/api/fs";
import {writable} from "svelte/store";
import {socialMediaWebsites} from "$lib/lists/socialMedia";
import {shoppingWebsites} from "$lib/lists/shopping";
import {newsWebsites} from "$lib/lists/news";
import {entertainmentWebsites} from "$lib/lists/entertainment";
import {gamingWebsites} from "$lib/lists/gaming";
import {adultWebsites} from "$lib/lists/adult";

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
    "Social Media": {enabled: true, websites: socialMediaWebsites},
    "Shopping": {enabled: true, websites: shoppingWebsites},
    "News": {enabled: true, websites: newsWebsites},
    "Entertainment": {enabled: true, websites: entertainmentWebsites},
    "Games": {enabled: true, websites: gamingWebsites},
    "Adult 18+": {enabled: true, websites: adultWebsites}
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

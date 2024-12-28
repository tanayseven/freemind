import { configDir } from '@tauri-apps/api/path'
import { createDir, readTextFile, writeFile } from '@tauri-apps/api/fs'
import { writable } from 'svelte/store'
import { socialMediaWebsites } from '$lib/lists/socialMedia'
import { shoppingWebsites } from '$lib/lists/shopping'
import { newsWebsites } from '$lib/lists/news'
import { entertainmentWebsites } from '$lib/lists/entertainment'
import { gamingWebsites } from '$lib/lists/gaming'
import { adultWebsites } from '$lib/lists/adult'

const settingsDirectoryName = "tech.tanay.freemind"
const settingsFileName = "settings.json"

export type WebsiteEntry = {
  website: string
  enabled: boolean
  category: string
}


export type Settings = {
  timerValue: number
  websiteBlockList: WebsiteEntry[]
}

const defaultSettings: Settings = {
  timerValue: 25,
  websiteBlockList: [
    ...socialMediaWebsites.map((website) => ({ website, enabled: true, category: "Social Media" })),
    ...shoppingWebsites.map((website) => ({ website, enabled: true, category: "Shopping" })),
    ...newsWebsites.map((website) => ({ website, enabled: true, category: "News" })),
    ...entertainmentWebsites.map((website) => ({ website, enabled: true, category: "Entertainment" })),
    ...gamingWebsites.map((website) => ({ website, enabled: true, category: "Gaming" })),
    ...adultWebsites.map((website) => ({ website, enabled: true, category: "Porn 18+" })),
  ],
}

const mergeSettings = (oldSettings: Settings, newSettings: Settings): Settings => {
  return {
    timerValue: newSettings.timerValue,
    websiteBlockList: { ...oldSettings.websiteBlockList, ...newSettings.websiteBlockList },
  }
}

const saveSettings = async (settings: Settings) => {
  const configBase = await configDir()
  const settingsStem = `${configBase}${settingsDirectoryName}`
  await createDir(settingsStem, { recursive: true })
  const settingsPath = `${configBase}${settingsDirectoryName}/${settingsFileName}`
  await writeFile(settingsPath, JSON.stringify(settings))
}

const loadSettings = async (): Promise<Settings> => {
  const configBase = await configDir()
  const settingsPath = `${configBase}${settingsDirectoryName}/${settingsFileName}`
  try {
    await readTextFile(settingsPath)
  } catch (e) {
    await saveSettings(defaultSettings)
    return defaultSettings
  }
  const existingSettings: Settings = JSON.parse(await readTextFile(settingsPath))
  const settings = mergeSettings(defaultSettings, existingSettings)
  return settings
}

const settingsStore = writable<Settings>(defaultSettings)

loadSettings().then((settings) => {
  settingsStore.set(settings)
  settingsStore.subscribe(async (settings) => {
    await saveSettings(settings)
  })
})

export { saveSettings, loadSettings, settingsStore }

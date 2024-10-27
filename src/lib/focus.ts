import { invoke } from "@tauri-apps/api/tauri"
import { settingsStore } from "$lib/settings"
import { get } from "svelte/store"
import { readTextFile, writeFile } from "@tauri-apps/api/fs"

const hostsFile = "/etc/hosts"
const possibleSubdomains = ["www", "news", "blog", "web"]
const start = "#-freemind-blacklist-start-#"
const end = "#-freemind-blacklist-end-#"
const redirectUrl = "127.0.0.1"

export type TimeRemaining = {
  minutes: number
  seconds: number
}

export const areSitesBlocked = async () => {
  const hostsFileContents: string = await invoke("read_file_contents", { filePath: hostsFile })
  return hostsFileContents.includes(start) && hostsFileContents.includes(end)
}

const allEnabledDistractingSites = (): string[] => {
  const settings = get(settingsStore)
  let listOfWebsitesToBlock: string[] = []
  for (let websiteBlockList of Object.values(settings.websiteBlockList)) {
    if (websiteBlockList.enabled) {
      listOfWebsitesToBlock = [...listOfWebsitesToBlock, ...websiteBlockList.websites.map((website) => website.name)]
    }
  }
  return listOfWebsitesToBlock
}

const addBlockedSites = async (hostsFileContents: string) => {
  if (await areSitesBlocked()) return hostsFileContents
  const lines = hostsFileContents.split("\n")
  let newLines = [start]
  for (let distractingSite of allEnabledDistractingSites()) {
    const line = `${redirectUrl} ${distractingSite}`
    newLines.push(line)
    for (let subdomain of possibleSubdomains) {
      const line = `${redirectUrl} ${[subdomain, distractingSite].join(".")}`
      newLines.push(line)
    }
  }
  newLines.push(end)
  newLines.push("")
  return lines.concat(newLines).join("\n")
}

const removeBlockedSites = async (hostsFileContents: string) => {
  if (!(await areSitesBlocked())) return hostsFileContents
  const lines = hostsFileContents.split("\n")
  let newLines = []
  let isInsideBlockedSitesSection = false
  for (let line of lines) {
    if (line.includes(start)) {
      isInsideBlockedSitesSection = true
      continue
    }
    if (line.includes(end)) {
      isInsideBlockedSitesSection = false
      continue
    }
    if (!isInsideBlockedSitesSection) {
      newLines.push(line)
    }
  }
  if (newLines[newLines.length - 1] === "") newLines.pop()
  return newLines.join("\n")
}

export const startFocus = async () => {
  console.log("Starting focus time")
  try {
    const hostContents: string = await invoke("read_file_contents", { filePath: hostsFile })
    const modifiedHostContents = await addBlockedSites(hostContents)
    await invoke("write_file_contents", { contents: modifiedHostContents, filePath: hostsFile })
    await invoke("restart_network")
  } catch (error) {
    console.error("Error reading hosts file:", error)
  }
}

export const stopFocus = async () => {
  console.log("Stopping focus time")
  try {
    const hostContents: string = await invoke("read_file_contents", { filePath: hostsFile })
    const modifiedHostContents = await removeBlockedSites(hostContents)
    await invoke("write_file_contents", { contents: modifiedHostContents, filePath: hostsFile })
    await invoke("restart_network")
  } catch (error) {
    console.error("Error reading hosts file:", error)
  }
}

export const isFocusEnabled = async () => {
  console.log("Checking focus time")
  try {
    return areSitesBlocked()
  } catch (error) {
    console.error("Error reading hosts file:", error)
    return false
  }
}

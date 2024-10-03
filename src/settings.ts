import {configDir} from "@tauri-apps/api/path";
import {writeFile, readTextFile, createDir} from "@tauri-apps/api/fs";

const settingsDirectoryName = "tech.tanay.freemind";
const settingsFileName = "settings.json";

type Settings = {
  timerValue: number,
}

const defaultSettings = {
  timerValue: 25,
}

const saveSettings = async (settings: Settings) => {
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
  }
  catch (e) {
    await saveSettings(defaultSettings);
    return defaultSettings;
  }
  const settings = await readTextFile(settingsPath);
  return JSON.parse(settings);
}

export {
  saveSettings,
  loadSettings,
}

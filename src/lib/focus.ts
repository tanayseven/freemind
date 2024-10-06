import {invoke} from "@tauri-apps/api/tauri";

const hostsFile = '/etc/hosts';
const possibleSubdomains = ["www", "news", "blog", "web"]
const distractingSites = ['facebook.com', 'twitter.com', 'instagram.com', 'reddit.com', 'x.com', 'linkedin.com', 'youtube.com', 'whatsapp.com'];
const start = '#-freemind-blacklist-start-#';
const end = '#-freemind-blacklist-end-#';
const redirectUrl = '127.0.0.1';

export const areSitesBlocked = async () => {
  const hostsFileContents: string = await invoke('read_file_contents', { filePath: hostsFile });
  return hostsFileContents.includes(start) && hostsFileContents.includes(end);
}

const addBlockedSites = async (hostsFileContents: string) => {
  if (await areSitesBlocked()) return hostsFileContents;
  const lines = hostsFileContents.split('\n');
  let newLines = [start];
  for (let distractingSite of distractingSites) {
    const line = `${redirectUrl} ${distractingSite}`;
    newLines.push(line);
    for (let subdomain of possibleSubdomains) {
      const line = `${redirectUrl} ${([subdomain, distractingSite].join('.'))}`;
      newLines.push(line);
    }
  }
  newLines.push(end);
  newLines.push('');
  return lines.concat(newLines).join('\n');
}

const removeBlockedSites = async (hostsFileContents: string) => {
  if (!await areSitesBlocked()) return hostsFileContents;
  const lines = hostsFileContents.split('\n');
  let newLines = [];
  let isInsideBlockedSitesSection = false;
  for (let line of lines) {
    if (line.includes(start)) {
      isInsideBlockedSitesSection = true;
      continue;
    }
    if (line.includes(end)) {
      isInsideBlockedSitesSection = false;
      continue;
    }
    if (!isInsideBlockedSitesSection) {
      newLines.push(line);
    }
  }
  if (newLines[newLines.length - 1] === '') newLines.pop();
  return newLines.join('\n');
}

export const startFocus = async () => {
  console.log("Starting focus time")
  try {
    const hostContents: string = await invoke('read_file_contents', { filePath: hostsFile });
    const modifiedHostContents = addBlockedSites(hostContents)
    await invoke('write_file_contents', { filePath: hostsFile, contents: modifiedHostContents });
    await invoke('restart_network');
  } catch (error) {
    console.error('Error reading hosts file:', error);
  }
}

export const stopFocus = async () => {
  console.log("Stopping focus time")
  try {
    const hostContents: string = await invoke('read_file_contents', { filePath: hostsFile });
    const modifiedHostContents = removeBlockedSites(hostContents)
    await invoke('write_file_contents', { filePath: hostsFile, contents: modifiedHostContents });
    await invoke('restart_network');
  } catch (error) {
    console.error('Error reading hosts file:', error);
  }
}

export const isFocusEnabled = async () => {
  console.log("Checking focus time")
  try {
    return areSitesBlocked();
  } catch (error) {
    console.error('Error reading hosts file:', error);
    return false;
  }
}
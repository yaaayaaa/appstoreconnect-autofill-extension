// Inject content.js into ASC pages (including iframes)

chrome.webNavigation.onCompleted.addListener(
  (details) => {
    chrome.storage.local.get(["appleId", "password", "enabled"], (data) => {
      if (data.enabled === false || !data.appleId || !data.password) return;

      chrome.scripting.executeScript({
        target: { tabId: details.tabId, allFrames: true },
        files: ["content.js"],
      }).catch(() => {});
    });
  },
  { url: [{ hostContains: "appstoreconnect.apple.com" }] }
);

chrome.webNavigation.onDOMContentLoaded.addListener(
  (details) => {
    if (details.frameId === 0) return;

    chrome.storage.local.get(["appleId", "password", "enabled"], (data) => {
      if (data.enabled === false || !data.appleId || !data.password) return;

      chrome.scripting.executeScript({
        target: { tabId: details.tabId, frameIds: [details.frameId] },
        files: ["content.js"],
      }).catch(() => {});
    });
  },
  { url: [{ hostContains: "idmsa.apple.com" }] }
);

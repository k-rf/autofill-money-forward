chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {
  console.warn("Failed to set chrome panel behavior");
});

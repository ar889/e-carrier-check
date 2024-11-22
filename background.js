chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked, executing content script...");
  
  // Check if the content script is being injected correctly
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: processPageData,
  }, () => {
    if (chrome.runtime.lastError) {
      console.log("Error executing script:", chrome.runtime.lastError);
    }
  });
});

// Function to extract page data (this runs in the context of the page)
function processPageData() {
  console.log('processPageData is executing...');

  // Extract tags
  const tags = Array.from(document.querySelectorAll(".section-tags .tag"))
    .map(tag => tag.textContent.trim())
    .join(", ");
  console.log('Extracted tags:', tags);
  
  // Extract paragraph content
  const paragraph = Array.from(document.querySelectorAll(".inner-content p"))
    .map(p => p.textContent.trim())
    .join("\n");
  console.log('Extracted paragraph:', paragraph);

  // Send extracted content to background script via message
  chrome.runtime.sendMessage({ tags, paragraph }, (response) => {
    console.log('Response from background script:', response);
  });
}

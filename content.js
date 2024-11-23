console.log("Content script is running...");

const tags = Array.from(document.querySelectorAll(".section-tags .tag"))
  .map(tag => tag.textContent.trim())
  .join(", ");
console.log('Extracted tags:', tags);

const paragraph = Array.from(document.querySelectorAll(".inner-content p"))
  .map(p => p.textContent.trim())
  .join("\n");
console.log('Extracted paragraph:', paragraph);

// Send data to the background script
chrome.runtime.sendMessage({ tags, paragraph }, (response) => {
  if (chrome.runtime.lastError) {
    console.error("Runtime error:", chrome.runtime.lastError.message);
    return;
  }

  if (response) {
    if (response.processedData) {
      console.log("Processed data from ChatGPT:", response.processedData);
    } else if (response.error) {
      console.error("Error from ChatGPT processing:", response.error);
    }
  } else {
    console.error("No response received from ChatGPT processing.");
  }
});

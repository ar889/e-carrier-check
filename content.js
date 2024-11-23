console.log("Content script is running...");

// Extract the tags and paragraph from the page
const tags = Array.from(document.querySelectorAll(".section-tags .tag"))
  .map(tag => tag.textContent.trim())
  .join(", ");
console.log('Extracted tags:', tags);

const paragraph = Array.from(document.querySelectorAll(".inner-content p"))
  .map(p => p.textContent.trim())
  .join("\n");
console.log('Extracted paragraph:', paragraph);

// Send extracted data to the background script
chrome.runtime.sendMessage({ tags, paragraph }, (response) => {
  if (chrome.runtime.lastError) {
    console.error("Runtime error:", chrome.runtime.lastError.message);
    return;
  }

  if (response) {
    if (response.processedData) {
      console.log("Processed data from Gemini:", response.processedData);
      // Display the processed data in an alert
      alert("Processed Data from Gemini: " + response.processedData);
    } else if (response.error) {
      console.error("Error from Gemini processing:", response.error);
    }
  } else {
    console.error("No response received from Gemini processing.");
  }
});

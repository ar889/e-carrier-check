chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in background script:", message);

  const payload = {
    representatives: message.representatives || "No representatives provided",  // Ensure there's a fallback value
    tags: message.tags || "No tags provided",  // Ensure there's a fallback value
    paragraph: message.paragraph || "No paragraph provided", // Ensure paragraph exists
  };

  console.log("Forwarding data to backend:", payload);

  // Send the data to your Node.js API
  fetch("http://localhost:5000/process-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Backend API returned status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response from backend API:", data);
      sendResponse({ processedData: data.result });
    })
    .catch((error) => {
      console.error("Error communicating with backend:", error);
      sendResponse({ error: "Failed to process data via backend." });
    });

  return true; // Keep the message port open for async response
});

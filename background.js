async function sendToPythonAPI(data) {
  console.log("Sending data to Python API:", data);

  try {
    const response = await fetch("http://localhost:5000/process-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Python API Response:", result);

    return result.processedData || "Unexpected response structure.";
  } catch (error) {
    console.error("Error in Python API communication:", error);
    throw new Error("Failed to connect to Python API.");
  }
}



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Listener triggered. Message received:", message);

  if (message.tags && message.paragraph) {
    console.log("Extracted data is valid. Sending to API...");
    
    sendToPythonAPI({ tags: message.tags, paragraph: message.paragraph })
      .then((processedData) => {
        console.log("Data processed successfully:", processedData);
        try {
          sendResponse({ processedData });
          console.log("Response sent successfully.");
        } catch (err) {
          console.error("Error while sending response:", err);
        }
      })
      .catch((error) => {
        console.error("Error while processing data:", error);
        try {
          sendResponse({ error: "Failed to process data." });
          console.log("Error response sent.");
        } catch (err) {
          console.error("Error while sending error response:", err);
        }
      });

    return true; // Critical to keep the port open
  }

  console.log("Invalid message structure. No response sent.");
});

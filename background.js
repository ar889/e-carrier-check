async function callGemini(data) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";
  const apiKey = "Replace with your actual API key"; // Replace with your actual API key

  const payload = {
    contents: [{
      parts: [{
        text: `Process the following data and just give me truck type name:\n${data}`
      }]
    }]
  };

  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Gemini API Error (${response.status}):`, errorData);
      throw new Error(`Error: ${errorData.error.message}`);
    }

    // Log the full response as a stringified object to inspect the structure
    const responseData = await response.json();
    console.log("Full Gemini API Response (Stringified):", JSON.stringify(responseData, null, 2));

    // Check if the response contains the expected structure and extract text
    if (responseData.candidates && responseData.candidates[0]?.content?.parts[0]?.text) {
      const generatedText = responseData.candidates[0].content.parts[0].text;
      console.log("Processed Text:", generatedText);
      return generatedText;
    } else {
      console.error("Unexpected response structure:", JSON.stringify(responseData, null, 2));
      return "Failed to process data.";
    }

  } catch (error) {
    console.error("Error during Gemini API call:", error);
    return "Failed to process data.";
  }
}


// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.tags && message.paragraph) {
    console.log("Received extracted data:", message);

    const extractedData = `Tags: ${message.tags}\nParagraph: ${message.paragraph}`;

    callGemini(extractedData)
      .then((processedData) => {
        console.log("Processed data from Gemini:", processedData);
        sendResponse({ processedData });
      })
      .catch((error) => {
        console.error("Error processing data with Gemini:", error);
        sendResponse({ error: "Failed to process data." });
      });

    return true; // Keeps the message port open for the asynchronous response
  }
});

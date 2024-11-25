console.log("Hi AbdulRehman 😍😎. Content script is running...");

// Check if the current URL matches the target site pattern
if (window.location.hostname === "lookup.ecarriercheck.com" && window.location.pathname.startsWith("/dir/carrier/")) {
  console.log("Target page detected.");

  // Select all the `.txt-card` elements
  const txtCards = document.querySelectorAll(".card-container .txt-card");

  // Find the one that starts with "Representative(s):"
  const representativeCard = Array.from(txtCards).find(card =>
    card.querySelector(".txt-f1.r1")?.textContent.trim() === "Representative(s):"
  );

  // Extract the representatives' names if the card exists
  let representatives = [];
  if (representativeCard) {
    representatives = Array.from(representativeCard.querySelectorAll(".txt-f1"))
      .slice(1) // Skip the first element as it contains the label
      .map(div => div.textContent.trim()); // Extract text and trim
  }

  console.log("Representatives:", representatives);

  // Extract tags from the page
  const tags = Array.from(document.querySelectorAll(".section-tags .tag"))
    .map(tag => tag.textContent.trim())
    .join(", ");
  console.log("Extracted tags:", tags);

  const paragraphsimple = Array.from(document.querySelectorAll(".inner-content p"))
  .filter(p => p.getAttribute("style") === "text-align: justify;") // Filter for style attribute
  .map(p => p.textContent.trim()) // Extract and trim text content
  .join("\n");

// Split paragraph into sentences based on full stops (.)
const sentences = paragraphsimple.split('.').map(sentence => sentence.trim()).filter(Boolean);

// Remove the last sentence
let paragraph = sentences.slice(0, sentences.length - 1).join('. ') + '.'; // Join sentences back with a dot

console.log("Modified Paragraph:", paragraph);


  // Check if we have meaningful data to send
  if (tags || paragraph) {
    // Send the extracted data to the background script
    chrome.runtime.sendMessage({ tags, paragraph, representatives }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Runtime error:", chrome.runtime.lastError.message);
        return;
      }

      console.log("Response from background script:", response);

      if (response?.processedData) {
        console.log("Processed data:", response.processedData);
      } else if (response?.error) {
        console.error("Error processing data:", response.error);
      } else {
        console.error("No response received.");
      }
    });
  } else {
    console.log("No relevant data found to send.");
  }
} else {
  console.log("This is not the target site or page.");
}

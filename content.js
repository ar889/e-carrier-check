console.log("Content script is running...");

const tags = Array.from(document.querySelectorAll(".section-tags .tag"))
  .map(tag => tag.textContent.trim())
  .join(", ");
console.log('Extracted tags:', tags);

const paragraph = Array.from(document.querySelectorAll(".inner-content p"))
  .map(p => p.textContent.trim())
  .join("\n");
console.log('Extracted paragraph:', paragraph);

document.getElementById("copyBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          // Extract the tags
          const tags = Array.from(document.querySelectorAll(".section-tags .tag"))
            .map(tag => tag.textContent.trim())
            .join(", ");
  
          // Extract the paragraph content
          const paragraph = Array.from(document.querySelectorAll(".inner-content p"))
            .map(p => p.textContent.trim())
            .join("\n");
  
          // Combine the content
          const contentToCopy = `Tags:\n${tags}\n\nParagraph:\n${paragraph}`;
  
          // Fallback approach to copy content using document.execCommand
          const textarea = document.createElement("textarea");
          document.body.appendChild(textarea);
          textarea.value = contentToCopy;
          textarea.select();
          try {
            document.execCommand('copy');
            alert("Content copied to clipboard!");
          } catch (err) {
            console.error("Failed to copy content:", err);
          }
          document.body.removeChild(textarea);
        }
      });
    });
  });
  
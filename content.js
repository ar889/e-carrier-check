(() => {
    try {
      // Ensure the document is focused
      if (!document.hasFocus()) {
        window.focus(); // Attempt to bring the window into focus
      }
  
      // Extract tags
      const tags = Array.from(document.querySelectorAll(".section-tags .tag"))
        .map(tag => tag.textContent.trim())
        .join(", ");
  
      // Extract paragraph content
      const paragraph = Array.from(document.querySelectorAll(".inner-content p"))
        .map(p => p.textContent.trim())
        .join("\n");
  
      // Combine the content
      const contentToCopy = `Tags:\n${tags}\n\nParagraph:\n${paragraph}`;
  
      // Copy to clipboard
      navigator.clipboard.writeText(contentToCopy).then(() => {
        alert("Content copied to clipboard!");
      }).catch(err => {
        console.error("Failed to copy content: ", err);
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  })();
  
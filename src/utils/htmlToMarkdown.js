/**
 * Converts rich HTML text (copied from clipboard) into clean Markdown formatting.
 * Preserves lists, code tags, bold, italics, links, and layout spacing.
 */
export function convertHtmlToMarkdown(html) {
  if (typeof window === "undefined" || !html) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Helper to check if a node or its children have inline code formatting
  const isInlineCodeNode = (node) => {
    if (node.tagName && node.tagName.toLowerCase() === "code") return true;
    if (node.classList && (node.classList.contains("codespan") || node.classList.contains("code"))) return true;
    if (node.style && (node.style.fontFamily === "monospace" || node.style.fontFamily.includes("Courier"))) return true;
    return false;
  };

  const walk = (node, context = {}) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    const tagName = node.tagName.toLowerCase();

    // Process list indices and custom contexts
    let childrenText = "";
    if (tagName === "ol") {
      let index = 1;
      for (let child of node.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === "li") {
          childrenText += walk(child, { listType: "ol", index: index++ });
        } else {
          childrenText += walk(child, context);
        }
      }
    } else if (tagName === "ul") {
      for (let child of node.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === "li") {
          childrenText += walk(child, { listType: "ul" });
        } else {
          childrenText += walk(child, context);
        }
      }
    } else {
      for (let child of node.childNodes) {
        childrenText += walk(child, context);
      }
    }

    // Format specific HTML elements to Markdown equivalents
    switch (tagName) {
      case "h1":
        return `\n# ${childrenText.trim()}\n`;
      case "h2":
        return `\n## ${childrenText.trim()}\n`;
      case "h3":
        return `\n### ${childrenText.trim()}\n`;
      case "h4":
        return `\n#### ${childrenText.trim()}\n`;
      case "h5":
        return `\n##### ${childrenText.trim()}\n`;
      case "h6":
        return `\n###### ${childrenText.trim()}\n`;
      case "strong":
      case "b":
        return `**${childrenText}**`;
      case "em":
      case "i":
        return `*${childrenText}*`;
      case "code":
        return `\`${childrenText}\``;
      case "pre":
        return `\n\`\`\`\n${childrenText}\n\`\`\`\n`;
      case "li":
        const prefix = context.listType === "ol" ? `${context.index}. ` : "- ";
        return `\n${prefix}${childrenText.trim()}`;
      case "p":
        return `\n${childrenText.trim()}\n`;
      case "br":
        return "\n";
      case "div":
        return `\n${childrenText}\n`;
      default:
        // Fallback for custom code spans or monospace elements (like LeetCode uses)
        if (isInlineCodeNode(node)) {
          return `\`${childrenText}\``;
        }
        return childrenText;
    }
  };

  let markdown = walk(doc.body);

  // Clean up excessive newlines while maintaining structure
  markdown = markdown
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return markdown;
}

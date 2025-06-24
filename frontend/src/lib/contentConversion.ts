import TurndownService from 'turndown';

// Initialize turndown service for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

// Custom rules for better conversion
turndownService.addRule('strikethrough', {
  filter: ['s', 'strike', 'del'],
  replacement: function (content) {
    return '~~' + content + '~~';
  }
});

// Convert HTML to Markdown
export function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === '') return '';
  
  try {
    return turndownService.turndown(html);
  } catch (error) {
    console.error('Error converting HTML to Markdown:', error);
    return html; // Return original HTML if conversion fails
  }
}

// Simple markdown to HTML conversion for client-side use
export function markdownToHtmlContent(markdown: string): string {
  if (!markdown || markdown.trim() === '') return '';
  
  try {
    // Basic markdown to HTML conversion
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n\n/gim, '</p><p>')
      // Lists
      .replace(/^\s*\n\*/gm, '<ul>\n*')
      .replace(/^(\*.+)\s*\n([^\*])/gm, '$1\n</ul>\n\n$2')
      .replace(/^\*(.+)/gm, '<li>$1</li>')
      // Wrap in paragraphs
      .replace(/^(.+)$/gm, '<p>$1</p>')
      // Clean up extra paragraph tags around headers
      .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/gim, '$1')
      .replace(/<p>(<ul>)/gim, '$1')
      .replace(/(<\/ul>)<\/p>/gim, '$1');

    return html;
  } catch (error) {
    console.error('Error converting Markdown to HTML:', error);
    return markdown; // Return original markdown if conversion fails
  }
}

// Detect if content is HTML or Markdown
export function isHtmlContent(content: string): boolean {
  if (!content) return false;
  
  // Simple detection: check for HTML tags
  const htmlTagRegex = /<[^>]+>/;
  return htmlTagRegex.test(content);
}

// Smart content conversion for editor initialization
export function prepareContentForEditor(content: string): string {
  if (!content) return '';
  
  // If it's markdown, convert to HTML for the WYSIWYG editor
  if (!isHtmlContent(content)) {
    return markdownToHtmlContent(content);
  }
  
  // If it's already HTML, return as-is
  return content;
}

// Prepare content for storage (convert to markdown)
export function prepareContentForStorage(htmlContent: string): string {
  if (!htmlContent) return '';
  
  // Convert HTML to Markdown for storage
  return htmlToMarkdown(htmlContent);
}
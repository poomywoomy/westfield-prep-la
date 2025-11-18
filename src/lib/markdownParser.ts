import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// Custom renderer for code blocks and tables
const renderer = new marked.Renderer();

// Custom code block renderer with syntax highlighting
renderer.code = (code, language) => {
  const validLanguage = hljs.getLanguage(language || '') ? language : 'plaintext';
  const highlighted = hljs.highlight(code, { language: validLanguage || 'plaintext' }).value;
  return `<pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`;
};

// Custom table renderer to ensure proper structure
renderer.table = (header, body) => {
  return `<table>
    <thead>${header}</thead>
    <tbody>${body}</tbody>
  </table>`;
};

// Custom table cell renderer
renderer.tablecell = (content, flags) => {
  const type = flags.header ? 'th' : 'td';
  const align = flags.align ? ` style="text-align:${flags.align}"` : '';
  return `<${type}${align}>${content}</${type}>`;
};

// Custom link renderer to ensure proper HTML anchor tags
renderer.link = function(href: string, title: string | null, text: string) {
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr}>${text}</a>`;
};

// Configure marked with GitHub Flavored Markdown
marked.setOptions({
  gfm: true,           // GitHub Flavored Markdown
  breaks: true,        // Convert \n to <br>
  renderer: renderer,
});

export const parseMarkdown = (markdown: string): string => {
  if (!markdown) return '';
  
  try {
    // Convert markdown to HTML
    const html = marked.parse(markdown) as string;
    return html;
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return markdown; // Fallback to raw markdown
  }
};

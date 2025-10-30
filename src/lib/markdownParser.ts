import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

// Custom renderer for code blocks with syntax highlighting
const renderer = new marked.Renderer();
renderer.code = (code, language) => {
  const validLanguage = hljs.getLanguage(language || '') ? language : 'plaintext';
  const highlighted = hljs.highlight(code, { language: validLanguage || 'plaintext' }).value;
  return `<pre><code class="hljs language-${validLanguage}">${highlighted}</code></pre>`;
};

// Configure marked with GitHub Flavored Markdown
marked.setOptions({
  gfm: true,           // GitHub Flavored Markdown
  breaks: true,        // Convert \n to <br>
  mangle: false,       // Don't escape autolinked email addresses
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

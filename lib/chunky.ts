import nlp from 'compromise';

interface ContentNode {
    tag: string;
    text: string;
    position: {
        x: number;
        y: number;
    };
}

const IRRELEVANT_TAGS = ['nav', 'footer', 'header', 'aside', 'form', 'iframe', 'script', 'style'];
const IRRELEVANT_CLASSES = ['menu', 'nav', 'footer', 'header', 'aside', 'form', 'ad', 'sidebar', 'comment'];

export const processText = () => (tempDoc => {
  //// Define keywords for links to remove
  //const keywords = ["read", "view", "see", "learn"];
  //// Define patterns to identify useless links
  //const uselessPatterns = [/onetrust/i, /hubspot/i, /w3/i, /widget/i];
  //
  //// Remove unwanted elements
  //Array.from(tempDoc.querySelectorAll('iframe, script, noscript, style')).forEach(el => el.remove());
  //
  //// Process links
  //Array.from(tempDoc.querySelectorAll('a')).forEach(link => {
  //  const href = link.getAttribute('href') || '';
  //
  //  // Check if the link should be removed based on keywords
  //  if (keywords.some(keyword => href.includes(keyword))) {
  //    link.remove();
  //    return;
  //  }
  //
  //  try {
  //    // Check if the link points to the current domain
  //    const currentDomain = window.location.hostname;
  //    const linkDomain = new URL(href, window.location.origin).hostname;
  //
  //    if (linkDomain === currentDomain) {
  //      link.remove();
  //      return;
  //    }
  //
  //    // Check if the link is obviously useless
  //    if (uselessPatterns.some(pattern => pattern.test(href))) {
  //      link.remove();
  //      return;
  //    }
  //  } catch (e) {
  //    // If URL construction fails, assume it's invalid and remove the link
  //    link.remove();
  //  }
  //});
  //
  // Get and clean the text content
  return tempDoc.textContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n');
})(document.body.cloneNode(true));

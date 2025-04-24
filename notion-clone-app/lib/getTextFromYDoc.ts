import * as Y from 'yjs';

export function getTextContentFromYDoc(doc: Y.Doc): string {
  const yXml = doc.get('document-store');

  if (yXml instanceof Y.XmlFragment) {
    const xmlString = yXml.toJSON(); // This is a string, not an array

    // Extract all text between <paragraph> tags
    const matches = xmlString.match(/<paragraph[^>]*>(.*?)<\/paragraph>/g);
    if (!matches) return '';

    return matches
      .map((tag) => {
        const inner = tag.match(/<paragraph[^>]*>(.*?)<\/paragraph>/);
        return inner?.[1] || '';
      })
      .filter((text) => text.trim().length > 0)
      .join(' ');
  }

  return '';
}

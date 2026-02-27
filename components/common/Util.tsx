/**
 * Hjelpefunksjon for å rense input (fjerner ulovlige tegn og trimmer whitespace).
 * Tilsvarer logikken brukt i validator.tsx for å være kompatibel med foerstesidegenerator.
 */
const inputFilter = (input: string | undefined): string => {
  if (!input) return '';

  /**
   * Bruker RegExp-konstruktøren for å unngå problemer med eldre ES-targets
   * når man bruker Unicode property escapes.
   */
  try {
    const invalidCharactersRegex = new RegExp('[^\\p{L}\\p{N}\\p{Zs}\\n\\t\\-./;()":,–_!\'?&+’%#•@»«§]', 'gu');
    return input.replace(invalidCharactersRegex, '').trim();
  } catch (e) {
    // Fallback dersom miljøet ikke støtter Unicode property escapes i det hele tatt
    return input.trim();
  }
};

export default inputFilter;

/**
 * Serialize a JSON-LD object for safe embedding inside a <script> tag.
 *
 * `JSON.stringify` alone is unsafe here: it does not escape `<`, `>` or `/`,
 * so attacker-controlled API content (e.g. a startup name containing
 * `</script><script>...`) could break out of the script element (stored XSS).
 * Embedding the raw string as JSX text children is XSS-safe but corrupts the
 * JSON (React turns `&`/`<`/`>` into HTML entities), so Google rejects it.
 *
 * Escaping these code points to their `\uXXXX` form keeps the JSON valid for
 * crawlers while making script-element breakout impossible. U+2028/U+2029 are
 * also escaped: they are valid JSON but break some JS string parsers.
 *
 * The pattern is built from ASCII escape sequences so the source file stays
 * free of invisible control characters.
 */
const UNSAFE_JSON_LD = new RegExp('[<>&\\u2028\\u2029]', 'g');

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(
    UNSAFE_JSON_LD,
    (char) => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'),
  );
}

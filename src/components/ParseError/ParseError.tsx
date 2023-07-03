export default function ParseError(text: string) {
  return text
    .replaceAll(/[{}()"]/g, " ")
    .replaceAll(/,/g, "\n")
    .replaceAll(":", "")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll(".", "");
}

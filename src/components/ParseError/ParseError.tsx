export default function ParseError(text: string) {
  return text
    .replaceAll(/[{}()"]/g, " ")
    .replaceAll(/,/g, "\n")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll(".", "");
}

export function ParseLoginError(text: string) {
  return text
    .replaceAll(/[{}()"]/g, " ")
    .replaceAll(/,/g, "\n")
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll(".", "")
    .replaceAll("non_field_errors", "");
}

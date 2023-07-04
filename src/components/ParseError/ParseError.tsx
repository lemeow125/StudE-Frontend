export default function ParseError(text: string) {
  if (text) {
    return text
      .replaceAll(/[{}()"]/g, " ")
      .replaceAll(/,/g, "\n")
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replaceAll(".", "");
  }
  return "";
}

export function ParseLoginError(text: string) {
  if (text) {
    return text
      .replaceAll(/[{}()"]/g, " ")
      .replaceAll(/,/g, "\n")
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replaceAll(".", "")
      .replaceAll("non_field_errors", "");
  }
  return "";
}

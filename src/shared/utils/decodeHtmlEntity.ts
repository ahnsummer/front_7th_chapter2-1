export function decodeHtmlEntity(html: string) {
  const temp = document.createElement("textarea");
  temp.innerHTML = html;
  return temp.value;
}

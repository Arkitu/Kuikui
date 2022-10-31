export function addToHtmlHead(html: string, head: string): string {
  return html.replace(/<head>/, `<head>${head}`);
}
export function addToHtmlHead(html, head) {
    return html.replace(/<head>/, `<head>${head}`);
}

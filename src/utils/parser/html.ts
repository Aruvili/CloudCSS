export type Attr = { raw: string, key: string, value: string|string[], start: number, end: number };
export type ClassName = { result: string, start: number, end: number };



export default class HTMLParser {
  html?: string;
  constructor(html?: string) {
    this.html = html;
  }

  parseAttrs(): Attr[] {
    if (!this.html) return [];
    this.html = this.html.replace(/\r\n/g, '\n');


    const output: Attr[] = [];
    const regex = /\S+\s*=\s*(?:"[^"]+"|'[^']+'|[^>\s]+)/igm;
    let match;
    while ((match = regex.exec(this.html as string))) {
      if (match) {
        const raw = match[0];
        const sep = raw.indexOf('=');
        const key = raw.slice(0, sep).trim();
        let value: string| string[] = raw.slice(sep + 1).trim();
        if (['"', '\''].includes(value.charAt(0))) value = value.slice(1, -1);
        value = value.split(/\s/).filter(i => i);
        value = value[0] === undefined ? '' : value[1] === undefined ? value[0] : value;
        output.push({
          raw,
          key,
          value,
          start: match.index,
          end: regex.lastIndex,
        });
      }
    }
    return output;
  }

  parseClasses(): ClassName[] {
    if (!this.html) return [];
    this.html = this.html.replace(/\r\n/g, '\n');



    const output: ClassName[] = [];
    const regex = /class(?:Name)?\s*=\s*(?:{`[^`]+`}|"[^"]+"|'[^']+'|[^>\s]+)/igm;
    let match;
    while ((match = regex.exec(this.html as string))) {
      if (match) {
        const raw = match[0];
        const sep = raw.indexOf('=');
        let value: string| string[] = raw.slice(sep + 1).trim();
        let start = match.index + raw.indexOf(value);
        let end = regex.lastIndex;
        let first = value.charAt(0);
        while (['"', '\'', '`', '{'].includes(first)) {
          value = value.slice(1, -1);
          first = value.charAt(0);
          end--;
          start++;
        }
        output.push({
          result: value,
          start,
          end,
        });
      }
    }
    return output;
  }

  parseTags(): string[] {
    if (!this.html) return [];



    return Array.from(new Set(this.html.match(/<\w+/g))).map((i) =>
      i.substring(1)
    );
  }
}

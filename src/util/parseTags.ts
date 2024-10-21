import { ParsedTag, ParseResult } from "@/types";
  
  export function parseTags(input: string): ParseResult {
    const tagRegex = /<(\w+)(?: ([^>]+))?>([^<]*)<\/\1>/g;
    const paramRegex = /(\w+)=["']?([^"']+)["']?/g;
    const tags: ParsedTag[] = [];
  
    // Parse tags
    let match;
    while ((match = tagRegex.exec(input)) !== null) {
      const [, name, paramsString, content] = match;
      const params: Record<string, string> = {};
  
      if (paramsString) {
        let paramMatch;
        while ((paramMatch = paramRegex.exec(paramsString)) !== null) {
          const [, key, value] = paramMatch;
          params[key] = value;
        }
      }
  
      tags.push({ name, params, content });
    }
  
    // Remove tags and empty lines from the original string
    const cleanedString = input
      .replace(tagRegex, '')  // Remove all tags
      .split('\n')  // Split into lines
      .filter(line => line.trim() !== '')  // Remove empty or whitespace-only lines
      .join('\n');  // Join back into a single string
  
    return { tags, cleanedString };
  }
  
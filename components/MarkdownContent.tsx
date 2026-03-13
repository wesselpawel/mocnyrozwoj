"use client";

interface MarkdownContentProps {
  content: string;
}

const separatorPattern = new RegExp("^\\|[\\-:\\s\\|]+\\|$");
const boldPattern = new RegExp("\\*\\*([^*]+)\\*\\*", "g");

function isSeparatorLine(line: string): boolean {
  return separatorPattern.test(line);
}

function parseInlineMarkdown(text: string): string {
  return text.replace(boldPattern, '<strong class="font-semibold text-zinc-800">$1</strong>');
}

function parseMarkdownTables(text: string): string {
  const lines = text.split("\n");
  let html = "";
  let inTable = false;
  let isHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("|") && line.endsWith("|")) {
      const nextLine = lines[i + 1]?.trim() || "";

      if (isSeparatorLine(line)) {
        continue;
      }

      if (!inTable) {
        html += '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-zinc-200 text-sm">';
        inTable = true;
        isHeader = true;
      }

      const cells = line
        .slice(1, -1)
        .split("|")
        .map((cell) => cell.trim());

      if (isHeader && isSeparatorLine(nextLine)) {
        html += '<thead class="bg-zinc-100"><tr>';
        cells.forEach((cell) => {
          html += `<th class="border border-zinc-200 px-4 py-2 text-left font-semibold text-zinc-800">${parseInlineMarkdown(cell)}</th>`;
        });
        html += "</tr></thead><tbody>";
        isHeader = false;
      } else if (!isHeader) {
        html += '<tr class="even:bg-zinc-50">';
        cells.forEach((cell) => {
          html += `<td class="border border-zinc-200 px-4 py-2 text-zinc-700">${parseInlineMarkdown(cell)}</td>`;
        });
        html += "</tr>";
      }
    } else {
      if (inTable) {
        html += "</tbody></table></div>";
        inTable = false;
        isHeader = true;
      }

      const parsedLine = parseInlineMarkdown(line);

      if (line.startsWith("**") && line.endsWith("**")) {
        html += `<p class="my-3 font-semibold text-zinc-800">${line.slice(2, -2)}</p>`;
      } else if (line.startsWith("💡")) {
        html += `<p class="my-3 text-zinc-700 bg-amber-50 p-3 rounded-lg border border-amber-200">${parsedLine}</p>`;
      } else if (line) {
        html += `<p class="my-2 text-zinc-700 leading-relaxed">${parsedLine}</p>`;
      }
    }
  }

  if (inTable) {
    html += "</tbody></table></div>";
  }

  return html;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const html = parseMarkdownTables(content);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

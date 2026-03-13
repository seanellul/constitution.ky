const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, 'articles');
const OUT = path.join(__dirname, 'public', 'llms-full.txt');

const partMap = [
  { number: 1, title: "Bill of Rights, Freedoms and Responsibilities", folder: "chapter_1", sections: [1, 28] },
  { number: 2, title: "The Governor", folder: "chapter_2", sections: [29, 42] },
  { number: 3, title: "The Executive", folder: "chapter_3", sections: [43, 58] },
  { number: 4, title: "The Legislature", folder: "chapter_4", sections: [59, 93] },
  { number: 5, title: "The Judicature", folder: "chapter_5", sections: [94, 107] },
  { number: 6, title: "The Public Service", folder: "chapter_6", sections: [108, 110] },
  { number: 7, title: "Finance", folder: "chapter_7", sections: [111, 115] },
  { number: 8, title: "Institutions Supporting Democracy", folder: "chapter_8", sections: [116, 122] },
  { number: 9, title: "Miscellaneous", folder: "chapter_9", sections: [123, 125] },
];

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

function readArticle(folder, artNum) {
  const filePath = path.join(BASE, folder, `article_${artNum}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Missing: ${filePath}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function formatArticle(art) {
  let lines = [];
  lines.push(`### Section ${art.number} - ${art.title}`);
  lines.push('');
  if (art.content && art.content.length > 0) {
    for (const p of art.content) {
      lines.push(typeof p === 'string' ? p : p.text);
      lines.push('');
    }
  }
  return lines.join('\n');
}

let output = [];
output.push('# Constitution of the Cayman Islands - Full Text');
output.push('');
output.push('> Source: constitution.ky');
output.push('> This is the complete text of the Cayman Islands Constitution Order 2009 for LLM consumption.');
output.push('> For official legal reference: https://www.legislation.gov.uk/uksi/2009/1379/schedule/2/made');
output.push('');

for (const part of partMap) {
  const roman = romanNumerals[part.number - 1];
  output.push('---');
  output.push('');
  output.push(`## Part ${roman} - ${part.title}`);
  output.push('');

  for (let secNum = part.sections[0]; secNum <= part.sections[1]; secNum++) {
    const art = readArticle(part.folder, secNum);
    if (art) {
      output.push(formatArticle(art));
    } else {
      output.push(`### Section ${secNum}`);
      output.push('');
      output.push('[Text not available]');
      output.push('');
    }
  }
}

output.push('---');
output.push('');
output.push('End of the Constitution of the Cayman Islands.');

fs.writeFileSync(OUT, output.join('\n'), 'utf8');
console.log(`Written to ${OUT}`);
console.log(`Total lines: ${output.length}`);

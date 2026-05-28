import fs from 'fs';
import path from 'path';

const filesToProcess = [
  'AdminDashboard.jsx',
  'InterviewerDashboard.jsx',
  'Explorer.jsx',
  'Resume.jsx'
];

const basePath = path.join('d:', 'Projects', 'Career Connect', 'src', 'pages');

const replacements = [
  { regex: /\btext-white\b/g, replacement: 'text-slate-900 dark:text-white' },
  { regex: /\btext-slate-400\b/g, replacement: 'text-slate-600 dark:text-slate-400' },
  { regex: /\btext-slate-300\b/g, replacement: 'text-slate-700 dark:text-slate-300' },
  { regex: /\btext-slate-200\b/g, replacement: 'text-slate-800 dark:text-slate-200' },
  { regex: /\btext-slate-500\b/g, replacement: 'text-slate-500 dark:text-slate-500' },
  { regex: /\bbg-black\/20\b/g, replacement: 'bg-white dark:bg-black/20' },
  { regex: /\bbg-black\/30\b/g, replacement: 'bg-slate-50 dark:bg-black/30' },
  { regex: /\bbg-black\/40\b/g, replacement: 'bg-slate-100 dark:bg-black/40' },
  { regex: /\bborder-white\/5\b/g, replacement: 'border-slate-200 dark:border-white/5' },
  { regex: /\bborder-white\/10\b/g, replacement: 'border-slate-300 dark:border-white/10' },
  { regex: /\bborder-white\/20\b/g, replacement: 'border-slate-400 dark:border-white/20' },
  { regex: /\bbg-white\/5\b/g, replacement: 'bg-slate-50 dark:bg-white/5' },
  { regex: /\bbg-white\/10\b/g, replacement: 'bg-slate-100 dark:bg-white/10' },
  { regex: /\bhover:bg-white\/5\b/g, replacement: 'hover:bg-slate-100 dark:hover:bg-white/5' },
  { regex: /\bhover:bg-white\/10\b/g, replacement: 'hover:bg-slate-200 dark:hover:bg-white/10' },
  { regex: /\bhover:border-white\/10\b/g, replacement: 'hover:border-slate-400 dark:hover:border-white/10' },
  { regex: /\bbg-yellow-500\/5\b/g, replacement: 'bg-yellow-50 dark:bg-yellow-500/5' },
];

filesToProcess.forEach(fileName => {
  const filePath = path.join(basePath, fileName);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Quick heuristic to avoid double replacing if script run multiple times
    if (content.includes('dark:text-white')) {
      console.log(`Skipping ${fileName} as it seems already processed`);
      return;
    }

    replacements.forEach(r => {
      content = content.replace(r.regex, r.replacement);
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${fileName}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

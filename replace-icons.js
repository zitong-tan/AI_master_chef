const fs = require('fs');
const path = require('path');

const iconMap = {
  '🥬': '◆',
  '🍽️': '◈',
  '👨‍🍳': '◉',
  '🥩': '◉',
  '🍗': '◉',
  '🐟': '◊',
  '🦐': '◊',
  '🥚': '◇',
  '🥛': '◇',
  '🍎': '◐',
  '🍚': '◈',
  '🍜': '◈',
  '🍞': '◈',
  '🧀': '◇',
  '🧈': '◇',
  '🫒': '◑',
  '🧂': '◑',
  '🍬': '◐',
  '🌾': '◈',
  '🥔': '◆',
  '🍄': '◆',
  '🫘': '◆',
  '🎲': '⚄',
  '🔮': '◉',
  '🥄': '◈',
  '👥': '◎',
  '❤️': '♥',
  '🖼️': '◫',
  '🏠': '⌂',
  '📖': '◐',
  '⚙️': '⚙',
  '🔍': '◎',
  '🥢': '◈',
  '🍱': '◇',
  '🌶️': '◊',
  '🍝': '◈',
  '🥐': '◇',
  '🍛': '◆',
  '🌍': '◎',
  '✨': '✦',
  '⭐': '★',
  '🔥': '◈',
  '🏆': '◈',
  '🏅': '◉',
  '💡': '◉',
  '📊': '◫',
  '📋': '◐',
  '⏱️': '◌',
  '🌡️': '◑',
  '😊': '◡',
  '😍': '♥',
  '🤔': '◔',
  '😮': '◉',
  '😕': '◑',
  '😅': '◔',
  '😓': '◑',
  '🤷‍♂️': '◔',
  '🤷': '◔',
  '🎯': '◎',
  '💭': '◔',
  '⚡': '✦',
  '🎨': '◈',
  '🎪': '◎',
  '🎭': '◇',
  '🎬': '◫',
  '🎮': '◉',
  '🎰': '⚄',
  '🃏': '◇',
  '🎴': '◈',
  '🀄': '◉',
  '👤': '◉',
  '🔑': '◉',
  '🚪': '⊗',
  '⚖️': '◈',
  '💪': '◉',
  '🏃‍♀️': '◉',
  '🍲': '◈',
  '🥗': '◆',
  '🍴': '◈',
  '📝': '◐',
  '🥣': '◈',
  '🍳': '◈',
  '🔪': '◈',
};

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!filePath.includes('node_modules') && !filePath.includes('.git')) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else if (filePath.match(/\.(vue|ts|js)$/)) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

function replaceIconsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [oldIcon, newIcon] of Object.entries(iconMap)) {
    if (content.includes(oldIcon)) {
      content = content.replace(new RegExp(oldIcon, 'g'), newIcon);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
    return true;
  }
  return false;
}

// 主执行
const srcPath = path.join(__dirname, 'src');
const files = getAllFiles(srcPath);
let updatedCount = 0;

console.log(`Found ${files.length} files to process...\n`);

files.forEach(file => {
  if (replaceIconsInFile(file)) {
    updatedCount++;
  }
});

console.log(`\n✨ Icon replacement completed!`);
console.log(`📊 Updated ${updatedCount} files out of ${files.length} total files.`);

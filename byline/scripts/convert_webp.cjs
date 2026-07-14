const fs = require('fs');
const { execSync } = require('child_process');

const files = fs.readdirSync('public').filter(f => f.endsWith('.png') && f !== 'og-image.png');
for (const file of files) {
  const inPath = `public/${file}`;
  const outPath = `public/${file.replace('.png', '.webp')}`;
  console.log(`Converting ${inPath} to ${outPath}`);
  try {
    execSync(`npx -y sharp-cli@2.1.1 -i ${inPath} -o ${outPath}`);
    console.log(`Successfully converted ${file}`);
  } catch (e) {
    console.error(`Failed to convert ${file}:`, e.message);
  }
}

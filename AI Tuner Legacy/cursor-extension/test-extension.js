// Test script to verify AI Tuner extension functionality
console.log('AI Tuner Extension Test');
console.log('=====================');

// Test 1: Check if extension files exist
const fs = require('fs');
const path = require('path');

console.log('\n1. Checking extension files...');
const files = [
  'package.json',
  'src/extension.ts',
  'src/aiTunerProvider.ts',
  'out/extension.js',
  'out/aiTunerProvider.js'
];

files.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Test 2: Check package.json content
console.log('\n2. Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`   ✅ Extension name: ${packageJson.name}`);
  console.log(`   ✅ Version: ${packageJson.version}`);
  console.log(`   ✅ Commands: ${Object.keys(packageJson.contributes.commands).length}`);
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
}

// Test 3: Check compiled output
console.log('\n3. Checking compiled output...');
try {
  const extensionJs = fs.readFileSync('out/extension.js', 'utf8');
  const hasActivate = extensionJs.includes('activate');
  const hasCommands = extensionJs.includes('registerCommand');
  console.log(`   ${hasActivate ? '✅' : '❌'} Contains activate function`);
  console.log(`   ${hasCommands ? '✅' : '❌'} Contains command registration`);
} catch (error) {
  console.log(`   ❌ Error reading compiled output: ${error.message}`);
}

console.log('\n4. Extension Test Complete!');
console.log('\nTo test the extension:');
console.log('1. Install the .vsix file in Cursor');
console.log('2. Open a workspace folder');
console.log('3. Open AI Tuner panel');
console.log('4. Change settings and click "Apply to Cursor"');
console.log('5. Check if .cursorrules file is created in workspace root');

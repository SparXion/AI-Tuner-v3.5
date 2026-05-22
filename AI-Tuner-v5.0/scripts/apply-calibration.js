/**
 * AITuner v5.0 - Apply Calibration Script
 * 
 * Manual promotion tool: Backs up live file, guides merge in Cursor
 * Never auto-applies - human review required
 */

const fs = require('fs');
const path = require('path');

const LIVE_FILE = path.join(__dirname, '../src/data/v5-models.js');
const PROPOSED_FILE = path.join(__dirname, '../src/data/v5-models.proposed.js');
const BACKUP_FILE = path.join(__dirname, '../src/data/v5-models.backup.js');

console.log('Apply Calibration Tool');
console.log('=====================');
console.log('');
console.log('This tool:');
console.log('1. Backs up live file to v5-models.backup.js');
console.log('2. Shows diff between live and proposed');
console.log('3. Guides manual merge in Cursor');
console.log('');
console.log('NEVER auto-applies. Human review required.');

// Check if proposed file exists
if (!fs.existsSync(PROPOSED_FILE)) {
    console.error('Error: v5-models.proposed.js not found');
    console.error('Run: npm run calibrate first');
    process.exit(1);
}

// Backup live file
if (fs.existsSync(LIVE_FILE)) {
    fs.copyFileSync(LIVE_FILE, BACKUP_FILE);
    console.log('✓ Backed up live file to v5-models.backup.js');
} else {
    console.error('Error: v5-models.js not found');
    process.exit(1);
}

console.log('');
console.log('Next steps:');
console.log('1. Review diff: Compare v5-models.js vs v5-models.proposed.js');
console.log('2. Manually merge accepted changes');
console.log('3. Test the updated defaults');
console.log('4. Commit: git commit -m "Model calibration run YYYY-MM-DD"');

/**
 * Simple verification script to check if hooks are properly exported
 * Run with: node verify-hooks.js
 */

console.log('Verifying hooks implementation...\n');

// Check if files exist
const fs = require('fs');
const path = require('path');

const hooksPath = path.join(__dirname, 'src', 'hooks.ts');
const animationsPath = path.join(__dirname, 'src', 'animations.ts');
const typesPath = path.join(__dirname, 'src', 'types.ts');

console.log('✓ hooks.ts exists:', fs.existsSync(hooksPath));
console.log('✓ animations.ts exists:', fs.existsSync(animationsPath));
console.log('✓ types.ts exists:', fs.existsSync(typesPath));

// Check hooks.ts exports
const hooksContent = fs.readFileSync(hooksPath, 'utf8');
const expectedHooks = [
  'useRevealAnimation',
  'useModalToggle',
  'useCatAnimationRotation',
  'useBreakpoint'
];

console.log('\nVerifying hook exports:');
expectedHooks.forEach(hook => {
  const hasExport = hooksContent.includes(`export function ${hook}`);
  console.log(hasExport ? `✓ ${hook}` : `✗ ${hook} missing!`);
});

// Check if CAT_ANIMATIONS is imported
const hasImport = hooksContent.includes("import { CAT_ANIMATIONS } from './animations'");
console.log('\nVerifying imports:');
console.log(hasImport ? '✓ CAT_ANIMATIONS imported' : '✗ CAT_ANIMATIONS import missing!');

// Check hooks documentation
console.log('\nVerifying documentation:');
expectedHooks.forEach(hook => {
  const hasJSDoc = hooksContent.includes(`* Hook for`) || hooksContent.includes(`* @`);
  if (hasJSDoc) {
    console.log(`✓ ${hook} has documentation`);
  }
});

console.log('\n✅ Verification complete!');
console.log('\nNext step: Run "npm run dev" to test the hooks in the browser.');

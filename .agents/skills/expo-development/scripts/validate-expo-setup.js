#!/usr/bin/env node

/**
 * Validates Expo project setup, configuration, routing, and conventions.
 */

const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

function logSuccess(msg) {
  console.log(`\x1b[32m✔\x1b[0m ${msg}`);
}

function logWarning(msg) {
  console.log(`\x1b[33m▲\x1b[0m ${msg}`);
}

function logError(msg) {
  console.log(`\x1b[31m✖\x1b[0m ${msg}`);
}

let hasErrors = false;

console.log('=== Validating Expo & React Native Project Setup ===\n');

// 1. Check package.json
const packageJsonPath = path.join(rootDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const expoVersion = pkg.dependencies?.expo;
  if (expoVersion) {
    logSuccess(`Expo installed: ${expoVersion}`);
  } else {
    logError('Expo is not listed in dependencies in package.json');
    hasErrors = true;
  }

  if (pkg.dependencies?.['expo-router']) {
    logSuccess(`Expo Router installed: ${pkg.dependencies['expo-router']}`);
  } else {
    logWarning('expo-router is not found in dependencies.');
  }
} else {
  logError('package.json not found in root directory.');
  hasErrors = true;
}

// 2. Check app.json
const appJsonPath = path.join(rootDir, 'app.json');
if (fs.existsSync(appJsonPath)) {
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const expoConfig = appJson.expo || {};

  if (expoConfig.name && expoConfig.slug) {
    logSuccess(`App name: "${expoConfig.name}", slug: "${expoConfig.slug}"`);
  } else {
    logError('app.json is missing "name" or "slug".');
    hasErrors = true;
  }

  if (expoConfig.scheme) {
    logSuccess(`Deep linking scheme configured: "${expoConfig.scheme}"`);
  } else {
    logWarning('No "scheme" configured in app.json for deep linking.');
  }

  if (expoConfig.ios?.bundleIdentifier) {
    logSuccess(`iOS bundleIdentifier: "${expoConfig.ios.bundleIdentifier}"`);
  } else {
    logWarning('iOS bundleIdentifier missing in app.json (required for iOS builds).');
  }

  if (expoConfig.android?.package) {
    logSuccess(`Android package: "${expoConfig.android.package}"`);
  } else {
    logWarning('Android package name missing in app.json (required for Android builds).');
  }
} else {
  logError('app.json not found.');
  hasErrors = true;
}

// 3. Check App Directory & Layouts
const appDir = path.join(rootDir, 'src', 'app');
if (fs.existsSync(appDir)) {
  logSuccess('src/app/ routing directory found.');

  if (fs.existsSync(path.join(appDir, '_layout.tsx'))) {
    logSuccess('Root layout src/app/_layout.tsx exists.');
  } else {
    logError('Root layout src/app/_layout.tsx is missing.');
    hasErrors = true;
  }

  if (fs.existsSync(path.join(appDir, '+not-found.tsx'))) {
    logSuccess('404 route src/app/+not-found.tsx exists.');
  } else {
    logWarning('+not-found.tsx is recommended for handling unmatched routes.');
  }

  // Check for route collision
  if (fs.existsSync(path.join(appDir, 'index.tsx')) && fs.existsSync(path.join(appDir, '(tabs)', 'index.tsx'))) {
    logError('Route collision detected: both src/app/index.tsx and src/app/(tabs)/index.tsx exist.');
    hasErrors = true;
  }
} else {
  logError('src/app/ directory not found.');
  hasErrors = true;
}

console.log('\n====================================================');
if (hasErrors) {
  console.log('\x1b[31mSetup validation failed with errors.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32mSetup validation passed successfully!\x1b[0m\n');
  process.exit(0);
}


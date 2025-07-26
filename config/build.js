import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Compile TypeScript to JavaScript
execSync('npx tsc', { stdio: 'inherit' });

// Path setup
const __filename = new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1').replace(/\//g, path.sep);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');
const coreOutDir = path.join(distDir, 'core');

// Copy src/php to dist/php
const phpSrcDir = path.resolve(__dirname, '../src/php');
const phpDestDir = path.join(distDir, 'php');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

if (fs.existsSync(phpSrcDir)) {
    copyDir(phpSrcDir, phpDestDir);
}

// Flatten dist/core into dist, skipping .ts files, then remove dist/core
function copyDirFlatten(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirFlatten(srcPath, destPath);
        } else {
            if (!srcPath.endsWith('.ts')) {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}

if (fs.existsSync(coreOutDir)) {
    const entries = fs.readdirSync(coreOutDir, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(coreOutDir, entry.name);
        const destPath = path.join(distDir, entry.name);
        if (entry.isDirectory()) {
            copyDirFlatten(srcPath, destPath);
        } else {
            if (!srcPath.endsWith('.ts')) {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
    // Remove the core folder after copying
    fs.rmSync(coreOutDir, { recursive: true, force: true });
}

// Copy index.php to dist/index.php (after __dirname and distDir are defined)
const indexPhpSrc = path.resolve(__dirname, '../index.php');
const indexPhpDest = path.join(distDir, 'index.php');
if (fs.existsSync(indexPhpSrc)) {
    fs.copyFileSync(indexPhpSrc, indexPhpDest);
}

const pageHtmlSrc = path.resolve(__dirname, '../page.html');
const pageHtmlDest = path.join(distDir, 'page.html');
if (fs.existsSync(pageHtmlSrc)) {
    fs.copyFileSync(pageHtmlSrc, pageHtmlDest);
}
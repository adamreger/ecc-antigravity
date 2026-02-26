#!/usr/bin/env node
/**
 * Validate that Antigravity workflows have required frontmatter
 */

const fs = require('fs');
const path = require('path');

const WORKFLOWS_DIR = path.join(__dirname, '../../workflows');
const REQUIRED_FIELDS = ['description'];

function extractFrontmatter(content) {
    // Strip BOM if present (UTF-8 BOM: \uFEFF)
    const cleanContent = content.replace(/^\uFEFF/, '');
    // Support both LF and CRLF line endings
    const match = cleanContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;

    const frontmatter = {};
    const lines = match[1].split(/\r?\n/);
    for (const line of lines) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0) {
            const key = line.slice(0, colonIdx).trim();
            const value = line.slice(colonIdx + 1).trim();
            frontmatter[key] = value;
        }
    }

    // If we didn't extract any valid key-value pairs, treat it as missing
    if (Object.keys(frontmatter).length === 0) {
        return null;
    }

    return frontmatter;
}

function validateWorkflows() {
    if (!fs.existsSync(WORKFLOWS_DIR)) {
        console.log('No workflows directory found, skipping validation');
        process.exit(0);
    }

    const files = fs.readdirSync(WORKFLOWS_DIR).filter(f => f.endsWith('.md'));
    let hasErrors = false;

    for (const file of files) {
        const filePath = path.join(WORKFLOWS_DIR, file);
        let content;
        try {
            content = fs.readFileSync(filePath, 'utf-8');
        } catch (err) {
            console.error(`ERROR: ${file} - ${err.message}`);
            hasErrors = true;
            continue;
        }
        const frontmatter = extractFrontmatter(content);

        if (!frontmatter) {
            console.error(`ERROR: ${file} - Missing frontmatter`);
            hasErrors = true;
            continue;
        }

        for (const field of REQUIRED_FIELDS) {
            if (!frontmatter[field] || (typeof frontmatter[field] === 'string' && !frontmatter[field].trim())) {
                console.error(`ERROR: ${file} - Missing required field: ${field}`);
                hasErrors = true;
            }
        }
    }

    if (hasErrors) {
        process.exit(1);
    }

    console.log(`Validated ${files.length} workflow files`);
}

validateWorkflows();

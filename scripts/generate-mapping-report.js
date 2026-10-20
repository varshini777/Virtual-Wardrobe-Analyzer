import fs from 'node:fs';
import path from 'node:path';

const manifest = JSON.parse(fs.readFileSync('D:\\Wardrobe_Asset_Refresh_Output\\asset-manifest.json', 'utf8'));
const { CURATED_WARDROBE } = await import('file://' + path.resolve('server/src/data/curatedWardrobe.js').replace(/\\/g, '/'));

const curatedMap = new Map();
CURATED_WARDROBE.forEach(item => curatedMap.set(item.id, item));

let md = '# Virtual Wardrobe Analyzer — 160-Garment Asset Integration Mapping Report\n\n';
md += '| Item ID | Concept ID | Name | Category | Prior Image Path | Replacement Image Path | Format | Status | Visual Verification |\n';
md += '| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n';

let successCount = 0;
let formatPng = 0;
let formatJpg = 0;

for (const m of manifest) {
  const curated = curatedMap.get(m.item_id);
  const currentUrl = curated ? curated.image_url : 'NOT_FOUND';
  const expectedUrl = '/clothing-assets/' + m.replacement_filename;
  const isMatch = (currentUrl === expectedUrl);

  const clientPath = path.resolve('client/public/clothing-assets', m.replacement_filename);
  const serverPath = path.resolve('server/public/clothing-assets', m.replacement_filename);
  const filesExist = fs.existsSync(clientPath) && fs.existsSync(serverPath);

  const status = (isMatch && filesExist) ? 'SUCCESS' : 'FAILED';
  if (status === 'SUCCESS') successCount++;

  if (m.replacement_format.toLowerCase() === 'png') formatPng++;
  else if (m.replacement_format.toLowerCase() === 'jpg') formatJpg++;

  const visualNote = (m.item_id === 'bot-017')
    ? 'Replaced mismatched jeans photo with sky-blue striped poplin pyjama pant'
    : (m.source_type === 'existing_project_ai_photo' ? 'Retained studio photograph' : 'High-resolution generated product photo');

  md += `| ${m.item_id} | ${m.concept_id} | ${m.product_name} | ${m.category} | ${m.original_image_url} | ${expectedUrl} | ${m.replacement_format.toUpperCase()} | ${status} | ${visualNote} |\n`;
}

md += `\n\n## Summary\n- Total Mappings: ${manifest.length}\n- Successful Integrations: ${successCount}\n- PNG Assets: ${formatPng}\n- JPG Assets: ${formatJpg}\n- Failures: ${manifest.length - successCount}\n`;

fs.writeFileSync('docs/ASSET_INTEGRATION_MAPPING_REPORT.md', md, 'utf8');
console.log('Mapping report generated. Total:', manifest.length, 'Success:', successCount);

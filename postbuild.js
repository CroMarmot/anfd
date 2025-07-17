const fs = require('fs-extra');
const path = require('path');
const productsDist = path.resolve('dist', 'products', 'browser');
const targetPath = path.resolve('dist', 'shell', 'browser', 'assets', 'remote', 'products');
fs.ensureDirSync(targetPath);
fs.moveSync(productsDist, targetPath, { overwrite: true });
console.log(`Moved ${productsDist} to ${targetPath}`);

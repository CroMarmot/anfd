// postbuild.js
const fs = require('fs-extra');
const path = require('path');

// 定义路径
const productsDist = path.resolve('dist', 'products', 'browser');
const targetPath = path.resolve('dist', 'shell', 'browser', 'assets', 'remote', 'products');

// 确保目标路径存在
fs.ensureDirSync(targetPath);

// 移动文件夹内容
fs.moveSync(productsDist, targetPath, { overwrite: true });

console.log(`Moved ${productsDist} to ${targetPath}`);

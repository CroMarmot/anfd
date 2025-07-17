# angular native federation Demo

```bash
ng version # 使用的 20 版本
ng new anfd-workspace --create-application=false
cd anfd-workspace
ng g application shell --routing --style=scss --prefix app-shell
ng g application products --routing --style=scss --prefix app-products
npm i -D @angular-architects/native-federation
ng g @angular-architects/native-federation:init --project shell --port 4200 --type dynamic-host
ng g c home --project shell
ng g @angular-architects/native-federation:init --project products --port 4201 --type remote
sed -i 's/:4200/:4201/g' projects/shell/public/federation.manifest.json
# 修改 projects/shell/src/app/app.routes.ts 见下
ng serve shell
ng serve products
```

`projects/shell/src/app/app.routes.ts`

```ts
import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  {
    path: 'products',
    loadComponent: () =>
        loadRemoteModule('products', './Component').then((m) => m.App), // 需要注意, 新的ng g c生成的Component是不带Component的，这里App和Home都是，老版本的对应是AppComponent和HomeComponent
  },
  {
      path: '**',
      component: Home,
  }
];
```

## generate static

修改所有`app.config.ts`使用hash路由: `provideRouter(routes, withHashLocation())`

```bash
npm i -D ncp express
```

配置dev: `projects\shell\env\dev\federation.manifest.json` (因为这个是assets形式访问的，不能用envrionment fileReplacements那套(可以修改main.ts))

```json
{ "products": "http://localhost:4201/remoteEntry.json" }
```

配置production的远端地址`projects\shell\env\prod\federation.manifest.json`

```json
{ "products": "/anfd/assets/remote/products/remoteEntry.json" }
```

`angular.json`增加
- v18新版的会有browser文件夹https://github.com/angular/angular-cli/issues/26304

```json
{
  "projects": {
    "shell": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/shell"
          }
        },
        "esbuild": {
          "configurations": {
            "production": {
              "assets": [
                {
                  "glob": "**/*",
                  "input": "projects/shell/env/prod"
                }
              ]
            },
            "development": {
              "assets": [
                {
                  "glob": "**/*",
                  "input": "projects/shell/env/dev"
                }
              ]
            }
          }
        }
      }
    },
    "products": {
      "architect": {
        "build": {
          "options": {
            "outputPath": "dist/products"
          }
        }
      }
    }
  }
}
```

`local-preview.js`

```js
const express = require('express')
const app = express()
const port = 3000
const path = require('path');
app.use('/anfd', express.static(path.join(__dirname, 'dist/shell/broswer'))); // ng v18 会多一个browser文件夹
app.get('/', (req, res) => { res.send('Hello World!') })
app.listen(port, () => { console.log(`http://localhost:${port}/anfd/`) })
```

`package.json`增加

```json
{
  "scripts": {
    "build:shell": "ng build shell --base-href /anfd/",
    "build:products": "ng build products --base-href /anfd/assets/remote/products/",
    "postbuild": "node postbuild.js",
    "build:all": "npm run build:shell && npm run build:products && npm run postbuild",
    "serve:dist": "node local-preview.js",
    "gh-pages": "cd dist/shell/browser && rm -rf ./.git && git init && git add . && git remote add origin git@github.com:CroMarmot/anfd.git && git commit -m \"Deploy to GitHub Pages\" && git push --force origin HEAD:gh-pages && cd ../../.."
  }
}
```

gh-pages 默認是jekyll, 需要static配置，直接網頁上有引导设置成static.yml的action即可

```bash
npm run build:all # 生成静态文件
npm run serve:dist
npm run gh-pages
```

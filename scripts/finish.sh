#! /bin/sh

mkdir -p dist/web/

mv esm/index.node.d.ts esm/node.d.ts
rm web/isometric.d.ts
cp web/isometric.js dist/web/isometric.js
mv index.node.d.ts node.d.ts
echo '{\n    "type": "module"\n}' > esm/package.json
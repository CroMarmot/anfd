const express = require('express')
const app = express()
const port = 3000
const path = require('path');
app.use('/anfd', express.static(path.join(__dirname, 'dist/shell/browser')));
app.get('/', (req, res) => { res.send('Hello World!') })
app.listen(port, () => { console.log(`http://localhost:${port}/anfd/`) })

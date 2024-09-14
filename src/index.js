"use strict";

const fs = require('fs');
const path = require('path');

const ChromeExtension = require('crx');

const crx = new ChromeExtension({
  codebase: 'http://localhost:8000/ytwl-manager.crx',
  privateKey: fs.readFileSync('./ytwl-manager.pem')
});

crx.load(path.resolve(__dirname, '../dist') )
  .then(crx => crx.pack())
  .then(crxBuffer => {
    const updateXML = crx.generateUpdateXML()
    fs.writeFileSync('./update.xml', updateXML);
    fs.writeFileSync('./ytwl-manager.crx', crxBuffer);
  })
  .catch(err=>{
    console.error( err );
  });
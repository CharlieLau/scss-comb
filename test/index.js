const fs = require('fs')
const path = require('path')
const combine = require('../')


const baseDir = path.resolve(__dirname, './theme-chalk/src')
const content = fs.readFileSync(baseDir + '/index.scss', 'utf8')
const final = combine(content, baseDir)

fs.writeFileSync('./test/test.scss', Buffer.from(final))
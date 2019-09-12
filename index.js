const fs = require('fs');
const path = require('path');
const regex = /@import[^'"]+?['"](.+?)['"];?/g;


function scssCombine(content, baseDir, resolvefiles = {}) {
    if (regex.test(content)) {
        content = content.replace(regex, function (m, capture) {
            let resolvepath = resolveScssPath(capture, baseDir)
            let str = fs.readFileSync(path.resolve(baseDir, resolvepath), 'utf8')
            let absolute = path.resolve(baseDir, resolvepath);
            if (resolvefiles[absolute]) {
                return '';
            }
            resolvefiles[absolute] = true;
            let dirname = path.dirname(path.resolve(baseDir, resolvepath));
            return scssCombine(str, dirname, resolveScssPath);
        })
    }
    return content
}

function resolveScssPath(relative, baseDir) {
    let result;
    let isExist;
    let scssPath = path.resolve(baseDir, relative);
    let basename
    if (scssPath.endsWith('.scss')) {
        isExist = fs.existsSync(scssPath);
        basename = path.basename(scssPath, '.scss');
        if (isExist) {
            result = relative;
        }
    } else {
        isExist = fs.existsSync(scssPath + '.scss')
        basename = path.basename(scssPath + '.scss', '.scss');
        if (isExist) {
            result = relative + '.scss';
        }
    }
    if (!isExist) {
        let underline = scssPath.slice(0, scssPath.lastIndexOf(basename)) + `_${basename}.scss`;
        isExist = fs.existsSync(path.resolve(baseDir, underline))
        if (isExist) {
            result = underline
        } else {
            let noneExt;
            if (scssPath.endsWith('.scss')) {
                noneExt = scssPath.slice(0, scssPath.lastIndexOf('.scss'));
            } else {
                noneExt = scssPath
            }
            isExist = fs.existsSync(noneExt + '/index.scss')
            if (isExist) {
                result = noneExt + '/index.scss'
            } else {
                console.log(relative, '没有辙了~~')
                return relative;
            }
        }
    }
    return result;
}

module.exports = scssCombine
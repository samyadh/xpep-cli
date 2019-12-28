#!/usr/bin/env node

const fse = require('fs-extra');
var program = require('commander');

const handlePath = (name) => {
    let tempName = name.split('/');
    tempName = tempName.length === 1 ? name.split('\\') : tempName;
    let filename = tempName.length === 1 ? name : tempName[tempName.length - 1];
    let path = tempName.splice(0, tempName.length - 1).toString().replace(/,/g, '/') + '/';
    let component = filename[0].toUpperCase() + filename.slice(1);
    return { filename, path, component };
}

program
    .arguments('<name>')
    .requiredOption('-l, --language <r:react||a:angular||n:none>', 'it\'s an react helper')
    .requiredOption('-g, --genrate <c:component||m:module||s:service||fo:folder||f:file>', 'to genrate a entity, c for component, m for module')
    .option('-t, --type <type>', 'Type of file required')
    .action(function (name) {
        let { filename, path, component } = handlePath(name);
        if (program.language === 'n') {
            if (program.genrate === 'f') {
                const extention = program.type ? program.type : 'js';

                fse.outputFile(`./${path}${filename}.${extention}`, `// ${filename}.${extention} file contents!`, err => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`${filename}.${extention} created!`);
                    }
                });
            }

            if (program.genrate === 'fo') {
                const extention = program.type ? program.type : 'js';
                fse.mkdirs(`./${path}${filename}`, err => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`${filename} folder created!`);
                    }
                });
            }
        }

        if (program.language === 'r') {
            if (program.genrate === 'c') {
                const extention = program.type ? program.type : 'jsx';

                const tsFileContent = `import * as React from 'react';
import './${filename}.scss';
export const ${component} = () => <div>${component} works!</div>`;

                const cssFileContent = `/* ${filename} scss */`;
                const testFileContent = `import React from 'react';
import { render } from '@testing-library/react';
import { ${component} } from './${filename}';

test('renders ${filename}', () => {
  const { getByText } = render(<${component}/>);
  const divElement = getByText(/${component} works!/i);
  expect(divElement).toBeInTheDocument();
});`

                fse.outputFile(`./${path}${filename}/${filename}.${extention}`, tsFileContent, err => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`${filename}.${extention} created!`);
                    }
                });

                fse.outputFile(`./${path}${filename}/${filename}.scss`, cssFileContent, err => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`${filename}.css created!`);
                    }
                });

                fse.outputFile(`./${path}${filename}/${filename}.test.${extention}`, testFileContent, err => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`${filename}.test.${extention} created!`);
                    }
                });
            }
        }
    })
    .parse(process.argv);

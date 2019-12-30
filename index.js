#!/usr/bin/env node
const content = require('./contents');
const execSync = require('child_process').execSync;
const fse = require('fs-extra');
const util = require('util');
var program = require('commander');

let filename, path, component;

const handlePath = (name) => {
	let tempName = name.split('/');
	tempName = tempName.length === 1 ? name.split('\\') : tempName;
	filename = tempName.length === 1 ? name : tempName[tempName.length - 1];
	path = tempName.splice(0, tempName.length - 1).toString().replace(/,/g, '/') + '/';
	component = filename[0].toUpperCase() + filename.slice(1);
};

program.command('gpull').action(function() {
	gitPull();
});

program.command('gpush').action(function() {
	gitPush();
});

program.command('gs').action(function() {
	gitSync();
});

program.command('gf').action(function() {
	gitFetch();
});

program.command('ngc').arguments('<name>').action(function(name) {
	handlePath(name);
	genrateAngularComponent();
});

program.command('rgc').arguments('<name>').option('-t, --type <type>', 'Type of file required').action(function(name) {
	handlePath(name);
	genrateReactComponent();
});

program.command('cf').arguments('<name>').option('-t, --type <type>', 'Type of file required').action(function(name) {
	handlePath(name);
	createFile();
});

program.command('cfo').arguments('<name>').action(function(name) {
	handlePath(name);
	createFolder();
});

program.parse(process.argv);

function genrateAngularComponent() {
	const output = execSync('ng g c ' + path + filename, { encoding: 'utf-8' }); // the default is 'buffer'
	console.log(output);
}

function genrateReactComponent() {
	const extention = program.type ? program.type : 'jsx';

	fse.outputFile(
		`./${path}${filename}/${filename}.${extention}`,
		util.format(content.rtsxFileContent, filename, component, component),
		(err) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`${filename}.${extention} created!`);
			}
		}
	);

	fse.outputFile(`./${path}${filename}/${filename}.scss`, util.format(content.rcssFileContent, filename), (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`${filename}.css created!`);
		}
	});

	fse.outputFile(
		`./${path}${filename}/${filename}.test.${extention}`,
		util.format(content.rtestFileContent, component, filename, filename, component, component),
		(err) => {
			if (err) {
				console.log(err);
			} else {
				console.log(`${filename}.test.${extention} created!`);
			}
		}
	);
}

function createFile() {
	const extention = program.type ? program.type : 'js';

	fse.outputFile(`./${path}${filename}.${extention}`, `// ${filename}.${extention} file contents!`, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`${filename}.${extention} created!`);
		}
	});
}

function createFolder() {
	fse.mkdirs(`./${path}${filename}`, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`${filename} folder created!`);
		}
	});
}

function gitPull() {
	const output = execSync('git pull', { encoding: 'utf-8' }); // the default is 'buffer'
	console.log(output);
}

function gitFetch() {
	const output = execSync('git fetch', { encoding: 'utf-8' }); // the default is 'buffer'
	console.log(output);
}

function gitPush() {
	const output = execSync('git push', { encoding: 'utf-8' }); // the default is 'buffer'
	console.log(output);
}

function gitSync() {
	const output1 = execSync('git fetch && git pull', { encoding: 'utf-8' }); // the default is 'buffer'
	console.log(output1);
	const output2 = execSync('git push', { encoding: 'utf-8' }); // the default is 'buffer'
	console.log(output2);
}

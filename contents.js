const rtsxFileContent = `import * as React from 'react';
import './%s.scss';
export const %s = () => <div>%s works!</div>`;

const rcssFileContent = `/* %s scss */`;
const rtestFileContent = `import React from 'react';
import { render } from '@testing-library/react';
import { %s } from './%s';
	
test('renders %s', () => {
	const { getByText } = render(<%s/>);
	const divElement = getByText(/%s works!/i);
	expect(divElement).toBeInTheDocument();
});`;

module.exports = { rtsxFileContent, rcssFileContent, rtestFileContent };

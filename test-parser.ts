const ClassParser = require('./src/utils/parser/class').default;

const testCases = [
    'hover:bg-red-500',
    'sm:(bg-blue-500 text-white)',
    '![text-red-500]',
    'focus:(ring ring-red-500)',
    'w-1/2',
    '-mt-2'
];

let nativeParser;
try {
    nativeParser = require('@windicss/parser').parseClasses;
    console.log('Native parser loaded successfully.');
} catch (e) {
    console.error('Failed to load native parser:', e.message);
}

for (const css of testCases) {
    console.log(`\nTesting: "${css}"`);
    
    // Test JS parser
    const jsParser = new ClassParser(css, ':', ['hover', 'sm', 'focus', 'active']);
    // Mock the JS parse method, we need to hack it back just to get original run for comparison
    const jsOutput = (() => {
        jsParser.classNames = '(' + css + ')';
        const elements = jsParser._handle_group(true);
        jsParser.classNames = jsParser.classNames.slice(1, -1);
        return elements;
    })();

    console.log('JS Output:');
    console.log(JSON.stringify(jsOutput, null, 2));

    if (nativeParser) {
        console.log('Native Output:');
        const nativeOutput = nativeParser(css, ':', ['hover', 'sm', 'focus', 'active']);
        console.log(JSON.stringify(nativeOutput, null, 2));
    }
}

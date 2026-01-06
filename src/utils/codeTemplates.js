// Utility to generate starter code templates based on function signature

const typeMappings = {
    python: {
        'int': 'int',
        'int[]': 'List[int]',
        'string': 'str',
        'string[]': 'List[str]',
        'boolean': 'bool',
        'boolean[]': 'List[bool]',
        'double': 'float',
        'double[]': 'List[float]',
        'char': 'str',
        'char[]': 'List[str]'
    },
    javascript: {
        'int': 'number',
        'int[]': 'number[]',
        'string': 'string',
        'string[]': 'string[]',
        'boolean': 'boolean',
        'boolean[]': 'boolean[]',
        'double': 'number',
        'double[]': 'number[]',
        'char': 'string',
        'char[]': 'string[]'
    },
    java: {
        'int': 'int',
        'int[]': 'int[]',
        'string': 'String',
        'string[]': 'String[]',
        'boolean': 'boolean',
        'boolean[]': 'boolean[]',
        'double': 'double',
        'double[]': 'double[]',
        'char': 'char',
        'char[]': 'char[]'
    },
    cpp: {
        'int': 'int',
        'int[]': 'vector<int>',
        'string': 'string',
        'string[]': 'vector<string>',
        'boolean': 'bool',
        'boolean[]': 'vector<bool>',
        'double': 'double',
        'double[]': 'vector<double>',
        'char': 'char',
        'char[]': 'vector<char>'
    }
};

const generateParameterString = (parameters, language) => {
    if (!parameters || parameters.length === 0) return '';

    return parameters
        .filter(param => param.name && param.type)
        .map(param => {
            const mappedType = typeMappings[language][param.type] || param.type;
            // Python uses different syntax for type hints
            if (language === 'python') {
                return `${param.name}: ${mappedType}`;
            }
            return `${mappedType} ${param.name}`;
        })
        .join(', ');
};

export const generateStarterTemplates = (functionName, returnType, parameters) => {
    const paramStr = {
        python: generateParameterString(parameters, 'python'),
        javascript: generateParameterString(parameters, 'javascript'),
        java: generateParameterString(parameters, 'java'),
        cpp: generateParameterString(parameters, 'cpp')
    };

    const returnTypeMapped = {
        python: typeMappings.python[returnType] || returnType,
        javascript: typeMappings.javascript[returnType] || returnType,
        java: typeMappings.java[returnType] || returnType,
        cpp: typeMappings.cpp[returnType] || returnType
    };

    // Check if Python needs List import
    const needsListImport = parameters.some(param => param.type && param.type.includes('[]'));
    const pythonImports = needsListImport ? 'from typing import List\n\n' : '';

    return {
        python: `${pythonImports}def ${functionName}(${paramStr.python}):\n    # Your code here\n    pass`,
        javascript: `function ${functionName}(${paramStr.javascript}) {\n    // Your code here\n}`,
        java: `public static ${returnTypeMapped.java} ${functionName}(${paramStr.java}) {\n    // Your code here\n}`,
        cpp: `${returnTypeMapped.cpp} ${functionName}(${paramStr.cpp}) {\n    // Your code here\n}`
    };
};

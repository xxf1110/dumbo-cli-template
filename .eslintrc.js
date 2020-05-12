const isDev = process.env.NODE_ENV === 'development' 

module.exports = {
    "env": {
        "browser": true,
        "es6": true, 
        "node": true,
        "commonjs": true,
    },
    "extends": "eslint:recommended", 
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2019,
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
        "react",
        "react-hooks",
    ], 
    'globals': { 
        'React': true, 
        "Component": true,
        "global": true,
        "module": true
    },
    "rules": {
        "no-unused-vars": 1,
        "curly": 2, 
        "max-params": [2, 8],
        "new-cap": 2,
        "no-caller": 2,
        "no-const-assign": 2,
        "no-undef": 2, 
        'no-alert': 1,
        'no-await-in-loop': 2,
        'no-class-assign': 2,
        'no-confusing-arrow': 0,
        'no-console': isDev ? 0 : 1,
        'no-dupe-keys': 2,
        'no-dupe-class-members': 2,
        'no-duplicate-imports': 2,
        'no-empty-pattern': 2,
        'no-eval': 2,
        'no-extend-native': [2, { 'exceptions': ['Array', 'Object'] }],
        'no-lonely-if': 0,
        'no-mixed-spaces-and-tabs': 2,
        'no-redeclare': 2,
        'no-shadow-restricted-names': 2,
        'no-var': 2,  
        "react-hooks/rules-of-hooks": "error", 
        "react-hooks/exhaustive-deps": "warn",
    }
};
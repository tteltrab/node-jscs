/**
 * Requires space after opening object curly brace and before closing.
 *
 * Type: `String`
 *
 * Values: `"all"` for strict mode, `"allButNested"` ignores closing brackets in a row.
 *
 * #### Example
 *
 * ```js
 * "requireSpacesInsideObjectBrackets": "all"
 * ```
 *
 * ##### Valid for mode `"all"`
 *
 * ```js
 * var x = { a: { b: 1 } };
 * ```
 *
 * ##### Valid for mode `"allButNested"`
 *
 * ```js
 * var x = { a: { b: 1 }};
 * ```
 *
 * ##### Invalid
 *
 * ```js
 * var x = {a: 1};
 * ```
 */

var assert = require('assert');

module.exports = function() {};

module.exports.prototype = {

    configure: function(mode) {
        var modes = {
            'all': true,
            'allButNested': true
        };
        assert(
            typeof mode === 'string' &&
            modes[mode],
            'requireSpacesInsideObjectBrackets option requires string value \'all\' or \'allButNested\''
        );
        this._mode = mode;
    },

    getOptionName: function() {
        return 'requireSpacesInsideObjectBrackets';
    },

    check: function(file, errors) {
        var mode = this._mode;
        file.iterateNodesByType('ObjectExpression', function(node) {
            var tokens = file.getTokens();
            var openingBracketPos = file.getTokenPosByRangeStart(node.range[0]);

            var openingBracket = tokens[openingBracketPos];
            var nextToken = tokens[openingBracketPos + 1];

            if (nextToken.type === 'Punctuator' && nextToken.value === '}') {
                return;
            }

            if (openingBracket.range[1] === nextToken.range[0]) {
                errors.add('Missing space after opening curly brace', nextToken.loc.start);
            }

            var closingBracketPos = file.getTokenPosByRangeStart(node.range[1] - 1);
            var closingBracket = tokens[closingBracketPos];
            var prevToken = tokens[closingBracketPos - 1];
            var isNested = mode === 'allButNested' &&
                           prevToken.type === 'Punctuator' &&
                           prevToken.value === '}';

            if (closingBracket.range[0] === prevToken.range[1] && !isNested) {
                errors.add('Missing space before closing curly brace', closingBracket.loc.start);
            }
        });
    }

};

"use strict";

(function(namespace) {
    var statementPartSchema = {
        tokens : {
            integer                :  [/-\d+|\d+/],
            variable               :  [/[A-Za-z_]\w*/],
            equals                 :  ["is equal to", "equals to", "equals", "="],
            comma                  :  [","],
            semicolon              :  [";"],
            "if"                   :  ["if"],
            set                    :  ["set"],
            then                   :  ["then"],
            "while"                :  ["repeat while", "do while", "while", "keep going while"],
            until                  :  ["repeat until", "do until", "until", "keep going until"],
            "for"                  :  ["for each", "for every", "go through every", "go through each", 
                                       "go through", "every", "for all", "all", "each", "for"],
            "true"                 :  ["true", "yes"],
            "false"                :  ["false", "no"],
            from                   :  ["from"],
            to                     :  ["to"],
            increase               :  ["increase", "augment", "increment"],
            decrease               :  ["decrease", "decrement"],
            by                     :  ["by"],
            or                     :  ["or"],
            and                    :  ["and"],
            lessThan               :  ["is less than", "less than", "<"],
            greaterThan            :  ["is greater than", "greater than", "is more than", "exceeds", "more than", ">"],
            plus                   :  ["\\+", "plus", "add"],
            minus                  :  ["-", "minus", "subtract"],
            multiply               :  ["\\*", "multiply", "times"],
            divide                 :  ["\\/", "divided by", "divide"],
            power                  :  ["\\^", "raised to the", "to the", "power"],
            openBracket            :  ["{"],
            closeBracket           :  ["}"],
            statementSeparator     :  [/\.|;|\r\n|\r|\n/],
            fullStatementSeparator :  [/\.\s*|\r\n|\r|\n/]
        },

        expressionLogical : {
            // add boolean variable?  If so, expressionGeneral needs to be fixed because it should be processed last.
            expressionTrue         :  ["true"],
            expressionFalse        :  ["false"],
            expressionLessThan     :  ["expressionNumerical", "lessThan", "expressionNumerical"],
            expressionGreaterThan  :  ["expressionNumerical", "greaterThan", "expressionNumerical"],
            expressionEquals       :  ["expressionNumerical", "equals", "expressionNumerical"],
            expressionOr           :  ["expressionLogical", "or", "expressionLogical"],
            expressionAnd          :  ["expressionLogical", "and", "expressionLogical"],
        },

        expressionNumerical : {
            expressionInteger      :  ["integer"],
            expressionSum          :  ["expressionNumerical", "plus", "expressionNumerical"],
            expressionDifference   :  ["expressionNumerical", "minus", "expressionNumerical"],
            expressionProduct      :  ["expressionNumerical", "multiply", "expressionNumerical"],
            expressionDivide       :  ["expressionNumerical", "divide", "expressionNumerical"],
            expressionPower        :  ["expressionNumerical", "power", "expressionNumerical"],
            expressionVariable     :  ["variable"],
        },

        expressionGeneral : {
            expressionGenNumerical :  ["expressionNumerical"],
            expressionGenLogical   :  ["expressionLogical"],
        },

        statementGeneral : {
            statementBlock         :  ["openBracket", "statementGeneral", "closeBracket"],
            statementJoin          :  ["statementGeneral", "semicolon", "statementGeneral"],
            statementAssignment    :  ["set", "variable", "to", "expressionGeneral"],
            statementIncreaseVar   :  ["increase", "variable", "by", "expressionGeneral"],
            statementDecreaseVar   :  ["decrease", "variable", "by", "expressionGeneral"],
            statementForLessThan   :  ["for", "variable", "lessThan", "expressionNumerical", "comma", "statementGeneral"],
            statementForFromTo     :  ["for", "variable", "from", "expressionNumerical", "to", 
                                       "expressionNumerical", "comma", "statementGeneral"],
            statementWhile         :  ["while", "expressionLogical", "comma", "statementGeneral"],
            statementUntil         :  ["until", "expressionLogical", "comma", "statementGeneral"],
            statementIfComma       :  ["if", "expressionLogical", "comma", "statementGeneral"],
            statementIfThen        :  ["if", "expressionLogical", "then", "statementGeneral"]
        }
    };

    namespace.exports.statementPartSchema = statementPartSchema;

    var processingOrder = {
        expressionGeneral   : ["expressionGenLogical", "expressionGenNumerical"],
        expressionLogical   : ["expressionOr", "expressionAnd", "expressionLessThan", "expressionGreaterThan", 
                               "expressionEquals", "expressionTrue", "expressionFalse"],
        expressionNumerical : ["expressionSum", "expressionDifference", "expressionProduct", "expressionDivide", 
                               "expressionPower", "expressionInteger", "expressionVariable"],
        statementGeneral    : ["statementBlock", "statementJoin", "statementAssignment", "statementIncreaseVar", 
                               "statementDecreaseVar", "statementForLessThan", "statementForFromTo", "statementWhile", 
                               "statementUntil", "statementIfComma", "statementIfThen"]
    };

    var getPartsArr = function(schemaName) {
        var schemaCategory;

        for(schemaCategory in statementPartSchema) {
            if(schemaName in schemaCategory && schemaCategory !== "tokens") {
                return statementPartSchema[schemaCategory][schemaName];
            }
        }

        return []; // not found
    };

    var getFirstTokenIndex = function(partsArr) {
        var i;

        for(i = 0; i < partsArr.length; i++) {
            if(partsArr[i] in statementPartSchema.tokens) {
                return i;
            }
        }

        return -1;
    };

    var splitOnFirst = function(text, tokenName, isTokenAtStart) {
        var arr = statementPartSchema.tokens[tokenName] ? statementPartSchema.tokens[tokenName] : [];
        var i, match;

        for(i = 0; i < arr.length; i++) {
            match = RegExp(arr[i]).exec(text);
            if(match && (!isTokenAtStart || match.index == 0)) {
                return [text.substring(0, match.index), text.substring(match.index, match.index + match[0].length),
                        text.substring(match.index + match[0].length)];
            }
        }

        return null;
    };

    var parseSchemaFragment = function(text, schemaArrFragment, matchEntire) {
        var i = 0;
        var parseResultsArr = [];
        var result;
        var textRemaining = text.toLowerCase().trim();
        var tokenName;

        while(parseResultsArr !== null && i < schemaArrFragment.length) {
            if(schemaArrFragment[i] in statementPartSchema.tokens) {
                result = splitOnFirst(textRemaining, schemaArrFragment[i], true);
                result = result ? result.slice(1) : null; // token at start so result[0] == ""
            } else {
                result = parseTextFragmentByCategory(textRemaining, schemaArrFragment[i]);
            }
            if(result !== null) {
                textRemaining = result[result.length - 1].trim();
                result.pop(); // remove textRemaining
                parseResultsArr.push(result);
            } else {
                parseResultsArr = null;
            }
            i++;
        }

        if( parseResultsArr !== null && (!matchEntire || textRemaining.trim() === "") ) {
            parseResultsArr.push(textRemaining);
        } else {
            parseResultsArr = null;
        }

        return parseResultsArr;
    };

    var parseTextOnFirstToken = function(text, partsArr, matchEntire) {
        // parse text on token appearing first in partsArr on the first
        // occurrence in text that forms an instance of partsArr schema
        // returns array [args[0], args[1], ..., args[n], textRemaining]
        // or null if text can't be split on any token to match partsArr schema

        var tokenIndex = getFirstTokenIndex(partsArr);
        var tokenName = tokenIndex >= 0 ? partsArr[tokenIndex] : "NOT_FOUND";
        var textRemaining = text.trim().toLowerCase();
        var textThroughPreviousToken = "";
        var foundMatchingTokenSplit = false;
        var splitOnTokenArr;
        var parseResultsArr = null;
        var parseResultsArrBeforeToken;
        var parseResultsArrAfterToken;

        if(tokenIndex <= 0) {
            // For efficiency : don't need to check each possible match if token needs to be at start
            parseResultsArr = parseSchemaFragment(textRemaining, partsArr);
        } else {
            splitOnTokenArr = splitOnFirst(textRemaining, tokenName);

            while(!foundMatchingTokenSplit && splitOnTokenArr) {
                parseResultsArr = null;
                parseResultsArrAfterToken = undefined; // reset 
                parseResultsArrBeforeToken = parseSchemaFragment( (textThroughPreviousToken + splitOnTokenArr[0]).trim(), 
    	    	                                                   partsArr.slice(0, tokenIndex), true );
                if(parseResultsArrBeforeToken) {
                    parseResultsArrBeforeToken.pop(); // textRemaining === "" since matchEntire is true
                    parseResultsArrAfterToken = parseSchemaFragment(splitOnTokenArr[2].trim(), partsArr.slice(tokenIndex + 1), matchEntire );
                }

                if(parseResultsArrAfterToken) {
                    foundMatchingTokenSplit = true;
                    parseResultsArr = parseResultsArrBeforeToken.concat(splitOnTokenArr[1], parseResultsArrAfterToken);
                }

                textThroughPreviousToken += splitOnTokenArr[0] + splitOnTokenArr[1];
                splitOnTokenArr = splitOnFirst(splitOnTokenArr[2], tokenName);
            }
        }

        return parseResultsArr;
    };

    var parseTextFragmentByCategory = function(text, category, matchEntire) {
        // parse text using first matching schema in category
        // returns array [schema identifier, args[0], args[1], ..., args[n], textRemaining]
        // or null if no matching schema

        var i = 0;
        var result = undefined;
        var schemas = processingOrder[category];
        var schemaArr;

        while(!result && i < schemas.length) {
            schemaArr = statementPartSchema[category][schemas[i]];
            result = parseTextOnFirstToken(text, schemaArr, matchEntire);
            if(result) {
                result = [schemas[i]].concat(result); // add schema identifier to front of result array
            }
            i++;
        }

        return result;
    };

    namespace.exports.parseText = function(text) {
        text = document.getElementById("pseudocode").value; // Remove later
        var statementCount = text.split(statementPartSchema.tokens.statementSeparator).length;
        var statements = text.split(statementPartSchema.tokens.fullStatementSeparator[0]);
        var parsedStatements = [];

        statements.forEach(function(statement) {
            parsedStatements.push(parseTextFragmentByCategory(statement, "statementGeneral", true));
            console.log("Parsed Statement:" + parsedStatements[parsedStatements.length-1] + "\n");
        });

        console.log(statements.length);
        return parsedStatements;
    };
})(provide("parser"));
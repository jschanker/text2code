"use strict";

(function(namespace) {
    var memo = {};
    var statementPartSchema = {
        tokens : {
            integer                :  [/-\d+|\d+/],
            variable               :  [/[A-Za-z_]\w*/],
            word                   :  [/[^""''\n\r\u2028\u2029]*/],
            equals                 :  ["is equal to", "equals to", "equals", "equal to", "equal", "=", "to"],
            comma                  :  [","],
            semicolon              :  [";"],
            "if"                   :  ["if"],
            "else"                 :  ["otherwise", "else"],
            print                  :  ["print", "output"],
            set                    :  ["set", "let"],
            then                   :  ["then"],
            commaThen              :  [", then", ",then", ",", "then"],
            "while"                :  ["repeat while", "do while", "while", "keep going while"],
            until                  :  ["repeat until", "do until", "until", "keep going until"],
            "for"                  :  ["for each", "for every", "go through every", "go through each", 
                                       "go through", "every", "for all", "all", "each", "for"],
            "true"                 :  ["true", "yes"],
            "false"                :  ["false", "no"],
            number                 :  ["at position number", "at position #", "at position", "at number", 
                                       "number", "at #", "#", "position"],
            "substring"            :  ["substring"],
            from                   :  ["from"],
            to                     :  ["to"],
            "in"                   :  ["in"],
            increase               :  ["increase", "augment", "increment"],
            decrease               :  ["decrease", "decrement"],
            by                     :  ["by"],
            of                     :  ["of"],
            not                    :  ["is not", "not"],
            or                     :  ["or"],
            and                    :  ["and"],
            lessThan               :  ["is less than", "less than", "<"],
            lessThanOrEq           :  ["is less than or equals", "is less than or equal to", "less than or equals", 
                                       "less than or equal to", "<=", "is not greater than", "is not more than"],
            greaterThan            :  ["is greater than", "greater than", "is more than", "exceeds", "more than", ">"],
            greaterThanOrEq        :  ["is greater than or equals", "is greater than or equal to", "greater than or equals", 
                                       "greater than or equal to", ">=", "is not less than"],
            notEquals              :  ["is not equal to", "does not equal", "not equal to"],
            divisibleBy            :  ["is divisible by", "divisible by", "is a multiple of", "is multiple of"],
            factorOf               :  ["is a factor of", "is factor of"],
            plus                   :  ["\\+", "plus", "add"],
            minus                  :  ["-", "minus", "subtract"],
            multiply               :  ["\\*", "multiply", "times"],
            divide                 :  ["\\/", "divided by", "divide"],
            intDivide              :  ["\\//"],
            modulo                 :  ["modulo", "mod", "modulus"],
            squareRoot             :  ["the square root of", "square root of", "square root", "sqrt"],
            even                   :  ["is even", "even"],
            odd                    :  ["is odd", "odd"],
            negative               :  ["is negative", "negative"],
            positive               :  ["is positive", "positive"],
            prime                  :  ["is prime", "prime"],
            remainderOf            :  ["the remainder of", "remainder of"],
            power                  :  ["\\^", "raised to the", "to the", "power"],
            first                  :  ["the first", "first"],
            last                   :  ["the last", "last", "final"],
            character              :  ["the character", "character", "the letter", "letter"],
            //concatenate            :  ["joined with", "concatenated with", "concatenate", "join", "with", "plus", "\\+"],
            concatenate            :  ["concatenated with", "concatenate with", "concatenate"],//, "plus", "\\+"],
            join                   :  ["joined with", "join with", "join"],
            quotationMark          :  ['\\"', "\\'"],
            openBracket            :  ["{"],
            closeBracket           :  ["}"],
            openParenthesis        :  ["\\("],
            closeParenthesis       :  ["\\)"],
            statementSeparator     :  [/\.|;|\r\n|\r|\n/],
            fullStatementSeparator :  [/\.\s*|\r\n|\r|\n/]
        },

        expressionLogical : {
            expressionTrue         :  ["true"],
            expressionFalse        :  ["false"],
            expressionLessThan     :  ["expressionNumerical", "lessThan", "expressionNumerical"],
            expressionLessThanEq   :  ["expressionNumerical", "lessThanOrEq", "expressionNumerical"],
            expressionGreaterThan  :  ["expressionNumerical", "greaterThan", "expressionNumerical"],
            expressionGreaterThanEq:  ["expressionNumerical", "greaterThanOrEq", "expressionNumerical"],
            expressionEquals       :  ["expressionGeneral", "equals", "expressionGeneral"],
            expressionNotEquals    :  ["expressionGeneral", "notEquals", "expressionGeneral"],
            expressionDivisibleBy  :  ["expressionNumerical", "divisibleBy", "expressionNumerical"],
            expressionFactorOf     :  ["expressionNumerical", "factorOf", "expressionNumerical"],
            expressionEven         :  ["expressionNumerical", "even"],
            expressionOdd          :  ["expressionNumerical", "odd"],
            expressionPositive     :  ["expressionNumerical", "positive"],
            expressionNegative     :  ["expressionNumerical", "negative"],
            expressionPrime        :  ["expressionNumerical", "prime"],
            expressionOr           :  ["expressionLogical", "or", "expressionLogical"],
            expressionAnd          :  ["expressionLogical", "and", "expressionLogical"],
            expressionNot          :  ["not", "expressionLogical"],
            expressionLogicalBlock :  ["openParenthesis", "expressionLogical", "closeParenthesis"],
            expressionVariable     :  ["variable"]
        },

        expressionNumerical : {
            expressionInteger      :  ["integer"],
            expressionSum          :  ["expressionNumerical", "plus", "expressionNumerical"],
            expressionDifference   :  ["expressionNumerical", "minus", "expressionNumerical"],
            expressionProduct      :  ["expressionNumerical", "multiply", "expressionNumerical"],
            expressionDivide       :  ["expressionNumerical", "divide", "expressionNumerical"],
            expressionIntDivide    :  ["expressionNumerical", "intDivide", "expressionNumerical"],
            expressionPower        :  ["expressionNumerical", "power", "expressionNumerical"],
            expressionRemainderOf  :  ["remainderOf", "expressionNumerical", "divide", "expressionNumerical"],
            expressionModulo       :  ["expressionNumerical", "modulo", "expressionNumerical"],
            expressionSquareRoot   :  ["squareRoot", "expressionNumerical"],
            expressionFirstIndexOf :  ["number", "of", "first", "expressionString", "in", "expressionString"],
            expressionLastIndexOf  :  ["number", "of", "last", "expressionString", "in", "expressionString"],
            expressionVariable     :  ["variable"],
            expressionNumBlock     :  ["openParenthesis", "expressionNumerical", "closeParenthesis"]
        },

        expressionString : {
            expressionText         :  ["quotationMark", "word", "quotationMark"],
            expressionVariable     :  ["variable"],
            expressionConcatenate  :  ["expressionString", "concatenate", "expressionString"],
            expressionJoinStr      :  ["expressionString", "join", "expressionString"],
            expressionPlusStr      :  ["expressionString", "plus", "expressionString"],
            expressionStringBlock  :  ["openParenthesis", "expressionString", "closeParenthesis"],
            expressionFirstChar    :  ["first", "character", "of", "expressionString"],
            expressionLastChar     :  ["last", "character", "of", "expressionString"],
            expressionCharNumber   :  ["character", "number", "expressionNumerical", "of", "expressionString"],
            expressionSubstringPos :  ["substring", "of", "expressionString", "from", "number", "expressionNumerical", "to", 
                                       "number", "expressionNumerical"],
        },

        expressionGeneral : {
            expressionGenNumerical :  ["expressionNumerical"],
            expressionGenLogical   :  ["expressionLogical"],
            expressionGenString    :  ["expressionString"]
        },

        statementConditional : {
            statementElseIf        :  ["else", "if", "expressionLogical", "commaThen", "statementGeneral"],
            statementElseIfMore    :  ["else", "if", "expressionLogical", "commaThen", "statementGeneral", 
                                       "semicolon", "statementConditional"],
            statementElse          :  ["else", "statementGeneral"]
        },

        statementGeneral : {
            statementBlock         :  ["openBracket", "statementGeneral", "closeBracket"],
            statementJoin          :  ["statementGeneral", "semicolon", "statementGeneral"],
            statementAssignment    :  ["set", "variable", "equals", "expressionGeneral"],
            statementMultiplyVar   :  ["multiply", "variable", "by", "expressionNumerical"],
            statementDivideVar     :  ["divide", "variable", "by", "expressionNumerical"],
            statementIncreaseVar   :  ["increase", "variable", "by", "expressionNumerical"],
            statementDecreaseVar   :  ["decrease", "variable", "by", "expressionNumerical"],
            statementAddToVar      :  ["plus", "expressionNumerical", "to", "variable"],
            statementMinusFromVar  :  ["minus", "expressionNumerical", "from", "variable"],
            statementForLessThan   :  ["for", "variable", "lessThan", "expressionNumerical", "comma", "statementGeneral"],
            statementForFromTo     :  ["for", "variable", "from", "expressionNumerical", "to", 
                                       "expressionNumerical", "comma", "statementGeneral"],
            statementWhile         :  ["while", "expressionLogical", "comma", "statementGeneral"],
            statementUntil         :  ["until", "expressionLogical", "comma", "statementGeneral"],
            statementIfThen        :  ["if", "expressionLogical", "commaThen", "statementGeneral"],
            statementIfThenAlt     :  ["if", "expressionLogical", "commaThen", "statementGeneral", 
                                       "semicolon", "statementConditional"],
            statementPrint         :  ["print", "expressionGeneral"]
        }
    };

    namespace.exports.statementPartSchema = statementPartSchema;

    var processingOrder = {
        expressionGeneral     : ["expressionGenLogical", "expressionGenNumerical", "expressionGenString"],
        expressionLogical     : ["expressionOr", "expressionAnd", "expressionNot", 
                                 "expressionNotEquals", "expressionLessThanEq", "expressionGreaterThanEq", 
                                 "expressionLessThan", "expressionGreaterThan", 
                                 "expressionEquals", "expressionDivisibleBy", "expressionFactorOf", "expressionEven",
                                 "expressionOdd", "expressionPositive", "expressionNegative", "expressionPrime",
                                 "expressionLogicalBlock", "expressionTrue", "expressionFalse", "expressionVariable"],
        expressionNumerical   : ["expressionNumBlock", "expressionInteger", "expressionVariable", "expressionSum", "expressionDifference", 
                                 "expressionProduct", "expressionIntDivide", "expressionDivide", "expressionModulo", "expressionRemainderOf",
                                 "expressionPower", "expressionSquareRoot", "expressionFirstIndexOf", "expressionLastIndexOf"],
        expressionString      : ["expressionStringBlock", "expressionConcatenate", "expressionJoinStr", "expressionPlusStr", 
                                 "expressionFirstChar", "expressionLastChar", "expressionCharNumber", "expressionText", 
                                 "expressionSubstringPos", "expressionVariable"],
        statementGeneral      : ["statementBlock", "statementJoin", "statementAssignment", "statementMultiplyVar", "statementDivideVar",
                                 "statementAddToVar", "statementMinusFromVar", 
                                 "statementIncreaseVar", "statementDecreaseVar", "statementForLessThan", "statementForFromTo", 
                                 "statementWhile", "statementUntil", "statementIfThenAlt", "statementIfThen", "statementPrint"],
        statementConditional  : ["statementElseIfMore", "statementElseIf", "statementElse"]
    };

    namespace.exports.processingOrder = processingOrder;

    var funcIds = {
        parseSchemaFragment         : 0,
        parseTextOnFirstToken       : 1,
        parseTextFragmentByCategory : 2
    };

    var tupleToStr = function(arr) {
        return arr.join("|");
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
    
    var addTokens = function(tokenName) {
        // create a new token for each item in statementPartSchema.tokens[tokenName]
        // returns array of new token names
        var tokenArr = statementPartSchema.tokens[tokenName] ? statementPartSchema.tokens[tokenName] : [];
        var namePadding = "__";
        var tokenNames = [];
        var strTokenName;
        var i;

        for(i = 0; i < tokenArr.length; i++) {
            strTokenName = namePadding + tokenName + i + namePadding;
            tokenNames.push(strTokenName);
            statementPartSchema.tokens[strTokenName] = [tokenArr[i]];
        }

        return tokenNames;
    };

    var memoizedFunc = function(func, argArr, uid) {
        var key = tupleToStr(argArr.concat(uid));
        var parseResultsArr;

        if(key in memo) {
            parseResultsArr = memo[key];
        } else {
            parseResultsArr = func.apply(null, argArr);
            memo[key] = parseResultsArr;
        }

        return parseResultsArr.map(function(result) {
                return result.slice();
        }); // store shallow copies of each array so other functions can change them
            // without affecting memo entries
    };

    var parseSchemaFragment = function(text, schemaArrFragment, matchEntire) {
        // returns all possible schemaArrFragment parsings of a prefix of text;
        // full text if matchEntire is true
        // in form [args[0], args[1], ..., args[n], textRemaining]

        var key = tupleToStr([text, schemaArrFragment, matchEntire]);
        var parseResultsArr = []; // all possible results for schemaArrFragment
        var result = undefined; 
        var resultArr = null; // result for schemaArrFragment[1:]
        var results; // possible results for schemaArrFragment[0]
        var textRemaining = text.toLowerCase().trim();

        if(schemaArrFragment.length === 0) {
            return (textRemaining === "" || !matchEntire) ? [[textRemaining]] : [];
        }
        else if(schemaArrFragment[0] in statementPartSchema.tokens) {
            result = splitOnFirst(textRemaining, schemaArrFragment[0], true);
            results = result ? [result.slice(1)] : []; // token at start so result[0] == ""
        }
        else {
            results = memoizedFunc(parseTextFragmentByCategory, [textRemaining, schemaArrFragment[0], false], 
                                   funcIds.parseTextFragmentByCategory);
        }

        results.forEach(function(result) {
            textRemaining = result[result.length-1].trim();
            result.pop(); // remove textRemaining
            resultArr = memoizedFunc(parseSchemaFragment, [textRemaining, schemaArrFragment.slice(1), matchEntire],
                                     funcIds.parseSchemaFragment);
            resultArr.forEach(function(suffixResult) {
                parseResultsArr.push([result].concat(suffixResult));
            });
        });

        return parseResultsArr;
    };

    var parseTextOnFirstToken = function(text, partsArr, matchEntire) {
        // parse text on token appearing first in partsArr on each
        // occurrence in text that forms an instance of partsArr schema
        // returns array of arrays of the form
        // [args[0], args[1], ..., args[n], textRemaining]

        var tokenIndex = getFirstTokenIndex(partsArr);
        var tokenName = tokenIndex >= 0 ? partsArr[tokenIndex] : "NOT_FOUND";
        var textRemaining = text.trim().toLowerCase();
        var textThroughPreviousToken = "";
        var splitOnTokenArr;
        var parseResultsArr = [];
        var parseResultsArrBeforeToken;
        var parseResultsArrAfterToken;
        var tokenNames;
        var partsArrBeforeFirstToken;
        var partsArrAfterFirstToken;

        if(tokenIndex <= 0) {
            // For efficiency : don't need to check each possible match if token needs to be at start
            parseResultsArr = parseSchemaFragment(textRemaining, partsArr, matchEntire);
        } else {
            partsArrBeforeFirstToken = partsArr.slice(0, tokenIndex);
            partsArrAfterFirstToken = partsArr.slice(tokenIndex + 1);
            tokenNames = addTokens(tokenName);

            tokenNames.forEach(function(derivedTokenName) {
                textThroughPreviousToken = "";
                splitOnTokenArr = splitOnFirst(textRemaining, derivedTokenName);

                while(splitOnTokenArr) {
                    parseResultsArrBeforeToken = memoizedFunc(parseSchemaFragment, 
                                                              [ (textThroughPreviousToken + splitOnTokenArr[0]).trim(), 
                                                               partsArrBeforeFirstToken, true ], funcIds.parseSchemaFragment);

                    if(parseResultsArrBeforeToken.length > 0) {
                        parseResultsArrAfterToken = memoizedFunc(parseSchemaFragment,
                                                                 [splitOnTokenArr[2].trim(), partsArrAfterFirstToken, matchEntire ], 
                                                                  funcIds.parseSchemaFragment);

                        parseResultsArrBeforeToken.forEach(function(beforeResult) {
                            beforeResult.pop(); // textRemaining === "" since matchEntire is true
                            parseResultsArrAfterToken.forEach(function(afterResult) {
                                parseResultsArr.push(beforeResult.concat([splitOnTokenArr[1]], afterResult));
                            });
                        });
                    }

                    textThroughPreviousToken += splitOnTokenArr[0] + splitOnTokenArr[1];
                    splitOnTokenArr = splitOnFirst(splitOnTokenArr[2], derivedTokenName);
                }
            });
        }

        return parseResultsArr;
    };

    var parseTextFragmentByCategory = function(text, category, matchEntire) {
        // parse text using each matching schema in category;
        // returns array of arrays for each one; each in the form 
        // [schema identifier, args[0], args[1], ..., args[n], textRemaining]

        var results;
        var parseResultsArr = [];
        var schemas = processingOrder[category];
        var schemaArr;

        schemas.forEach(function(schema) {
            schemaArr = statementPartSchema[category][schema];
            results = memoizedFunc(parseTextOnFirstToken, [text, schemaArr, matchEntire], 
                                   funcIds.parseTextOnFirstToken);
            results.forEach(function(result) {
                parseResultsArr.push( [schema].concat(result) ); // add schema identifier to front of result array
            });
        });

        return parseResultsArr;
    };

    namespace.exports.parseText = function(text) {
        var statementCount = text.split(statementPartSchema.tokens.statementSeparator).length;
        var statements = text.split(statementPartSchema.tokens.fullStatementSeparator[0]);
        var parsedStatements = [];

        statements.forEach(function(statement) {
            var result = memoizedFunc(parseTextFragmentByCategory, [statement, "statementGeneral", true],
                                      funcIds.parseTextFragmentByCategory);
            console.log("Number of Possibilities: " + result.length);
            if(result.length > 0) {
                parsedStatements.push(result[0]);
            }
            console.log("Parsed Statement:" + parsedStatements[parsedStatements.length-1] + "\n");
        });

        console.log(statements.length);
        return parsedStatements;
    };
})(provide("parser"));

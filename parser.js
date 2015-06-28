"use strict";

(function(namespace) {
    var memo = {};
    var statementPartSchema = {
        tokens : {
            integer                :  [/-\d+|\d+/],
            variable               :  [/[A-Za-z_]\w*/],
            word                   :  [/[A-Za-z]+/],
            equals                 :  ["is equal to", "equals to", "equals", "="],
            comma                  :  [","],
            semicolon              :  [";"],
            "if"                   :  ["if"],
            "else"                 :  ["otherwise", "else"],
            set                    :  ["set"],
            then                   :  ["then"],
            commaThen              :  [", then", ",then", ",", "then"],
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
            not                    :  ["not"],
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
            modulo                 :  ["modulo", "mod", "modulus"],
            remainderOf            :  ["the remainder of", "remainder of"],
            power                  :  ["\\^", "raised to the", "to the", "power"],
            quotationMark          :  ['\\"', "\\'"],
            openBracket            :  ["{"],
            closeBracket           :  ["}"],
            openParenthesis        :  ["\\("],
            closeParenthesis       :  ["\\)"],
            statementSeparator     :  [/\.|;|\r\n|\r|\n/],
            fullStatementSeparator :  [/\.\s*|\r\n|\r|\n/]
        },

        expressionLogical : {
            // add boolean variable?  If so, expressionGeneral needs to be fixed because it should be processed last.
            expressionTrue         :  ["true"],
            expressionFalse        :  ["false"],
            expressionLessThan     :  ["expressionNumerical", "lessThan", "expressionNumerical"],
            expressionLessThanEq   :  ["expressionNumerical", "lessThanOrEq", "expressionNumerical"],
            expressionGreaterThan  :  ["expressionNumerical", "greaterThan", "expressionNumerical"],
            expressionGreaterThanEq:  ["expressionNumerical", "greaterThanOrEq", "expressionNumerical"],
            expressionEquals       :  ["expressionNumerical", "equals", "expressionNumerical"],
            expressionNotEquals    :  ["expressionNumerical", "notEquals", "expressionNumerical"],
            expressionDivisibleBy  :  ["expressionNumerical", "divisibleBy", "expressionNumerical"],
            expressionFactorOf     :  ["expressionNumerical", "factorOf", "expressionNumerical"],
            expressionOr           :  ["expressionLogical", "or", "expressionLogical"],
            expressionAnd          :  ["expressionLogical", "and", "expressionLogical"],
            expressionNot          :  ["not", "expressionLogical"],
            expressionLogicalBlock :  ["openParenthesis", "expressionLogical", "closeParenthesis"]
        },

        expressionNumerical : {
            expressionInteger      :  ["integer"],
            expressionSum          :  ["expressionNumerical", "plus", "expressionNumerical"],
            expressionDifference   :  ["expressionNumerical", "minus", "expressionNumerical"],
            expressionProduct      :  ["expressionNumerical", "multiply", "expressionNumerical"],
            expressionDivide       :  ["expressionNumerical", "divide", "expressionNumerical"],
            expressionPower        :  ["expressionNumerical", "power", "expressionNumerical"],
            expressionRemainderOf  :  ["remainderOf", "expressionNumerical", "divide", "expressionNumerical"], // divide
            expressionModulo       :  ["expressionNumerical", "modulo", "expressionNumerical"],
            expressionVariable     :  ["variable"],
            expressionNumBlock     :  ["openParenthesis", "expressionNumerical", "closeParenthesis"]
        },

        expressionString : {
            expressionText         :  ["quotationMark", "word", "quotationMark"]
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
            statementAssignment    :  ["set", "variable", "to", "expressionGeneral"],
            statementIncreaseVar   :  ["increase", "variable", "by", "expressionNumerical"],
            statementDecreaseVar   :  ["decrease", "variable", "by", "expressionNumerical"],
            statementForLessThan   :  ["for", "variable", "lessThan", "expressionNumerical", "comma", "statementGeneral"],
            statementForFromTo     :  ["for", "variable", "from", "expressionNumerical", "to", 
                                       "expressionNumerical", "comma", "statementGeneral"],
            statementWhile         :  ["while", "expressionLogical", "comma", "statementGeneral"],
            statementUntil         :  ["until", "expressionLogical", "comma", "statementGeneral"],
            //statementIfComma     :  ["if", "expressionLogical", "comma", "statementGeneral"],
            statementIfThen        :  ["if", "expressionLogical", "commaThen", "statementGeneral"],
            statementIfThenAlt     :  ["if", "expressionLogical", "commaThen", "statementGeneral", 
                                       "semicolon", "statementConditional"]
        }
    };

    namespace.exports.statementPartSchema = statementPartSchema;

    var processingOrder = {
        expressionGeneral     : ["expressionGenLogical", "expressionGenNumerical", "expressionGenString"],
        expressionLogical     : ["expressionOr", "expressionAnd", "expressionNot", 
                                 "expressionNotEquals", "expressionLessThanEq", "expressionGreaterThanEq", 
                                 "expressionLessThan", "expressionGreaterThan", 
                                 "expressionEquals", "expressionDivisibleBy", "expressionFactorOf", 
                                 "expressionLogicalBlock", "expressionTrue", "expressionFalse"],
        expressionNumerical   : ["expressionSum", "expressionDifference", 
                                 "expressionProduct", "expressionDivide", "expressionModulo", "expressionRemainderOf",
                                 "expressionPower", "expressionVariable", "expressionNumBlock", "expressionInteger"],
        expressionString      : ["expressionText"],
        statementGeneral      : ["statementBlock", "statementJoin", "statementAssignment", "statementIncreaseVar", 
                                 "statementDecreaseVar", "statementForLessThan", "statementForFromTo", "statementWhile", 
                                 "statementUntil", "statementIfThenAlt", "statementIfThen"],
        statementConditional  : ["statementElseIfMore", "statementElseIf", "statementElse"]
    };

    namespace.exports.processingOrder = processingOrder;

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

    var parseSchemaFragment = function(text, schemaArrFragment, matchEntire) {
        // returns all possible schemaArrFragment parsings of a prefix of text;
        // full text if matchEntire is true
        // in form []
        var i;
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
            results = parseTextFragmentByCategory(textRemaining, schemaArrFragment[0]);
        }

        results.forEach(function(result) {
            textRemaining = result[result.length-1].trim();
            result.pop(); // remove textRemaining
            resultArr = parseSchemaFragment(textRemaining, schemaArrFragment.slice(1), matchEntire);
            resultArr.forEach(function(suffixResult) {
                parseResultsArr.push([result].concat(suffixResult));
            });
        });

        //if(matchEntire && parseResultsArr.length > 0)
        //    console.log("Final:" + parseResultsArr);

        return parseResultsArr;
    };

    var parseTextOnFirstToken = function(text, partsArr, matchEntire) {
        // parse text on token appearing first in partsArr on each
        // occurrence in text that forms an instance of partsArr schema
        // returns array of arrays [args[0], args[1], ..., args[n], textRemaining]
        // or null if text can't be split on any token to match partsArr schema

        var tokenIndex = getFirstTokenIndex(partsArr);
        var tokenName = tokenIndex >= 0 ? partsArr[tokenIndex] : "NOT_FOUND";
        var textRemaining = text.trim().toLowerCase();
        var textThroughPreviousToken = "";
        var splitOnTokenArr;
        var parseResultsArr = [];
        var parseResultsArrBeforeToken;
        var parseResultsArrAfterToken;

        if(tokenIndex <= 0) {
            // For efficiency : don't need to check each possible match if token needs to be at start
            parseResultsArr = parseSchemaFragment(textRemaining, partsArr, matchEntire);
        } else {
            splitOnTokenArr = splitOnFirst(textRemaining, tokenName);

            while(splitOnTokenArr) {
                parseResultsArrBeforeToken = parseSchemaFragment( (textThroughPreviousToken + splitOnTokenArr[0]).trim(), 
    	    	                                                   partsArr.slice(0, tokenIndex), true );

                if(parseResultsArrBeforeToken.length > 0) {
                    parseResultsArrAfterToken = parseSchemaFragment(splitOnTokenArr[2].trim(), partsArr.slice(tokenIndex + 1), matchEntire );

                    parseResultsArrBeforeToken.forEach(function(beforeResult) {
                        beforeResult.pop(); // textRemaining === "" since matchEntire is true
                        parseResultsArrAfterToken.forEach(function(afterResult) {
                            parseResultsArr.push(beforeResult.concat([splitOnTokenArr[1]], afterResult));
                        });
                    });
                }

                textThroughPreviousToken += splitOnTokenArr[0] + splitOnTokenArr[1];
                splitOnTokenArr = splitOnFirst(splitOnTokenArr[2], tokenName);
            }
        }

        return parseResultsArr;
    };

    var parseTextFragmentByCategory = function(text, category, matchEntire) {
        // parse text using each matching schema in category;
        // returns array of arrays for each one; each in the form 
        // [schema identifier, args[0], args[1], ..., args[n], textRemaining]
        // or null if no matching schema X (no longer true)

        var key = tupleToStr([text, category, matchEntire]);
        var results;
        var parseResultsArr = [];
        var schemas = processingOrder[category];
        var schemaArr;
        var schema;
        var i;

        if(key in memo) {
            parseResultsArr = memo[key];
        } else {
            for(i = 0; i < schemas.length; i++) {
                schema = schemas[i];
                schemaArr = statementPartSchema[category][schema];
                results = parseTextOnFirstToken(text, schemaArr, matchEntire);
                results.forEach(function(result) {
                    parseResultsArr.push( [schema].concat(result) ); // add schema identifier to front of result array
                });
            }

            //memo[key] = resultArr;
        }

        return parseResultsArr;//.map(function(resultd) {
        //        return resultd.slice(); // store shallow copies of each array so other functions can change them
                                       // without affecting memo entries
        //    });
    };

    namespace.exports.parseText = function(text) {
        //text = document.getElementById("pseudocode").value; // Remove later
        var statementCount = text.split(statementPartSchema.tokens.statementSeparator).length;
        var statements = text.split(statementPartSchema.tokens.fullStatementSeparator[0]);
        var parsedStatements = [];

        statements.forEach(function(statement) {
            var result = parseTextFragmentByCategory(statement, "statementGeneral", true);
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

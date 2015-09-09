"use strict";

(function(namespace) {
    var numberOfUnclosedStatements = 0;

    var generateAttributeElement = function(type, name, value) {
        return "<" + type + " name = \"" + name + "\">" + value + "</" + type + ">"; 
    };

    var generateOpenBlockTag = function(type) {
        return "<block type = \"" + type + "\">";
    };

    namespace.exports.generateVariablesSet = function(variableName, valueBlock) {
        var XMLCode = generateOpenBlockTag("variables_set");
        XMLCode += generateAttributeElement("field", "VAR", variableName);
        XMLCode += generateAttributeElement("value", "VALUE", valueBlock);
        XMLCode += "<next>";
        numberOfUnclosedStatements++;
	  
        return XMLCode;
    };

    namespace.exports.generateVariablesGet = function(variableName) {
        var XMLCode = generateOpenBlockTag("variables_get");
        XMLCode += generateAttributeElement("field", "VAR", variableName);
        XMLCode += "</block>";
        return XMLCode;
    };

    namespace.exports.generateTextPrint = function(textBlock) {
        var XMLCode = generateOpenBlockTag("text_print");
        XMLCode += generateAttributeElement("value", "TEXT", textBlock);
        XMLCode += "<next>";
        numberOfUnclosedStatements++;

        return XMLCode;
    };

    var generateLogicBoolean = function(isTrue) {
        var truthValue = isTrue ? "TRUE" : "FALSE";
        var XMLCode = generateOpenBlockTag("logic_boolean");
        XMLCode += generateAttributeElement("field", "BOOL", truthValue);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateLogicBooleanTrue = generateLogicBoolean.bind(null, true);
    namespace.exports.generateLogicBooleanFalse = generateLogicBoolean.bind(null, false);

    namespace.exports.generateMathNumber = function(num) {
        var numVal = (num !== undefined ? num : 0);
        var XMLCode = generateOpenBlockTag("math_number");
        XMLCode += generateAttributeElement("field", "NUM", numVal);
        XMLCode += "</block>";

        return XMLCode;
    };

    var generateMathNumber = namespace.exports.generateMathNumber;

    namespace.exports.generateText = function(str) {
        var strVal = (str !== undefined ? str : "");
        var XMLCode = generateOpenBlockTag("text");
        XMLCode += generateAttributeElement("field", "TEXT", strVal);
        XMLCode += "</block>";

        return XMLCode;
    };

    var generateMathArithmetic = function(OP, valueBlockA, valueBlockB) {
        var XMLCode = generateOpenBlockTag("math_arithmetic");
        XMLCode += generateAttributeElement("value", "A", valueBlockA);
        XMLCode += generateAttributeElement("field", "OP", OP);
        XMLCode += generateAttributeElement("value", "B", valueBlockB);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateMathArithmeticAdd = generateMathArithmetic.bind(null, "ADD");
    namespace.exports.generateMathArithmeticMinus = generateMathArithmetic.bind(null, "MINUS");
    namespace.exports.generateMathArithmeticMultiply = generateMathArithmetic.bind(null, "MULTIPLY");
    namespace.exports.generateMathArithmeticDivide = generateMathArithmetic.bind(null, "DIVIDE");
    namespace.exports.generateMathArithmeticPower = generateMathArithmetic.bind(null, "POWER");

    namespace.exports.generateMathModulo = function(valueBlockDividend, valueBlockDivisor) {
        var XMLCode = generateOpenBlockTag("math_modulo");
        XMLCode += generateAttributeElement("value", "DIVIDEND", valueBlockDividend);
        XMLCode += generateAttributeElement("value", "DIVISOR", valueBlockDivisor);
        XMLCode += "</block>";

        return XMLCode;
    };

    var generateMathRound = function(OP, valueBlock) {
        var XMLCode = generateOpenBlockTag("math_round");
        XMLCode += generateAttributeElement("value", "NUM", valueBlock);
        XMLCode += generateAttributeElement("field", "OP", OP);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateMathRoundNormal = generateMathRound.bind(null, "ROUND");
    namespace.exports.generateMathRoundDown = generateMathRound.bind(null, "ROUNDDOWN");
    namespace.exports.generateMathRoundUp = generateMathRound.bind(null, "ROUNDUP");

    namespace.exports.generateMathArithmeticIntDivide = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateMathRoundDown(namespace.exports.generateMathArithmeticDivide(valueBlockA, valueBlockB));
    };

    var generateMathSingle = function(OP, valueBlockNum) {
        var XMLCode = generateOpenBlockTag("math_single");
        XMLCode += generateAttributeElement("field", "OP", OP);
        XMLCode += generateAttributeElement("value", "NUM", valueBlockNum);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateMathSingleSquareRoot = generateMathSingle.bind(null, "ROOT");

    namespace.exports.generateTextLength = function(textBlock) {
        var XMLCode = generateOpenBlockTag("text_length");
        XMLCode += generateAttributeElement("value", "VALUE", textBlock);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateTextJoin = function(valueBlockAdd0, valueBlockAdd1) {
        var XMLCode = generateOpenBlockTag("text_join");
        XMLCode += "<mutation items = \"2\"></mutation>";
        XMLCode += generateAttributeElement("value", "ADD0", valueBlockAdd0);
        XMLCode += generateAttributeElement("value", "ADD1", valueBlockAdd1);
        XMLCode += "</block>";

        return XMLCode;
    };

    var generateTextCharAt = function(hasTwo, WHERE, valueBlock, atBlock) {
        var XMLCode = generateOpenBlockTag("text_charAt");

        hasTwo = hasTwo ? "true" : "false";
        XMLCode += "<mutation at = \"" + hasTwo + "\"></mutation>";
        XMLCode += generateAttributeElement("field", "WHERE", WHERE);
        XMLCode += generateAttributeElement("value", "VALUE", valueBlock);
        if(atBlock) {
            XMLCode += generateAttributeElement("value", "AT", atBlock);
        }

        return XMLCode;
    };

    namespace.exports.generateTextCharAtFirst = generateTextCharAt.bind(null, false, "FIRST");
    namespace.exports.generateTextCharAtLast = generateTextCharAt.bind(null, false, "LAST");
    namespace.exports.generateTextCharFromStart = generateTextCharAt.bind(null, true, "FROM_START");

    var generateTextGetSubstring = function(hasStart, hasEnd, WHERE1, WHERE2, strValueBlock, at1Block, at2Block) {
        var hasFirst = hasStart ? "true" : "false";
        var hasSecond = hasEnd ? "true" : "false";
        var XMLCode = generateOpenBlockTag("text_getSubstring");

        XMLCode += "<mutation at1 = \"" + hasFirst + "\" at2 = \"" + hasSecond + "\"></mutation>";
        XMLCode += generateAttributeElement("field", "WHERE1", WHERE1);
        XMLCode += generateAttributeElement("field", "WHERE2", WHERE2);
        XMLCode += generateAttributeElement("value", "STRING", strValueBlock);
        if(at1Block) {
            XMLCode += generateAttributeElement("value", "AT1", at1Block);
        }
        if(at2Block) {
            XMLCode += generateAttributeElement("value", "AT2", at2Block);
        }

        return XMLCode;
    };

    namespace.exports.generateTextGetSubstringPosToPos = generateTextGetSubstring.bind(null, true, true, "FROM_START", "FROM_START");
    namespace.exports.generateTextGetSubstringStartToPos = generateTextGetSubstring.bind(null, false, true, "FIRST", "FROM_START");
    namespace.exports.generateTextGetSubstringPosToEnd = generateTextGetSubstring.bind(null, true, false, "FROM_START", "LAST");

    var generateTextIndexOf = function(fromEnd, strValueBlock, findBlock) {
        var END = fromEnd ? "LAST" : "FIRST";
        var XMLCode = generateOpenBlockTag("text_indexOf");
        XMLCode += generateAttributeElement("field", "END", END);
        XMLCode += generateAttributeElement("value", "VALUE", strValueBlock);
        XMLCode += generateAttributeElement("value", "FIND", findBlock);

        return XMLCode;
    };

    namespace.exports.generateTextIndexOfFirst = generateTextIndexOf.bind(null, false);
    namespace.exports.generateTextIndexOfLast = generateTextIndexOf.bind(null, true);

    var generateUpdateVariable = function(OP, variable, valueBlock) {
        return namespace.exports.generateVariablesSet(variable, 
               generateMathArithmetic(OP, namespace.exports.generateVariablesGet(variable), 
               valueBlock));
    };

    namespace.exports.generateVariablesIncrease = generateUpdateVariable.bind(null, "ADD");
    namespace.exports.generateVariablesDecrease = generateUpdateVariable.bind(null, "MINUS");
    namespace.exports.generateVariablesMultiply = generateUpdateVariable.bind(null, "MULTIPLY");
    namespace.exports.generateVariablesDivide = generateUpdateVariable.bind(null, "DIVIDE");

    namespace.exports.generateControlsForBlock = function(variableName, fromBlock, toBlock, doBlock, byBlock) {
        var XMLCode = generateOpenBlockTag("controls_for");

        variableName = variableName ? variableName : "i";
        fromBlock = fromBlock ? fromBlock : generateMathNumber(0); 
        toBlock = toBlock ? toBlock : generateMathNumber(1); 
        doBlock = doBlock ? doBlock : "";
        byBlock = byBlock ? byBlock : generateMathNumber(1);

        XMLCode += generateAttributeElement("field", "VAR", variableName);
        XMLCode += generateAttributeElement("value", "FROM", fromBlock);
        XMLCode += generateAttributeElement("value", "TO", toBlock);
        XMLCode += generateAttributeElement("value", "BY", byBlock);
        XMLCode += "<statement name = \"DO\">" + doBlock + "</next></block></statement>";
        XMLCode += "<next>";

        numberOfUnclosedStatements++;

        return XMLCode;
    };

    namespace.exports.closeAllStatements = function() {
        var XMLCode = "";

        for(var i = 0; i < numberOfUnclosedStatements; i++) {
            XMLCode += "</next></block>";
        }

        numberOfUnclosedStatements = 0;

        return XMLCode;
    };

    namespace.exports.generateControlsForBlockLessThan = function(variableName, toBlock, doBlock) {
        return namespace.exports.generateControlsForBlock(variableName, namespace.exports.generateMathNumber(0), 
                                                          namespace.exports.generateMathArithmeticMinus(toBlock,
                                                          generateMathNumber(1)), doBlock);
    };

    var generateControlsWhileUntil = function(isUntil, testBlock, doBlock) {
        var XMLCode = generateOpenBlockTag("controls_whileUntil");
        var mode = isUntil ? "UNTIL" : "WHILE";
        testBlock = testBlock || namespace.exports.generateLogicBooleanFalse();
        doBlock = (doBlock !== undefined ? doBlock : "");

        XMLCode += generateAttributeElement("field", "MODE", mode);
        XMLCode += generateAttributeElement("value", "BOOL", testBlock);
        XMLCode += "<statement name = \"DO\">" + doBlock + "</next></block></statement>";
        XMLCode += "<next>";
        numberOfUnclosedStatements++;

        return XMLCode;
    };

    namespace.exports.generateControlsWhile = generateControlsWhileUntil.bind(null, false);
    namespace.exports.generateControlsUntil = generateControlsWhileUntil.bind(null, true);

    namespace.exports.generateControlsIf = function(testBlock, doBlock, elseIfConditionArr) {
        var XMLCode = generateOpenBlockTag("controls_if");
        var ifCounter;
        var numOfElseIfs = elseIfConditionArr ? Math.floor(elseIfConditionArr.length / 2) : 0;
        var numOfElses = elseIfConditionArr ? elseIfConditionArr.length % 2 : 0;

        XMLCode += "<mutation elseif = \"" + numOfElseIfs + "\" else = \"" + numOfElses +"\"></mutation>";

        testBlock = testBlock || namespace.exports.generateLogicBooleanTrue();
        doBlock = (doBlock !== undefined ? doBlock : "");

        XMLCode += generateAttributeElement("value", "IF0", testBlock);
        XMLCode += "<statement name = \"DO0\">" + doBlock + "</next></block></statement>";

        for(ifCounter = 1; ifCounter <= numOfElseIfs; ifCounter++) {
            XMLCode += generateAttributeElement("value", "IF" + ifCounter, elseIfConditionArr[2*ifCounter-2]);
            XMLCode += "<statement name = \"DO" + ifCounter + "\">" + elseIfConditionArr[2*ifCounter-1] + 
                       "</next></block></statement>";
        }

        if(numOfElses > 0) {
            XMLCode += "<statement name = \"ELSE\">" + elseIfConditionArr[elseIfConditionArr.length - 1] + "</next></block></statement>";
        }

        XMLCode += "<next>";
        numberOfUnclosedStatements++;

        return XMLCode;
    };

    var generateLogicOperation = function(isOr, valueBlockA, valueBlockB) {
        var XMLCode = generateOpenBlockTag("logic_operation");
        var OP = isOr ? "OR" : "AND";

        XMLCode += generateAttributeElement("value", "A", valueBlockA);
        XMLCode += generateAttributeElement("field", "OP", OP);
        XMLCode += generateAttributeElement("value", "B", valueBlockB);
        XMLCode += "</block>";

        return XMLCode;
    };

    var generateMathNumberProperty = function(OP, valueBlockToCheck) {
        var XMLCode = generateOpenBlockTag("math_number_property");
        XMLCode += generateAttributeElement("field", "PROPERTY", OP);
        XMLCode += generateAttributeElement("value", "NUMBER_TO_CHECK", valueBlockToCheck);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateMathNumberPropertyEven = generateMathNumberProperty.bind(null, "EVEN"),
    namespace.exports.generateMathNumberPropertyOdd = generateMathNumberProperty.bind(null, "ODD"),
    namespace.exports.generateMathNumberPropertyPositive = generateMathNumberProperty.bind(null, "POSITIVE"),
    namespace.exports.generateMathNumberPropertyNegative = generateMathNumberProperty.bind(null, "NEGATIVE"),
    namespace.exports.generateMathNumberPropertyPrime = generateMathNumberProperty.bind(null, "PRIME"),

    namespace.exports.generateMathNumberPropertyDivisible = function(valueBlockToCheck, valueBlockDivisor) {
        var XMLCode = generateOpenBlockTag("math_number_property");
        XMLCode += "<mutation divisor_input = \"true\"></mutation>";
        XMLCode += generateAttributeElement("field", "PROPERTY", "DIVISIBLE_BY");
        XMLCode += generateAttributeElement("value", "NUMBER_TO_CHECK", valueBlockToCheck);
        XMLCode += generateAttributeElement("value", "DIVISOR", valueBlockDivisor);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateLogicNegate = function(logicalExpressionBlock) {
        var XMLCode = generateOpenBlockTag("logic_negate");
        XMLCode += generateAttributeElement("value", "BOOL", logicalExpressionBlock);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateLogicOperationOr = generateLogicOperation.bind(null, true);
    namespace.exports.generateLogicOperationAnd = generateLogicOperation.bind(null, false);

    var generateLogicCompare = function(OP, valueBlockA, valueBlockB) {
        var XMLCode = generateOpenBlockTag("logic_compare");

        XMLCode += generateAttributeElement("value", "A", valueBlockA);
        XMLCode += generateAttributeElement("field", "OP", OP);
        XMLCode += generateAttributeElement("value", "B", valueBlockB);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateLogicCompareLT = generateLogicCompare.bind(null, "LT");
    namespace.exports.generateLogicCompareGT = generateLogicCompare.bind(null, "GT");
    namespace.exports.generateLogicCompareLTE = generateLogicCompare.bind(null, "LTE");
    namespace.exports.generateLogicCompareGTE = generateLogicCompare.bind(null, "GTE");
    namespace.exports.generateLogicCompareEQ = generateLogicCompare.bind(null, "EQ");
    namespace.exports.generateLogicCompareNEQ = generateLogicCompare.bind(null, "NEQ");


    namespace.exports.generateStatementBlock = function(statementBlockA, statementBlockB) {
    	numberOfUnclosedStatements++;
        return statementBlockA + statementBlockB;
    };

})(provide("block_generators"));

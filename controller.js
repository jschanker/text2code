"use strict";

(function(namespace) {
    var parser = require("parser");
    var bg = require("block_generators");

    var blockGeneratorArgs = {
        expressionVariable      : [bg.generateVariablesGet, [1]],
        expressionInteger       : [bg.generateMathNumber, [1]],
        expressionTrue          : [bg.generateLogicBooleanTrue, []],
        expressionFalse         : [bg.generateLogicBooleanFalse, []],
        expressionText          : [bg.generateText, [2]],
        expressionSum           : [bg.generateMathArithmeticAdd, [1, 3]],
        expressionDifference    : [bg.generateMathArithmeticMinus, [1, 3]],
        expressionProduct       : [bg.generateMathArithmeticMultiply, [1, 3]],
        expressionDivide        : [bg.generateMathArithmeticDivide, [1, 3]],
        expressionPower         : [bg.generateMathArithmeticPower, [1, 3]],
        expressionModulo        : [bg.generateMathModulo, [1, 3]],
        expressionRemainderOf   : [bg.generateMathModulo, [2, 4]],
        expressionSquareRoot    : [bg.generateMathSingleSquareRoot, [2]],
        expressionFirstChar     : [bg.generateTextCharAtFirst, [4]],
        expressionLastChar      : [bg.generateTextCharAtLast, [4]],
        expressionCharNumber    : [bg.generateTextCharFromStart, [5, 3]],
        expressionSubstringPos  : [bg.generateTextGetSubstringPosToPos, [3, 6, 9]],
        expressionFirstIndexOf  : [bg.generateTextIndexOfFirst, [6, 4]],  
        expressionLastIndexOf   : [bg.generateTextIndexOfLast, [6, 4]], 
        expressionLessThan      : [bg.generateLogicCompareLT, [1, 3]],
        expressionLessThanEq    : [bg.generateLogicCompareLTE, [1, 3]],
        expressionGreaterThan   : [bg.generateLogicCompareGT, [1, 3]],
        expressionGreaterThanEq : [bg.generateLogicCompareGTE, [1, 3]],
        expressionEquals        : [bg.generateLogicCompareEQ, [1, 3]],
        expressionNotEquals     : [bg.generateLogicCompareNEQ, [1, 3]],
        expressionDivisibleBy   : [bg.generateMathNumberPropertyDivisible, [1, 3]],
        expressionFactorOf      : [bg.generateMathNumberPropertyDivisible, [3, 1]],
        expressionEven          : [bg.generateMathNumberPropertyEven, [1]],
        expressionOdd           : [bg.generateMathNumberPropertyOdd, [1]],
        expressionPositive      : [bg.generateMathNumberPropertyPositive, [1]],
        expressionNegative      : [bg.generateMathNumberPropertyNegative, [1]],
        expressionPrime         : [bg.generateMathNumberPropertyPrime, [1]],
        expressionConcatenate   : [bg.generateTextJoin, [1, 3]],
        expressionJoinStr       : [bg.generateTextJoin, [1, 3]],
        expressionPlusStr       : [bg.generateTextJoin, [1, 3]],
        expressionNot           : [bg.generateLogicNegate, [2]],
        expressionOr            : [bg.generateLogicOperationOr, [1, 3]],
        expressionAnd           : [bg.generateLogicOperationAnd, [1, 3]],
        expressionGenNumerical  : [identity, [1]],
        expressionGenLogical    : [identity, [1]],
        expressionGenString     : [identity, [1]],
        expressionLogicalBlock  : [identity, [2]],
        expressionNumBlock      : [identity, [2]],
        expressionStringBlock   : [identity, [2]],

        statementBlock          : [identity, [2]],
        statementIfThenAlt      : [bg.generateControlsIf, [2, 4, 6]],
        statementElseIf         : [statementElseIf, [3, 5]],
        statementElseIfMore     : [statementElseIfMore, [3, 5, 7]],
        statementElse           : [statementElse, [2]],
        statementJoin           : [bg.generateStatementBlock, [1, 3]],
        statementAssignment     : [bg.generateVariablesSet, [2, 4]],
        statementIncreaseVar    : [bg.generateVariablesIncrease, [2, 4]],
        statementDecreaseVar    : [bg.generateVariablesDecrease, [2, 4]],
        statementForLessThan    : [bg.generateControlsForBlockLessThan, [2, 4, 6]],
        statementForFromTo      : [bg.generateControlsForBlock, [2, 4, 6, 8]],
        statementWhile          : [bg.generateControlsWhile, [2, 4]],
        statementUntil          : [bg.generateControlsUntil, [2, 4]],
        statementIfThen         : [bg.generateControlsIf, [2, 4]],
        statementPrint          : [bg.generateTextPrint, [2]]
    };

    function identity(x) {
        return x;
    }

    function statementElseIfMore(condition, doStatement, conditionArr) {
        return [condition, doStatement].concat(conditionArr);
    }

    function statementElseIf(condition, doStatement) {
        return [condition, doStatement];
    }

    function statementElse(doStatement) {
        return [doStatement];
    }

    var generateBlocklyCode = function(parsedStatement) {
        var partsArr = parsedStatement;
        var blockGenerator;
        var blockGeneratorFunc;
        var blockGeneratorArgIds;
        var blockGeneratorFuncArgs;

        if(partsArr) {
            blockGenerator = blockGeneratorArgs[ partsArr[0] ];
            blockGeneratorFunc = blockGenerator[0];
            blockGeneratorArgIds = blockGenerator[1];

            blockGeneratorFuncArgs = blockGeneratorArgIds.map(function(argId) {
                if(partsArr[argId] && partsArr[argId][0] in blockGeneratorArgs) {
                    return generateBlocklyCode(partsArr[argId]);
                } else {
                    return partsArr[argId];
                }
            });

            return blockGeneratorFunc.apply(null, blockGeneratorFuncArgs); 
        }

        return "";
    };

    namespace.exports.processText = function() {
        var text = document.getElementById("pseudocode").value;

        var parsedTextArr = parser.parseText(text);
        var XMLCode = "";
        var startBlockField = document.getElementById("startBlocks");

        parsedTextArr.forEach(function(statement) {
            XMLCode += generateBlocklyCode(statement);
        });

        XMLCode += bg.closeAllStatements();

        console.log("XML: " + XMLCode);

        startBlockField.innerHTML = XMLCode;
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, startBlockField);
    };
    
})(provide("controller"));

"use strict";

(function(namespace) {
    var parser = require("parser");
    var blockGenerators = require("block_generators");

    var blockGeneratorArgs = {
        expressionVariable      : ["generateVariablesGet", [1]],
        expressionInteger       : ["generateMathNumber", [1]],
        expressionTrue          : ["generateLogicBooleanTrue", []],
        expressionFalse         : ["generateLogicBooleanFalse", []],
        expressionSum           : ["generateMathArithmeticAdd", [1, 3]],
        expressionDifference    : ["generateMathArithmeticMinus", [1, 3]],
        expressionProduct       : ["generateMathArithmeticMultiply", [1, 3]],
        expressionDivide        : ["generateMathArithmeticDivide", [1, 3]],
        expressionPower         : ["generateMathArithmeticPower", [1, 3]],
        expressionLessThan      : ["generateLogicCompareLT", [1, 3]],
        expressionGreaterThan   : ["generateLogicCompareGT", [1, 3]],
        expressionEquals        : ["generateLogicCompareEQ", [1, 3]],
        expressionOr            : ["generateLogicOperationOr", [1, 3]],
        expressionAnd           : ["generateLogicOperationAnd", [1, 3]],
        expressionGenNumerical  : ["", [1]],
        expressionGenLogical    : ["", [1]],

        statementBlock          : ["", [2]],
        statementJoin           : ["generateStatementBlock", [1, 3]],
        statementAssignment     : ["generateVariablesSet", [2, 4]],
        statementIncreaseVar    : ["generateVariablesIncrease", [2, 4]],
        statementDecreaseVar    : ["generateVariablesDecrease", [2, 4]],
        statementForLessThan    : ["generateControlsForBlockLessThan", [2, 4, 6]],
        statementForFromTo      : ["generateControlsForBlock", [2, 4, 6, 8]],
        statementWhile          : ["generateControlsWhile", [2, 4]],
        statementUntil          : ["generateControlsUntil", [2, 4]],
        statementIfComma        : ["generateControlsIf", [2, 4]],
        statementIfThen         : ["generateControlsIf", [2, 4]],
    };

    function identity(x) {
        return x;
    }

    var generateBlocklyCode = function(parsedStatement) {
        var partsArr = parsedStatement;
        var blockGenerator;
        var blockGeneratorFunc;
        var blockGeneratorArgIds;
        var blockGeneratorFuncArgs;

        if(partsArr) {
            blockGenerator = blockGeneratorArgs[ partsArr[0] ];
            blockGeneratorFunc = blockGenerator[0] ? blockGenerators[ blockGenerator[0] ] : identity;
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
        var parsedTextArr = parser.parseText(document.getElementById("pseudocode").value);
        var XMLCode = "";
        var startBlockField = document.getElementById("startBlocks");

        parsedTextArr.forEach(function(statement) {
            XMLCode += generateBlocklyCode(statement);
        });

        XMLCode += blockGenerators.closeAllStatements();

        console.log("XML: " + XMLCode);

        startBlockField.innerHTML = XMLCode;
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, startBlockField);
    };
    
})(provide("controller"));

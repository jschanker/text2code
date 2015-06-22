"user strict";

(function(namespace) {
    var parser = require("parser");
    var blockGenerators = require("block_generators");

    var blockGeneratorArgs = {
        expressionInteger     : [blockGenerators.generateMathNumber, [1]],
        expressionTrue        : [blockGenerators.generateLogicBooleanTrue, []],
        expressionFalse       : [blockGenerators.generateLogicBooleanFalse, []],
        expressionVariable    : [blockGenerators.generateVariablesGet, [1]],
        expressionSum         : [expressionSum, [1, 3]],
        expressionDifference  : [expressionDifference, [1, 3]],
        expressionProduct     : [expressionProduct, [1, 3]],
        expressionDivide      : [expressionDivide, [1, 3]],
        expressionPower       : [expressionPower, [1, 3]],
        expressionLessThan    : [expressionLessThan, [1, 3]],
        expressionGreaterThan : [expressionGreaterThan, [1, 3]],
        expressionEquals      : [expressionEquals, [1, 3]],
        expressionOr          : [expressionOr, [1, 3]],
        expressionAnd         : [expressionAnd, [1, 3]],

        statementBlock        : [statementBlock, [2]],
        statementJoin         : [statementJoin, [1, 3]],
        statementAssignment   : [statementAssignment, [2, 4]],
        statementIncreaseVar  : [statementIncreaseVar, [2, 4]],
        statementDecreaseVar  : [statementDecreaseVar, [2, 4]],
        statementForLessThan  : [statementForLessThan, [2, 4, 6]],
        statementForFromTo    : [statementForFromTo, [2, 4, 6, 8]],
        statementWhile        : [statementWhile, [2, 4]],
        statementUntil        : [statementUntil, [2, 4]],
        statementIfComma      : [statementIf, [2, 4]],
        statementIfThen       : [statementIf, [2, 4]],
    };

    function expressionLessThan(numericalExpressionA, numericalExpressionB) {
        return blockGenerators.generateLogicCompareLT(generateBlocklyCode(numericalExpressionA), 
                                                      generateBlocklyCode(numericalExpressionB));
    }

    function expressionGreaterThan(numericalExpressionA, numericalExpressionB) {
        return blockGenerators.generateLogicCompareGT(generateBlocklyCode(numericalExpressionA), 
                                                      generateBlocklyCode(numericalExpressionB));
    }

    function expressionEquals(numericalExpressionA, numericalExpressionB) {
        return blockGenerators.generateLogicCompareEQ(generateBlocklyCode(numericalExpressionA), 
                                                      generateBlocklyCode(numericalExpressionB));
    }

    function expressionOr(numericalExpressionA, numericalExpressionB) {
        return blockGenerators.generateLogicOperationOr(generateBlocklyCode(numericalExpressionA), 
                                                        generateBlocklyCode(numericalExpressionB));
    }

    function expressionAnd(numericalExpressionA, numericalExpressionB) {
        return blockGenerators.generateLogicOperationAnd(generateBlocklyCode(numericalExpressionA), 
                                                         generateBlocklyCode(numericalExpressionB));
    }

    function expressionSum(numericalExpressionA, numericalExpressionB) {
        return blockGenerators.generateMathArithmeticAdd(generateBlocklyCode(numericalExpressionA), 
                                                         generateBlocklyCode(numericalExpressionB));
    }

    function expressionDifference(numericalExpressionA, numericalExpressionB) {
        return blockGenerators.generateMathArithmeticMinus(generateBlocklyCode(numericalExpressionA), 
                                                           generateBlocklyCode(numericalExpressionB));
    }

    function expressionProduct(numericalExpressionA, numericalExpressionB) {
        return blockGenerators.generateMathArithmeticMultiply(generateBlocklyCode(numericalExpressionA), 
                                                              generateBlocklyCode(numericalExpressionB));
    }

    function expressionDivide(numericalExpressionA, numericalExpressionB) {
        return blockGenerators.generateMathArithmeticDivide(generateBlocklyCode(numericalExpressionA), 
                                                            generateBlocklyCode(numericalExpressionB));
    }

    function expressionPower(numericalExpressionA, numericalExpressionB) {
        return blockGenerators.generateMathArithmeticPower(generateBlocklyCode(numericalExpressionA), 
                                                           generateBlocklyCode(numericalExpressionB));
    }

    function statementBlock(statement) {
        return generateBlocklyCode(statement);
    }

    function statementJoin(statementA, statementB) {
        return blockGenerators.generateStatementBlock(generateBlocklyCode(statementA), 
                                                      generateBlocklyCode(statementB));
    }

    function statementForLessThan(variable, toNumericalExpression, doStatement) {
        return blockGenerators.generateControlsForBlockLessThan(variable, generateBlocklyCode(toNumericalExpression), 
                                                                generateBlocklyCode(doStatement));
    }

    function statementForFromTo(variable, fromNumericalExpression, toNumericalExpression, doStatement) {
        return blockGenerators.generateControlsForBlock(variable,
                                                        generateBlocklyCode(fromNumericalExpression),  
                                                        generateBlocklyCode(toNumericalExpression), 
                                                        generateBlocklyCode(doStatement));
    }

    function statementWhile(logicalExpression, doStatement) {
        return blockGenerators.generateControlsWhile(generateBlocklyCode(logicalExpression), 
                                                     generateBlocklyCode(doStatement));
    }

    function statementUntil(logicalExpression, doStatement) {
        return blockGenerators.generateControlsUntil(generateBlocklyCode(logicalExpression), 
                                                     generateBlocklyCode(doStatement));
    }

    function statementIf(logicalExpression, doStatement) {
        return blockGenerators.generateControlsIf(generateBlocklyCode(logicalExpression), 
                                                     generateBlocklyCode(doStatement));
    }

    function statementIncreaseVar(variable, numericalExpression) {
    	return blockGenerators.generateVariablesIncrease(variable, generateBlocklyCode(numericalExpression));
    }

    function statementDecreaseVar(variable, numericalExpression) {
    	return blockGenerators.generateVariablesDecrease(variable, generateBlocklyCode(numericalExpression));
    }

    function statementAssignment(variable, numericalExpression) {
    	return blockGenerators.generateVariablesSet(variable, generateBlocklyCode(numericalExpression));
    }

    var generateBlocklyCode = function(parsedStatement) {
        var partsArr = parsedStatement;
        var blockGenerator;
        var blockGeneratorFunc;
        var blockGeneratorArgIds;
        var blockGeneratorFuncArgs;

        while(partsArr && partsArr[0] && !(partsArr[0] in blockGeneratorArgs)) {
            partsArr = partsArr[1]; // pass through categories
        }

        if(partsArr) {
            blockGenerator = blockGeneratorArgs[ partsArr[0] ];
            blockGeneratorFunc = blockGenerator[0];
            blockGeneratorArgIds = blockGenerator[1];

            blockGeneratorFuncArgs = blockGeneratorArgIds.map(function(argId) {
                return partsArr[argId];
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

        console.log(XMLCode);

        startBlockField.innerHTML = XMLCode;
        Blockly.mainWorkspace.clear();
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, startBlockField);
    };
})(provide("controller"));

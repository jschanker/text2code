"use strict";

(function(namespace) {
    var numberOfUnclosedStatements = 0;

    var generateAttributeElement = function(type, name, value) {
        return "<" + type + " name = \"" + name + "\">" + value + "</" + type + ">"; 
    };

    namespace.exports.generateVariablesSet = function(variableName, valueBlock) {
        var XMLCode = "";
        XMLCode += "<block type = \"variables_set\">";
        XMLCode += generateAttributeElement("field", "VAR", variableName);
        XMLCode += generateAttributeElement("value", "VALUE", valueBlock);
        XMLCode += "<next>";
        numberOfUnclosedStatements++;
	  
        return XMLCode;
    };

    namespace.exports.generateVariablesGet = function(variableName) {
        var XMLCode = "";
        XMLCode += "<block type = \"variables_get\">";
        XMLCode += generateAttributeElement("field", "VAR", variableName);
        XMLCode += "</block>";
        return XMLCode;
    };

    namespace.exports.generateLogicBoolean = function(isTrue) {
        var XMLCode = "";
        var truthValue = isTrue ? "true" : "false"; 

        XMLCode += "<block type = \"logic_boolean\">";
        XMLCode += generateAttributeElement("field", "BOOL", truthValue);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateLogicBooleanTrue = function() {
        return namespace.exports.generateLogicBoolean(true);
    };

    namespace.exports.generateLogicBooleanFalse = function() {
        return namespace.exports.generateLogicBoolean();
    };

    namespace.exports.generateMathNumber = function(num) {
        var XMLCode = "";
        var num = (num !== undefined ? num : 0);

        XMLCode += "<block type = \"math_number\">";
        XMLCode += generateAttributeElement("field", "NUM", num);
        XMLCode += "</block>";

        return XMLCode;
    };

    var generateMathNumber = namespace.exports.generateMathNumber;

    namespace.exports.generateMathArithmetic = function(valueBlockA, valueBlockB, OP) {
        var XMLCode = "";
        XMLCode += "<block type = \"math_arithmetic\">";
        XMLCode += generateAttributeElement("value", "A", valueBlockA);
        XMLCode += generateAttributeElement("field", "OP", OP);
        XMLCode += generateAttributeElement("value", "B", valueBlockB);
        XMLCode += "</block>";
        return XMLCode;
    };

    namespace.exports.generateMathArithmeticAdd = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateMathArithmetic(valueBlockA, valueBlockB, "ADD");
    };

    namespace.exports.generateMathArithmeticMinus = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateMathArithmetic(valueBlockA, valueBlockB, "MINUS");
    };

    namespace.exports.generateMathArithmeticMultiply = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateMathArithmetic(valueBlockA, valueBlockB, "MULTIPLY");
    };

    namespace.exports.generateMathArithmeticDivide = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateMathArithmetic(valueBlockA, valueBlockB, "DIVIDE");
    };

    namespace.exports.generateMathArithmeticPower = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateMathArithmetic(valueBlockA, valueBlockB, "POWER");
    };

    namespace.exports.generateUpdateVariable = function(variable, valueBlock, OP) {
        return namespace.exports.generateVariablesSet(variable, 
               namespace.exports.generateMathArithmetic(namespace.exports.generateVariablesGet(variable), 
               	valueBlock, OP));
    };

    namespace.exports.generateVariablesIncrease = function(variableName, valueBlock) {
        return namespace.exports.generateUpdateVariable(variableName, valueBlock, "ADD");
    };

	namespace.exports.generateVariablesDecrease = function(variableName, valueBlock) {
        return namespace.exports.generateUpdateVariable(variableName, valueBlock, "MINUS");
    };

    namespace.exports.generateControlsForBlock = function(variableName, fromBlock, toBlock, doBlock, byBlock) {
        var XMLCode = "";

        XMLCode += "<block type = \"controls_for\">";
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
                                                          toBlock, doBlock);
    };

    namespace.exports.generateControlsWhileUntil = function(testBlock, doBlock, isUntil) {
        var XMLCode = "";
        var mode = isUntil ? "UNTIL" : "WHILE";
        testBlock = testBlock || namespace.exports.generateLogicBooleanFalse();
        doBlock = (doBlock !== undefined ? doBlock : "");

        XMLCode += "<block type = \"controls_whileUntil\">";
        XMLCode += generateAttributeElement("field", "MODE", mode);
        XMLCode += generateAttributeElement("value", "BOOL", testBlock);
        XMLCode += "<statement name = \"DO\">" + doBlock + "</next></block></statement>";
        XMLCode += "<next>";
        numberOfUnclosedStatements++;

        return XMLCode;
    };

    namespace.exports.generateControlsWhile = function(testBlock, doBlock) {
        return namespace.exports.generateControlsWhileUntil(testBlock, doBlock);
    };

    namespace.exports.generateControlsUntil = function(testBlock, doBlock) {
        return namespace.exports.generateControlsWhileUntil(testBlock, doBlock, true);
    };

    namespace.exports.generateControlsIf = function(testBlock, doBlock) {
        var XMLCode = "";

        testBlock = testBlock || namespace.exports.generateLogicBooleanTrue();
        doBlock = (doBlock !== undefined ? doBlock : "");

        XMLCode += "<block type = \"controls_if\">";
        XMLCode += generateAttributeElement("value", "IF0", testBlock);
        XMLCode += "<statement name = \"DO0\">" + doBlock + "</next></block></statement>";
        XMLCode += "<next>";
	    numberOfUnclosedStatements++;

        return XMLCode;
    };

    namespace.exports.generateLogicOperation = function(valueBlockA, valueBlockB, isOr) {
        var XMLCode = "";
        var OP = isOr ? "OR" : "AND";

        XMLCode += "<block type = \"logic_operation\">";
        XMLCode += generateAttributeElement("value", "A", valueBlockA);
        XMLCode += generateAttributeElement("field", "OP", OP);
        XMLCode += generateAttributeElement("value", "B", valueBlockB);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateLogicOperationOr = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateLogicOperation(valueBlockA, valueBlockB, true);
    };

    namespace.exports.generateLogicOperationAnd = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateLogicOperation(valueBlockA, valueBlockB);
    };

    namespace.exports.generateLogicCompare = function(valueBlockA, valueBlockB, OP) {
        var XMLCode = "";

        XMLCode += "<block type = \"logic_compare\">";
        XMLCode += generateAttributeElement("value", "A", valueBlockA);
        XMLCode += generateAttributeElement("field", "OP", OP);
        XMLCode += generateAttributeElement("value", "B", valueBlockB);
        XMLCode += "</block>";

        return XMLCode;
    };

    namespace.exports.generateLogicCompareLT = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateLogicCompare(valueBlockA, valueBlockB, "LT");
    };

    namespace.exports.generateLogicCompareGT = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateLogicCompare(valueBlockA, valueBlockB, "GT");
    };

    namespace.exports.generateLogicCompareEQ = function(valueBlockA, valueBlockB) {
        return namespace.exports.generateLogicCompare(valueBlockA, valueBlockB, "EQ");
    };

    namespace.exports.generateStatementBlock = function(statementBlockA, statementBlockB) {
    	numberOfUnclosedStatements++;
        return statementBlockA + statementBlockB;
    };

})(provide("block_generators"));

"use strict";

(function(namespace) {
	namespace.exports.generateControlsForBlock = function(blockAttributes, varIndex, fromIndex, toIndex, doIndex, byIndex) {
	  var XMLCode = "";
	  var variableName = blockAttributes[1][varIndex] ? blockAttributes[1][varIndex] : "i";
	  var fromValue = blockAttributes[1][fromIndex] ? generateCodeForStatement(blockAttributes[1][fromIndex]) : 
	                  "<block type = \"math_number\"><field name = \"NUM\">0</field></block>";
	  var toValue = blockAttributes[1][toIndex] ? generateCodeForStatement(blockAttributes[1][toIndex]) : 
	                  "<block type = \"math_number\"><field name = \"NUM\">1</field></block>";
	  var byValue = blockAttributes[1][byIndex] ? generateCodeForStatement(blockAttributes[1][byIndex]) : 
	                  "<block type = \"math_number\"><field name = \"NUM\">1</field></block>";
	  var statementAttr = blockAttributes[1][doIndex] ? generateCodeForStatement(blockAttributes[1][doIndex]) : "";

	  XMLCode += "<block type = \"controls_for\">";
	  //console.log(blockAttributes[1][0] + "\n" + blockAttributes[1][1] + "\n" + blockAttributes[1][2] + "\n" + blockAttributes[1][3][0]);
	  XMLCode += "<field name = \"VAR\">" + variableName + "</field>";
	  XMLCode += "<value name = \"FROM\">" + fromValue + "</value>";
	  XMLCode += "<value name = \"TO\">" + toValue + "</value>";
	  XMLCode += "<value name = \"BY\">" + byValue + "</value>";
	  //XMLCode += "<statement></statement>";
	  XMLCode += "<statement name = \"DO\">" + statementAttr + "</next></block></statement>";
	  //XMLCode += "</block>";
	  XMLCode += "<next>";
	  return XMLCode;
	};

	namespace.exports.generateControlsForBlockLessThan = function(blockAttributes) {
	  return namespace.exports.generateControlsForBlock(blockAttributes, 1, undefined, 3, 5);
	};

	namespace.exports.generateControlsForBlockFromTo = function(blockAttributes) {
	  return namespace.exports.generateControlsForBlock(blockAttributes, 1, 3, 5, 7);
	};

	namespace.exports.generateControlsWhileUntil = function(blockAttributes, testIndex, doIndex, isUntil) {
	  var XMLCode = "";
	  var mode = isUntil ? "UNTIL" : "WHILE";
	  var testValue = blockAttributes[1][testIndex] ? generateCodeForStatement(blockAttributes[1][testIndex]) : 
	                  "<block type = \"logic_boolean\"><field name = \"BOOL\">false</field></block>";
	  var statementAttr = blockAttributes[1][doIndex] ? generateCodeForStatement(blockAttributes[1][doIndex]) : "";

	  XMLCode += "<block type = \"controls_whileUntil\">";
	  XMLCode += "<field name = \"MODE\">" + mode + "</field>";
	  //console.log(blockAttributes[1][0] + "\n" + blockAttributes[1][1] + "\n" + blockAttributes[1][2] + "\n" + blockAttributes[1][3][0]);
	  XMLCode += "<value name = \"BOOL\">" + testValue + "</value>";
	  //XMLCode += "<statement></statement>";
	  XMLCode += "<statement name = \"DO\">" + statementAttr + "</next></block></statement>";
	  //XMLCode += "</block>";
	  XMLCode += "<next>";
	  return XMLCode;
	};

	namespace.exports.generateControlsWhile = function(blockAttributes) {
	  return namespace.exports.generateControlsWhileUntil(blockAttributes, 1, 3);
	};

	namespace.exports.generateControlsUntil = function(blockAttributes) {
	  return namespace.exports.generateControlsWhileUntil(blockAttributes, 1, 3, true);
	}

	namespace.exports.generateControlsIfBlock = function(blockAttributes) {
	  var XMLCode = "";
	  XMLCode += "<block type = \"controls_if\">";
	  if(blockAttributes[1][1]) {
	    XMLCode += "<value name = \"IF0\">" + generateCodeForStatement(blockAttributes[1][1]) + "</value>";
	  }
	  if(blockAttributes[1][3]) {
	    XMLCode += "<statement name = \"DO0\">" + generateCodeForStatement(blockAttributes[1][3]) + "</next></block></statement>";
	  }
	  XMLCode += "<next>";
	  //XMLCode += "</block>";
	  return XMLCode;
	}

	namespace.exports.generateVariablesGet = function(blockAttributes) {
	  var XMLCode = "";
	  XMLCode += "<block type = \"variables_get\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][0]) {
	    XMLCode += "<field name = \"VAR\">" + blockAttributes[1][0] + "</field>";
	  }
	  //XMLCode += "<value name = \"VALUE\">" + generateCodeForStatement(blockAttributes[1][3]) + "</value>";
	  XMLCode += "<next>";
	  return XMLCode;
	}

	namespace.exports.generateVariablesSet = function(blockAttributes) {
	  var XMLCode = "";
	  XMLCode += "<block type = \"variables_set\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][1]) {
	    XMLCode += "<field name = \"VAR\">" + blockAttributes[1][1] + "</field>";
	  }
	  XMLCode += "<value name = \"VALUE\">" + generateCodeForStatement(blockAttributes[1][3]) + "</value>";
	  XMLCode += "<next>";
	  return XMLCode;
	}

	namespace.exports.generateMathNumber = function(blockAttributes) {
	  var XMLCode = "";
	  XMLCode += "<block type = \"math_number\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][0]) {
	    XMLCode += "<field name = \"NUM\">" + blockAttributes[1][0] + "</field>";
	  }
	  XMLCode += "</block>";
	  return XMLCode;
	}

	namespace.exports.generateMathArithmetic = function(blockAttributes, OP) {
	  var XMLCode = "";
	  //console.log(blockAttributes);
	  XMLCode += "<block type = \"math_arithmetic\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][0]) {
	    XMLCode += "<value name = \"A\">" + generateCodeForStatement(blockAttributes[1][0]) + "</value>";
	  }

	  XMLCode += "<field name = \"OP\">" + OP + "</field>"; 

	  if(blockAttributes[1][2]) {
	    XMLCode += "<value name = \"B\">" + generateCodeForStatement(blockAttributes[1][2]) + "</value>";
	  }
	  XMLCode += "</block>";
	  return XMLCode;
	}

	namespace.exports.generateMathArithmeticAdd = function(blockAttributes) {
	  return namespace.exports.generateMathArithmetic(blockAttributes, "ADD");
	}

	namespace.exports.generateMathArithmeticMinus = function(blockAttributes) {
	  return namespace.exports.generateMathArithmetic(blockAttributes, "MINUS");
	}

	namespace.exports.generateMathArithmeticMultiply = function(blockAttributes) {
	  return namespace.exports.generateMathArithmetic(blockAttributes, "MULTIPLY");
	}

	namespace.exports.generateMathArithmeticDivide = function(blockAttributes) {
	  return namespace.exports.generateMathArithmetic(blockAttributes, "DIVIDE");
	}

	namespace.exports.generateMathArithmeticPower = function(blockAttributes) {
	  return namespace.exports.generateMathArithmetic(blockAttributes, "POWER");
	}

	// REFACTOR FUNCTION : USE generateVariablesGet, generateVariablesSet and generateMathArithmeticAdd

	namespace.exports.generateVariablesUpdateVariable = function(blockAttributes, OP) {
	  var XMLCode = "";
	  XMLCode += "<block type = \"variables_set\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][1]) {
	    XMLCode += "<field name = \"VAR\">" + blockAttributes[1][1] + "</field>";
	  }
	  XMLCode += "<value name = \"VALUE\">";


	  XMLCode += "<block type = \"math_arithmetic\">";

	  if(blockAttributes[1][1]) {
	    XMLCode += "<value name = \"A\"><block type = \"variables_get\"><field name = \"VAR\">" + 
	               blockAttributes[1][1] + "</field></block></value>";
	  }

	  XMLCode += "<field name = \"OP\">" + OP + "</field>"; 

	  if(blockAttributes[1][3]) {
	    XMLCode += "<value name = \"B\">" + generateCodeForStatement(blockAttributes[1][3]) + "</value>";
	  }
	  XMLCode += "</block>";


	  XMLCode += "</value>";

	  XMLCode += "<next>";

	  return XMLCode;
	}

	namespace.exports.generateVariablesIncrease = function(blockAttributes) {
	  return namespace.exports.generateVariablesUpdateVariable(blockAttributes, "ADD");
	}

	namespace.exports.generateVariablesDecrease = function(blockAttributes) {
	  return namespace.exports.generateVariablesUpdateVariable(blockAttributes, "MINUS");
	}

	namespace.exports.generateLogicBoolean = function(blockAttributes) {
	  var XMLCode = "";
	  XMLCode += "<block type = \"logic_boolean\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][0]) {
	    /* Quick fix - change later */
	    if(blockAttributes[1][0] == "no") {
	      blockAttributes[1][0] = "false";
	    } 
	    else if(blockAttributes[1][0] == "yes") {
	      blockAttributes[1][0] = "true";
	    }
	    /* end fix */
	    XMLCode += "<field name = \"BOOL\">" + blockAttributes[1][0] + "</field>";
	  }
	  XMLCode += "</block>";
	  return XMLCode;
	}

	namespace.exports.generateLogicOperationOr = function(blockAttributes) {
	  var XMLCode = "";
	  console.log(blockAttributes);
	  XMLCode += "<block type = \"logic_operation\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][0]) {
	    XMLCode += "<value name = \"A\">" + generateCodeForStatement(blockAttributes[1][0]) + "</value>";
	  }

	  XMLCode += "<field name = \"OP\">OR</field>"; 

	  if(blockAttributes[1][2]) {
	    XMLCode += "<value name = \"B\">" + generateCodeForStatement(blockAttributes[1][2]) + "</value>";
	  }
	  XMLCode += "</block>";
	  return XMLCode;
	}

	namespace.exports.generateLogicOperationAnd = function(blockAttributes) {
	  var XMLCode = "";
	  XMLCode += "<block type = \"logic_operation\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][0]) {
	    XMLCode += "<value name = \"A\">" + generateCodeForStatement(blockAttributes[1][0]) + "</value>";
	  }

	  XMLCode += "<field name = \"OP\">AND</field>"; 

	  if(blockAttributes[1][2]) {
	    XMLCode += "<value name = \"B\">" + generateCodeForStatement(blockAttributes[1][2]) + "</value>";
	  }
	  XMLCode += "</block>";
	  return XMLCode;
	}

	namespace.exports.generateLogicCompareLT = function(blockAttributes) {
	  var XMLCode = "";
	  XMLCode += "<block type = \"logic_compare\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][0]) {
	    XMLCode += "<value name = \"A\">" + generateCodeForStatement(blockAttributes[1][0]) + "</value>";
	  }

	  XMLCode += "<field name = \"OP\">LT</field>"; 

	  if(blockAttributes[1][2]) {
	    XMLCode += "<value name = \"B\">" + generateCodeForStatement(blockAttributes[1][2]) + "</value>";
	  }
	  XMLCode += "</block>";
	  return XMLCode;
	}

	namespace.exports.generateLogicCompareGT = function(blockAttributes) {
	  var XMLCode = "";
	  XMLCode += "<block type = \"logic_compare\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][0]) {
	    XMLCode += "<value name = \"A\">" + generateCodeForStatement(blockAttributes[1][0]) + "</value>";
	  }

	  XMLCode += "<field name = \"OP\">GT</field>"; 

	  if(blockAttributes[1][2]) {
	    XMLCode += "<value name = \"B\">" + generateCodeForStatement(blockAttributes[1][2]) + "</value>";
	  }
	  XMLCode += "</block>";
	  return XMLCode;
	}

	namespace.exports.generateLogicCompareEQ = function(blockAttributes) {
	  var XMLCode = "";
	  XMLCode += "<block type = \"logic_compare\">";
	  //XMLCode += "</block>";
	  if(blockAttributes[1][0]) {
	    XMLCode += "<value name = \"A\">" + generateCodeForStatement(blockAttributes[1][0]) + "</value>";
	  }

	  XMLCode += "<field name = \"OP\">EQ</field>"; 

	  if(blockAttributes[1][2]) {
	    XMLCode += "<value name = \"B\">" + generateCodeForStatement(blockAttributes[1][2]) + "</value>";
	  }
	  XMLCode += "</block>";
	  return XMLCode;
	}

	namespace.exports.addedClosings = 0; // HACK

	namespace.exports.generateStatementBlock = function(blockAttributes) {
	  namespace.exports.addedClosings++;
	  return generateCodeForStatement(blockAttributes[1][0]) + 
	         generateCodeForStatement(blockAttributes[1][2]);
	}

	namespace.exports.generateBracketStatement = function(blockAttributes) {
	  //alert("Got");
	  return generateCodeForStatement(blockAttributes[1][1]);
	}

})(provide("block_generators"));

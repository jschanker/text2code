"use strict";

// TODO
// 1. matchAny should match keywords first to allow for recursive definitions such as:
//    matchLogicalExpression, matchOr, matchLogicalExpression
// Cleanup
// 2. Indicies for code generation shouldn't be numeric literals
// 3. Code generation should be separated
// 4. Parts should be classified
// 5. Ordering of rules

function Part(processFunc, args) {
  this.processFunc = processFunc;
  this.args = args;
}

function generateControlsForBlock(blockAttributes, varIndex, fromIndex, toIndex, doIndex, byIndex) {
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
}

function generateControlsForBlockLessThan(blockAttributes) {
  return generateControlsForBlock(blockAttributes, 1, undefined, 3, 5);
}

function generateControlsForBlockFromTo(blockAttributes) {
  return generateControlsForBlock(blockAttributes, 1, 3, 5, 7);
}

function generateControlsWhileUntil(blockAttributes, testIndex, doIndex, isUntil) {
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
}

function generateControlsWhile(blockAttributes) {
  return generateControlsWhileUntil(blockAttributes, 1, 3);
}

function generateControlsUntil(blockAttributes) {
  return generateControlsWhileUntil(blockAttributes, 1, 3, true);
}

function generateControlsIfBlock(blockAttributes) {
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

function generateVariablesGet(blockAttributes) {
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

function generateVariablesSet(blockAttributes) {
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

function generateMathNumber(blockAttributes) {
  var XMLCode = "";
  XMLCode += "<block type = \"math_number\">";
  //XMLCode += "</block>";
  if(blockAttributes[1][0]) {
    XMLCode += "<field name = \"NUM\">" + blockAttributes[1][0] + "</field>";
  }
  XMLCode += "</block>";
  return XMLCode;
}

function generateMathArithmetic(blockAttributes, OP) {
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

function generateMathArithmeticAdd(blockAttributes) {
  return generateMathArithmetic(blockAttributes, "ADD");
}

function generateMathArithmeticMinus(blockAttributes) {
  return generateMathArithmetic(blockAttributes, "MINUS");
}

function generateMathArithmeticMultiply(blockAttributes) {
  return generateMathArithmetic(blockAttributes, "MULTIPLY");
}

function generateMathArithmeticDivide(blockAttributes) {
  return generateMathArithmetic(blockAttributes, "DIVIDE");
}

function generateMathArithmeticPower(blockAttributes) {
  return generateMathArithmetic(blockAttributes, "POWER");
}

// REFACTOR FUNCTION : USE generateVariablesGet, generateVariablesSet and generateMathArithmeticAdd

function generateVariablesUpdateVariable(blockAttributes, OP) {
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

function generateVariablesIncrease(blockAttributes) {
  return generateVariablesUpdateVariable(blockAttributes, "ADD");
}

function generateVariablesDecrease(blockAttributes) {
  return generateVariablesUpdateVariable(blockAttributes, "MINUS");
}

function generateLogicBoolean(blockAttributes) {
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

function generateLogicOperationOr(blockAttributes) {
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

function generateLogicOperationAnd(blockAttributes) {
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

function generateLogicCompareLT(blockAttributes) {
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

function generateLogicCompareGT(blockAttributes) {
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

function generateLogicCompareEQ(blockAttributes) {
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

var blockCodeGenerator = Object.freeze({
  CONTROLS_FOR              : generateControlsForBlock,
  CONTROLS_FOR_LESS_THAN    : generateControlsForBlockLessThan,
  CONTROLS_FOR_FROM_TO      : generateControlsForBlockFromTo,
  CONTROLS_WHILE            : generateControlsWhile,
  CONTROLS_UNTIL            : generateControlsUntil,
  CONTROLS_IF               : generateControlsIfBlock,
  VARIABLES_SET             : generateVariablesSet,
  VARIABLES_INCREASE        : generateVariablesIncrease,
  VARIABLES_DECREASE        : generateVariablesDecrease,
  VARIABLES_GET             : generateVariablesGet,
  MATH_NUMBER               : generateMathNumber,
  LOGIC_BOOLEAN             : generateLogicBoolean,
  LOGIC_OPERATION_OR        : generateLogicOperationOr,
  LOGIC_OPERATION_AND       : generateLogicOperationAnd,
  LOGIC_COMPARE_LT          : generateLogicCompareLT,
  LOGIC_COMPARE_GT          : generateLogicCompareGT,
  LOGIC_COMPARE_EQ          : generateLogicCompareEQ,
  MATH_ARITHMETIC_ADD       : generateMathArithmeticAdd,
  MATH_ARITHMETIC_MINUS     : generateMathArithmeticMinus,
  MATH_ARITHMETIC_MULTIPLY  : generateMathArithmeticMultiply,
  MATH_ARITHMETIC_DIVIDE    : generateMathArithmeticDivide,
  MATH_ARITHMETIC_POWER     : generateMathArithmeticPower
});

function PartSchema(parts, blockCodeGenerator, splitFirst, splitPartIndex) {
  this.parts = parts;
  this.blockCodeGenerator = blockCodeGenerator;
  this.splitFirst = splitFirst; // HACK : Fix later
  this.splitPartIndex = splitPartIndex;
}

function matchAndRemove(text, arr, params) {
  for(var i = 0; i < arr.length; i++) {
    var match = RegExp(arr[i]).exec(text);
  	if(match && match.index == 0) {
  	  params.push([match]);
  	  return text.substring(match[0].length);
  	}
  }

  return null;
}

function matchControlsFor(text, params) {
  var keywordArr = ["for each", "for every", "go through every", "go through each", 
                    "go through", "every", "for all", "all", "each", "for"];
  return matchAndRemove(text, keywordArr, params);
}

function matchControlsWhile(text, params) {
  var keywordArr = ["repeat while", "do while", "while", "keep going while"];
  return matchAndRemove(text, keywordArr, params);
}

function matchControlsUntil(text, params) {
  var keywordArr = ["repeat until", "do until", "until", "keep going until"];
  return matchAndRemove(text, keywordArr, params);
}

function matchControlsIf(text, params) {
  var keywordArr = ["if"];
  return matchAndRemove(text, keywordArr, params);
}

function matchVariable(text, params) {
  return matchAndRemove(text, [/[A-Za-z_]\w*/], params);
}

function matchComma(text, params) {
  return matchAndRemove(text, ",", params);
}

function matchVariablesSet(text, params) {
  var keywordArr = ["set"];
  return matchAndRemove(text, keywordArr, params);
}

function matchInteger(text, params) {
  return matchAndRemove(text, [/-\d+|\d+/], params);
}

function matchBoolean(text, params) {
  var keywordArr = ["true", "false", "yes", "no"];
  return matchAndRemove(text, keywordArr, params);
}

function matchFrom(text, params) {
  var keywordArr = ["from"];
  return matchAndRemove(text, keywordArr, params);
}

function matchTo(text, params) {
  var keywordArr = ["to"];
  return matchAndRemove(text, keywordArr, params);
}

function matchIncrease(text, params) {
  var keywordArr = ["increase", "augment", "increment"];
  return matchAndRemove(text, keywordArr, params);
}

function matchDecrease(text, params) {
  var keywordArr = ["decrease", "decrement"];
  return matchAndRemove(text, keywordArr, params);
}

function matchBy(text, params) {
  var keywordArr = ["by"];
  return matchAndRemove(text, keywordArr, params);
}

function matchOr(text, params) {
  var keywordArr = ["or"];
  return matchAndRemove(text, keywordArr, params);
}

function matchAnd(text, params) {
  var keywordArr = ["and"];
  return matchAndRemove(text, keywordArr, params);
}

function matchThen(text, params) {
  var keywordArr = ["then"];
  return matchAndRemove(text, keywordArr, params);
}

function matchLessThan(text, params) {
  var keywordArr = ["is less than", "less than", "<"];

  return matchAndRemove(text, keywordArr, params);  
}

function matchGreaterThan(text, params) {
  var keywordArr = ["is greater than", "greater than", "is more than", "exceeds", "more than", ">"];

  return matchAndRemove(text, keywordArr, params);  
}

function matchEqualsTo(text, params) {
  var keywordArr = ["is equal to", "equals to", "equals", "="];

  return matchAndRemove(text, keywordArr, params);  
}

function matchPlus(text, params) {
  var keywordArr = ["\\+", "plus", "add"];

  return matchAndRemove(text, keywordArr, params);  
}

function matchMinus(text, params) {
  var keywordArr = ["-", "minus", "subtract"];

  return matchAndRemove(text, keywordArr, params);  
}

function matchMultiply(text, params) {
  var keywordArr = ["\\*", "multiply", "times"];

  return matchAndRemove(text, keywordArr, params);  
}

function matchDivide(text, params) {
  var keywordArr = ["\\/", "divided by", "divide"];

  return matchAndRemove(text, keywordArr, params);  
}

function matchPower(text, params) {
  var keywordArr = ["\\^", "raised to the", "to the", "power"];

  return matchAndRemove(text, keywordArr, params);  
}

function matchPowerEnd(text, params) {
  var keywordArr = ["power"];

  return matchAndRemove(text, keywordArr, params);  
}

// HACK : REMOVE FUNCTION LATER
function matchAtomicBooleanExpression(text, params) {
  var partSchemas = [];
  partSchemas.push(new PartSchema([matchNumericalExpression, matchLessThan, matchNumericalExpression], 
                                  blockCodeGenerator.LOGIC_COMPARE_LT)); // NOT ATOMIC, but hack for now
  partSchemas.push(new PartSchema([matchNumericalExpression, matchGreaterThan, matchNumericalExpression], 
                                  blockCodeGenerator.LOGIC_COMPARE_GT)); // NOT ATOMIC, but hack for now
  partSchemas.push(new PartSchema([matchNumericalExpression, matchEqualsTo, matchNumericalExpression], 
                                  blockCodeGenerator.LOGIC_COMPARE_EQ)); // NOT ATOMIC, but hack for now
  partSchemas.push(new PartSchema([matchBoolean], blockCodeGenerator.LOGIC_BOOLEAN));
  partSchemas.push(new PartSchema([matchVariable], blockCodeGenerator.VARIABLES_GET));

  return matchAny(text, params, partSchemas);
}

// HACK : REMOVE FUNCTION LATER
function matchAtomicNumericalExpression(text, params) {
  var partSchemas = [];

  partSchemas.push(new PartSchema([matchInteger], blockCodeGenerator.MATH_NUMBER));
  partSchemas.push(new PartSchema([matchVariable], blockCodeGenerator.VARIABLES_GET));

  //console.log(matchAny(text, params, partSchemas));

  return matchAny(text, params, partSchemas);
}

function matchNumericalExpression(text, params) {
  var partSchemas = [];
  partSchemas.push(new PartSchema([matchAtomicNumericalExpression, matchPlus, matchNumericalExpression], 
                                  blockCodeGenerator.MATH_ARITHMETIC_ADD));
  partSchemas.push(new PartSchema([matchAtomicNumericalExpression, matchMinus, matchNumericalExpression], 
                                  blockCodeGenerator.MATH_ARITHMETIC_MINUS));
  partSchemas.push(new PartSchema([matchAtomicNumericalExpression, matchMultiply, matchNumericalExpression], 
                                  blockCodeGenerator.MATH_ARITHMETIC_MULTIPLY));
  partSchemas.push(new PartSchema([matchAtomicNumericalExpression, matchDivide, matchNumericalExpression], 
                                  blockCodeGenerator.MATH_ARITHMETIC_DIVIDE));
  //partSchemas.push(new PartSchema([matchAtomicNumericalExpression, matchPower, matchNumericalExpression, matchPowerEnd], 
  //                                blockCodeGenerator.MATH_ARITHMETIC_POWER));
  partSchemas.push(new PartSchema([matchAtomicNumericalExpression, matchPower, matchNumericalExpression], 
                                  blockCodeGenerator.MATH_ARITHMETIC_POWER));

  partSchemas.push(new PartSchema([matchInteger], blockCodeGenerator.MATH_NUMBER));
  partSchemas.push(new PartSchema([matchVariable], blockCodeGenerator.VARIABLES_GET));

  //console.log(matchAny(text, params, partSchemas));

  return matchAny(text, params, partSchemas);
}

function matchLogicalExpression(text, params) {
  var partSchemas = [];

  partSchemas.push(new PartSchema([matchLogicalExpression, matchOr, matchLogicalExpression], 
                                  blockCodeGenerator.LOGIC_OPERATION_OR, /or(.+)/i, 1));

  partSchemas.push(new PartSchema([matchLogicalExpression, matchAnd, matchLogicalExpression], 
                                  blockCodeGenerator.LOGIC_OPERATION_AND, /and(.+)/i, 1));

  //partSchemas.push(new PartSchema([matchAtomicBooleanExpression, matchAnd, matchLogicalExpression], 
  //                                blockCodeGenerator.LOGIC_OPERATION_AND));

  partSchemas.push(new PartSchema([matchAtomicNumericalExpression, matchLessThan, matchNumericalExpression], 
                                  blockCodeGenerator.LOGIC_COMPARE_LT));
  partSchemas.push(new PartSchema([matchAtomicNumericalExpression, matchGreaterThan, matchNumericalExpression], 
                                  blockCodeGenerator.LOGIC_COMPARE_GT));
  partSchemas.push(new PartSchema([matchAtomicNumericalExpression, matchEqualsTo, matchNumericalExpression], 
                                  blockCodeGenerator.LOGIC_COMPARE_EQ));
  partSchemas.push(new PartSchema([matchBoolean], blockCodeGenerator.LOGIC_BOOLEAN));
  //partSchemas.push(new PartSchema([matchVariable], blockCodeGenerator.VARIABLES_GET)); // WANT TO ADD FOR BOOLEAN VARIABLES

  return matchAny(text, params, partSchemas);
}

function matchGeneralExpression(text, params) {
  // TODO: Add other expressions
  // TODO: Fix conflict for floats (period terminates statement)

  //var numExpression = matchNumericalExpression(text, params);
  //return numExpression !== null ? numExpression : matchLogicalExpression(text, params);
  var boolExpression = matchLogicalExpression(text, params);
  return boolExpression !== null ? boolExpression : matchNumericalExpression(text, params);


  //return ( (matchNumericalExpression(text, params) + " ") || matchLogicalExpression(text, params) );

  //var partSchemas = [];
  //partSchemas.push(new PartSchema([matchInteger], blockCodeGenerator.MATH_NUMBER));
  //partSchemas.push(new PartSchema([matchBoolean], blockCodeGenerator.LOGIC_BOOLEAN));

  //return matchAny(text, params, partSchemas);

  //return matchNumericalExpression(text, params) || matchLogicalExpression(text, params);
  //alert(matchLogicalExpression(text, params));
  //alert("Text: " + ( matchNumericalExpression(text, params) || "abc" || matchLogicalExpression(text, params) ) );
  //return matchLogicalExpression(text, params) || matchNumericalExpression(text, params);
  //return matchNumericalExpression(text, params) || matchLogicalExpression(text, params);
}

function matchAny(text, params, partSchemas) {
  var i = 0;
  var j;
  var textRemaining = text;
  var foundMatchingSchema = false;
  params = params || [];
  var statementParams;

  while(!foundMatchingSchema && i < partSchemas.length) {
  	statementParams = [];
  	textRemaining = text;
  	j = 0;

  	partSchemas[i].parts.forEach(function(){
      statementParams.push([]);
  	});

    // BEGIN HACK

    if(partSchemas[i].splitFirst) {
      var textRemainingArr = text.split(RegExp(partSchemas[i].splitFirst));
      //console.log("Text: " + textRemainingArr[0] + " : " + textRemainingArr[1] + " # " + partSchemas[i].splitPartIndex);
      if(textRemainingArr.length > 1) {
        textRemaining = textRemainingArr[0];
        while(textRemaining !== null && j < partSchemas[i].splitPartIndex) {
          textRemaining = textRemaining.trim().toLowerCase();
          textRemaining = partSchemas[i].parts[j](textRemaining, statementParams[j]);
          j++;
        }
        //console.log("Text1: ", textRemaining);
        if(textRemaining !== null) {
          j += 1;
          textRemaining = textRemainingArr[1];
          //console.log("Text2: ", textRemaining);
          while(textRemaining !== null && j < partSchemas[i].parts.length) {
            textRemaining = textRemaining.trim().toLowerCase();
            textRemaining = partSchemas[i].parts[j](textRemaining, statementParams[j]);
            j++;
          }
          //console.log("Text3: ", textRemaining);
        } 
      } else {
        textRemaining = null;
      }
    }

    // END HACK

    else {
  	  while(textRemaining !== null && j < partSchemas[i].parts.length) {
  	    textRemaining = textRemaining.trim().toLowerCase();
  	    textRemaining = partSchemas[i].parts[j](textRemaining, statementParams[j]);
  	    j++;
  	  }
    }

  	foundMatchingSchema = (textRemaining !== null);
  	i++;
  }

  if(foundMatchingSchema) {
  	params.push(partSchemas[i-1].blockCodeGenerator);
  	params.push(statementParams);
  	//alert("Found match");
  	return textRemaining;
  }

  return null;
  //return foundMatchingSchema ? textRemaining : null;  
}

function matchGeneralStatement(text, params) {
  var partSchemas = [];
  partSchemas.push( new PartSchema([matchVariablesSet, matchVariable, matchTo, matchGeneralExpression], 
  	                                blockCodeGenerator.VARIABLES_SET) );
  partSchemas.push( new PartSchema([matchIncrease, matchVariable, matchBy, matchGeneralExpression],
                                    blockCodeGenerator.VARIABLES_INCREASE) );
  partSchemas.push( new PartSchema([matchDecrease, matchVariable, matchBy, matchGeneralExpression],
                                    blockCodeGenerator.VARIABLES_DECREASE) );
  partSchemas.push( new PartSchema([matchControlsFor, matchVariable, matchLessThan, matchNumericalExpression,
                                    matchComma, matchGeneralStatement], 
                                    blockCodeGenerator.CONTROLS_FOR_LESS_THAN) );
  partSchemas.push( new PartSchema([matchControlsFor, matchVariable, matchFrom, matchNumericalExpression, 
                                    matchTo, matchNumericalExpression, matchComma, matchGeneralStatement], 
                                    blockCodeGenerator.CONTROLS_FOR_FROM_TO) );
  partSchemas.push( new PartSchema([matchControlsWhile, matchLogicalExpression, matchComma, matchGeneralStatement],
                                    blockCodeGenerator.CONTROLS_WHILE) );
  partSchemas.push( new PartSchema([matchControlsUntil, matchLogicalExpression, matchComma, matchGeneralStatement],
                                    blockCodeGenerator.CONTROLS_UNTIL) );
  //partSchemas.push( new PartSchema([matchControlsFor, matchVariable, matchComma, matchGeneralStatement], 
	//                                  blockCodeGenerator.CONTROLS_FOR) );
  partSchemas.push( new PartSchema([matchControlsIf, matchGeneralExpression, matchComma, matchGeneralStatement],
                                    blockCodeGenerator.CONTROLS_IF) );
  partSchemas.push( new PartSchema([matchControlsIf, matchGeneralExpression, matchThen, matchGeneralStatement],
                                    blockCodeGenerator.CONTROLS_IF, /then(.+)/i, 2) );

  return matchAny(text, params, partSchemas);
}

function generateCodeForStatement(blockAttributes) {
  //console.log("Running " + blockAttributes[0]);
  return blockAttributes[0] ? blockAttributes[0](blockAttributes) : "";
}

function processText() {
  var text = document.getElementById("pseudocode").value;
  var statements = text.split(/\.\s*|\r\n|\r|\n/);
  var params = [];
  var XMLCode = "";
  var startBlockField = document.getElementById("startBlocks");

  statements.forEach(function(statement) {
  	params.push([]);
  	matchGeneralStatement(statement, params[params.length-1]);
  });

  params.forEach(function(blockAttributes) {
    XMLCode += generateCodeForStatement(blockAttributes);
  });
  params.forEach(function(blockAttributes) {
    XMLCode += "</next></block>";
  });

  console.log(XMLCode);

  startBlockField.innerHTML = XMLCode;
  Blockly.mainWorkspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, startBlockField);
}

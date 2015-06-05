"use strict";

function Part(processFunc, args) {
  this.processFunc = processFunc;
  this.args = args;
}

function generateControlsForBlock(blockAttributes) {
  var XMLCode = "";
  XMLCode += "<block type = \"controls_for\">";
  //console.log(blockAttributes[1][0] + "\n" + blockAttributes[1][1] + "\n" + blockAttributes[1][2] + "\n" + blockAttributes[1][3][0]);
  XMLCode += "<field name = \"VAR\">" + blockAttributes[1][1] + "</field>";
  XMLCode += "<value name = \"FROM\"><block type = \"math_number\"><field name = \"NUM\">0</field></block></value>";
  XMLCode += "<value name = \"TO\"><block type = \"math_number\"><field name = \"NUM\">2</field></block></value>";
  XMLCode += "<value name = \"BY\"><block type = \"math_number\"><field name = \"NUM\">1</field></block></value>";
  //XMLCode += "<statement></statement>";
  if(blockAttributes[1][3]) {
    XMLCode += "<statement name = \"DO\">" + generateCodeForStatement(blockAttributes[1][3]) + "</next></block></statement>";
  }
  //XMLCode += "</block>";
  XMLCode += "<next>";
  return XMLCode;
}

function generateControlsIfBlock(blockAttributes) {
  var XMLCode = "";
  XMLCode += "<block type = \"controls_if\"><next>";
  //XMLCode += "</block>";
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

var blockCodeGenerator = Object.freeze({
  CONTROLS_FOR  : generateControlsForBlock,
  CONTROLS_IF   : generateControlsIfBlock,
  VARIABLES_SET : generateVariablesSet,
  MATH_NUMBER   : generateMathNumber 
});

function PartSchema(parts, blockCodeGenerator) {
  this.parts = parts;
  this.blockCodeGenerator = blockCodeGenerator;
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
  var keywordArr = ["for each", "for", "go through every", "go through each", 
                    "go through", "for every", "every", "for all", "all", "each"];
  return matchAndRemove(text, keywordArr, params);
}

function matchControlsIf(text, params) {
  var keywordArr = ["if"];
  return matchAndRemove(text, keywordArr, params);
}

function matchVariable(text, params) {
  return matchAndRemove(text, [/\w+/], params);
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

function matchTo(text, params) {
  var keywordArr = ["to"];
  return matchAndRemove(text, keywordArr, params);
}

function matchGeneralExpression(text, params) {
  // TODO: Add other expressions
  // TODO: Fix conflict for floats (period terminates statement)

  var partSchemas = [];
  partSchemas.push(new PartSchema([matchInteger], blockCodeGenerator.MATH_NUMBER));

  return matchAny(text, params, partSchemas);
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
  	while(textRemaining !== null && j < partSchemas[i].parts.length) {
  	  textRemaining = textRemaining.trim();
  	  textRemaining = partSchemas[i].parts[j](textRemaining, statementParams[j]);
  	  j++;
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
  partSchemas.push( new PartSchema([matchControlsFor, matchVariable, matchComma, matchGeneralStatement], 
	                                blockCodeGenerator.CONTROLS_FOR) );
  partSchemas.push( new PartSchema([matchControlsIf], blockCodeGenerator.CONTROLS_IF) );

  return matchAny(text, params, partSchemas);
}

function generateCodeForStatement(blockAttributes) {
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

  startBlockField.innerHTML = XMLCode;
  Blockly.mainWorkspace.clear();
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, startBlockField);
}

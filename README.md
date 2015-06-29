# text2code
Natural language processor that compiles pseudocode to Blockly code blocks.

Blockly base code from: https://github.com/google/blockly/

Future of app : Voice ==> Text (Pseudocode) ==> Blockly code blocks ==> Python, JavaScript, etc.

How to use and currently supported conversions:
--
* Separate each statement that you want processed in isolation with a period or a new line.  The program will attempt to parse a statement on its own line (or between periods) even if pervious ones were unable to be handled.  Currently, this is the only use for periods.  For example, floats cannot be expressed in decimal and strings cannot contain periods at the present time.  Statements that cannot be parsed produce no Blockly code.
* Separate statements that are part of a statement block with ; and surround the block with braces ({ and }). These statements are processed together so a mistake in one of them can cause failure for the parsing of the entire block.
* Expressions can be grouped together with parentheses (or not).
* Text is converted to lowercase while processing so capitalization is ignored.

* Variable names must start with a letter or an underscore and contain only alphanumeric characters or underscores (no spaces are allowed).  Variables can hold the value of an expression of any currently supported type (numeric, boolean, and string).
* Only integers are allowed for atomic numeric literals.  I.e., no numbers can be expressed in decimal at this time (see above note).  However, fractions are allowed so e.g., 3.14 can be expressed as 314/100.
* True can be expressed as "true" and "yes" while false can be expressed as "false" and "no".
* String literals should be placed in between " and ".  Almost all characters except for line breaks and periods can be part of a string literal.
* The phrases "is less than", "is greater than", "is greater than or equal to", "is less than or equal to", "is equal to", "is not equal to", "is divisible by" ("is a factor of", "is a multiple of") can go between any two numerical expressions (alternatively <, >, >=, <= for the first few) to produce boolean expressions.  "Is equal to" and "is not equal to" can go between any types of expressions.  (No type checking is done to see if the values on the left and right are of matching types.)  "Is prime", "is even", "is odd", "is positive", and "is negative" can proceed any numeric expression to form a boolean expression. 
* Boolean expressions can be combined by placing an "or" or an "and" between them.  A not can be placed in the *front* of any boolean expression. For example, "Set y to not -15 is divisible by 7." can be processed but "Set y to -15 is not divisible by 7." cannot right now.  Not greater than, Not less than and not equal are all fine.
* Numeric expressions can be combined by separating them with +, -, *, ^ (for exponentiation), and the word "mod".  You can also enter variations for some of these operations such as plus for +.  You can use a prefix of sqrt or "square root of" before a numeric expression.  For example: "Set x to the square root of (the remainder of 42 divided by 20 plus 5)" can be processed.
* Strings can be combined with "+" and phrases such as "joined with".  Examples for the syntax for supported string functions is as follows ("bc" and "abcdeabc" can be replaced with any string expression):
    * the first letter of "abcdeabc"  (a)
    * the last letter of "abcdeabc"   (e)
    * the letter at position 3 of "abcde"   (c)
    * substring of "abcdeabc" from position 2 to position 4 (bcd)
    * position of first "bc" in "abcdeabc"  (2)
    * position of last "bc" in "abcdeabc"   (7)

* Variable assignments : Variables can be assigned to an expression of any supported type.  Variable assignments must be of the form "Set *variableName* to *expression*."
    * Set c to the square root of (a times a + b times b).
    * Set str to "abcde" joined with "abc".
    * Set isPositiveOrMultipleOfTen to num is divisible by 5 and num mod 2 equals 0 or num > 0.
* Variables can be increased or decreased as follows: "Increase *variableName* by *numeric expression*" or "Decrease *variableName* by *numeric expression* .  The numeric expression can be any supported one.
   * Increase x by the square root of y plus 7 divided by 10.
   * Decrease x by position of first "bc" in "abcdeabc" mod 2.
* Conditional statements : The condition of an if/else if statement can be any supported boolean expression and the statement to do conditionally can be any one (including a block).  An if statement can be written as "If *boolean expression* then *statement*".  It can be followed by any number of statements of the form "Otherwise if *boolean expression* then *statement*" and an optional "Otherwise *statement*".  If/else if/else statements must be separated by semicolons.
    * If num is divisible by 2 and num > 0 then print "num is a positive even integer"; otherwise if num is divisible by 2 and num is less than 0 then output "num is a negative even integer"; otherwise if num is not equal to 0 then output "num is not even"; otherwise {set isZero to true; print "num equals zero"}.
* While/Until statements : The loop guard of a while or until statement can be any supported boolean expression and the statement to (potentially repeat) can be any one (including a block).  A while statement can be written as while *boolean expression*, *statement*.  Similarly an until statement can be written as until *boolean expression*, *statement*.  The comma must be present for the statement to be parsed.
   * While x is less than or equal to 0, increase x by 10.
   * Until x is greater than 0, increase x by 10.
* For loops: For loops can be of the form for each *variableName* from *numeric expression* to *numeric expression*, *statement* or for each *variableName* less than *numeric expression*, *statement*.  Both forms assume step values of 1 with the latter assuming a starting value of 0.  The comma is required in both cases.
* Expressions can be outputted by typing "output *expression*" or "print *expression*".

Some variations of these forms are also possible as can be seen by examining the statementPartSchema object in parser.js.  For example, consider the following from the statementGeneral category:

* statementForLessThan   :  ["for", "variable", "lessThan", "expressionNumerical", "comma", "statementGeneral"],

A syntactically valid form consists of any match in the for token array ("for each", "for every", "go through every", "go through each", "go through", "every", "for all", "all", "each", and "for") followed by one or more spaces and any match of the regular expression for the variable token (/[A-Za-z_]\w*/) (i.e., a letter or underscore followed by 0 or more alphanumeric or underscore characters) followed by the lessThan possibilities of "is less than", "less than", or "<" followed by one or more any of the valid forms from the expressionNumerical category followed by a comma and then any of the valid statement forms from the statementGeneral category:
    * For every num < 10, {print num; increase sum by num}.
    
As an implementation note, tokens should be categorized and processed differently in a future version.  Currently, the program tries to match each word (or regular expression) in the order that it appears.

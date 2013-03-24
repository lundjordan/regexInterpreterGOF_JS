#A regex interpreter in Javascript

##This is a translation of the interpreter pattern example from GOF Design Patterns 
(originally written in Smalltalk)

###root obj:
    regex

###main obj types defined:
    RegularExpression (parent)
    SequenceExpression
    AlternationExpression
    RepetitionExpression
    LiteralExpression

This example monkeypatch's type String to help build pattern operations

###To use:
    1. run the redexInterpreter.js file:
    2. envoke regex.compile(pattern, inputString)
        * pattern - expressions available (can be chained):
            * literal: ""
            * alternation: "someLiteral".and("someLiteral")
            * sequence: "someLiteral".and("someLiteral")
            * repetition: "someLiteral".repeat()
        * inputString - String to be match against
    3. regex.compile() returns the result

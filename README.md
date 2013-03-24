#A regex interpreter in Javascript

##This is a translation of the interpreter pattern example from GOF Design Patterns 
(originally written in Smalltalk)

###root obj:
    regex

###main obj types defined:
    regex.RegularExpression (parent)
    regex.SequenceExpression
    regex.AlternationExpression
    regex.RepetitionExpression
    regex.LiteralExpression

This example monkeypatch's String to help build patterns

###To use:
    1. run the redexInterpreter.js file:
    2. envoke regex.compile(pattern, inputString)
        * pattern - expressions available (can be chained):
            * literal: ""
            * alternation: "someLiteral".or("someLiteral")
            * sequence: "someLiteral".and("someLiteral")
            * repetition: "someLiteral".repeat()
        * inputString - String to be match against
    3. regex.compile() returns the result

###example:
```javascript
result1 = regex.compile("a".repeat().and("abc"), "bc"); // should fail
result2 = regex.compile("a".repeat().and("abc"), "abc"); // should pass

console.log(result1); // output
                        /* Input: "bc"
                           Pattern: regex.SequenceExpression
                             _expression1: regex.RepetitionExpression
                             _expression2: regex.LiteralExpression
                           Result: "no match found"
                         */
console.log(result2); // output
                        /* Input: "abc"
                           Pattern: regex.SequenceExpression
                             _expression1: regex.RepetitionExpression
                             _expression2: regex.LiteralExpression
                           Result: "found match"
                         */
```


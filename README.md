
>a regex interpreter in Javascript

this is a translation of a interpreter pattern example from GOF Design Patterns (originally written in Smalltalk)

root obj: regex

main obj types defined:
    RegularExpression (parent)
    SequenceExpression
    AlternationExpression
    RepetitionExpression
    LiteralExpression

this example monkeypatch's type String to help build pattern operations

to use compile redexInterpreter and then call:
    1) regex.compile() with a pattern and an input of type String to match against
    2) regex.compile() returns a the result

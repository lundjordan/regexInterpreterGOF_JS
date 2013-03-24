var regex = regex || {}

// Stream obj
regex.Stream = function(stringValue, pointerIndex) {
    this.stringValue = stringValue;
    this.pointerIndex = pointerIndex || 0;
};
regex.Stream.prototype.nextAvailable = function(pointerAdvanceLength) {
    var returnString, startSubstrIndex = this.pointerIndex,
        finishSubstrIndex = this.pointerIndex + pointerAdvanceLength;
    returnString = this.stringValue.substr(startSubstrIndex, pointerAdvanceLength);
    this.pointerIndex = finishSubstrIndex;
    return returnString;
};
//

// abstract parent
regex.RegularExpression = function() {
};
regex.RegularExpression.prototype.match = function(inputState) {
};
regex.RegularExpression.prototype.and = function(aNode) {
    return new regex.SequenceExpression(this, aNode.asRExp());
};
regex.RegularExpression.prototype.repeat = function() {
    return new regex.RepetitionExpression(this);
};
regex.RegularExpression.prototype.or = function(aNode) {
    return new regex.AlternationExpression(this, aNode.asRExp());
};
regex.RegularExpression.prototype.asRExp = function() {
    return this;
};
//

// XXX HARDCORE JS MONKEY-PATCHING
String.prototype.and = function(aNode) {
    return new regex.SequenceExpression(this.asRExp(), aNode.asRExp());
};
String.prototype.repeat = function() {
    return new regex.RepetitionExpression(this.asRExp());
};
String.prototype.or = function(aNode) {
    return new regex.AlternationExpression(this.asRExp(), aNode.asRExp());
};
String.prototype.asRExp = function(inputState) {
    return new regex.LiteralExpression(this.valueOf());
};
//


// literalExpression
regex.LiteralExpression = function(literal) {
    this._components = literal; // string for comparing
};
regex.LiteralExpression.prototype = new regex.RegularExpression();
regex.LiteralExpression.prototype.match = function(inputState) {
    var finalState = [], tStream, nextAvailable;
    for (var i = 0, n = inputState.length; i < n; i++) {
        tStream = new regex.Stream(inputState[i].stringValue, inputState[i].pointerIndex);
        nextAvailable = tStream.nextAvailable(this._components.length);
        if (nextAvailable === this._components) {
            finalState.push(tStream);
        }
    }
    return finalState;
};
//

// sequenceExpression
regex.SequenceExpression = function(expression1, expression2) {
    this._expression1 = expression1;
    this._expression2 = expression2;
};
regex.SequenceExpression.prototype = new regex.RegularExpression();
regex.SequenceExpression.prototype.match = function(inputState) {
    return this._expression2.match(this._expression1.match(inputState));
};

// alternationExpression
regex.AlternationExpression = function(alternative1, alternative2) {
    this._alternative1 = alternative1;
    this._alternative2 = alternative2;
};
regex.AlternationExpression.prototype = new regex.RegularExpression();
regex.AlternationExpression.prototype.match = function(inputState) {
    var finalState;
    finalState = this._alternative1.match(inputState);
    finalState = finalState.concat(this._alternative2.match(inputState));
    return finalState;
};


// repetitionExpression
regex.RepetitionExpression = function(repetition) {
    this._repetition = repetition;
};
regex.RepetitionExpression.prototype = new regex.RegularExpression();
regex.RepetitionExpression.prototype.match = function(inputState) {
    var finalState = [], aState = inputState, tStream;

    // console.log(aState);
    // now let's assign finalState as a deep copy of aState
    // in a really manual hard coded sad way for lack of knowing any better :(
    for (var i = 0, n = aState.length; i < n; i++) {
        tStream = new regex.Stream(aState[i].stringValue, aState[i].pointerIndex);
        finalState.push(tStream);
    }

    while (aState.length > 0) {
        aState = this._repetition.match(aState);
        finalState = finalState.concat(aState);
    };

    return finalState;
};


// regEx1 = "a".repeat().and("abc").or("dog");

regex.compile = function(pattern, stringInput) {
    inputState = [new regex.Stream(stringInput)];
    matches = pattern.match(inputState)
    for (var i = 0, n = matches.length; i < n; i++) {
        streamingCharsUnmatched = matches[i].stringValue.length -
            matches[i].pointerIndex;
        if (streamingCharsUnmatched === 0) {
            return {
                Result: "found match",
                Pattern: pattern,
                Input: stringInput
            }
        }
    }
    return {
        Result: "no match found",
        Pattern: pattern,
        Input: stringInput
    }
};

// some testing examples
result1 = regex.compile("a".repeat().and("abc"), "aaa"); // should fail
result2 = regex.compile("a".repeat().and("abc"), "bc"); // should fail
result3 = regex.compile("a".repeat().and("abc"), "abc"); // should pass
result4 = regex.compile("a".repeat().and("abc"), "aaabc"); // should pass
result5 = regex.compile("cat".or("dog"), "catdog"); // should fail
result6 = regex.compile("cat".or("dog"), "catt"); // should fail
result7 = regex.compile("cat".or("dog"), "dog"); // should pass
result8 = regex.compile("cat".or("dog"), "cat"); // should pass
console.log(result1);
console.log(result2);
console.log(result3);
console.log(result4);
console.log(result5);
console.log(result6);
console.log(result7);
console.log(result8);
//

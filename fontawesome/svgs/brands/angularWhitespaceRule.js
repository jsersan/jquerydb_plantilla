    Mac OS X            	   2  �     �                                    ATTR;���  �   �   :                  �   :  com.apple.quarantine 0081;64c6867a;Firefox;BAC67E25-0BD1-4221-8664-63D5CC966CD2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             This resource fork intentionally left blank                                                                                                                                                                                                                            �� errorText = length === 0 ? 'Missing' : 'Extra';
                context.addFailureAt(position, length + lengthFix, errorText + " whitespace in interpolation " + location + "; expecting " + InterpolationOpen + " expr " + InterpolationClose, [new Lint.Replacement(absolutePosition, length + lengthFix, fixTo)]);
            };
            InterpolationWhitespaceRe.lastIndex = 0;
            var match = void 0;
            while ((match = InterpolationWhitespaceRe.exec(expr))) {
                var start = text.sourceSpan.start.offset + match.index;
                var absolutePosition = context.getSourcePosition(start);
                checkWhiteSpace(match[1], 'start', InterpolationOpen + " ", start, absolutePosition, InterpolationOpen.length);
                var positionFix = InterpolationOpen.length + match[1].length + match[2].length;
                checkWhiteSpace(match[3], 'end', " " + InterpolationClose, start + positionFix, absolutePosition + positionFix, InterpolationClose.length);
            }
        }
        _super.prototype.visitBoundText.call(this, text, context);
        return null;
    };
    InterpolationWhitespaceVisitor.prototype.getCheckOption = function () {
        return 'check-interpolation';
    };
    return InterpolationWhitespaceVisitor;
}(basicTemplateAstVisitor_1.BasicTemplateAstVisitor));
var SemicolonTemplateVisitor = (function (_super) {
    __extends(SemicolonTemplateVisitor, _super);
    function SemicolonTemplateVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SemicolonTemplateVisitor.prototype.visitDirectiveProperty = function (prop, context) {
        if (prop.sourceSpan) {
            var directive = prop.sourceSpan.toString();
            var match = /^([^=]+=\s*)([^]*?)\s*$/.exec(directive);
            var rawExpression = match[2];
            var positionFix = match[1].length + 1;
            var expr = rawExpression.slice(1, -1).trim();
            var doubleQuote = rawExpression[0] === '"';
            var reg = doubleQuote ? SemicolonNoWhitespaceNotInSimpleQuoteRe : SemicolonNoWhitespaceNotInDoubleQuoteRe;
            reg.lastIndex = 0;
            checkSemicolonNoWhitespace(reg, context, expr, prop.sourceSpan.start.offset + positionFix);
        }
        _super.prototype.visitDirectiveProperty.call(this, prop, context);
    };
    SemicolonTemplateVisitor.prototype.getCheckOption = function () {
        return 'check-semicolon';
    };
    return SemicolonTemplateVisitor;
}(basicTemplateAstVisitor_1.BasicTemplateAstVisitor));
var WhitespaceTemplateVisitor = (function (_super) {
    __extends(WhitespaceTemplateVisitor, _super);
    function WhitespaceTemplateVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.visitors = [
            new InterpolationWhitespaceVisitor(_this.getSourceFile(), _this.getOptions(), _this.context, _this.templateStart),
            new SemicolonTemplateVisitor(_this.getSourceFile(), _this.getOptions(), _this.context, _this.templateStart)
        ];
        return _this;
    }
    WhitespaceTemplateVisitor.prototype.visitBoundText = function (text, context) {
        var _this = this;
        var options = this.getOptions();
        this.visitors
            .filter(function (v) { return options.indexOf(v.getCheckOption()) >= 0; })
            .map(function (v) { return v.visitBoundText(text, _this); })
            .filter(Boolean)
            .forEach(function (f) {
            return _this.addFailureFromStartToEnd(f.getStartPosition().getPosition(), f.getEndPosition().getPosition(), f.getFailure(), f.getFix());
        });
        _super.prototype.visitBoundText.call(this, text, context);
    };
    WhitespaceTemplateVisitor.prototype.visitDirectiveProperty = function (prop, context) {
        var _this = this;
        var options = this.getOptions();
        this.visitors
            .filter(function (v) { return options.indexOf(v.getCheckOption()) >= 0; })
            .map(function (v) { return v.visitDirectiveProperty(prop, _this); })
            .filter(Boolean)
            .forEach(function (f) {
            return _this.addFailureFromStartToEnd(f.getStartPosition().getPosition(), f.getEndPosition().getPosition(), f.getFailure(), f.getFix());
        });
        _super.prototype.visitDirectiveProperty.call(this, prop, context);
    };
    return WhitespaceTemplateVisitor;
}(basicTemplateAstVisitor_1.BasicTemplateAstVisitor));
var PipeWhitespaceVisitor = (function (_super) {
    __extends(PipeWhitespaceVisitor, _super);
    function PipeWhitespaceVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PipeWhitespaceVisitor.prototype.visitPipe = function (ast, context) {
        var exprStart, exprEnd, exprText, sf;
        exprStart = context.getSourcePosition(ast.exp.span.start);
        exprEnd = context.getSourcePosition(ast.exp.span.end);
        sf = context.getSourceFile().getFullText();
        exprText = sf.substring(exprStart, exprEnd);
        var replacements = [];
        var parentheses = false;
        var leftBeginning;
        if (sf[exprEnd] === ')') {
            parentheses = true;
            leftBeginning = exprEnd + 1 + 2;
        }
        else {
            leftBeginning = exprEnd + 1;
        }
        if (sf[leftBeginning] === ' ') {
            var ignoreSpace = 1;
            while (sf[leftBeginning + ignoreSpace] === ' ') {
                ignoreSpace += 1;
            }
            if (ignoreSpace > 1) {
                replacements.push(new Lint.Replacement(exprEnd + 1, ignoreSpace, ' '));
            }
        }
        else {
            replacements.push(new Lint.Replacement(exprEnd + 1, 0, ' '));
        }
        if (exprText[exprText.length - 1] === ' ') {
            var ignoreSpace = 1;
            while (exprText[exprText.length - 1 - ignoreSpace] === ' ') {
                ignoreSpace += 1;
            }
            if (ignoreSpace > 1) {
                replacements.push(new Lint.Replacement(exprEnd - ignoreSpace, ignoreSpace, ' '));
            }
        }
        else {
            if (!parentheses) {
                replacements.push(new Lint.Replacement(exprEnd, 0, ' '));
            }
        }
        if (replacements.length) {
            context.addFailureAt(ast.exp.span.end - 1, 3, 'The pipe operator should be surrounded by one space on each side, i.e. " | ".', replacements);
        }
        _super.prototype.visitPipe.call(this, ast, context);
        return null;
    };
    PipeWhitespaceVisitor.prototype.getCheckOption = function () {
        return 'check-pipe';
    };
    return PipeWhitespaceVisitor;
}(recursiveAngularExpressionVisitor_1.RecursiveAngularExpressionVisitor));
var TemplateExpressionVisitor = (function (_super) {
    __extends(TemplateExpressionVisitor, _super);
    function TemplateExpressionVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.visitors = [
            new PipeWhitespaceVisitor(_this.getSourceFile(), _this.getOptions(), _this.context, _this.basePosition)
        ];
        return _this;
    }
    TemplateExpressionVisitor.prototype.visitPipe = function (expr, context) {
        var _this = this;
        var options = this.getOptions();
        this.visitors
            .map(function (v) { return v.addParentAST(_this.parentAST); })
            .filter(function (v) { return options.indexOf(v.getCheckOption()) >= 0; })
            .map(function (v) { return v.visitPipe(expr, _this); })
            .filter(Boolean)
            .forEach(function (f) {
            return _this.addFailureFromStartToEnd(f.getStartPosition().getPosition(), f.getEndPosition().getPosition(), f.getFailure(), f.getFix());
        });
    };
    return TemplateExpressionVisitor;
}(recursiveAngularExpressionVisitor_1.RecursiveAngularExpressionVisitor));
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ngWalker_1.NgWalker(sourceFile, this.getOptions(), {
            expressionVisitorCtrl: TemplateExpressionVisitor,
            templateVisitorCtrl: WhitespaceTemplateVisitor
        }));
    };
    Rule.prototype.isEnabled = function () {
        var _a = Rule.metadata.options, maxLength = _a.maxLength, minLength = _a.minLength;
        var length = this.ruleArguments.length;
        return _super.prototype.isEnabled.call(this) && length >= minLength && length <= maxLength;
    };
    Rule.metadata = {
        description: 'Ensures the proper formatting of Angular expressions.',
        hasFix: true,
        optionExamples: [
            [true, OPTION_CHECK_INTERPOLATION],
            [true, OPTION_CHECK_PIPE],
            [true, OPTION_CHECK_SEMICOLON],
            [true, OPTION_CHECK_INTERPOLATION, OPTION_CHECK_PIPE, OPTION_CHECK_SEMICOLON]
        ],
        options: {
            items: {
                enum: [OPTION_CHECK_INTERPOLATION, OPTION_CHECK_PIPE, OPTION_CHECK_SEMICOLON],
                type: 'string'
            },
            maxLength: 3,
            minLength: 1,
            type: 'array'
        },
        optionsDescription: Lint.Utils.dedent(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      One (or both) of the following arguments must be provided:\n      * `", "` - checks for whitespace before and after the interpolation characters.\n      * `", "` - checks for whitespace before and after a pipe.\n      * `", "` - checks for whitespace after semicolon.\n    "], ["\n      One (or both) of the following arguments must be provided:\n      * \\`", "\\` - checks for whitespace before and after the interpolation characters.\n      * \\`", "\\` - checks for whitespace before and after a pipe.\n      * \\`", "\\` - checks for whitespace after semicolon.\n    "])), OPTION_CHECK_INTERPOLATION, OPTION_CHECK_PIPE, OPTION_CHECK_SEMICOLON),
        rationale: 'Having whitespace in the right places in an Angular expression makes the template more readable.',
        ruleName: 'angular-whitespace',
        type: 'style',
        typescriptOnly: true
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var templateObject_1;

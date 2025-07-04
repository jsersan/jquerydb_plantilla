<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M360 0H24C10.8 0 0 10.8 0 24v48c0 13.2 10.8 24 24 24h336c13.2 0 24-10.8 24-24V24c0-13.2-10.8-24-24-24zM32 480c0 17.6 14.4 32 32 32h256c17.6 0 32-14.4 32-32V128H32v352zm64-184c0-4.4 3.6-8 8-8h56v-56c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v56h56c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8h-56v56c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8v-56h-56c-4.4 0-8-3.6-8-8v-48z"/></svg>
<!--
Font Awesome Free 5.5.0 by @fontawesome - https://fontawesome.com
License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
-->                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 he maximum allowed inline lines for %s. Defined limit: %s / total lines: %s (https://angular.io/guide/styleguide#style-05-04)';
    return Rule;
}(lib_1.Rules.AbstractRule));
exports.Rule = Rule;
var generateFailure = function (type, limit, value) {
    return sprintf_js_1.sprintf(Rule.FAILURE_STRING, type, limit, value);
};
exports.getAnimationsFailure = function (value, limit) {
    if (limit === void 0) { limit = DEFAULT_ANIMATIONS_LIMIT; }
    return generateFailure(OPTION_ANIMATIONS, limit, value);
};
exports.getStylesFailure = function (value, limit) {
    if (limit === void 0) { limit = DEFAULT_STYLES_LIMIT; }
    return generateFailure(OPTION_STYLES, limit, value);
};
exports.getTemplateFailure = function (value, limit) {
    if (limit === void 0) { limit = DEFAULT_TEMPLATE_LIMIT; }
    return generateFailure(OPTION_TEMPLATE, limit, value);
};
var MaxInlineDeclarationsWalker = (function (_super) {
    __extends(MaxInlineDeclarationsWalker, _super);
    function MaxInlineDeclarationsWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.animationsLinesLimit = DEFAULT_ANIMATIONS_LIMIT;
        _this.stylesLinesLimit = DEFAULT_STYLES_LIMIT;
        _this.templateLinesLimit = DEFAULT_TEMPLATE_LIMIT;
        _this.newLineRegExp = /\r\n|\r|\n/;
        var _a = (options.ruleArguments[0] || []), _b = _a.animations, animations = _b === void 0 ? -1 : _b, _c = _a.styles, styles = _c === void 0 ? -1 : _c, _d = _a.template, template = _d === void 0 ? -1 : _d;
        _this.animationsLinesLimit = animations > -1 ? animations : _this.animationsLinesLimit;
        _this.stylesLinesLimit = styles > -1 ? styles : _this.stylesLinesLimit;
        _this.templateLinesLimit = template > -1 ? template : _this.templateLinesLimit;
        return _this;
    }
    MaxInlineDeclarationsWalker.prototype.visitNgComponent = function (metadata) {
        this.validateInlineAnimations(metadata);
        this.validateInlineStyles(metadata);
        this.validateInlineTemplate(metadata);
        _super.prototype.visitNgComponent.call(this, metadata);
    };
    MaxInlineDeclarationsWalker.prototype.getLinesCount = function (source) {
        return source.trim().split(this.newLineRegExp).length;
    };
    MaxInlineDeclarationsWalker.prototype.getInlineAnimationsLinesCount = function (metadata) {
        var _this = this;
        return (metadata.animations || []).reduce(function (previousValue, currentValue) {
            if (currentValue && currentValue.animation) {
                previousValue += _this.getLinesCount(currentValue.animation.source);
            }
            return previousValue;
        }, 0);
    };
    MaxInlineDeclarationsWalker.prototype.validateInlineAnimations = function (metadata) {
        var linesCount = this.getInlineAnimationsLinesCount(metadata);
        if (linesCount <= this.animationsLinesLimit) {
            return;
        }
        var failureMessage = exports.getAnimationsFailure(linesCount, this.animationsLinesLimit);
        for (var _i = 0, _a = metadata.animations; _i < _a.length; _i++) {
            var animation = _a[_i];
            this.addFailureAtNode(animation.node, failureMessage);
        }
    };
    MaxInlineDeclarationsWalker.prototype.getInlineStylesLinesCount = function (metadata) {
        var _this = this;
        return (metadata.styles || []).reduce(function (previousValue, currentValue) {
            if (currentValue && !currentValue.url) {
                previousValue += _this.getLinesCount(currentValue.style.source);
            }
            return previousValue;
        }, 0);
    };
    MaxInlineDeclarationsWalker.prototype.validateInlineStyles = function (metadata) {
        var linesCount = this.getInlineStylesLinesCount(metadata);
        if (linesCount <= this.stylesLinesLimit) {
            return;
        }
        var failureMessage = exports.getStylesFailure(linesCount, this.stylesLinesLimit);
        for (var _i = 0, _a = metadata.styles; _i < _a.length; _i++) {
            var style = _a[_i];
            this.addFailureAtNode(style.node, failureMessage);
        }
    };
    MaxInlineDeclarationsWalker.prototype.getTemplateLinesCount = function (metadata) {
        return this.hasInlineTemplate(metadata) ? this.getLinesCount(metadata.template.template.source) : 0;
    };
    MaxInlineDeclarationsWalker.prototype.hasInlineTemplate = function (metadata) {
        return !!(metadata.template && !metadata.template.url && metadata.template.template && metadata.template.template.source);
    };
    MaxInlineDeclarationsWalker.prototype.validateInlineTemplate = function (metadata) {
        var linesCount = this.getTemplateLinesCount(metadata);
        if (linesCount <= this.templateLinesLimit) {
            return;
        }
        var failureMessage = exports.getTemplateFailure(linesCount, this.templateLinesLimit);
        this.addFailureAtNode(metadata.template.node, failureMessage);
    };
    return MaxInlineDeclarationsWalker;
}(ngWalker_1.NgWalker));
exports.MaxInlineDeclarationsWalker = MaxInlineDeclarationsWalker;
var templateObject_1;

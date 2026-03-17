'use strict';

var path$2 = require('path');
var fs$4 = require('fs');
var module$1 = require('module');
var require$$3 = require('url');
var require$$0 = require('os');
var require$$0$1 = require('util');
var require$$0$2 = require('stream');
var require$$0$3 = require('events');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var picocolors = {exports: {}};

var hasRequiredPicocolors;

function requirePicocolors () {
	if (hasRequiredPicocolors) return picocolors.exports;
	hasRequiredPicocolors = 1;
	let p = process || {}, argv = p.argv || [], env = p.env || {};
	let isColorSupported =
		!(!!env.NO_COLOR || argv.includes("--no-color")) &&
		(!!env.FORCE_COLOR || argv.includes("--color") || p.platform === "win32" || ((p.stdout || {}).isTTY && env.TERM !== "dumb") || !!env.CI);

	let formatter = (open, close, replace = open) =>
		input => {
			let string = "" + input, index = string.indexOf(close, open.length);
			return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close
		};

	let replaceClose = (string, close, replace, index) => {
		let result = "", cursor = 0;
		do {
			result += string.substring(cursor, index) + replace;
			cursor = index + close.length;
			index = string.indexOf(close, cursor);
		} while (~index)
		return result + string.substring(cursor)
	};

	let createColors = (enabled = isColorSupported) => {
		let f = enabled ? formatter : () => String;
		return {
			isColorSupported: enabled,
			reset: f("\x1b[0m", "\x1b[0m"),
			bold: f("\x1b[1m", "\x1b[22m", "\x1b[22m\x1b[1m"),
			dim: f("\x1b[2m", "\x1b[22m", "\x1b[22m\x1b[2m"),
			italic: f("\x1b[3m", "\x1b[23m"),
			underline: f("\x1b[4m", "\x1b[24m"),
			inverse: f("\x1b[7m", "\x1b[27m"),
			hidden: f("\x1b[8m", "\x1b[28m"),
			strikethrough: f("\x1b[9m", "\x1b[29m"),

			black: f("\x1b[30m", "\x1b[39m"),
			red: f("\x1b[31m", "\x1b[39m"),
			green: f("\x1b[32m", "\x1b[39m"),
			yellow: f("\x1b[33m", "\x1b[39m"),
			blue: f("\x1b[34m", "\x1b[39m"),
			magenta: f("\x1b[35m", "\x1b[39m"),
			cyan: f("\x1b[36m", "\x1b[39m"),
			white: f("\x1b[37m", "\x1b[39m"),
			gray: f("\x1b[90m", "\x1b[39m"),

			bgBlack: f("\x1b[40m", "\x1b[49m"),
			bgRed: f("\x1b[41m", "\x1b[49m"),
			bgGreen: f("\x1b[42m", "\x1b[49m"),
			bgYellow: f("\x1b[43m", "\x1b[49m"),
			bgBlue: f("\x1b[44m", "\x1b[49m"),
			bgMagenta: f("\x1b[45m", "\x1b[49m"),
			bgCyan: f("\x1b[46m", "\x1b[49m"),
			bgWhite: f("\x1b[47m", "\x1b[49m"),

			blackBright: f("\x1b[90m", "\x1b[39m"),
			redBright: f("\x1b[91m", "\x1b[39m"),
			greenBright: f("\x1b[92m", "\x1b[39m"),
			yellowBright: f("\x1b[93m", "\x1b[39m"),
			blueBright: f("\x1b[94m", "\x1b[39m"),
			magentaBright: f("\x1b[95m", "\x1b[39m"),
			cyanBright: f("\x1b[96m", "\x1b[39m"),
			whiteBright: f("\x1b[97m", "\x1b[39m"),

			bgBlackBright: f("\x1b[100m", "\x1b[49m"),
			bgRedBright: f("\x1b[101m", "\x1b[49m"),
			bgGreenBright: f("\x1b[102m", "\x1b[49m"),
			bgYellowBright: f("\x1b[103m", "\x1b[49m"),
			bgBlueBright: f("\x1b[104m", "\x1b[49m"),
			bgMagentaBright: f("\x1b[105m", "\x1b[49m"),
			bgCyanBright: f("\x1b[106m", "\x1b[49m"),
			bgWhiteBright: f("\x1b[107m", "\x1b[49m"),
		}
	};

	picocolors.exports = createColors();
	picocolors.exports.createColors = createColors;
	return picocolors.exports;
}

var tokenize;
var hasRequiredTokenize;

function requireTokenize () {
	if (hasRequiredTokenize) return tokenize;
	hasRequiredTokenize = 1;

	const SINGLE_QUOTE = "'".charCodeAt(0);
	const DOUBLE_QUOTE = '"'.charCodeAt(0);
	const BACKSLASH = '\\'.charCodeAt(0);
	const SLASH = '/'.charCodeAt(0);
	const NEWLINE = '\n'.charCodeAt(0);
	const SPACE = ' '.charCodeAt(0);
	const FEED = '\f'.charCodeAt(0);
	const TAB = '\t'.charCodeAt(0);
	const CR = '\r'.charCodeAt(0);
	const OPEN_SQUARE = '['.charCodeAt(0);
	const CLOSE_SQUARE = ']'.charCodeAt(0);
	const OPEN_PARENTHESES = '('.charCodeAt(0);
	const CLOSE_PARENTHESES = ')'.charCodeAt(0);
	const OPEN_CURLY = '{'.charCodeAt(0);
	const CLOSE_CURLY = '}'.charCodeAt(0);
	const SEMICOLON = ';'.charCodeAt(0);
	const ASTERISK = '*'.charCodeAt(0);
	const COLON = ':'.charCodeAt(0);
	const AT = '@'.charCodeAt(0);

	const RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
	const RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
	const RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
	const RE_HEX_ESCAPE = /[\da-f]/i;

	tokenize = function tokenizer(input, options = {}) {
	  let css = input.css.valueOf();
	  let ignore = options.ignoreErrors;

	  let code, content, escape, next, quote;
	  let currentToken, escaped, escapePos, n, prev;

	  let length = css.length;
	  let pos = 0;
	  let buffer = [];
	  let returned = [];

	  function position() {
	    return pos
	  }

	  function unclosed(what) {
	    throw input.error('Unclosed ' + what, pos)
	  }

	  function endOfFile() {
	    return returned.length === 0 && pos >= length
	  }

	  function nextToken(opts) {
	    if (returned.length) return returned.pop()
	    if (pos >= length) return

	    let ignoreUnclosed = opts ? opts.ignoreUnclosed : false;

	    code = css.charCodeAt(pos);

	    switch (code) {
	      case NEWLINE:
	      case SPACE:
	      case TAB:
	      case CR:
	      case FEED: {
	        next = pos;
	        do {
	          next += 1;
	          code = css.charCodeAt(next);
	        } while (
	          code === SPACE ||
	          code === NEWLINE ||
	          code === TAB ||
	          code === CR ||
	          code === FEED
	        )

	        currentToken = ['space', css.slice(pos, next)];
	        pos = next - 1;
	        break
	      }

	      case OPEN_SQUARE:
	      case CLOSE_SQUARE:
	      case OPEN_CURLY:
	      case CLOSE_CURLY:
	      case COLON:
	      case SEMICOLON:
	      case CLOSE_PARENTHESES: {
	        let controlChar = String.fromCharCode(code);
	        currentToken = [controlChar, controlChar, pos];
	        break
	      }

	      case OPEN_PARENTHESES: {
	        prev = buffer.length ? buffer.pop()[1] : '';
	        n = css.charCodeAt(pos + 1);
	        if (
	          prev === 'url' &&
	          n !== SINGLE_QUOTE &&
	          n !== DOUBLE_QUOTE &&
	          n !== SPACE &&
	          n !== NEWLINE &&
	          n !== TAB &&
	          n !== FEED &&
	          n !== CR
	        ) {
	          next = pos;
	          do {
	            escaped = false;
	            next = css.indexOf(')', next + 1);
	            if (next === -1) {
	              if (ignore || ignoreUnclosed) {
	                next = pos;
	                break
	              } else {
	                unclosed('bracket');
	              }
	            }
	            escapePos = next;
	            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
	              escapePos -= 1;
	              escaped = !escaped;
	            }
	          } while (escaped)

	          currentToken = ['brackets', css.slice(pos, next + 1), pos, next];

	          pos = next;
	        } else {
	          next = css.indexOf(')', pos + 1);
	          content = css.slice(pos, next + 1);

	          if (next === -1 || RE_BAD_BRACKET.test(content)) {
	            currentToken = ['(', '(', pos];
	          } else {
	            currentToken = ['brackets', content, pos, next];
	            pos = next;
	          }
	        }

	        break
	      }

	      case SINGLE_QUOTE:
	      case DOUBLE_QUOTE: {
	        quote = code === SINGLE_QUOTE ? "'" : '"';
	        next = pos;
	        do {
	          escaped = false;
	          next = css.indexOf(quote, next + 1);
	          if (next === -1) {
	            if (ignore || ignoreUnclosed) {
	              next = pos + 1;
	              break
	            } else {
	              unclosed('string');
	            }
	          }
	          escapePos = next;
	          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
	            escapePos -= 1;
	            escaped = !escaped;
	          }
	        } while (escaped)

	        currentToken = ['string', css.slice(pos, next + 1), pos, next];
	        pos = next;
	        break
	      }

	      case AT: {
	        RE_AT_END.lastIndex = pos + 1;
	        RE_AT_END.test(css);
	        if (RE_AT_END.lastIndex === 0) {
	          next = css.length - 1;
	        } else {
	          next = RE_AT_END.lastIndex - 2;
	        }

	        currentToken = ['at-word', css.slice(pos, next + 1), pos, next];

	        pos = next;
	        break
	      }

	      case BACKSLASH: {
	        next = pos;
	        escape = true;
	        while (css.charCodeAt(next + 1) === BACKSLASH) {
	          next += 1;
	          escape = !escape;
	        }
	        code = css.charCodeAt(next + 1);
	        if (
	          escape &&
	          code !== SLASH &&
	          code !== SPACE &&
	          code !== NEWLINE &&
	          code !== TAB &&
	          code !== CR &&
	          code !== FEED
	        ) {
	          next += 1;
	          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
	            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
	              next += 1;
	            }
	            if (css.charCodeAt(next + 1) === SPACE) {
	              next += 1;
	            }
	          }
	        }

	        currentToken = ['word', css.slice(pos, next + 1), pos, next];

	        pos = next;
	        break
	      }

	      default: {
	        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
	          next = css.indexOf('*/', pos + 2) + 1;
	          if (next === 0) {
	            if (ignore || ignoreUnclosed) {
	              next = css.length;
	            } else {
	              unclosed('comment');
	            }
	          }

	          currentToken = ['comment', css.slice(pos, next + 1), pos, next];
	          pos = next;
	        } else {
	          RE_WORD_END.lastIndex = pos + 1;
	          RE_WORD_END.test(css);
	          if (RE_WORD_END.lastIndex === 0) {
	            next = css.length - 1;
	          } else {
	            next = RE_WORD_END.lastIndex - 2;
	          }

	          currentToken = ['word', css.slice(pos, next + 1), pos, next];
	          buffer.push(currentToken);
	          pos = next;
	        }

	        break
	      }
	    }

	    pos++;
	    return currentToken
	  }

	  function back(token) {
	    returned.push(token);
	  }

	  return {
	    back,
	    endOfFile,
	    nextToken,
	    position
	  }
	};
	return tokenize;
}

var terminalHighlight_1;
var hasRequiredTerminalHighlight;

function requireTerminalHighlight () {
	if (hasRequiredTerminalHighlight) return terminalHighlight_1;
	hasRequiredTerminalHighlight = 1;

	let pico = /*@__PURE__*/ requirePicocolors();

	let tokenizer = requireTokenize();

	let Input;

	function registerInput(dependant) {
	  Input = dependant;
	}

	const HIGHLIGHT_THEME = {
	  ';': pico.yellow,
	  ':': pico.yellow,
	  '(': pico.cyan,
	  ')': pico.cyan,
	  '[': pico.yellow,
	  ']': pico.yellow,
	  '{': pico.yellow,
	  '}': pico.yellow,
	  'at-word': pico.cyan,
	  'brackets': pico.cyan,
	  'call': pico.cyan,
	  'class': pico.yellow,
	  'comment': pico.gray,
	  'hash': pico.magenta,
	  'string': pico.green
	};

	function getTokenType([type, value], processor) {
	  if (type === 'word') {
	    if (value[0] === '.') {
	      return 'class'
	    }
	    if (value[0] === '#') {
	      return 'hash'
	    }
	  }

	  if (!processor.endOfFile()) {
	    let next = processor.nextToken();
	    processor.back(next);
	    if (next[0] === 'brackets' || next[0] === '(') return 'call'
	  }

	  return type
	}

	function terminalHighlight(css) {
	  let processor = tokenizer(new Input(css), { ignoreErrors: true });
	  let result = '';
	  while (!processor.endOfFile()) {
	    let token = processor.nextToken();
	    let color = HIGHLIGHT_THEME[getTokenType(token, processor)];
	    if (color) {
	      result += token[1]
	        .split(/\r?\n/)
	        .map(i => color(i))
	        .join('\n');
	    } else {
	      result += token[1];
	    }
	  }
	  return result
	}

	terminalHighlight.registerInput = registerInput;

	terminalHighlight_1 = terminalHighlight;
	return terminalHighlight_1;
}

var cssSyntaxError;
var hasRequiredCssSyntaxError;

function requireCssSyntaxError () {
	if (hasRequiredCssSyntaxError) return cssSyntaxError;
	hasRequiredCssSyntaxError = 1;

	let pico = /*@__PURE__*/ requirePicocolors();

	let terminalHighlight = requireTerminalHighlight();

	class CssSyntaxError extends Error {
	  constructor(message, line, column, source, file, plugin) {
	    super(message);
	    this.name = 'CssSyntaxError';
	    this.reason = message;

	    if (file) {
	      this.file = file;
	    }
	    if (source) {
	      this.source = source;
	    }
	    if (plugin) {
	      this.plugin = plugin;
	    }
	    if (typeof line !== 'undefined' && typeof column !== 'undefined') {
	      if (typeof line === 'number') {
	        this.line = line;
	        this.column = column;
	      } else {
	        this.line = line.line;
	        this.column = line.column;
	        this.endLine = column.line;
	        this.endColumn = column.column;
	      }
	    }

	    this.setMessage();

	    if (Error.captureStackTrace) {
	      Error.captureStackTrace(this, CssSyntaxError);
	    }
	  }

	  setMessage() {
	    this.message = this.plugin ? this.plugin + ': ' : '';
	    this.message += this.file ? this.file : '<css input>';
	    if (typeof this.line !== 'undefined') {
	      this.message += ':' + this.line + ':' + this.column;
	    }
	    this.message += ': ' + this.reason;
	  }

	  showSourceCode(color) {
	    if (!this.source) return ''

	    let css = this.source;
	    if (color == null) color = pico.isColorSupported;

	    let aside = text => text;
	    let mark = text => text;
	    let highlight = text => text;
	    if (color) {
	      let { bold, gray, red } = pico.createColors(true);
	      mark = text => bold(red(text));
	      aside = text => gray(text);
	      if (terminalHighlight) {
	        highlight = text => terminalHighlight(text);
	      }
	    }

	    let lines = css.split(/\r?\n/);
	    let start = Math.max(this.line - 3, 0);
	    let end = Math.min(this.line + 2, lines.length);
	    let maxWidth = String(end).length;

	    return lines
	      .slice(start, end)
	      .map((line, index) => {
	        let number = start + 1 + index;
	        let gutter = ' ' + (' ' + number).slice(-maxWidth) + ' | ';
	        if (number === this.line) {
	          if (line.length > 160) {
	            let padding = 20;
	            let subLineStart = Math.max(0, this.column - padding);
	            let subLineEnd = Math.max(
	              this.column + padding,
	              this.endColumn + padding
	            );
	            let subLine = line.slice(subLineStart, subLineEnd);

	            let spacing =
	              aside(gutter.replace(/\d/g, ' ')) +
	              line
	                .slice(0, Math.min(this.column - 1, padding - 1))
	                .replace(/[^\t]/g, ' ');

	            return (
	              mark('>') +
	              aside(gutter) +
	              highlight(subLine) +
	              '\n ' +
	              spacing +
	              mark('^')
	            )
	          }

	          let spacing =
	            aside(gutter.replace(/\d/g, ' ')) +
	            line.slice(0, this.column - 1).replace(/[^\t]/g, ' ');

	          return (
	            mark('>') +
	            aside(gutter) +
	            highlight(line) +
	            '\n ' +
	            spacing +
	            mark('^')
	          )
	        }

	        return ' ' + aside(gutter) + highlight(line)
	      })
	      .join('\n')
	  }

	  toString() {
	    let code = this.showSourceCode();
	    if (code) {
	      code = '\n\n' + code + '\n';
	    }
	    return this.name + ': ' + this.message + code
	  }
	}

	cssSyntaxError = CssSyntaxError;
	CssSyntaxError.default = CssSyntaxError;
	return cssSyntaxError;
}

var stringifier;
var hasRequiredStringifier;

function requireStringifier () {
	if (hasRequiredStringifier) return stringifier;
	hasRequiredStringifier = 1;

	const DEFAULT_RAW = {
	  after: '\n',
	  beforeClose: '\n',
	  beforeComment: '\n',
	  beforeDecl: '\n',
	  beforeOpen: ' ',
	  beforeRule: '\n',
	  colon: ': ',
	  commentLeft: ' ',
	  commentRight: ' ',
	  emptyBody: '',
	  indent: '    ',
	  semicolon: false
	};

	function capitalize(str) {
	  return str[0].toUpperCase() + str.slice(1)
	}

	class Stringifier {
	  constructor(builder) {
	    this.builder = builder;
	  }

	  atrule(node, semicolon) {
	    let name = '@' + node.name;
	    let params = node.params ? this.rawValue(node, 'params') : '';

	    if (typeof node.raws.afterName !== 'undefined') {
	      name += node.raws.afterName;
	    } else if (params) {
	      name += ' ';
	    }

	    if (node.nodes) {
	      this.block(node, name + params);
	    } else {
	      let end = (node.raws.between || '') + (semicolon ? ';' : '');
	      this.builder(name + params + end, node);
	    }
	  }

	  beforeAfter(node, detect) {
	    let value;
	    if (node.type === 'decl') {
	      value = this.raw(node, null, 'beforeDecl');
	    } else if (node.type === 'comment') {
	      value = this.raw(node, null, 'beforeComment');
	    } else if (detect === 'before') {
	      value = this.raw(node, null, 'beforeRule');
	    } else {
	      value = this.raw(node, null, 'beforeClose');
	    }

	    let buf = node.parent;
	    let depth = 0;
	    while (buf && buf.type !== 'root') {
	      depth += 1;
	      buf = buf.parent;
	    }

	    if (value.includes('\n')) {
	      let indent = this.raw(node, null, 'indent');
	      if (indent.length) {
	        for (let step = 0; step < depth; step++) value += indent;
	      }
	    }

	    return value
	  }

	  block(node, start) {
	    let between = this.raw(node, 'between', 'beforeOpen');
	    this.builder(start + between + '{', node, 'start');

	    let after;
	    if (node.nodes && node.nodes.length) {
	      this.body(node);
	      after = this.raw(node, 'after');
	    } else {
	      after = this.raw(node, 'after', 'emptyBody');
	    }

	    if (after) this.builder(after);
	    this.builder('}', node, 'end');
	  }

	  body(node) {
	    let last = node.nodes.length - 1;
	    while (last > 0) {
	      if (node.nodes[last].type !== 'comment') break
	      last -= 1;
	    }

	    let semicolon = this.raw(node, 'semicolon');
	    for (let i = 0; i < node.nodes.length; i++) {
	      let child = node.nodes[i];
	      let before = this.raw(child, 'before');
	      if (before) this.builder(before);
	      this.stringify(child, last !== i || semicolon);
	    }
	  }

	  comment(node) {
	    let left = this.raw(node, 'left', 'commentLeft');
	    let right = this.raw(node, 'right', 'commentRight');
	    this.builder('/*' + left + node.text + right + '*/', node);
	  }

	  decl(node, semicolon) {
	    let between = this.raw(node, 'between', 'colon');
	    let string = node.prop + between + this.rawValue(node, 'value');

	    if (node.important) {
	      string += node.raws.important || ' !important';
	    }

	    if (semicolon) string += ';';
	    this.builder(string, node);
	  }

	  document(node) {
	    this.body(node);
	  }

	  raw(node, own, detect) {
	    let value;
	    if (!detect) detect = own;

	    // Already had
	    if (own) {
	      value = node.raws[own];
	      if (typeof value !== 'undefined') return value
	    }

	    let parent = node.parent;

	    if (detect === 'before') {
	      // Hack for first rule in CSS
	      if (!parent || (parent.type === 'root' && parent.first === node)) {
	        return ''
	      }

	      // `root` nodes in `document` should use only their own raws
	      if (parent && parent.type === 'document') {
	        return ''
	      }
	    }

	    // Floating child without parent
	    if (!parent) return DEFAULT_RAW[detect]

	    // Detect style by other nodes
	    let root = node.root();
	    if (!root.rawCache) root.rawCache = {};
	    if (typeof root.rawCache[detect] !== 'undefined') {
	      return root.rawCache[detect]
	    }

	    if (detect === 'before' || detect === 'after') {
	      return this.beforeAfter(node, detect)
	    } else {
	      let method = 'raw' + capitalize(detect);
	      if (this[method]) {
	        value = this[method](root, node);
	      } else {
	        root.walk(i => {
	          value = i.raws[own];
	          if (typeof value !== 'undefined') return false
	        });
	      }
	    }

	    if (typeof value === 'undefined') value = DEFAULT_RAW[detect];

	    root.rawCache[detect] = value;
	    return value
	  }

	  rawBeforeClose(root) {
	    let value;
	    root.walk(i => {
	      if (i.nodes && i.nodes.length > 0) {
	        if (typeof i.raws.after !== 'undefined') {
	          value = i.raws.after;
	          if (value.includes('\n')) {
	            value = value.replace(/[^\n]+$/, '');
	          }
	          return false
	        }
	      }
	    });
	    if (value) value = value.replace(/\S/g, '');
	    return value
	  }

	  rawBeforeComment(root, node) {
	    let value;
	    root.walkComments(i => {
	      if (typeof i.raws.before !== 'undefined') {
	        value = i.raws.before;
	        if (value.includes('\n')) {
	          value = value.replace(/[^\n]+$/, '');
	        }
	        return false
	      }
	    });
	    if (typeof value === 'undefined') {
	      value = this.raw(node, null, 'beforeDecl');
	    } else if (value) {
	      value = value.replace(/\S/g, '');
	    }
	    return value
	  }

	  rawBeforeDecl(root, node) {
	    let value;
	    root.walkDecls(i => {
	      if (typeof i.raws.before !== 'undefined') {
	        value = i.raws.before;
	        if (value.includes('\n')) {
	          value = value.replace(/[^\n]+$/, '');
	        }
	        return false
	      }
	    });
	    if (typeof value === 'undefined') {
	      value = this.raw(node, null, 'beforeRule');
	    } else if (value) {
	      value = value.replace(/\S/g, '');
	    }
	    return value
	  }

	  rawBeforeOpen(root) {
	    let value;
	    root.walk(i => {
	      if (i.type !== 'decl') {
	        value = i.raws.between;
	        if (typeof value !== 'undefined') return false
	      }
	    });
	    return value
	  }

	  rawBeforeRule(root) {
	    let value;
	    root.walk(i => {
	      if (i.nodes && (i.parent !== root || root.first !== i)) {
	        if (typeof i.raws.before !== 'undefined') {
	          value = i.raws.before;
	          if (value.includes('\n')) {
	            value = value.replace(/[^\n]+$/, '');
	          }
	          return false
	        }
	      }
	    });
	    if (value) value = value.replace(/\S/g, '');
	    return value
	  }

	  rawColon(root) {
	    let value;
	    root.walkDecls(i => {
	      if (typeof i.raws.between !== 'undefined') {
	        value = i.raws.between.replace(/[^\s:]/g, '');
	        return false
	      }
	    });
	    return value
	  }

	  rawEmptyBody(root) {
	    let value;
	    root.walk(i => {
	      if (i.nodes && i.nodes.length === 0) {
	        value = i.raws.after;
	        if (typeof value !== 'undefined') return false
	      }
	    });
	    return value
	  }

	  rawIndent(root) {
	    if (root.raws.indent) return root.raws.indent
	    let value;
	    root.walk(i => {
	      let p = i.parent;
	      if (p && p !== root && p.parent && p.parent === root) {
	        if (typeof i.raws.before !== 'undefined') {
	          let parts = i.raws.before.split('\n');
	          value = parts[parts.length - 1];
	          value = value.replace(/\S/g, '');
	          return false
	        }
	      }
	    });
	    return value
	  }

	  rawSemicolon(root) {
	    let value;
	    root.walk(i => {
	      if (i.nodes && i.nodes.length && i.last.type === 'decl') {
	        value = i.raws.semicolon;
	        if (typeof value !== 'undefined') return false
	      }
	    });
	    return value
	  }

	  rawValue(node, prop) {
	    let value = node[prop];
	    let raw = node.raws[prop];
	    if (raw && raw.value === value) {
	      return raw.raw
	    }

	    return value
	  }

	  root(node) {
	    this.body(node);
	    if (node.raws.after) this.builder(node.raws.after);
	  }

	  rule(node) {
	    this.block(node, this.rawValue(node, 'selector'));
	    if (node.raws.ownSemicolon) {
	      this.builder(node.raws.ownSemicolon, node, 'end');
	    }
	  }

	  stringify(node, semicolon) {
	    /* c8 ignore start */
	    if (!this[node.type]) {
	      throw new Error(
	        'Unknown AST node type ' +
	          node.type +
	          '. ' +
	          'Maybe you need to change PostCSS stringifier.'
	      )
	    }
	    /* c8 ignore stop */
	    this[node.type](node, semicolon);
	  }
	}

	stringifier = Stringifier;
	Stringifier.default = Stringifier;
	return stringifier;
}

var stringify_1;
var hasRequiredStringify$1;

function requireStringify$1 () {
	if (hasRequiredStringify$1) return stringify_1;
	hasRequiredStringify$1 = 1;

	let Stringifier = requireStringifier();

	function stringify(node, builder) {
	  let str = new Stringifier(builder);
	  str.stringify(node);
	}

	stringify_1 = stringify;
	stringify.default = stringify;
	return stringify_1;
}

var symbols = {};

var hasRequiredSymbols;

function requireSymbols () {
	if (hasRequiredSymbols) return symbols;
	hasRequiredSymbols = 1;

	symbols.isClean = Symbol('isClean');

	symbols.my = Symbol('my');
	return symbols;
}

var node;
var hasRequiredNode;

function requireNode () {
	if (hasRequiredNode) return node;
	hasRequiredNode = 1;

	let CssSyntaxError = requireCssSyntaxError();
	let Stringifier = requireStringifier();
	let stringify = requireStringify$1();
	let { isClean, my } = requireSymbols();

	function cloneNode(obj, parent) {
	  let cloned = new obj.constructor();

	  for (let i in obj) {
	    if (!Object.prototype.hasOwnProperty.call(obj, i)) {
	      /* c8 ignore next 2 */
	      continue
	    }
	    if (i === 'proxyCache') continue
	    let value = obj[i];
	    let type = typeof value;

	    if (i === 'parent' && type === 'object') {
	      if (parent) cloned[i] = parent;
	    } else if (i === 'source') {
	      cloned[i] = value;
	    } else if (Array.isArray(value)) {
	      cloned[i] = value.map(j => cloneNode(j, cloned));
	    } else {
	      if (type === 'object' && value !== null) value = cloneNode(value);
	      cloned[i] = value;
	    }
	  }

	  return cloned
	}

	function sourceOffset(inputCSS, position) {
	  // Not all custom syntaxes support `offset` in `source.start` and `source.end`
	  if (position && typeof position.offset !== 'undefined') {
	    return position.offset
	  }

	  let column = 1;
	  let line = 1;
	  let offset = 0;

	  for (let i = 0; i < inputCSS.length; i++) {
	    if (line === position.line && column === position.column) {
	      offset = i;
	      break
	    }

	    if (inputCSS[i] === '\n') {
	      column = 1;
	      line += 1;
	    } else {
	      column += 1;
	    }
	  }

	  return offset
	}

	class Node {
	  get proxyOf() {
	    return this
	  }

	  constructor(defaults = {}) {
	    this.raws = {};
	    this[isClean] = false;
	    this[my] = true;

	    for (let name in defaults) {
	      if (name === 'nodes') {
	        this.nodes = [];
	        for (let node of defaults[name]) {
	          if (typeof node.clone === 'function') {
	            this.append(node.clone());
	          } else {
	            this.append(node);
	          }
	        }
	      } else {
	        this[name] = defaults[name];
	      }
	    }
	  }

	  addToError(error) {
	    error.postcssNode = this;
	    if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
	      let s = this.source;
	      error.stack = error.stack.replace(
	        /\n\s{4}at /,
	        `$&${s.input.from}:${s.start.line}:${s.start.column}$&`
	      );
	    }
	    return error
	  }

	  after(add) {
	    this.parent.insertAfter(this, add);
	    return this
	  }

	  assign(overrides = {}) {
	    for (let name in overrides) {
	      this[name] = overrides[name];
	    }
	    return this
	  }

	  before(add) {
	    this.parent.insertBefore(this, add);
	    return this
	  }

	  cleanRaws(keepBetween) {
	    delete this.raws.before;
	    delete this.raws.after;
	    if (!keepBetween) delete this.raws.between;
	  }

	  clone(overrides = {}) {
	    let cloned = cloneNode(this);
	    for (let name in overrides) {
	      cloned[name] = overrides[name];
	    }
	    return cloned
	  }

	  cloneAfter(overrides = {}) {
	    let cloned = this.clone(overrides);
	    this.parent.insertAfter(this, cloned);
	    return cloned
	  }

	  cloneBefore(overrides = {}) {
	    let cloned = this.clone(overrides);
	    this.parent.insertBefore(this, cloned);
	    return cloned
	  }

	  error(message, opts = {}) {
	    if (this.source) {
	      let { end, start } = this.rangeBy(opts);
	      return this.source.input.error(
	        message,
	        { column: start.column, line: start.line },
	        { column: end.column, line: end.line },
	        opts
	      )
	    }
	    return new CssSyntaxError(message)
	  }

	  getProxyProcessor() {
	    return {
	      get(node, prop) {
	        if (prop === 'proxyOf') {
	          return node
	        } else if (prop === 'root') {
	          return () => node.root().toProxy()
	        } else {
	          return node[prop]
	        }
	      },

	      set(node, prop, value) {
	        if (node[prop] === value) return true
	        node[prop] = value;
	        if (
	          prop === 'prop' ||
	          prop === 'value' ||
	          prop === 'name' ||
	          prop === 'params' ||
	          prop === 'important' ||
	          /* c8 ignore next */
	          prop === 'text'
	        ) {
	          node.markDirty();
	        }
	        return true
	      }
	    }
	  }

	  /* c8 ignore next 3 */
	  markClean() {
	    this[isClean] = true;
	  }

	  markDirty() {
	    if (this[isClean]) {
	      this[isClean] = false;
	      let next = this;
	      while ((next = next.parent)) {
	        next[isClean] = false;
	      }
	    }
	  }

	  next() {
	    if (!this.parent) return undefined
	    let index = this.parent.index(this);
	    return this.parent.nodes[index + 1]
	  }

	  positionBy(opts = {}) {
	    let pos = this.source.start;
	    if (opts.index) {
	      pos = this.positionInside(opts.index);
	    } else if (opts.word) {
	      let inputString =
	        'document' in this.source.input
	          ? this.source.input.document
	          : this.source.input.css;
	      let stringRepresentation = inputString.slice(
	        sourceOffset(inputString, this.source.start),
	        sourceOffset(inputString, this.source.end)
	      );
	      let index = stringRepresentation.indexOf(opts.word);
	      if (index !== -1) pos = this.positionInside(index);
	    }
	    return pos
	  }

	  positionInside(index) {
	    let column = this.source.start.column;
	    let line = this.source.start.line;
	    let inputString =
	      'document' in this.source.input
	        ? this.source.input.document
	        : this.source.input.css;
	    let offset = sourceOffset(inputString, this.source.start);
	    let end = offset + index;

	    for (let i = offset; i < end; i++) {
	      if (inputString[i] === '\n') {
	        column = 1;
	        line += 1;
	      } else {
	        column += 1;
	      }
	    }

	    return { column, line, offset: end }
	  }

	  prev() {
	    if (!this.parent) return undefined
	    let index = this.parent.index(this);
	    return this.parent.nodes[index - 1]
	  }

	  rangeBy(opts = {}) {
	    let inputString =
	      'document' in this.source.input
	        ? this.source.input.document
	        : this.source.input.css;
	    let start = {
	      column: this.source.start.column,
	      line: this.source.start.line,
	      offset: sourceOffset(inputString, this.source.start)
	    };
	    let end = this.source.end
	      ? {
	          column: this.source.end.column + 1,
	          line: this.source.end.line,
	          offset:
	            typeof this.source.end.offset === 'number'
	              ? // `source.end.offset` is exclusive, so we don't need to add 1
	                this.source.end.offset
	              : // Since line/column in this.source.end is inclusive,
	                // the `sourceOffset(... , this.source.end)` returns an inclusive offset.
	                // So, we add 1 to convert it to exclusive.
	                sourceOffset(inputString, this.source.end) + 1
	        }
	      : {
	          column: start.column + 1,
	          line: start.line,
	          offset: start.offset + 1
	        };

	    if (opts.word) {
	      let stringRepresentation = inputString.slice(
	        sourceOffset(inputString, this.source.start),
	        sourceOffset(inputString, this.source.end)
	      );
	      let index = stringRepresentation.indexOf(opts.word);
	      if (index !== -1) {
	        start = this.positionInside(index);
	        end = this.positionInside(index + opts.word.length);
	      }
	    } else {
	      if (opts.start) {
	        start = {
	          column: opts.start.column,
	          line: opts.start.line,
	          offset: sourceOffset(inputString, opts.start)
	        };
	      } else if (opts.index) {
	        start = this.positionInside(opts.index);
	      }

	      if (opts.end) {
	        end = {
	          column: opts.end.column,
	          line: opts.end.line,
	          offset: sourceOffset(inputString, opts.end)
	        };
	      } else if (typeof opts.endIndex === 'number') {
	        end = this.positionInside(opts.endIndex);
	      } else if (opts.index) {
	        end = this.positionInside(opts.index + 1);
	      }
	    }

	    if (
	      end.line < start.line ||
	      (end.line === start.line && end.column <= start.column)
	    ) {
	      end = {
	        column: start.column + 1,
	        line: start.line,
	        offset: start.offset + 1
	      };
	    }

	    return { end, start }
	  }

	  raw(prop, defaultType) {
	    let str = new Stringifier();
	    return str.raw(this, prop, defaultType)
	  }

	  remove() {
	    if (this.parent) {
	      this.parent.removeChild(this);
	    }
	    this.parent = undefined;
	    return this
	  }

	  replaceWith(...nodes) {
	    if (this.parent) {
	      let bookmark = this;
	      let foundSelf = false;
	      for (let node of nodes) {
	        if (node === this) {
	          foundSelf = true;
	        } else if (foundSelf) {
	          this.parent.insertAfter(bookmark, node);
	          bookmark = node;
	        } else {
	          this.parent.insertBefore(bookmark, node);
	        }
	      }

	      if (!foundSelf) {
	        this.remove();
	      }
	    }

	    return this
	  }

	  root() {
	    let result = this;
	    while (result.parent && result.parent.type !== 'document') {
	      result = result.parent;
	    }
	    return result
	  }

	  toJSON(_, inputs) {
	    let fixed = {};
	    let emitInputs = inputs == null;
	    inputs = inputs || new Map();
	    let inputsNextIndex = 0;

	    for (let name in this) {
	      if (!Object.prototype.hasOwnProperty.call(this, name)) {
	        /* c8 ignore next 2 */
	        continue
	      }
	      if (name === 'parent' || name === 'proxyCache') continue
	      let value = this[name];

	      if (Array.isArray(value)) {
	        fixed[name] = value.map(i => {
	          if (typeof i === 'object' && i.toJSON) {
	            return i.toJSON(null, inputs)
	          } else {
	            return i
	          }
	        });
	      } else if (typeof value === 'object' && value.toJSON) {
	        fixed[name] = value.toJSON(null, inputs);
	      } else if (name === 'source') {
	        if (value == null) continue
	        let inputId = inputs.get(value.input);
	        if (inputId == null) {
	          inputId = inputsNextIndex;
	          inputs.set(value.input, inputsNextIndex);
	          inputsNextIndex++;
	        }
	        fixed[name] = {
	          end: value.end,
	          inputId,
	          start: value.start
	        };
	      } else {
	        fixed[name] = value;
	      }
	    }

	    if (emitInputs) {
	      fixed.inputs = [...inputs.keys()].map(input => input.toJSON());
	    }

	    return fixed
	  }

	  toProxy() {
	    if (!this.proxyCache) {
	      this.proxyCache = new Proxy(this, this.getProxyProcessor());
	    }
	    return this.proxyCache
	  }

	  toString(stringifier = stringify) {
	    if (stringifier.stringify) stringifier = stringifier.stringify;
	    let result = '';
	    stringifier(this, i => {
	      result += i;
	    });
	    return result
	  }

	  warn(result, text, opts = {}) {
	    let data = { node: this };
	    for (let i in opts) data[i] = opts[i];
	    return result.warn(text, data)
	  }
	}

	node = Node;
	Node.default = Node;
	return node;
}

var comment;
var hasRequiredComment;

function requireComment () {
	if (hasRequiredComment) return comment;
	hasRequiredComment = 1;

	let Node = requireNode();

	class Comment extends Node {
	  constructor(defaults) {
	    super(defaults);
	    this.type = 'comment';
	  }
	}

	comment = Comment;
	Comment.default = Comment;
	return comment;
}

var declaration;
var hasRequiredDeclaration;

function requireDeclaration () {
	if (hasRequiredDeclaration) return declaration;
	hasRequiredDeclaration = 1;

	let Node = requireNode();

	class Declaration extends Node {
	  get variable() {
	    return this.prop.startsWith('--') || this.prop[0] === '$'
	  }

	  constructor(defaults) {
	    if (
	      defaults &&
	      typeof defaults.value !== 'undefined' &&
	      typeof defaults.value !== 'string'
	    ) {
	      defaults = { ...defaults, value: String(defaults.value) };
	    }
	    super(defaults);
	    this.type = 'decl';
	  }
	}

	declaration = Declaration;
	Declaration.default = Declaration;
	return declaration;
}

var container$1;
var hasRequiredContainer;

function requireContainer () {
	if (hasRequiredContainer) return container$1;
	hasRequiredContainer = 1;

	let Comment = requireComment();
	let Declaration = requireDeclaration();
	let Node = requireNode();
	let { isClean, my } = requireSymbols();

	let AtRule, parse, Root, Rule;

	function cleanSource(nodes) {
	  return nodes.map(i => {
	    if (i.nodes) i.nodes = cleanSource(i.nodes);
	    delete i.source;
	    return i
	  })
	}

	function markTreeDirty(node) {
	  node[isClean] = false;
	  if (node.proxyOf.nodes) {
	    for (let i of node.proxyOf.nodes) {
	      markTreeDirty(i);
	    }
	  }
	}

	class Container extends Node {
	  get first() {
	    if (!this.proxyOf.nodes) return undefined
	    return this.proxyOf.nodes[0]
	  }

	  get last() {
	    if (!this.proxyOf.nodes) return undefined
	    return this.proxyOf.nodes[this.proxyOf.nodes.length - 1]
	  }

	  append(...children) {
	    for (let child of children) {
	      let nodes = this.normalize(child, this.last);
	      for (let node of nodes) this.proxyOf.nodes.push(node);
	    }

	    this.markDirty();

	    return this
	  }

	  cleanRaws(keepBetween) {
	    super.cleanRaws(keepBetween);
	    if (this.nodes) {
	      for (let node of this.nodes) node.cleanRaws(keepBetween);
	    }
	  }

	  each(callback) {
	    if (!this.proxyOf.nodes) return undefined
	    let iterator = this.getIterator();

	    let index, result;
	    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
	      index = this.indexes[iterator];
	      result = callback(this.proxyOf.nodes[index], index);
	      if (result === false) break

	      this.indexes[iterator] += 1;
	    }

	    delete this.indexes[iterator];
	    return result
	  }

	  every(condition) {
	    return this.nodes.every(condition)
	  }

	  getIterator() {
	    if (!this.lastEach) this.lastEach = 0;
	    if (!this.indexes) this.indexes = {};

	    this.lastEach += 1;
	    let iterator = this.lastEach;
	    this.indexes[iterator] = 0;

	    return iterator
	  }

	  getProxyProcessor() {
	    return {
	      get(node, prop) {
	        if (prop === 'proxyOf') {
	          return node
	        } else if (!node[prop]) {
	          return node[prop]
	        } else if (
	          prop === 'each' ||
	          (typeof prop === 'string' && prop.startsWith('walk'))
	        ) {
	          return (...args) => {
	            return node[prop](
	              ...args.map(i => {
	                if (typeof i === 'function') {
	                  return (child, index) => i(child.toProxy(), index)
	                } else {
	                  return i
	                }
	              })
	            )
	          }
	        } else if (prop === 'every' || prop === 'some') {
	          return cb => {
	            return node[prop]((child, ...other) =>
	              cb(child.toProxy(), ...other)
	            )
	          }
	        } else if (prop === 'root') {
	          return () => node.root().toProxy()
	        } else if (prop === 'nodes') {
	          return node.nodes.map(i => i.toProxy())
	        } else if (prop === 'first' || prop === 'last') {
	          return node[prop].toProxy()
	        } else {
	          return node[prop]
	        }
	      },

	      set(node, prop, value) {
	        if (node[prop] === value) return true
	        node[prop] = value;
	        if (prop === 'name' || prop === 'params' || prop === 'selector') {
	          node.markDirty();
	        }
	        return true
	      }
	    }
	  }

	  index(child) {
	    if (typeof child === 'number') return child
	    if (child.proxyOf) child = child.proxyOf;
	    return this.proxyOf.nodes.indexOf(child)
	  }

	  insertAfter(exist, add) {
	    let existIndex = this.index(exist);
	    let nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
	    existIndex = this.index(exist);
	    for (let node of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node);

	    let index;
	    for (let id in this.indexes) {
	      index = this.indexes[id];
	      if (existIndex < index) {
	        this.indexes[id] = index + nodes.length;
	      }
	    }

	    this.markDirty();

	    return this
	  }

	  insertBefore(exist, add) {
	    let existIndex = this.index(exist);
	    let type = existIndex === 0 ? 'prepend' : false;
	    let nodes = this.normalize(
	      add,
	      this.proxyOf.nodes[existIndex],
	      type
	    ).reverse();
	    existIndex = this.index(exist);
	    for (let node of nodes) this.proxyOf.nodes.splice(existIndex, 0, node);

	    let index;
	    for (let id in this.indexes) {
	      index = this.indexes[id];
	      if (existIndex <= index) {
	        this.indexes[id] = index + nodes.length;
	      }
	    }

	    this.markDirty();

	    return this
	  }

	  normalize(nodes, sample) {
	    if (typeof nodes === 'string') {
	      nodes = cleanSource(parse(nodes).nodes);
	    } else if (typeof nodes === 'undefined') {
	      nodes = [];
	    } else if (Array.isArray(nodes)) {
	      nodes = nodes.slice(0);
	      for (let i of nodes) {
	        if (i.parent) i.parent.removeChild(i, 'ignore');
	      }
	    } else if (nodes.type === 'root' && this.type !== 'document') {
	      nodes = nodes.nodes.slice(0);
	      for (let i of nodes) {
	        if (i.parent) i.parent.removeChild(i, 'ignore');
	      }
	    } else if (nodes.type) {
	      nodes = [nodes];
	    } else if (nodes.prop) {
	      if (typeof nodes.value === 'undefined') {
	        throw new Error('Value field is missed in node creation')
	      } else if (typeof nodes.value !== 'string') {
	        nodes.value = String(nodes.value);
	      }
	      nodes = [new Declaration(nodes)];
	    } else if (nodes.selector || nodes.selectors) {
	      nodes = [new Rule(nodes)];
	    } else if (nodes.name) {
	      nodes = [new AtRule(nodes)];
	    } else if (nodes.text) {
	      nodes = [new Comment(nodes)];
	    } else {
	      throw new Error('Unknown node type in node creation')
	    }

	    let processed = nodes.map(i => {
	      /* c8 ignore next */
	      if (!i[my]) Container.rebuild(i);
	      i = i.proxyOf;
	      if (i.parent) i.parent.removeChild(i);
	      if (i[isClean]) markTreeDirty(i);

	      if (!i.raws) i.raws = {};
	      if (typeof i.raws.before === 'undefined') {
	        if (sample && typeof sample.raws.before !== 'undefined') {
	          i.raws.before = sample.raws.before.replace(/\S/g, '');
	        }
	      }
	      i.parent = this.proxyOf;
	      return i
	    });

	    return processed
	  }

	  prepend(...children) {
	    children = children.reverse();
	    for (let child of children) {
	      let nodes = this.normalize(child, this.first, 'prepend').reverse();
	      for (let node of nodes) this.proxyOf.nodes.unshift(node);
	      for (let id in this.indexes) {
	        this.indexes[id] = this.indexes[id] + nodes.length;
	      }
	    }

	    this.markDirty();

	    return this
	  }

	  push(child) {
	    child.parent = this;
	    this.proxyOf.nodes.push(child);
	    return this
	  }

	  removeAll() {
	    for (let node of this.proxyOf.nodes) node.parent = undefined;
	    this.proxyOf.nodes = [];

	    this.markDirty();

	    return this
	  }

	  removeChild(child) {
	    child = this.index(child);
	    this.proxyOf.nodes[child].parent = undefined;
	    this.proxyOf.nodes.splice(child, 1);

	    let index;
	    for (let id in this.indexes) {
	      index = this.indexes[id];
	      if (index >= child) {
	        this.indexes[id] = index - 1;
	      }
	    }

	    this.markDirty();

	    return this
	  }

	  replaceValues(pattern, opts, callback) {
	    if (!callback) {
	      callback = opts;
	      opts = {};
	    }

	    this.walkDecls(decl => {
	      if (opts.props && !opts.props.includes(decl.prop)) return
	      if (opts.fast && !decl.value.includes(opts.fast)) return

	      decl.value = decl.value.replace(pattern, callback);
	    });

	    this.markDirty();

	    return this
	  }

	  some(condition) {
	    return this.nodes.some(condition)
	  }

	  walk(callback) {
	    return this.each((child, i) => {
	      let result;
	      try {
	        result = callback(child, i);
	      } catch (e) {
	        throw child.addToError(e)
	      }
	      if (result !== false && child.walk) {
	        result = child.walk(callback);
	      }

	      return result
	    })
	  }

	  walkAtRules(name, callback) {
	    if (!callback) {
	      callback = name;
	      return this.walk((child, i) => {
	        if (child.type === 'atrule') {
	          return callback(child, i)
	        }
	      })
	    }
	    if (name instanceof RegExp) {
	      return this.walk((child, i) => {
	        if (child.type === 'atrule' && name.test(child.name)) {
	          return callback(child, i)
	        }
	      })
	    }
	    return this.walk((child, i) => {
	      if (child.type === 'atrule' && child.name === name) {
	        return callback(child, i)
	      }
	    })
	  }

	  walkComments(callback) {
	    return this.walk((child, i) => {
	      if (child.type === 'comment') {
	        return callback(child, i)
	      }
	    })
	  }

	  walkDecls(prop, callback) {
	    if (!callback) {
	      callback = prop;
	      return this.walk((child, i) => {
	        if (child.type === 'decl') {
	          return callback(child, i)
	        }
	      })
	    }
	    if (prop instanceof RegExp) {
	      return this.walk((child, i) => {
	        if (child.type === 'decl' && prop.test(child.prop)) {
	          return callback(child, i)
	        }
	      })
	    }
	    return this.walk((child, i) => {
	      if (child.type === 'decl' && child.prop === prop) {
	        return callback(child, i)
	      }
	    })
	  }

	  walkRules(selector, callback) {
	    if (!callback) {
	      callback = selector;

	      return this.walk((child, i) => {
	        if (child.type === 'rule') {
	          return callback(child, i)
	        }
	      })
	    }
	    if (selector instanceof RegExp) {
	      return this.walk((child, i) => {
	        if (child.type === 'rule' && selector.test(child.selector)) {
	          return callback(child, i)
	        }
	      })
	    }
	    return this.walk((child, i) => {
	      if (child.type === 'rule' && child.selector === selector) {
	        return callback(child, i)
	      }
	    })
	  }
	}

	Container.registerParse = dependant => {
	  parse = dependant;
	};

	Container.registerRule = dependant => {
	  Rule = dependant;
	};

	Container.registerAtRule = dependant => {
	  AtRule = dependant;
	};

	Container.registerRoot = dependant => {
	  Root = dependant;
	};

	container$1 = Container;
	Container.default = Container;

	/* c8 ignore start */
	Container.rebuild = node => {
	  if (node.type === 'atrule') {
	    Object.setPrototypeOf(node, AtRule.prototype);
	  } else if (node.type === 'rule') {
	    Object.setPrototypeOf(node, Rule.prototype);
	  } else if (node.type === 'decl') {
	    Object.setPrototypeOf(node, Declaration.prototype);
	  } else if (node.type === 'comment') {
	    Object.setPrototypeOf(node, Comment.prototype);
	  } else if (node.type === 'root') {
	    Object.setPrototypeOf(node, Root.prototype);
	  }

	  node[my] = true;

	  if (node.nodes) {
	    node.nodes.forEach(child => {
	      Container.rebuild(child);
	    });
	  }
	};
	/* c8 ignore stop */
	return container$1;
}

var atRule;
var hasRequiredAtRule;

function requireAtRule () {
	if (hasRequiredAtRule) return atRule;
	hasRequiredAtRule = 1;

	let Container = requireContainer();

	class AtRule extends Container {
	  constructor(defaults) {
	    super(defaults);
	    this.type = 'atrule';
	  }

	  append(...children) {
	    if (!this.proxyOf.nodes) this.nodes = [];
	    return super.append(...children)
	  }

	  prepend(...children) {
	    if (!this.proxyOf.nodes) this.nodes = [];
	    return super.prepend(...children)
	  }
	}

	atRule = AtRule;
	AtRule.default = AtRule;

	Container.registerAtRule(AtRule);
	return atRule;
}

var document$1;
var hasRequiredDocument;

function requireDocument () {
	if (hasRequiredDocument) return document$1;
	hasRequiredDocument = 1;

	let Container = requireContainer();

	let LazyResult, Processor;

	class Document extends Container {
	  constructor(defaults) {
	    // type needs to be passed to super, otherwise child roots won't be normalized correctly
	    super({ type: 'document', ...defaults });

	    if (!this.nodes) {
	      this.nodes = [];
	    }
	  }

	  toResult(opts = {}) {
	    let lazy = new LazyResult(new Processor(), this, opts);

	    return lazy.stringify()
	  }
	}

	Document.registerLazyResult = dependant => {
	  LazyResult = dependant;
	};

	Document.registerProcessor = dependant => {
	  Processor = dependant;
	};

	document$1 = Document;
	Document.default = Document;
	return document$1;
}

var nonSecure;
var hasRequiredNonSecure;

function requireNonSecure () {
	if (hasRequiredNonSecure) return nonSecure;
	hasRequiredNonSecure = 1;
	// This alphabet uses `A-Za-z0-9_-` symbols.
	// The order of characters is optimized for better gzip and brotli compression.
	// References to the same file (works both for gzip and brotli):
	// `'use`, `andom`, and `rict'`
	// References to the brotli default dictionary:
	// `-26T`, `1983`, `40px`, `75px`, `bush`, `jack`, `mind`, `very`, and `wolf`
	let urlAlphabet =
	  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict';

	let customAlphabet = (alphabet, defaultSize = 21) => {
	  return (size = defaultSize) => {
	    let id = '';
	    // A compact alternative for `for (var i = 0; i < step; i++)`.
	    let i = size | 0;
	    while (i--) {
	      // `| 0` is more compact and faster than `Math.floor()`.
	      id += alphabet[(Math.random() * alphabet.length) | 0];
	    }
	    return id
	  }
	};

	let nanoid = (size = 21) => {
	  let id = '';
	  // A compact alternative for `for (var i = 0; i < step; i++)`.
	  let i = size | 0;
	  while (i--) {
	    // `| 0` is more compact and faster than `Math.floor()`.
	    id += urlAlphabet[(Math.random() * 64) | 0];
	  }
	  return id
	};

	nonSecure = { nanoid, customAlphabet };
	return nonSecure;
}

var sourceMap = {};

var sourceMapGenerator = {};

var base64Vlq = {};

var base64 = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredBase64;

function requireBase64 () {
	if (hasRequiredBase64) return base64;
	hasRequiredBase64 = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

	/**
	 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	 */
	base64.encode = function (number) {
	  if (0 <= number && number < intToCharMap.length) {
	    return intToCharMap[number];
	  }
	  throw new TypeError("Must be between 0 and 63: " + number);
	};

	/**
	 * Decode a single base 64 character code digit to an integer. Returns -1 on
	 * failure.
	 */
	base64.decode = function (charCode) {
	  var bigA = 65;     // 'A'
	  var bigZ = 90;     // 'Z'

	  var littleA = 97;  // 'a'
	  var littleZ = 122; // 'z'

	  var zero = 48;     // '0'
	  var nine = 57;     // '9'

	  var plus = 43;     // '+'
	  var slash = 47;    // '/'

	  var littleOffset = 26;
	  var numberOffset = 52;

	  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
	  if (bigA <= charCode && charCode <= bigZ) {
	    return (charCode - bigA);
	  }

	  // 26 - 51: abcdefghijklmnopqrstuvwxyz
	  if (littleA <= charCode && charCode <= littleZ) {
	    return (charCode - littleA + littleOffset);
	  }

	  // 52 - 61: 0123456789
	  if (zero <= charCode && charCode <= nine) {
	    return (charCode - zero + numberOffset);
	  }

	  // 62: +
	  if (charCode == plus) {
	    return 62;
	  }

	  // 63: /
	  if (charCode == slash) {
	    return 63;
	  }

	  // Invalid base64 digit.
	  return -1;
	};
	return base64;
}

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredBase64Vlq;

function requireBase64Vlq () {
	if (hasRequiredBase64Vlq) return base64Vlq;
	hasRequiredBase64Vlq = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */

	var base64 = requireBase64();

	// A single base 64 digit can contain 6 bits of data. For the base 64 variable
	// length quantities we use in the source map spec, the first bit is the sign,
	// the next four bits are the actual value, and the 6th bit is the
	// continuation bit. The continuation bit tells us whether there are more
	// digits in this value following this digit.
	//
	//   Continuation
	//   |    Sign
	//   |    |
	//   V    V
	//   101011

	var VLQ_BASE_SHIFT = 5;

	// binary: 100000
	var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

	// binary: 011111
	var VLQ_BASE_MASK = VLQ_BASE - 1;

	// binary: 100000
	var VLQ_CONTINUATION_BIT = VLQ_BASE;

	/**
	 * Converts from a two-complement value to a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	 */
	function toVLQSigned(aValue) {
	  return aValue < 0
	    ? ((-aValue) << 1) + 1
	    : (aValue << 1) + 0;
	}

	/**
	 * Converts to a two-complement value from a value where the sign bit is
	 * placed in the least significant bit.  For example, as decimals:
	 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	 */
	function fromVLQSigned(aValue) {
	  var isNegative = (aValue & 1) === 1;
	  var shifted = aValue >> 1;
	  return isNegative
	    ? -shifted
	    : shifted;
	}

	/**
	 * Returns the base 64 VLQ encoded value.
	 */
	base64Vlq.encode = function base64VLQ_encode(aValue) {
	  var encoded = "";
	  var digit;

	  var vlq = toVLQSigned(aValue);

	  do {
	    digit = vlq & VLQ_BASE_MASK;
	    vlq >>>= VLQ_BASE_SHIFT;
	    if (vlq > 0) {
	      // There are still more digits in this value, so we must make sure the
	      // continuation bit is marked.
	      digit |= VLQ_CONTINUATION_BIT;
	    }
	    encoded += base64.encode(digit);
	  } while (vlq > 0);

	  return encoded;
	};

	/**
	 * Decodes the next base 64 VLQ value from the given string and returns the
	 * value and the rest of the string via the out parameter.
	 */
	base64Vlq.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
	  var strLen = aStr.length;
	  var result = 0;
	  var shift = 0;
	  var continuation, digit;

	  do {
	    if (aIndex >= strLen) {
	      throw new Error("Expected more digits in base 64 VLQ value.");
	    }

	    digit = base64.decode(aStr.charCodeAt(aIndex++));
	    if (digit === -1) {
	      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
	    }

	    continuation = !!(digit & VLQ_CONTINUATION_BIT);
	    digit &= VLQ_BASE_MASK;
	    result = result + (digit << shift);
	    shift += VLQ_BASE_SHIFT;
	  } while (continuation);

	  aOutParam.value = fromVLQSigned(result);
	  aOutParam.rest = aIndex;
	};
	return base64Vlq;
}

var util = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredUtil;

function requireUtil () {
	if (hasRequiredUtil) return util;
	hasRequiredUtil = 1;
	(function (exports$1) {
		/*
		 * Copyright 2011 Mozilla Foundation and contributors
		 * Licensed under the New BSD license. See LICENSE or:
		 * http://opensource.org/licenses/BSD-3-Clause
		 */

		/**
		 * This is a helper function for getting values from parameter/options
		 * objects.
		 *
		 * @param args The object we are extracting values from
		 * @param name The name of the property we are getting.
		 * @param defaultValue An optional value to return if the property is missing
		 * from the object. If this is not specified and the property is missing, an
		 * error will be thrown.
		 */
		function getArg(aArgs, aName, aDefaultValue) {
		  if (aName in aArgs) {
		    return aArgs[aName];
		  } else if (arguments.length === 3) {
		    return aDefaultValue;
		  } else {
		    throw new Error('"' + aName + '" is a required argument.');
		  }
		}
		exports$1.getArg = getArg;

		var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
		var dataUrlRegexp = /^data:.+\,.+$/;

		function urlParse(aUrl) {
		  var match = aUrl.match(urlRegexp);
		  if (!match) {
		    return null;
		  }
		  return {
		    scheme: match[1],
		    auth: match[2],
		    host: match[3],
		    port: match[4],
		    path: match[5]
		  };
		}
		exports$1.urlParse = urlParse;

		function urlGenerate(aParsedUrl) {
		  var url = '';
		  if (aParsedUrl.scheme) {
		    url += aParsedUrl.scheme + ':';
		  }
		  url += '//';
		  if (aParsedUrl.auth) {
		    url += aParsedUrl.auth + '@';
		  }
		  if (aParsedUrl.host) {
		    url += aParsedUrl.host;
		  }
		  if (aParsedUrl.port) {
		    url += ":" + aParsedUrl.port;
		  }
		  if (aParsedUrl.path) {
		    url += aParsedUrl.path;
		  }
		  return url;
		}
		exports$1.urlGenerate = urlGenerate;

		var MAX_CACHED_INPUTS = 32;

		/**
		 * Takes some function `f(input) -> result` and returns a memoized version of
		 * `f`.
		 *
		 * We keep at most `MAX_CACHED_INPUTS` memoized results of `f` alive. The
		 * memoization is a dumb-simple, linear least-recently-used cache.
		 */
		function lruMemoize(f) {
		  var cache = [];

		  return function(input) {
		    for (var i = 0; i < cache.length; i++) {
		      if (cache[i].input === input) {
		        var temp = cache[0];
		        cache[0] = cache[i];
		        cache[i] = temp;
		        return cache[0].result;
		      }
		    }

		    var result = f(input);

		    cache.unshift({
		      input,
		      result,
		    });

		    if (cache.length > MAX_CACHED_INPUTS) {
		      cache.pop();
		    }

		    return result;
		  };
		}

		/**
		 * Normalizes a path, or the path portion of a URL:
		 *
		 * - Replaces consecutive slashes with one slash.
		 * - Removes unnecessary '.' parts.
		 * - Removes unnecessary '<dir>/..' parts.
		 *
		 * Based on code in the Node.js 'path' core module.
		 *
		 * @param aPath The path or url to normalize.
		 */
		var normalize = lruMemoize(function normalize(aPath) {
		  var path = aPath;
		  var url = urlParse(aPath);
		  if (url) {
		    if (!url.path) {
		      return aPath;
		    }
		    path = url.path;
		  }
		  var isAbsolute = exports$1.isAbsolute(path);
		  // Split the path into parts between `/` characters. This is much faster than
		  // using `.split(/\/+/g)`.
		  var parts = [];
		  var start = 0;
		  var i = 0;
		  while (true) {
		    start = i;
		    i = path.indexOf("/", start);
		    if (i === -1) {
		      parts.push(path.slice(start));
		      break;
		    } else {
		      parts.push(path.slice(start, i));
		      while (i < path.length && path[i] === "/") {
		        i++;
		      }
		    }
		  }

		  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
		    part = parts[i];
		    if (part === '.') {
		      parts.splice(i, 1);
		    } else if (part === '..') {
		      up++;
		    } else if (up > 0) {
		      if (part === '') {
		        // The first part is blank if the path is absolute. Trying to go
		        // above the root is a no-op. Therefore we can remove all '..' parts
		        // directly after the root.
		        parts.splice(i + 1, up);
		        up = 0;
		      } else {
		        parts.splice(i, 2);
		        up--;
		      }
		    }
		  }
		  path = parts.join('/');

		  if (path === '') {
		    path = isAbsolute ? '/' : '.';
		  }

		  if (url) {
		    url.path = path;
		    return urlGenerate(url);
		  }
		  return path;
		});
		exports$1.normalize = normalize;

		/**
		 * Joins two paths/URLs.
		 *
		 * @param aRoot The root path or URL.
		 * @param aPath The path or URL to be joined with the root.
		 *
		 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
		 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
		 *   first.
		 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
		 *   is updated with the result and aRoot is returned. Otherwise the result
		 *   is returned.
		 *   - If aPath is absolute, the result is aPath.
		 *   - Otherwise the two paths are joined with a slash.
		 * - Joining for example 'http://' and 'www.example.com' is also supported.
		 */
		function join(aRoot, aPath) {
		  if (aRoot === "") {
		    aRoot = ".";
		  }
		  if (aPath === "") {
		    aPath = ".";
		  }
		  var aPathUrl = urlParse(aPath);
		  var aRootUrl = urlParse(aRoot);
		  if (aRootUrl) {
		    aRoot = aRootUrl.path || '/';
		  }

		  // `join(foo, '//www.example.org')`
		  if (aPathUrl && !aPathUrl.scheme) {
		    if (aRootUrl) {
		      aPathUrl.scheme = aRootUrl.scheme;
		    }
		    return urlGenerate(aPathUrl);
		  }

		  if (aPathUrl || aPath.match(dataUrlRegexp)) {
		    return aPath;
		  }

		  // `join('http://', 'www.example.com')`
		  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
		    aRootUrl.host = aPath;
		    return urlGenerate(aRootUrl);
		  }

		  var joined = aPath.charAt(0) === '/'
		    ? aPath
		    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

		  if (aRootUrl) {
		    aRootUrl.path = joined;
		    return urlGenerate(aRootUrl);
		  }
		  return joined;
		}
		exports$1.join = join;

		exports$1.isAbsolute = function (aPath) {
		  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
		};

		/**
		 * Make a path relative to a URL or another path.
		 *
		 * @param aRoot The root path or URL.
		 * @param aPath The path or URL to be made relative to aRoot.
		 */
		function relative(aRoot, aPath) {
		  if (aRoot === "") {
		    aRoot = ".";
		  }

		  aRoot = aRoot.replace(/\/$/, '');

		  // It is possible for the path to be above the root. In this case, simply
		  // checking whether the root is a prefix of the path won't work. Instead, we
		  // need to remove components from the root one by one, until either we find
		  // a prefix that fits, or we run out of components to remove.
		  var level = 0;
		  while (aPath.indexOf(aRoot + '/') !== 0) {
		    var index = aRoot.lastIndexOf("/");
		    if (index < 0) {
		      return aPath;
		    }

		    // If the only part of the root that is left is the scheme (i.e. http://,
		    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
		    // have exhausted all components, so the path is not relative to the root.
		    aRoot = aRoot.slice(0, index);
		    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
		      return aPath;
		    }

		    ++level;
		  }

		  // Make sure we add a "../" for each component we removed from the root.
		  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
		}
		exports$1.relative = relative;

		var supportsNullProto = (function () {
		  var obj = Object.create(null);
		  return !('__proto__' in obj);
		}());

		function identity (s) {
		  return s;
		}

		/**
		 * Because behavior goes wacky when you set `__proto__` on objects, we
		 * have to prefix all the strings in our set with an arbitrary character.
		 *
		 * See https://github.com/mozilla/source-map/pull/31 and
		 * https://github.com/mozilla/source-map/issues/30
		 *
		 * @param String aStr
		 */
		function toSetString(aStr) {
		  if (isProtoString(aStr)) {
		    return '$' + aStr;
		  }

		  return aStr;
		}
		exports$1.toSetString = supportsNullProto ? identity : toSetString;

		function fromSetString(aStr) {
		  if (isProtoString(aStr)) {
		    return aStr.slice(1);
		  }

		  return aStr;
		}
		exports$1.fromSetString = supportsNullProto ? identity : fromSetString;

		function isProtoString(s) {
		  if (!s) {
		    return false;
		  }

		  var length = s.length;

		  if (length < 9 /* "__proto__".length */) {
		    return false;
		  }

		  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
		      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
		      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
		      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
		      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
		      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
		      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
		      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
		      s.charCodeAt(length - 9) !== 95  /* '_' */) {
		    return false;
		  }

		  for (var i = length - 10; i >= 0; i--) {
		    if (s.charCodeAt(i) !== 36 /* '$' */) {
		      return false;
		    }
		  }

		  return true;
		}

		/**
		 * Comparator between two mappings where the original positions are compared.
		 *
		 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
		 * mappings with the same original source/line/column, but different generated
		 * line and column the same. Useful when searching for a mapping with a
		 * stubbed out mapping.
		 */
		function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
		  var cmp = strcmp(mappingA.source, mappingB.source);
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalLine - mappingB.originalLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalColumn - mappingB.originalColumn;
		  if (cmp !== 0 || onlyCompareOriginal) {
		    return cmp;
		  }

		  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.generatedLine - mappingB.generatedLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  return strcmp(mappingA.name, mappingB.name);
		}
		exports$1.compareByOriginalPositions = compareByOriginalPositions;

		function compareByOriginalPositionsNoSource(mappingA, mappingB, onlyCompareOriginal) {
		  var cmp;

		  cmp = mappingA.originalLine - mappingB.originalLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalColumn - mappingB.originalColumn;
		  if (cmp !== 0 || onlyCompareOriginal) {
		    return cmp;
		  }

		  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.generatedLine - mappingB.generatedLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  return strcmp(mappingA.name, mappingB.name);
		}
		exports$1.compareByOriginalPositionsNoSource = compareByOriginalPositionsNoSource;

		/**
		 * Comparator between two mappings with deflated source and name indices where
		 * the generated positions are compared.
		 *
		 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
		 * mappings with the same generated line and column, but different
		 * source/name/original line and column the same. Useful when searching for a
		 * mapping with a stubbed out mapping.
		 */
		function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
		  var cmp = mappingA.generatedLine - mappingB.generatedLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		  if (cmp !== 0 || onlyCompareGenerated) {
		    return cmp;
		  }

		  cmp = strcmp(mappingA.source, mappingB.source);
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalLine - mappingB.originalLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalColumn - mappingB.originalColumn;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  return strcmp(mappingA.name, mappingB.name);
		}
		exports$1.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

		function compareByGeneratedPositionsDeflatedNoLine(mappingA, mappingB, onlyCompareGenerated) {
		  var cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		  if (cmp !== 0 || onlyCompareGenerated) {
		    return cmp;
		  }

		  cmp = strcmp(mappingA.source, mappingB.source);
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalLine - mappingB.originalLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalColumn - mappingB.originalColumn;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  return strcmp(mappingA.name, mappingB.name);
		}
		exports$1.compareByGeneratedPositionsDeflatedNoLine = compareByGeneratedPositionsDeflatedNoLine;

		function strcmp(aStr1, aStr2) {
		  if (aStr1 === aStr2) {
		    return 0;
		  }

		  if (aStr1 === null) {
		    return 1; // aStr2 !== null
		  }

		  if (aStr2 === null) {
		    return -1; // aStr1 !== null
		  }

		  if (aStr1 > aStr2) {
		    return 1;
		  }

		  return -1;
		}

		/**
		 * Comparator between two mappings with inflated source and name strings where
		 * the generated positions are compared.
		 */
		function compareByGeneratedPositionsInflated(mappingA, mappingB) {
		  var cmp = mappingA.generatedLine - mappingB.generatedLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = strcmp(mappingA.source, mappingB.source);
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalLine - mappingB.originalLine;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  cmp = mappingA.originalColumn - mappingB.originalColumn;
		  if (cmp !== 0) {
		    return cmp;
		  }

		  return strcmp(mappingA.name, mappingB.name);
		}
		exports$1.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

		/**
		 * Strip any JSON XSSI avoidance prefix from the string (as documented
		 * in the source maps specification), and then parse the string as
		 * JSON.
		 */
		function parseSourceMapInput(str) {
		  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
		}
		exports$1.parseSourceMapInput = parseSourceMapInput;

		/**
		 * Compute the URL of a source given the the source root, the source's
		 * URL, and the source map's URL.
		 */
		function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
		  sourceURL = sourceURL || '';

		  if (sourceRoot) {
		    // This follows what Chrome does.
		    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
		      sourceRoot += '/';
		    }
		    // The spec says:
		    //   Line 4: An optional source root, useful for relocating source
		    //   files on a server or removing repeated values in the
		    //   “sources” entry.  This value is prepended to the individual
		    //   entries in the “source” field.
		    sourceURL = sourceRoot + sourceURL;
		  }

		  // Historically, SourceMapConsumer did not take the sourceMapURL as
		  // a parameter.  This mode is still somewhat supported, which is why
		  // this code block is conditional.  However, it's preferable to pass
		  // the source map URL to SourceMapConsumer, so that this function
		  // can implement the source URL resolution algorithm as outlined in
		  // the spec.  This block is basically the equivalent of:
		  //    new URL(sourceURL, sourceMapURL).toString()
		  // ... except it avoids using URL, which wasn't available in the
		  // older releases of node still supported by this library.
		  //
		  // The spec says:
		  //   If the sources are not absolute URLs after prepending of the
		  //   “sourceRoot”, the sources are resolved relative to the
		  //   SourceMap (like resolving script src in a html document).
		  if (sourceMapURL) {
		    var parsed = urlParse(sourceMapURL);
		    if (!parsed) {
		      throw new Error("sourceMapURL could not be parsed");
		    }
		    if (parsed.path) {
		      // Strip the last path component, but keep the "/".
		      var index = parsed.path.lastIndexOf('/');
		      if (index >= 0) {
		        parsed.path = parsed.path.substring(0, index + 1);
		      }
		    }
		    sourceURL = join(urlGenerate(parsed), sourceURL);
		  }

		  return normalize(sourceURL);
		}
		exports$1.computeSourceURL = computeSourceURL; 
	} (util));
	return util;
}

var arraySet = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredArraySet;

function requireArraySet () {
	if (hasRequiredArraySet) return arraySet;
	hasRequiredArraySet = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	var util = requireUtil();
	var has = Object.prototype.hasOwnProperty;
	var hasNativeMap = typeof Map !== "undefined";

	/**
	 * A data structure which is a combination of an array and a set. Adding a new
	 * member is O(1), testing for membership is O(1), and finding the index of an
	 * element is O(1). Removing elements from the set is not supported. Only
	 * strings are supported for membership.
	 */
	function ArraySet() {
	  this._array = [];
	  this._set = hasNativeMap ? new Map() : Object.create(null);
	}

	/**
	 * Static method for creating ArraySet instances from an existing array.
	 */
	ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	  var set = new ArraySet();
	  for (var i = 0, len = aArray.length; i < len; i++) {
	    set.add(aArray[i], aAllowDuplicates);
	  }
	  return set;
	};

	/**
	 * Return how many unique items are in this ArraySet. If duplicates have been
	 * added, than those do not count towards the size.
	 *
	 * @returns Number
	 */
	ArraySet.prototype.size = function ArraySet_size() {
	  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
	};

	/**
	 * Add the given string to this set.
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	  var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
	  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
	  var idx = this._array.length;
	  if (!isDuplicate || aAllowDuplicates) {
	    this._array.push(aStr);
	  }
	  if (!isDuplicate) {
	    if (hasNativeMap) {
	      this._set.set(aStr, idx);
	    } else {
	      this._set[sStr] = idx;
	    }
	  }
	};

	/**
	 * Is the given string a member of this set?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.has = function ArraySet_has(aStr) {
	  if (hasNativeMap) {
	    return this._set.has(aStr);
	  } else {
	    var sStr = util.toSetString(aStr);
	    return has.call(this._set, sStr);
	  }
	};

	/**
	 * What is the index of the given string in the array?
	 *
	 * @param String aStr
	 */
	ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	  if (hasNativeMap) {
	    var idx = this._set.get(aStr);
	    if (idx >= 0) {
	        return idx;
	    }
	  } else {
	    var sStr = util.toSetString(aStr);
	    if (has.call(this._set, sStr)) {
	      return this._set[sStr];
	    }
	  }

	  throw new Error('"' + aStr + '" is not in the set.');
	};

	/**
	 * What is the element at the given index?
	 *
	 * @param Number aIdx
	 */
	ArraySet.prototype.at = function ArraySet_at(aIdx) {
	  if (aIdx >= 0 && aIdx < this._array.length) {
	    return this._array[aIdx];
	  }
	  throw new Error('No element indexed by ' + aIdx);
	};

	/**
	 * Returns the array representation of this set (which has the proper indices
	 * indicated by indexOf). Note that this is a copy of the internal array used
	 * for storing the members so that no one can mess with internal state.
	 */
	ArraySet.prototype.toArray = function ArraySet_toArray() {
	  return this._array.slice();
	};

	arraySet.ArraySet = ArraySet;
	return arraySet;
}

var mappingList = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredMappingList;

function requireMappingList () {
	if (hasRequiredMappingList) return mappingList;
	hasRequiredMappingList = 1;
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	var util = requireUtil();

	/**
	 * Determine whether mappingB is after mappingA with respect to generated
	 * position.
	 */
	function generatedPositionAfter(mappingA, mappingB) {
	  // Optimized for most common case
	  var lineA = mappingA.generatedLine;
	  var lineB = mappingB.generatedLine;
	  var columnA = mappingA.generatedColumn;
	  var columnB = mappingB.generatedColumn;
	  return lineB > lineA || lineB == lineA && columnB >= columnA ||
	         util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
	}

	/**
	 * A data structure to provide a sorted view of accumulated mappings in a
	 * performance conscious manner. It trades a neglibable overhead in general
	 * case for a large speedup in case of mappings being added in order.
	 */
	function MappingList() {
	  this._array = [];
	  this._sorted = true;
	  // Serves as infimum
	  this._last = {generatedLine: -1, generatedColumn: 0};
	}

	/**
	 * Iterate through internal items. This method takes the same arguments that
	 * `Array.prototype.forEach` takes.
	 *
	 * NOTE: The order of the mappings is NOT guaranteed.
	 */
	MappingList.prototype.unsortedForEach =
	  function MappingList_forEach(aCallback, aThisArg) {
	    this._array.forEach(aCallback, aThisArg);
	  };

	/**
	 * Add the given source mapping.
	 *
	 * @param Object aMapping
	 */
	MappingList.prototype.add = function MappingList_add(aMapping) {
	  if (generatedPositionAfter(this._last, aMapping)) {
	    this._last = aMapping;
	    this._array.push(aMapping);
	  } else {
	    this._sorted = false;
	    this._array.push(aMapping);
	  }
	};

	/**
	 * Returns the flat, sorted array of mappings. The mappings are sorted by
	 * generated position.
	 *
	 * WARNING: This method returns internal data without copying, for
	 * performance. The return value must NOT be mutated, and should be treated as
	 * an immutable borrow. If you want to take ownership, you must make your own
	 * copy.
	 */
	MappingList.prototype.toArray = function MappingList_toArray() {
	  if (!this._sorted) {
	    this._array.sort(util.compareByGeneratedPositionsInflated);
	    this._sorted = true;
	  }
	  return this._array;
	};

	mappingList.MappingList = MappingList;
	return mappingList;
}

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredSourceMapGenerator;

function requireSourceMapGenerator () {
	if (hasRequiredSourceMapGenerator) return sourceMapGenerator;
	hasRequiredSourceMapGenerator = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	var base64VLQ = requireBase64Vlq();
	var util = requireUtil();
	var ArraySet = requireArraySet().ArraySet;
	var MappingList = requireMappingList().MappingList;

	/**
	 * An instance of the SourceMapGenerator represents a source map which is
	 * being built incrementally. You may pass an object with the following
	 * properties:
	 *
	 *   - file: The filename of the generated source.
	 *   - sourceRoot: A root for all relative URLs in this source map.
	 */
	function SourceMapGenerator(aArgs) {
	  if (!aArgs) {
	    aArgs = {};
	  }
	  this._file = util.getArg(aArgs, 'file', null);
	  this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	  this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
	  this._ignoreInvalidMapping = util.getArg(aArgs, 'ignoreInvalidMapping', false);
	  this._sources = new ArraySet();
	  this._names = new ArraySet();
	  this._mappings = new MappingList();
	  this._sourcesContents = null;
	}

	SourceMapGenerator.prototype._version = 3;

	/**
	 * Creates a new SourceMapGenerator based on a SourceMapConsumer
	 *
	 * @param aSourceMapConsumer The SourceMap.
	 */
	SourceMapGenerator.fromSourceMap =
	  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer, generatorOps) {
	    var sourceRoot = aSourceMapConsumer.sourceRoot;
	    var generator = new SourceMapGenerator(Object.assign(generatorOps || {}, {
	      file: aSourceMapConsumer.file,
	      sourceRoot: sourceRoot
	    }));
	    aSourceMapConsumer.eachMapping(function (mapping) {
	      var newMapping = {
	        generated: {
	          line: mapping.generatedLine,
	          column: mapping.generatedColumn
	        }
	      };

	      if (mapping.source != null) {
	        newMapping.source = mapping.source;
	        if (sourceRoot != null) {
	          newMapping.source = util.relative(sourceRoot, newMapping.source);
	        }

	        newMapping.original = {
	          line: mapping.originalLine,
	          column: mapping.originalColumn
	        };

	        if (mapping.name != null) {
	          newMapping.name = mapping.name;
	        }
	      }

	      generator.addMapping(newMapping);
	    });
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var sourceRelative = sourceFile;
	      if (sourceRoot !== null) {
	        sourceRelative = util.relative(sourceRoot, sourceFile);
	      }

	      if (!generator._sources.has(sourceRelative)) {
	        generator._sources.add(sourceRelative);
	      }

	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        generator.setSourceContent(sourceFile, content);
	      }
	    });
	    return generator;
	  };

	/**
	 * Add a single mapping from original source line and column to the generated
	 * source's line and column for this source map being created. The mapping
	 * object should have the following properties:
	 *
	 *   - generated: An object with the generated line and column positions.
	 *   - original: An object with the original line and column positions.
	 *   - source: The original source file (relative to the sourceRoot).
	 *   - name: An optional original token name for this mapping.
	 */
	SourceMapGenerator.prototype.addMapping =
	  function SourceMapGenerator_addMapping(aArgs) {
	    var generated = util.getArg(aArgs, 'generated');
	    var original = util.getArg(aArgs, 'original', null);
	    var source = util.getArg(aArgs, 'source', null);
	    var name = util.getArg(aArgs, 'name', null);

	    if (!this._skipValidation) {
	      if (this._validateMapping(generated, original, source, name) === false) {
	        return;
	      }
	    }

	    if (source != null) {
	      source = String(source);
	      if (!this._sources.has(source)) {
	        this._sources.add(source);
	      }
	    }

	    if (name != null) {
	      name = String(name);
	      if (!this._names.has(name)) {
	        this._names.add(name);
	      }
	    }

	    this._mappings.add({
	      generatedLine: generated.line,
	      generatedColumn: generated.column,
	      originalLine: original != null && original.line,
	      originalColumn: original != null && original.column,
	      source: source,
	      name: name
	    });
	  };

	/**
	 * Set the source content for a source file.
	 */
	SourceMapGenerator.prototype.setSourceContent =
	  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	    var source = aSourceFile;
	    if (this._sourceRoot != null) {
	      source = util.relative(this._sourceRoot, source);
	    }

	    if (aSourceContent != null) {
	      // Add the source content to the _sourcesContents map.
	      // Create a new _sourcesContents map if the property is null.
	      if (!this._sourcesContents) {
	        this._sourcesContents = Object.create(null);
	      }
	      this._sourcesContents[util.toSetString(source)] = aSourceContent;
	    } else if (this._sourcesContents) {
	      // Remove the source file from the _sourcesContents map.
	      // If the _sourcesContents map is empty, set the property to null.
	      delete this._sourcesContents[util.toSetString(source)];
	      if (Object.keys(this._sourcesContents).length === 0) {
	        this._sourcesContents = null;
	      }
	    }
	  };

	/**
	 * Applies the mappings of a sub-source-map for a specific source file to the
	 * source map being generated. Each mapping to the supplied source file is
	 * rewritten using the supplied source map. Note: The resolution for the
	 * resulting mappings is the minimium of this map and the supplied map.
	 *
	 * @param aSourceMapConsumer The source map to be applied.
	 * @param aSourceFile Optional. The filename of the source file.
	 *        If omitted, SourceMapConsumer's file property will be used.
	 * @param aSourceMapPath Optional. The dirname of the path to the source map
	 *        to be applied. If relative, it is relative to the SourceMapConsumer.
	 *        This parameter is needed when the two source maps aren't in the same
	 *        directory, and the source map to be applied contains relative source
	 *        paths. If so, those relative source paths need to be rewritten
	 *        relative to the SourceMapGenerator.
	 */
	SourceMapGenerator.prototype.applySourceMap =
	  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
	    var sourceFile = aSourceFile;
	    // If aSourceFile is omitted, we will use the file property of the SourceMap
	    if (aSourceFile == null) {
	      if (aSourceMapConsumer.file == null) {
	        throw new Error(
	          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
	          'or the source map\'s "file" property. Both were omitted.'
	        );
	      }
	      sourceFile = aSourceMapConsumer.file;
	    }
	    var sourceRoot = this._sourceRoot;
	    // Make "sourceFile" relative if an absolute Url is passed.
	    if (sourceRoot != null) {
	      sourceFile = util.relative(sourceRoot, sourceFile);
	    }
	    // Applying the SourceMap can add and remove items from the sources and
	    // the names array.
	    var newSources = new ArraySet();
	    var newNames = new ArraySet();

	    // Find mappings for the "sourceFile"
	    this._mappings.unsortedForEach(function (mapping) {
	      if (mapping.source === sourceFile && mapping.originalLine != null) {
	        // Check if it can be mapped by the source map, then update the mapping.
	        var original = aSourceMapConsumer.originalPositionFor({
	          line: mapping.originalLine,
	          column: mapping.originalColumn
	        });
	        if (original.source != null) {
	          // Copy mapping
	          mapping.source = original.source;
	          if (aSourceMapPath != null) {
	            mapping.source = util.join(aSourceMapPath, mapping.source);
	          }
	          if (sourceRoot != null) {
	            mapping.source = util.relative(sourceRoot, mapping.source);
	          }
	          mapping.originalLine = original.line;
	          mapping.originalColumn = original.column;
	          if (original.name != null) {
	            mapping.name = original.name;
	          }
	        }
	      }

	      var source = mapping.source;
	      if (source != null && !newSources.has(source)) {
	        newSources.add(source);
	      }

	      var name = mapping.name;
	      if (name != null && !newNames.has(name)) {
	        newNames.add(name);
	      }

	    }, this);
	    this._sources = newSources;
	    this._names = newNames;

	    // Copy sourcesContents of applied map.
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aSourceMapPath != null) {
	          sourceFile = util.join(aSourceMapPath, sourceFile);
	        }
	        if (sourceRoot != null) {
	          sourceFile = util.relative(sourceRoot, sourceFile);
	        }
	        this.setSourceContent(sourceFile, content);
	      }
	    }, this);
	  };

	/**
	 * A mapping can have one of the three levels of data:
	 *
	 *   1. Just the generated position.
	 *   2. The Generated position, original position, and original source.
	 *   3. Generated and original position, original source, as well as a name
	 *      token.
	 *
	 * To maintain consistency, we validate that any new mapping being added falls
	 * in to one of these categories.
	 */
	SourceMapGenerator.prototype._validateMapping =
	  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                              aName) {
	    // When aOriginal is truthy but has empty values for .line and .column,
	    // it is most likely a programmer error. In this case we throw a very
	    // specific error message to try to guide them the right way.
	    // For example: https://github.com/Polymer/polymer-bundler/pull/519
	    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
	      var message = 'original.line and original.column are not numbers -- you probably meant to omit ' +
	      'the original mapping entirely and only map the generated position. If so, pass ' +
	      'null for the original mapping instead of an object with empty or null values.';

	      if (this._ignoreInvalidMapping) {
	        if (typeof console !== 'undefined' && console.warn) {
	          console.warn(message);
	        }
	        return false;
	      } else {
	        throw new Error(message);
	      }
	    }

	    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	        && aGenerated.line > 0 && aGenerated.column >= 0
	        && !aOriginal && !aSource && !aName) {
	      // Case 1.
	      return;
	    }
	    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	             && aGenerated.line > 0 && aGenerated.column >= 0
	             && aOriginal.line > 0 && aOriginal.column >= 0
	             && aSource) {
	      // Cases 2 and 3.
	      return;
	    }
	    else {
	      var message = 'Invalid mapping: ' + JSON.stringify({
	        generated: aGenerated,
	        source: aSource,
	        original: aOriginal,
	        name: aName
	      });

	      if (this._ignoreInvalidMapping) {
	        if (typeof console !== 'undefined' && console.warn) {
	          console.warn(message);
	        }
	        return false;
	      } else {
	        throw new Error(message)
	      }
	    }
	  };

	/**
	 * Serialize the accumulated mappings in to the stream of base 64 VLQs
	 * specified by the source map format.
	 */
	SourceMapGenerator.prototype._serializeMappings =
	  function SourceMapGenerator_serializeMappings() {
	    var previousGeneratedColumn = 0;
	    var previousGeneratedLine = 1;
	    var previousOriginalColumn = 0;
	    var previousOriginalLine = 0;
	    var previousName = 0;
	    var previousSource = 0;
	    var result = '';
	    var next;
	    var mapping;
	    var nameIdx;
	    var sourceIdx;

	    var mappings = this._mappings.toArray();
	    for (var i = 0, len = mappings.length; i < len; i++) {
	      mapping = mappings[i];
	      next = '';

	      if (mapping.generatedLine !== previousGeneratedLine) {
	        previousGeneratedColumn = 0;
	        while (mapping.generatedLine !== previousGeneratedLine) {
	          next += ';';
	          previousGeneratedLine++;
	        }
	      }
	      else {
	        if (i > 0) {
	          if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
	            continue;
	          }
	          next += ',';
	        }
	      }

	      next += base64VLQ.encode(mapping.generatedColumn
	                                 - previousGeneratedColumn);
	      previousGeneratedColumn = mapping.generatedColumn;

	      if (mapping.source != null) {
	        sourceIdx = this._sources.indexOf(mapping.source);
	        next += base64VLQ.encode(sourceIdx - previousSource);
	        previousSource = sourceIdx;

	        // lines are stored 0-based in SourceMap spec version 3
	        next += base64VLQ.encode(mapping.originalLine - 1
	                                   - previousOriginalLine);
	        previousOriginalLine = mapping.originalLine - 1;

	        next += base64VLQ.encode(mapping.originalColumn
	                                   - previousOriginalColumn);
	        previousOriginalColumn = mapping.originalColumn;

	        if (mapping.name != null) {
	          nameIdx = this._names.indexOf(mapping.name);
	          next += base64VLQ.encode(nameIdx - previousName);
	          previousName = nameIdx;
	        }
	      }

	      result += next;
	    }

	    return result;
	  };

	SourceMapGenerator.prototype._generateSourcesContent =
	  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	    return aSources.map(function (source) {
	      if (!this._sourcesContents) {
	        return null;
	      }
	      if (aSourceRoot != null) {
	        source = util.relative(aSourceRoot, source);
	      }
	      var key = util.toSetString(source);
	      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
	        ? this._sourcesContents[key]
	        : null;
	    }, this);
	  };

	/**
	 * Externalize the source map.
	 */
	SourceMapGenerator.prototype.toJSON =
	  function SourceMapGenerator_toJSON() {
	    var map = {
	      version: this._version,
	      sources: this._sources.toArray(),
	      names: this._names.toArray(),
	      mappings: this._serializeMappings()
	    };
	    if (this._file != null) {
	      map.file = this._file;
	    }
	    if (this._sourceRoot != null) {
	      map.sourceRoot = this._sourceRoot;
	    }
	    if (this._sourcesContents) {
	      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	    }

	    return map;
	  };

	/**
	 * Render the source map being generated to a string.
	 */
	SourceMapGenerator.prototype.toString =
	  function SourceMapGenerator_toString() {
	    return JSON.stringify(this.toJSON());
	  };

	sourceMapGenerator.SourceMapGenerator = SourceMapGenerator;
	return sourceMapGenerator;
}

var sourceMapConsumer = {};

var binarySearch = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredBinarySearch;

function requireBinarySearch () {
	if (hasRequiredBinarySearch) return binarySearch;
	hasRequiredBinarySearch = 1;
	(function (exports$1) {
		/*
		 * Copyright 2011 Mozilla Foundation and contributors
		 * Licensed under the New BSD license. See LICENSE or:
		 * http://opensource.org/licenses/BSD-3-Clause
		 */

		exports$1.GREATEST_LOWER_BOUND = 1;
		exports$1.LEAST_UPPER_BOUND = 2;

		/**
		 * Recursive implementation of binary search.
		 *
		 * @param aLow Indices here and lower do not contain the needle.
		 * @param aHigh Indices here and higher do not contain the needle.
		 * @param aNeedle The element being searched for.
		 * @param aHaystack The non-empty array being searched.
		 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
		 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
		 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
		 *     closest element that is smaller than or greater than the one we are
		 *     searching for, respectively, if the exact element cannot be found.
		 */
		function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
		  // This function terminates when one of the following is true:
		  //
		  //   1. We find the exact element we are looking for.
		  //
		  //   2. We did not find the exact element, but we can return the index of
		  //      the next-closest element.
		  //
		  //   3. We did not find the exact element, and there is no next-closest
		  //      element than the one we are searching for, so we return -1.
		  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
		  var cmp = aCompare(aNeedle, aHaystack[mid], true);
		  if (cmp === 0) {
		    // Found the element we are looking for.
		    return mid;
		  }
		  else if (cmp > 0) {
		    // Our needle is greater than aHaystack[mid].
		    if (aHigh - mid > 1) {
		      // The element is in the upper half.
		      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
		    }

		    // The exact needle element was not found in this haystack. Determine if
		    // we are in termination case (3) or (2) and return the appropriate thing.
		    if (aBias == exports$1.LEAST_UPPER_BOUND) {
		      return aHigh < aHaystack.length ? aHigh : -1;
		    } else {
		      return mid;
		    }
		  }
		  else {
		    // Our needle is less than aHaystack[mid].
		    if (mid - aLow > 1) {
		      // The element is in the lower half.
		      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
		    }

		    // we are in termination case (3) or (2) and return the appropriate thing.
		    if (aBias == exports$1.LEAST_UPPER_BOUND) {
		      return mid;
		    } else {
		      return aLow < 0 ? -1 : aLow;
		    }
		  }
		}

		/**
		 * This is an implementation of binary search which will always try and return
		 * the index of the closest element if there is no exact hit. This is because
		 * mappings between original and generated line/col pairs are single points,
		 * and there is an implicit region between each of them, so a miss just means
		 * that you aren't on the very start of a region.
		 *
		 * @param aNeedle The element you are looking for.
		 * @param aHaystack The array that is being searched.
		 * @param aCompare A function which takes the needle and an element in the
		 *     array and returns -1, 0, or 1 depending on whether the needle is less
		 *     than, equal to, or greater than the element, respectively.
		 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
		 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
		 *     closest element that is smaller than or greater than the one we are
		 *     searching for, respectively, if the exact element cannot be found.
		 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
		 */
		exports$1.search = function search(aNeedle, aHaystack, aCompare, aBias) {
		  if (aHaystack.length === 0) {
		    return -1;
		  }

		  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
		                              aCompare, aBias || exports$1.GREATEST_LOWER_BOUND);
		  if (index < 0) {
		    return -1;
		  }

		  // We have found either the exact element, or the next-closest element than
		  // the one we are searching for. However, there may be more than one such
		  // element. Make sure we always return the smallest of these.
		  while (index - 1 >= 0) {
		    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
		      break;
		    }
		    --index;
		  }

		  return index;
		}; 
	} (binarySearch));
	return binarySearch;
}

var quickSort = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredQuickSort;

function requireQuickSort () {
	if (hasRequiredQuickSort) return quickSort;
	hasRequiredQuickSort = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	// It turns out that some (most?) JavaScript engines don't self-host
	// `Array.prototype.sort`. This makes sense because C++ will likely remain
	// faster than JS when doing raw CPU-intensive sorting. However, when using a
	// custom comparator function, calling back and forth between the VM's C++ and
	// JIT'd JS is rather slow *and* loses JIT type information, resulting in
	// worse generated code for the comparator function than would be optimal. In
	// fact, when sorting with a comparator, these costs outweigh the benefits of
	// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
	// a ~3500ms mean speed-up in `bench/bench.html`.

	function SortTemplate(comparator) {

	/**
	 * Swap the elements indexed by `x` and `y` in the array `ary`.
	 *
	 * @param {Array} ary
	 *        The array.
	 * @param {Number} x
	 *        The index of the first item.
	 * @param {Number} y
	 *        The index of the second item.
	 */
	function swap(ary, x, y) {
	  var temp = ary[x];
	  ary[x] = ary[y];
	  ary[y] = temp;
	}

	/**
	 * Returns a random integer within the range `low .. high` inclusive.
	 *
	 * @param {Number} low
	 *        The lower bound on the range.
	 * @param {Number} high
	 *        The upper bound on the range.
	 */
	function randomIntInRange(low, high) {
	  return Math.round(low + (Math.random() * (high - low)));
	}

	/**
	 * The Quick Sort algorithm.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 * @param {Number} p
	 *        Start index of the array
	 * @param {Number} r
	 *        End index of the array
	 */
	function doQuickSort(ary, comparator, p, r) {
	  // If our lower bound is less than our upper bound, we (1) partition the
	  // array into two pieces and (2) recurse on each half. If it is not, this is
	  // the empty array and our base case.

	  if (p < r) {
	    // (1) Partitioning.
	    //
	    // The partitioning chooses a pivot between `p` and `r` and moves all
	    // elements that are less than or equal to the pivot to the before it, and
	    // all the elements that are greater than it after it. The effect is that
	    // once partition is done, the pivot is in the exact place it will be when
	    // the array is put in sorted order, and it will not need to be moved
	    // again. This runs in O(n) time.

	    // Always choose a random pivot so that an input array which is reverse
	    // sorted does not cause O(n^2) running time.
	    var pivotIndex = randomIntInRange(p, r);
	    var i = p - 1;

	    swap(ary, pivotIndex, r);
	    var pivot = ary[r];

	    // Immediately after `j` is incremented in this loop, the following hold
	    // true:
	    //
	    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
	    //
	    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
	    for (var j = p; j < r; j++) {
	      if (comparator(ary[j], pivot, false) <= 0) {
	        i += 1;
	        swap(ary, i, j);
	      }
	    }

	    swap(ary, i + 1, j);
	    var q = i + 1;

	    // (2) Recurse on each half.

	    doQuickSort(ary, comparator, p, q - 1);
	    doQuickSort(ary, comparator, q + 1, r);
	  }
	}

	  return doQuickSort;
	}

	function cloneSort(comparator) {
	  let template = SortTemplate.toString();
	  let templateFn = new Function(`return ${template}`)();
	  return templateFn(comparator);
	}

	/**
	 * Sort the given array in-place with the given comparator function.
	 *
	 * @param {Array} ary
	 *        An array to sort.
	 * @param {function} comparator
	 *        Function to use to compare two items.
	 */

	let sortCache = new WeakMap();
	quickSort.quickSort = function (ary, comparator, start = 0) {
	  let doQuickSort = sortCache.get(comparator);
	  if (doQuickSort === void 0) {
	    doQuickSort = cloneSort(comparator);
	    sortCache.set(comparator, doQuickSort);
	  }
	  doQuickSort(ary, comparator, start, ary.length - 1);
	};
	return quickSort;
}

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredSourceMapConsumer;

function requireSourceMapConsumer () {
	if (hasRequiredSourceMapConsumer) return sourceMapConsumer;
	hasRequiredSourceMapConsumer = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	var util = requireUtil();
	var binarySearch = requireBinarySearch();
	var ArraySet = requireArraySet().ArraySet;
	var base64VLQ = requireBase64Vlq();
	var quickSort = requireQuickSort().quickSort;

	function SourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }

	  return sourceMap.sections != null
	    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
	    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
	}

	SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
	  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
	};

	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	SourceMapConsumer.prototype._version = 3;

	// `__generatedMappings` and `__originalMappings` are arrays that hold the
	// parsed mapping coordinates from the source map's "mappings" attribute. They
	// are lazily instantiated, accessed via the `_generatedMappings` and
	// `_originalMappings` getters respectively, and we only parse the mappings
	// and create these arrays once queried for a source location. We jump through
	// these hoops because there can be many thousands of mappings, and parsing
	// them is expensive, so we only want to do it if we must.
	//
	// Each object in the arrays is of the form:
	//
	//     {
	//       generatedLine: The line number in the generated code,
	//       generatedColumn: The column number in the generated code,
	//       source: The path to the original source file that generated this
	//               chunk of code,
	//       originalLine: The line number in the original source that
	//                     corresponds to this chunk of generated code,
	//       originalColumn: The column number in the original source that
	//                       corresponds to this chunk of generated code,
	//       name: The name of the original symbol which generated this chunk of
	//             code.
	//     }
	//
	// All properties except for `generatedLine` and `generatedColumn` can be
	// `null`.
	//
	// `_generatedMappings` is ordered by the generated positions.
	//
	// `_originalMappings` is ordered by the original positions.

	SourceMapConsumer.prototype.__generatedMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__generatedMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }

	    return this.__generatedMappings;
	  }
	});

	SourceMapConsumer.prototype.__originalMappings = null;
	Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	  configurable: true,
	  enumerable: true,
	  get: function () {
	    if (!this.__originalMappings) {
	      this._parseMappings(this._mappings, this.sourceRoot);
	    }

	    return this.__originalMappings;
	  }
	});

	SourceMapConsumer.prototype._charIsMappingSeparator =
	  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
	    var c = aStr.charAt(index);
	    return c === ";" || c === ",";
	  };

	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	SourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    throw new Error("Subclasses must implement _parseMappings");
	  };

	SourceMapConsumer.GENERATED_ORDER = 1;
	SourceMapConsumer.ORIGINAL_ORDER = 2;

	SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
	SourceMapConsumer.LEAST_UPPER_BOUND = 2;

	/**
	 * Iterate over each mapping between an original source/line/column and a
	 * generated line/column in this source map.
	 *
	 * @param Function aCallback
	 *        The function that is called with each mapping.
	 * @param Object aContext
	 *        Optional. If specified, this object will be the value of `this` every
	 *        time that `aCallback` is called.
	 * @param aOrder
	 *        Either `SourceMapConsumer.GENERATED_ORDER` or
	 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	 *        iterate over the mappings sorted by the generated file's line/column
	 *        order or the original's source/line/column order, respectively. Defaults to
	 *        `SourceMapConsumer.GENERATED_ORDER`.
	 */
	SourceMapConsumer.prototype.eachMapping =
	  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	    var context = aContext || null;
	    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

	    var mappings;
	    switch (order) {
	    case SourceMapConsumer.GENERATED_ORDER:
	      mappings = this._generatedMappings;
	      break;
	    case SourceMapConsumer.ORIGINAL_ORDER:
	      mappings = this._originalMappings;
	      break;
	    default:
	      throw new Error("Unknown order of iteration.");
	    }

	    var sourceRoot = this.sourceRoot;
	    var boundCallback = aCallback.bind(context);
	    var names = this._names;
	    var sources = this._sources;
	    var sourceMapURL = this._sourceMapURL;

	    for (var i = 0, n = mappings.length; i < n; i++) {
	      var mapping = mappings[i];
	      var source = mapping.source === null ? null : sources.at(mapping.source);
	      if(source !== null) {
	        source = util.computeSourceURL(sourceRoot, source, sourceMapURL);
	      }
	      boundCallback({
	        source: source,
	        generatedLine: mapping.generatedLine,
	        generatedColumn: mapping.generatedColumn,
	        originalLine: mapping.originalLine,
	        originalColumn: mapping.originalColumn,
	        name: mapping.name === null ? null : names.at(mapping.name)
	      });
	    }
	  };

	/**
	 * Returns all generated line and column information for the original source,
	 * line, and column provided. If no column is provided, returns all mappings
	 * corresponding to a either the line we are searching for or the next
	 * closest line that has any mappings. Otherwise, returns all mappings
	 * corresponding to the given line and either the column we are searching for
	 * or the next closest column that has any offsets.
	 *
	 * The only argument is an object with the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number is 1-based.
	 *   - column: Optional. the column number in the original source.
	 *    The column number is 0-based.
	 *
	 * and an array of objects is returned, each with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *    line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *    The column number is 0-based.
	 */
	SourceMapConsumer.prototype.allGeneratedPositionsFor =
	  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	    var line = util.getArg(aArgs, 'line');

	    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	    // returns the index of the closest mapping less than the needle. By
	    // setting needle.originalColumn to 0, we thus find the last mapping for
	    // the given line, provided such a mapping exists.
	    var needle = {
	      source: util.getArg(aArgs, 'source'),
	      originalLine: line,
	      originalColumn: util.getArg(aArgs, 'column', 0)
	    };

	    needle.source = this._findSourceIndex(needle.source);
	    if (needle.source < 0) {
	      return [];
	    }

	    var mappings = [];

	    var index = this._findMapping(needle,
	                                  this._originalMappings,
	                                  "originalLine",
	                                  "originalColumn",
	                                  util.compareByOriginalPositions,
	                                  binarySearch.LEAST_UPPER_BOUND);
	    if (index >= 0) {
	      var mapping = this._originalMappings[index];

	      if (aArgs.column === undefined) {
	        var originalLine = mapping.originalLine;

	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we found. Since
	        // mappings are sorted, this is guaranteed to find all mappings for
	        // the line we found.
	        while (mapping && mapping.originalLine === originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });

	          mapping = this._originalMappings[++index];
	        }
	      } else {
	        var originalColumn = mapping.originalColumn;

	        // Iterate until either we run out of mappings, or we run into
	        // a mapping for a different line than the one we were searching for.
	        // Since mappings are sorted, this is guaranteed to find all mappings for
	        // the line we are searching for.
	        while (mapping &&
	               mapping.originalLine === line &&
	               mapping.originalColumn == originalColumn) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });

	          mapping = this._originalMappings[++index];
	        }
	      }
	    }

	    return mappings;
	  };

	sourceMapConsumer.SourceMapConsumer = SourceMapConsumer;

	/**
	 * A BasicSourceMapConsumer instance represents a parsed source map which we can
	 * query for information about the original file positions by giving it a file
	 * position in the generated source.
	 *
	 * The first parameter is the raw source map (either as a JSON string, or
	 * already parsed to an object). According to the spec, source maps have the
	 * following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - sources: An array of URLs to the original source files.
	 *   - names: An array of identifiers which can be referrenced by individual mappings.
	 *   - sourceRoot: Optional. The URL root from which all sources are relative.
	 *   - sourcesContent: Optional. An array of contents of the original source files.
	 *   - mappings: A string of base64 VLQs which contain the actual mappings.
	 *   - file: Optional. The generated file this source map is associated with.
	 *
	 * Here is an example source map, taken from the source map spec[0]:
	 *
	 *     {
	 *       version : 3,
	 *       file: "out.js",
	 *       sourceRoot : "",
	 *       sources: ["foo.js", "bar.js"],
	 *       names: ["src", "maps", "are", "fun"],
	 *       mappings: "AA,AB;;ABCDE;"
	 *     }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	 */
	function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }

	  var version = util.getArg(sourceMap, 'version');
	  var sources = util.getArg(sourceMap, 'sources');
	  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	  // requires the array) to play nice here.
	  var names = util.getArg(sourceMap, 'names', []);
	  var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	  var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	  var mappings = util.getArg(sourceMap, 'mappings');
	  var file = util.getArg(sourceMap, 'file', null);

	  // Once again, Sass deviates from the spec and supplies the version as a
	  // string rather than a number, so we use loose equality checking here.
	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }

	  if (sourceRoot) {
	    sourceRoot = util.normalize(sourceRoot);
	  }

	  sources = sources
	    .map(String)
	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    .map(util.normalize)
	    // Always ensure that absolute sources are internally stored relative to
	    // the source root, if the source root is absolute. Not doing this would
	    // be particularly problematic when the source root is a prefix of the
	    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
	    .map(function (source) {
	      return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
	        ? util.relative(sourceRoot, source)
	        : source;
	    });

	  // Pass `true` below to allow duplicate names and sources. While source maps
	  // are intended to be compressed and deduplicated, the TypeScript compiler
	  // sometimes generates source maps with duplicates in them. See Github issue
	  // #72 and bugzil.la/889492.
	  this._names = ArraySet.fromArray(names.map(String), true);
	  this._sources = ArraySet.fromArray(sources, true);

	  this._absoluteSources = this._sources.toArray().map(function (s) {
	    return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
	  });

	  this.sourceRoot = sourceRoot;
	  this.sourcesContent = sourcesContent;
	  this._mappings = mappings;
	  this._sourceMapURL = aSourceMapURL;
	  this.file = file;
	}

	BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

	/**
	 * Utility function to find the index of a source.  Returns -1 if not
	 * found.
	 */
	BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
	  var relativeSource = aSource;
	  if (this.sourceRoot != null) {
	    relativeSource = util.relative(this.sourceRoot, relativeSource);
	  }

	  if (this._sources.has(relativeSource)) {
	    return this._sources.indexOf(relativeSource);
	  }

	  // Maybe aSource is an absolute URL as returned by |sources|.  In
	  // this case we can't simply undo the transform.
	  var i;
	  for (i = 0; i < this._absoluteSources.length; ++i) {
	    if (this._absoluteSources[i] == aSource) {
	      return i;
	    }
	  }

	  return -1;
	};

	/**
	 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	 *
	 * @param SourceMapGenerator aSourceMap
	 *        The source map that will be consumed.
	 * @param String aSourceMapURL
	 *        The URL at which the source map can be found (optional)
	 * @returns BasicSourceMapConsumer
	 */
	BasicSourceMapConsumer.fromSourceMap =
	  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
	    var smc = Object.create(BasicSourceMapConsumer.prototype);

	    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	    smc.sourceRoot = aSourceMap._sourceRoot;
	    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                            smc.sourceRoot);
	    smc.file = aSourceMap._file;
	    smc._sourceMapURL = aSourceMapURL;
	    smc._absoluteSources = smc._sources.toArray().map(function (s) {
	      return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
	    });

	    // Because we are modifying the entries (by converting string sources and
	    // names to indices into the sources and names ArraySets), we have to make
	    // a copy of the entry or else bad things happen. Shared mutable state
	    // strikes again! See github issue #191.

	    var generatedMappings = aSourceMap._mappings.toArray().slice();
	    var destGeneratedMappings = smc.__generatedMappings = [];
	    var destOriginalMappings = smc.__originalMappings = [];

	    for (var i = 0, length = generatedMappings.length; i < length; i++) {
	      var srcMapping = generatedMappings[i];
	      var destMapping = new Mapping;
	      destMapping.generatedLine = srcMapping.generatedLine;
	      destMapping.generatedColumn = srcMapping.generatedColumn;

	      if (srcMapping.source) {
	        destMapping.source = sources.indexOf(srcMapping.source);
	        destMapping.originalLine = srcMapping.originalLine;
	        destMapping.originalColumn = srcMapping.originalColumn;

	        if (srcMapping.name) {
	          destMapping.name = names.indexOf(srcMapping.name);
	        }

	        destOriginalMappings.push(destMapping);
	      }

	      destGeneratedMappings.push(destMapping);
	    }

	    quickSort(smc.__originalMappings, util.compareByOriginalPositions);

	    return smc;
	  };

	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	BasicSourceMapConsumer.prototype._version = 3;

	/**
	 * The list of original sources.
	 */
	Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    return this._absoluteSources.slice();
	  }
	});

	/**
	 * Provide the JIT with a nice shape / hidden class.
	 */
	function Mapping() {
	  this.generatedLine = 0;
	  this.generatedColumn = 0;
	  this.source = null;
	  this.originalLine = null;
	  this.originalColumn = null;
	  this.name = null;
	}

	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */

	const compareGenerated = util.compareByGeneratedPositionsDeflatedNoLine;
	function sortGenerated(array, start) {
	  let l = array.length;
	  let n = array.length - start;
	  if (n <= 1) {
	    return;
	  } else if (n == 2) {
	    let a = array[start];
	    let b = array[start + 1];
	    if (compareGenerated(a, b) > 0) {
	      array[start] = b;
	      array[start + 1] = a;
	    }
	  } else if (n < 20) {
	    for (let i = start; i < l; i++) {
	      for (let j = i; j > start; j--) {
	        let a = array[j - 1];
	        let b = array[j];
	        if (compareGenerated(a, b) <= 0) {
	          break;
	        }
	        array[j - 1] = b;
	        array[j] = a;
	      }
	    }
	  } else {
	    quickSort(array, compareGenerated, start);
	  }
	}
	BasicSourceMapConsumer.prototype._parseMappings =
	  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    var generatedLine = 1;
	    var previousGeneratedColumn = 0;
	    var previousOriginalLine = 0;
	    var previousOriginalColumn = 0;
	    var previousSource = 0;
	    var previousName = 0;
	    var length = aStr.length;
	    var index = 0;
	    var temp = {};
	    var originalMappings = [];
	    var generatedMappings = [];
	    var mapping, segment, end, value;

	    let subarrayStart = 0;
	    while (index < length) {
	      if (aStr.charAt(index) === ';') {
	        generatedLine++;
	        index++;
	        previousGeneratedColumn = 0;

	        sortGenerated(generatedMappings, subarrayStart);
	        subarrayStart = generatedMappings.length;
	      }
	      else if (aStr.charAt(index) === ',') {
	        index++;
	      }
	      else {
	        mapping = new Mapping();
	        mapping.generatedLine = generatedLine;

	        for (end = index; end < length; end++) {
	          if (this._charIsMappingSeparator(aStr, end)) {
	            break;
	          }
	        }
	        aStr.slice(index, end);

	        segment = [];
	        while (index < end) {
	          base64VLQ.decode(aStr, index, temp);
	          value = temp.value;
	          index = temp.rest;
	          segment.push(value);
	        }

	        if (segment.length === 2) {
	          throw new Error('Found a source, but no line and column');
	        }

	        if (segment.length === 3) {
	          throw new Error('Found a source and line, but no column');
	        }

	        // Generated column.
	        mapping.generatedColumn = previousGeneratedColumn + segment[0];
	        previousGeneratedColumn = mapping.generatedColumn;

	        if (segment.length > 1) {
	          // Original source.
	          mapping.source = previousSource + segment[1];
	          previousSource += segment[1];

	          // Original line.
	          mapping.originalLine = previousOriginalLine + segment[2];
	          previousOriginalLine = mapping.originalLine;
	          // Lines are stored 0-based
	          mapping.originalLine += 1;

	          // Original column.
	          mapping.originalColumn = previousOriginalColumn + segment[3];
	          previousOriginalColumn = mapping.originalColumn;

	          if (segment.length > 4) {
	            // Original name.
	            mapping.name = previousName + segment[4];
	            previousName += segment[4];
	          }
	        }

	        generatedMappings.push(mapping);
	        if (typeof mapping.originalLine === 'number') {
	          let currentSource = mapping.source;
	          while (originalMappings.length <= currentSource) {
	            originalMappings.push(null);
	          }
	          if (originalMappings[currentSource] === null) {
	            originalMappings[currentSource] = [];
	          }
	          originalMappings[currentSource].push(mapping);
	        }
	      }
	    }

	    sortGenerated(generatedMappings, subarrayStart);
	    this.__generatedMappings = generatedMappings;

	    for (var i = 0; i < originalMappings.length; i++) {
	      if (originalMappings[i] != null) {
	        quickSort(originalMappings[i], util.compareByOriginalPositionsNoSource);
	      }
	    }
	    this.__originalMappings = [].concat(...originalMappings);
	  };

	/**
	 * Find the mapping that best matches the hypothetical "needle" mapping that
	 * we are searching for in the given "haystack" of mappings.
	 */
	BasicSourceMapConsumer.prototype._findMapping =
	  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                         aColumnName, aComparator, aBias) {
	    // To return the position we are searching for, we must first find the
	    // mapping for the given position and then return the opposite position it
	    // points to. Because the mappings are sorted, we can use binary search to
	    // find the best mapping.

	    if (aNeedle[aLineName] <= 0) {
	      throw new TypeError('Line must be greater than or equal to 1, got '
	                          + aNeedle[aLineName]);
	    }
	    if (aNeedle[aColumnName] < 0) {
	      throw new TypeError('Column must be greater than or equal to 0, got '
	                          + aNeedle[aColumnName]);
	    }

	    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
	  };

	/**
	 * Compute the last column for each generated mapping. The last column is
	 * inclusive.
	 */
	BasicSourceMapConsumer.prototype.computeColumnSpans =
	  function SourceMapConsumer_computeColumnSpans() {
	    for (var index = 0; index < this._generatedMappings.length; ++index) {
	      var mapping = this._generatedMappings[index];

	      // Mappings do not contain a field for the last generated columnt. We
	      // can come up with an optimistic estimate, however, by assuming that
	      // mappings are contiguous (i.e. given two consecutive mappings, the
	      // first mapping ends where the second one starts).
	      if (index + 1 < this._generatedMappings.length) {
	        var nextMapping = this._generatedMappings[index + 1];

	        if (mapping.generatedLine === nextMapping.generatedLine) {
	          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	          continue;
	        }
	      }

	      // The last mapping for each line spans the entire line.
	      mapping.lastGeneratedColumn = Infinity;
	    }
	  };

	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	BasicSourceMapConsumer.prototype.originalPositionFor =
	  function SourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };

	    var index = this._findMapping(
	      needle,
	      this._generatedMappings,
	      "generatedLine",
	      "generatedColumn",
	      util.compareByGeneratedPositionsDeflated,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );

	    if (index >= 0) {
	      var mapping = this._generatedMappings[index];

	      if (mapping.generatedLine === needle.generatedLine) {
	        var source = util.getArg(mapping, 'source', null);
	        if (source !== null) {
	          source = this._sources.at(source);
	          source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
	        }
	        var name = util.getArg(mapping, 'name', null);
	        if (name !== null) {
	          name = this._names.at(name);
	        }
	        return {
	          source: source,
	          line: util.getArg(mapping, 'originalLine', null),
	          column: util.getArg(mapping, 'originalColumn', null),
	          name: name
	        };
	      }
	    }

	    return {
	      source: null,
	      line: null,
	      column: null,
	      name: null
	    };
	  };

	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function BasicSourceMapConsumer_hasContentsOfAllSources() {
	    if (!this.sourcesContent) {
	      return false;
	    }
	    return this.sourcesContent.length >= this._sources.size() &&
	      !this.sourcesContent.some(function (sc) { return sc == null; });
	  };

	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	BasicSourceMapConsumer.prototype.sourceContentFor =
	  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    if (!this.sourcesContent) {
	      return null;
	    }

	    var index = this._findSourceIndex(aSource);
	    if (index >= 0) {
	      return this.sourcesContent[index];
	    }

	    var relativeSource = aSource;
	    if (this.sourceRoot != null) {
	      relativeSource = util.relative(this.sourceRoot, relativeSource);
	    }

	    var url;
	    if (this.sourceRoot != null
	        && (url = util.urlParse(this.sourceRoot))) {
	      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	      // many users. We can help them out when they expect file:// URIs to
	      // behave like it would if they were running a local HTTP server. See
	      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
	      if (url.scheme == "file"
	          && this._sources.has(fileUriAbsPath)) {
	        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	      }

	      if ((!url.path || url.path == "/")
	          && this._sources.has("/" + relativeSource)) {
	        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
	      }
	    }

	    // This function is used recursively from
	    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	    // don't want to throw if we can't find the source - we just want to
	    // return null, so we provide a flag to exit gracefully.
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
	    }
	  };

	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
	 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	BasicSourceMapConsumer.prototype.generatedPositionFor =
	  function SourceMapConsumer_generatedPositionFor(aArgs) {
	    var source = util.getArg(aArgs, 'source');
	    source = this._findSourceIndex(source);
	    if (source < 0) {
	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    }

	    var needle = {
	      source: source,
	      originalLine: util.getArg(aArgs, 'line'),
	      originalColumn: util.getArg(aArgs, 'column')
	    };

	    var index = this._findMapping(
	      needle,
	      this._originalMappings,
	      "originalLine",
	      "originalColumn",
	      util.compareByOriginalPositions,
	      util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
	    );

	    if (index >= 0) {
	      var mapping = this._originalMappings[index];

	      if (mapping.source === needle.source) {
	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }
	    }

	    return {
	      line: null,
	      column: null,
	      lastColumn: null
	    };
	  };

	sourceMapConsumer.BasicSourceMapConsumer = BasicSourceMapConsumer;

	/**
	 * An IndexedSourceMapConsumer instance represents a parsed source map which
	 * we can query for information. It differs from BasicSourceMapConsumer in
	 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	 * input.
	 *
	 * The first parameter is a raw source map (either as a JSON string, or already
	 * parsed to an object). According to the spec for indexed source maps, they
	 * have the following attributes:
	 *
	 *   - version: Which version of the source map spec this map is following.
	 *   - file: Optional. The generated file this source map is associated with.
	 *   - sections: A list of section definitions.
	 *
	 * Each value under the "sections" field has two fields:
	 *   - offset: The offset into the original specified at which this section
	 *       begins to apply, defined as an object with a "line" and "column"
	 *       field.
	 *   - map: A source map definition. This source map could also be indexed,
	 *       but doesn't have to be.
	 *
	 * Instead of the "map" field, it's also possible to have a "url" field
	 * specifying a URL to retrieve a source map from, but that's currently
	 * unsupported.
	 *
	 * Here's an example source map, taken from the source map spec[0], but
	 * modified to omit a section which uses the "url" field.
	 *
	 *  {
	 *    version : 3,
	 *    file: "app.js",
	 *    sections: [{
	 *      offset: {line:100, column:10},
	 *      map: {
	 *        version : 3,
	 *        file: "section.js",
	 *        sources: ["foo.js", "bar.js"],
	 *        names: ["src", "maps", "are", "fun"],
	 *        mappings: "AAAA,E;;ABCDE;"
	 *      }
	 *    }],
	 *  }
	 *
	 * The second parameter, if given, is a string whose value is the URL
	 * at which the source map was found.  This URL is used to compute the
	 * sources array.
	 *
	 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	 */
	function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
	  var sourceMap = aSourceMap;
	  if (typeof aSourceMap === 'string') {
	    sourceMap = util.parseSourceMapInput(aSourceMap);
	  }

	  var version = util.getArg(sourceMap, 'version');
	  var sections = util.getArg(sourceMap, 'sections');

	  if (version != this._version) {
	    throw new Error('Unsupported version: ' + version);
	  }

	  this._sources = new ArraySet();
	  this._names = new ArraySet();

	  var lastOffset = {
	    line: -1,
	    column: 0
	  };
	  this._sections = sections.map(function (s) {
	    if (s.url) {
	      // The url field will require support for asynchronicity.
	      // See https://github.com/mozilla/source-map/issues/16
	      throw new Error('Support for url field in sections not implemented.');
	    }
	    var offset = util.getArg(s, 'offset');
	    var offsetLine = util.getArg(offset, 'line');
	    var offsetColumn = util.getArg(offset, 'column');

	    if (offsetLine < lastOffset.line ||
	        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	      throw new Error('Section offsets must be ordered and non-overlapping.');
	    }
	    lastOffset = offset;

	    return {
	      generatedOffset: {
	        // The offset fields are 0-based, but we use 1-based indices when
	        // encoding/decoding from VLQ.
	        generatedLine: offsetLine + 1,
	        generatedColumn: offsetColumn + 1
	      },
	      consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
	    }
	  });
	}

	IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

	/**
	 * The version of the source mapping spec that we are consuming.
	 */
	IndexedSourceMapConsumer.prototype._version = 3;

	/**
	 * The list of original sources.
	 */
	Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	  get: function () {
	    var sources = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	        sources.push(this._sections[i].consumer.sources[j]);
	      }
	    }
	    return sources;
	  }
	});

	/**
	 * Returns the original source, line, and column information for the generated
	 * source's line and column positions provided. The only argument is an object
	 * with the following properties:
	 *
	 *   - line: The line number in the generated source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the generated source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - source: The original source file, or null.
	 *   - line: The line number in the original source, or null.  The
	 *     line number is 1-based.
	 *   - column: The column number in the original source, or null.  The
	 *     column number is 0-based.
	 *   - name: The original identifier, or null.
	 */
	IndexedSourceMapConsumer.prototype.originalPositionFor =
	  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	    var needle = {
	      generatedLine: util.getArg(aArgs, 'line'),
	      generatedColumn: util.getArg(aArgs, 'column')
	    };

	    // Find the section containing the generated position we're trying to map
	    // to an original position.
	    var sectionIndex = binarySearch.search(needle, this._sections,
	      function(needle, section) {
	        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	        if (cmp) {
	          return cmp;
	        }

	        return (needle.generatedColumn -
	                section.generatedOffset.generatedColumn);
	      });
	    var section = this._sections[sectionIndex];

	    if (!section) {
	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    }

	    return section.consumer.originalPositionFor({
	      line: needle.generatedLine -
	        (section.generatedOffset.generatedLine - 1),
	      column: needle.generatedColumn -
	        (section.generatedOffset.generatedLine === needle.generatedLine
	         ? section.generatedOffset.generatedColumn - 1
	         : 0),
	      bias: aArgs.bias
	    });
	  };

	/**
	 * Return true if we have the source content for every source in the source
	 * map, false otherwise.
	 */
	IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
	  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
	    return this._sections.every(function (s) {
	      return s.consumer.hasContentsOfAllSources();
	    });
	  };

	/**
	 * Returns the original source content. The only argument is the url of the
	 * original source file. Returns null if no original source content is
	 * available.
	 */
	IndexedSourceMapConsumer.prototype.sourceContentFor =
	  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];

	      var content = section.consumer.sourceContentFor(aSource, true);
	      if (content || content === '') {
	        return content;
	      }
	    }
	    if (nullOnMissing) {
	      return null;
	    }
	    else {
	      throw new Error('"' + aSource + '" is not in the SourceMap.');
	    }
	  };

	/**
	 * Returns the generated line and column information for the original source,
	 * line, and column positions provided. The only argument is an object with
	 * the following properties:
	 *
	 *   - source: The filename of the original source.
	 *   - line: The line number in the original source.  The line number
	 *     is 1-based.
	 *   - column: The column number in the original source.  The column
	 *     number is 0-based.
	 *
	 * and an object is returned with the following properties:
	 *
	 *   - line: The line number in the generated source, or null.  The
	 *     line number is 1-based. 
	 *   - column: The column number in the generated source, or null.
	 *     The column number is 0-based.
	 */
	IndexedSourceMapConsumer.prototype.generatedPositionFor =
	  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];

	      // Only consider this section if the requested source is in the list of
	      // sources of the consumer.
	      if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
	        continue;
	      }
	      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
	      if (generatedPosition) {
	        var ret = {
	          line: generatedPosition.line +
	            (section.generatedOffset.generatedLine - 1),
	          column: generatedPosition.column +
	            (section.generatedOffset.generatedLine === generatedPosition.line
	             ? section.generatedOffset.generatedColumn - 1
	             : 0)
	        };
	        return ret;
	      }
	    }

	    return {
	      line: null,
	      column: null
	    };
	  };

	/**
	 * Parse the mappings in a string in to a data structure which we can easily
	 * query (the ordered arrays in the `this.__generatedMappings` and
	 * `this.__originalMappings` properties).
	 */
	IndexedSourceMapConsumer.prototype._parseMappings =
	  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	    this.__generatedMappings = [];
	    this.__originalMappings = [];
	    for (var i = 0; i < this._sections.length; i++) {
	      var section = this._sections[i];
	      var sectionMappings = section.consumer._generatedMappings;
	      for (var j = 0; j < sectionMappings.length; j++) {
	        var mapping = sectionMappings[j];

	        var source = section.consumer._sources.at(mapping.source);
	        if(source !== null) {
	          source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
	        }
	        this._sources.add(source);
	        source = this._sources.indexOf(source);

	        var name = null;
	        if (mapping.name) {
	          name = section.consumer._names.at(mapping.name);
	          this._names.add(name);
	          name = this._names.indexOf(name);
	        }

	        // The mappings coming from the consumer for the section have
	        // generated positions relative to the start of the section, so we
	        // need to offset them to be relative to the start of the concatenated
	        // generated file.
	        var adjustedMapping = {
	          source: source,
	          generatedLine: mapping.generatedLine +
	            (section.generatedOffset.generatedLine - 1),
	          generatedColumn: mapping.generatedColumn +
	            (section.generatedOffset.generatedLine === mapping.generatedLine
	            ? section.generatedOffset.generatedColumn - 1
	            : 0),
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: name
	        };

	        this.__generatedMappings.push(adjustedMapping);
	        if (typeof adjustedMapping.originalLine === 'number') {
	          this.__originalMappings.push(adjustedMapping);
	        }
	      }
	    }

	    quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
	    quickSort(this.__originalMappings, util.compareByOriginalPositions);
	  };

	sourceMapConsumer.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
	return sourceMapConsumer;
}

var sourceNode = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

var hasRequiredSourceNode;

function requireSourceNode () {
	if (hasRequiredSourceNode) return sourceNode;
	hasRequiredSourceNode = 1;
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	var SourceMapGenerator = requireSourceMapGenerator().SourceMapGenerator;
	var util = requireUtil();

	// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
	// operating systems these days (capturing the result).
	var REGEX_NEWLINE = /(\r?\n)/;

	// Newline character code for charCodeAt() comparisons
	var NEWLINE_CODE = 10;

	// Private symbol for identifying `SourceNode`s when multiple versions of
	// the source-map library are loaded. This MUST NOT CHANGE across
	// versions!
	var isSourceNode = "$$$isSourceNode$$$";

	/**
	 * SourceNodes provide a way to abstract over interpolating/concatenating
	 * snippets of generated JavaScript source code while maintaining the line and
	 * column information associated with the original source code.
	 *
	 * @param aLine The original line number.
	 * @param aColumn The original column number.
	 * @param aSource The original source's filename.
	 * @param aChunks Optional. An array of strings which are snippets of
	 *        generated JS, or other SourceNodes.
	 * @param aName The original identifier.
	 */
	function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	  this.children = [];
	  this.sourceContents = {};
	  this.line = aLine == null ? null : aLine;
	  this.column = aColumn == null ? null : aColumn;
	  this.source = aSource == null ? null : aSource;
	  this.name = aName == null ? null : aName;
	  this[isSourceNode] = true;
	  if (aChunks != null) this.add(aChunks);
	}

	/**
	 * Creates a SourceNode from generated code and a SourceMapConsumer.
	 *
	 * @param aGeneratedCode The generated code
	 * @param aSourceMapConsumer The SourceMap for the generated code
	 * @param aRelativePath Optional. The path that relative sources in the
	 *        SourceMapConsumer should be relative to.
	 */
	SourceNode.fromStringWithSourceMap =
	  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
	    // The SourceNode we want to fill with the generated code
	    // and the SourceMap
	    var node = new SourceNode();

	    // All even indices of this array are one line of the generated code,
	    // while all odd indices are the newlines between two adjacent lines
	    // (since `REGEX_NEWLINE` captures its match).
	    // Processed fragments are accessed by calling `shiftNextLine`.
	    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
	    var remainingLinesIndex = 0;
	    var shiftNextLine = function() {
	      var lineContents = getNextLine();
	      // The last line of a file might not have a newline.
	      var newLine = getNextLine() || "";
	      return lineContents + newLine;

	      function getNextLine() {
	        return remainingLinesIndex < remainingLines.length ?
	            remainingLines[remainingLinesIndex++] : undefined;
	      }
	    };

	    // We need to remember the position of "remainingLines"
	    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

	    // The generate SourceNodes we need a code range.
	    // To extract it current and last mapping is used.
	    // Here we store the last mapping.
	    var lastMapping = null;

	    aSourceMapConsumer.eachMapping(function (mapping) {
	      if (lastMapping !== null) {
	        // We add the code from "lastMapping" to "mapping":
	        // First check if there is a new line in between.
	        if (lastGeneratedLine < mapping.generatedLine) {
	          // Associate first line with "lastMapping"
	          addMappingWithCode(lastMapping, shiftNextLine());
	          lastGeneratedLine++;
	          lastGeneratedColumn = 0;
	          // The remaining code is added without mapping
	        } else {
	          // There is no new line in between.
	          // Associate the code between "lastGeneratedColumn" and
	          // "mapping.generatedColumn" with "lastMapping"
	          var nextLine = remainingLines[remainingLinesIndex] || '';
	          var code = nextLine.substr(0, mapping.generatedColumn -
	                                        lastGeneratedColumn);
	          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
	                                              lastGeneratedColumn);
	          lastGeneratedColumn = mapping.generatedColumn;
	          addMappingWithCode(lastMapping, code);
	          // No more remaining code, continue
	          lastMapping = mapping;
	          return;
	        }
	      }
	      // We add the generated code until the first mapping
	      // to the SourceNode without any mapping.
	      // Each line is added as separate string.
	      while (lastGeneratedLine < mapping.generatedLine) {
	        node.add(shiftNextLine());
	        lastGeneratedLine++;
	      }
	      if (lastGeneratedColumn < mapping.generatedColumn) {
	        var nextLine = remainingLines[remainingLinesIndex] || '';
	        node.add(nextLine.substr(0, mapping.generatedColumn));
	        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
	        lastGeneratedColumn = mapping.generatedColumn;
	      }
	      lastMapping = mapping;
	    }, this);
	    // We have processed all mappings.
	    if (remainingLinesIndex < remainingLines.length) {
	      if (lastMapping) {
	        // Associate the remaining code in the current line with "lastMapping"
	        addMappingWithCode(lastMapping, shiftNextLine());
	      }
	      // and add the remaining lines without any mapping
	      node.add(remainingLines.splice(remainingLinesIndex).join(""));
	    }

	    // Copy sourcesContent into SourceNode
	    aSourceMapConsumer.sources.forEach(function (sourceFile) {
	      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	      if (content != null) {
	        if (aRelativePath != null) {
	          sourceFile = util.join(aRelativePath, sourceFile);
	        }
	        node.setSourceContent(sourceFile, content);
	      }
	    });

	    return node;

	    function addMappingWithCode(mapping, code) {
	      if (mapping === null || mapping.source === undefined) {
	        node.add(code);
	      } else {
	        var source = aRelativePath
	          ? util.join(aRelativePath, mapping.source)
	          : mapping.source;
	        node.add(new SourceNode(mapping.originalLine,
	                                mapping.originalColumn,
	                                source,
	                                code,
	                                mapping.name));
	      }
	    }
	  };

	/**
	 * Add a chunk of generated JS to this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.add = function SourceNode_add(aChunk) {
	  if (Array.isArray(aChunk)) {
	    aChunk.forEach(function (chunk) {
	      this.add(chunk);
	    }, this);
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    if (aChunk) {
	      this.children.push(aChunk);
	    }
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};

	/**
	 * Add a chunk of generated JS to the beginning of this source node.
	 *
	 * @param aChunk A string snippet of generated JS code, another instance of
	 *        SourceNode, or an array where each member is one of those things.
	 */
	SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	  if (Array.isArray(aChunk)) {
	    for (var i = aChunk.length-1; i >= 0; i--) {
	      this.prepend(aChunk[i]);
	    }
	  }
	  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	    this.children.unshift(aChunk);
	  }
	  else {
	    throw new TypeError(
	      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	    );
	  }
	  return this;
	};

	/**
	 * Walk over the tree of JS snippets in this node and its children. The
	 * walking function is called once for each snippet of JS and is passed that
	 * snippet and the its original associated source's line/column location.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	  var chunk;
	  for (var i = 0, len = this.children.length; i < len; i++) {
	    chunk = this.children[i];
	    if (chunk[isSourceNode]) {
	      chunk.walk(aFn);
	    }
	    else {
	      if (chunk !== '') {
	        aFn(chunk, { source: this.source,
	                     line: this.line,
	                     column: this.column,
	                     name: this.name });
	      }
	    }
	  }
	};

	/**
	 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	 * each of `this.children`.
	 *
	 * @param aSep The separator.
	 */
	SourceNode.prototype.join = function SourceNode_join(aSep) {
	  var newChildren;
	  var i;
	  var len = this.children.length;
	  if (len > 0) {
	    newChildren = [];
	    for (i = 0; i < len-1; i++) {
	      newChildren.push(this.children[i]);
	      newChildren.push(aSep);
	    }
	    newChildren.push(this.children[i]);
	    this.children = newChildren;
	  }
	  return this;
	};

	/**
	 * Call String.prototype.replace on the very right-most source snippet. Useful
	 * for trimming whitespace from the end of a source node, etc.
	 *
	 * @param aPattern The pattern to replace.
	 * @param aReplacement The thing to replace the pattern with.
	 */
	SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	  var lastChild = this.children[this.children.length - 1];
	  if (lastChild[isSourceNode]) {
	    lastChild.replaceRight(aPattern, aReplacement);
	  }
	  else if (typeof lastChild === 'string') {
	    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	  }
	  else {
	    this.children.push(''.replace(aPattern, aReplacement));
	  }
	  return this;
	};

	/**
	 * Set the source content for a source file. This will be added to the SourceMapGenerator
	 * in the sourcesContent field.
	 *
	 * @param aSourceFile The filename of the source file
	 * @param aSourceContent The content of the source file
	 */
	SourceNode.prototype.setSourceContent =
	  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	  };

	/**
	 * Walk over the tree of SourceNodes. The walking function is called for each
	 * source file content and is passed the filename and source content.
	 *
	 * @param aFn The traversal function.
	 */
	SourceNode.prototype.walkSourceContents =
	  function SourceNode_walkSourceContents(aFn) {
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      if (this.children[i][isSourceNode]) {
	        this.children[i].walkSourceContents(aFn);
	      }
	    }

	    var sources = Object.keys(this.sourceContents);
	    for (var i = 0, len = sources.length; i < len; i++) {
	      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	    }
	  };

	/**
	 * Return the string representation of this source node. Walks over the tree
	 * and concatenates all the various snippets together to one string.
	 */
	SourceNode.prototype.toString = function SourceNode_toString() {
	  var str = "";
	  this.walk(function (chunk) {
	    str += chunk;
	  });
	  return str;
	};

	/**
	 * Returns the string representation of this source node along with a source
	 * map.
	 */
	SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	  var generated = {
	    code: "",
	    line: 1,
	    column: 0
	  };
	  var map = new SourceMapGenerator(aArgs);
	  var sourceMappingActive = false;
	  var lastOriginalSource = null;
	  var lastOriginalLine = null;
	  var lastOriginalColumn = null;
	  var lastOriginalName = null;
	  this.walk(function (chunk, original) {
	    generated.code += chunk;
	    if (original.source !== null
	        && original.line !== null
	        && original.column !== null) {
	      if(lastOriginalSource !== original.source
	         || lastOriginalLine !== original.line
	         || lastOriginalColumn !== original.column
	         || lastOriginalName !== original.name) {
	        map.addMapping({
	          source: original.source,
	          original: {
	            line: original.line,
	            column: original.column
	          },
	          generated: {
	            line: generated.line,
	            column: generated.column
	          },
	          name: original.name
	        });
	      }
	      lastOriginalSource = original.source;
	      lastOriginalLine = original.line;
	      lastOriginalColumn = original.column;
	      lastOriginalName = original.name;
	      sourceMappingActive = true;
	    } else if (sourceMappingActive) {
	      map.addMapping({
	        generated: {
	          line: generated.line,
	          column: generated.column
	        }
	      });
	      lastOriginalSource = null;
	      sourceMappingActive = false;
	    }
	    for (var idx = 0, length = chunk.length; idx < length; idx++) {
	      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	        generated.line++;
	        generated.column = 0;
	        // Mappings end at eol
	        if (idx + 1 === length) {
	          lastOriginalSource = null;
	          sourceMappingActive = false;
	        } else if (sourceMappingActive) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	      } else {
	        generated.column++;
	      }
	    }
	  });
	  this.walkSourceContents(function (sourceFile, sourceContent) {
	    map.setSourceContent(sourceFile, sourceContent);
	  });

	  return { code: generated.code, map: map };
	};

	sourceNode.SourceNode = SourceNode;
	return sourceNode;
}

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var hasRequiredSourceMap;

function requireSourceMap () {
	if (hasRequiredSourceMap) return sourceMap;
	hasRequiredSourceMap = 1;
	sourceMap.SourceMapGenerator = requireSourceMapGenerator().SourceMapGenerator;
	sourceMap.SourceMapConsumer = requireSourceMapConsumer().SourceMapConsumer;
	sourceMap.SourceNode = requireSourceNode().SourceNode;
	return sourceMap;
}

var previousMap;
var hasRequiredPreviousMap;

function requirePreviousMap () {
	if (hasRequiredPreviousMap) return previousMap;
	hasRequiredPreviousMap = 1;

	let { existsSync, readFileSync } = fs$4;
	let { dirname, join } = path$2;
	let { SourceMapConsumer, SourceMapGenerator } = requireSourceMap();

	function fromBase64(str) {
	  if (Buffer) {
	    return Buffer.from(str, 'base64').toString()
	  } else {
	    /* c8 ignore next 2 */
	    return window.atob(str)
	  }
	}

	class PreviousMap {
	  constructor(css, opts) {
	    if (opts.map === false) return
	    this.loadAnnotation(css);
	    this.inline = this.startWith(this.annotation, 'data:');

	    let prev = opts.map ? opts.map.prev : undefined;
	    let text = this.loadMap(opts.from, prev);
	    if (!this.mapFile && opts.from) {
	      this.mapFile = opts.from;
	    }
	    if (this.mapFile) this.root = dirname(this.mapFile);
	    if (text) this.text = text;
	  }

	  consumer() {
	    if (!this.consumerCache) {
	      this.consumerCache = new SourceMapConsumer(this.text);
	    }
	    return this.consumerCache
	  }

	  decodeInline(text) {
	    let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
	    let baseUri = /^data:application\/json;base64,/;
	    let charsetUri = /^data:application\/json;charset=utf-?8,/;
	    let uri = /^data:application\/json,/;

	    let uriMatch = text.match(charsetUri) || text.match(uri);
	    if (uriMatch) {
	      return decodeURIComponent(text.substr(uriMatch[0].length))
	    }

	    let baseUriMatch = text.match(baseCharsetUri) || text.match(baseUri);
	    if (baseUriMatch) {
	      return fromBase64(text.substr(baseUriMatch[0].length))
	    }

	    let encoding = text.match(/data:application\/json;([^,]+),/)[1];
	    throw new Error('Unsupported source map encoding ' + encoding)
	  }

	  getAnnotationURL(sourceMapString) {
	    return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, '').trim()
	  }

	  isMap(map) {
	    if (typeof map !== 'object') return false
	    return (
	      typeof map.mappings === 'string' ||
	      typeof map._mappings === 'string' ||
	      Array.isArray(map.sections)
	    )
	  }

	  loadAnnotation(css) {
	    let comments = css.match(/\/\*\s*# sourceMappingURL=/g);
	    if (!comments) return

	    // sourceMappingURLs from comments, strings, etc.
	    let start = css.lastIndexOf(comments.pop());
	    let end = css.indexOf('*/', start);

	    if (start > -1 && end > -1) {
	      // Locate the last sourceMappingURL to avoid pickin
	      this.annotation = this.getAnnotationURL(css.substring(start, end));
	    }
	  }

	  loadFile(path) {
	    this.root = dirname(path);
	    if (existsSync(path)) {
	      this.mapFile = path;
	      return readFileSync(path, 'utf-8').toString().trim()
	    }
	  }

	  loadMap(file, prev) {
	    if (prev === false) return false

	    if (prev) {
	      if (typeof prev === 'string') {
	        return prev
	      } else if (typeof prev === 'function') {
	        let prevPath = prev(file);
	        if (prevPath) {
	          let map = this.loadFile(prevPath);
	          if (!map) {
	            throw new Error(
	              'Unable to load previous source map: ' + prevPath.toString()
	            )
	          }
	          return map
	        }
	      } else if (prev instanceof SourceMapConsumer) {
	        return SourceMapGenerator.fromSourceMap(prev).toString()
	      } else if (prev instanceof SourceMapGenerator) {
	        return prev.toString()
	      } else if (this.isMap(prev)) {
	        return JSON.stringify(prev)
	      } else {
	        throw new Error(
	          'Unsupported previous source map format: ' + prev.toString()
	        )
	      }
	    } else if (this.inline) {
	      return this.decodeInline(this.annotation)
	    } else if (this.annotation) {
	      let map = this.annotation;
	      if (file) map = join(dirname(file), map);
	      return this.loadFile(map)
	    }
	  }

	  startWith(string, start) {
	    if (!string) return false
	    return string.substr(0, start.length) === start
	  }

	  withContent() {
	    return !!(
	      this.consumer().sourcesContent &&
	      this.consumer().sourcesContent.length > 0
	    )
	  }
	}

	previousMap = PreviousMap;
	PreviousMap.default = PreviousMap;
	return previousMap;
}

var input;
var hasRequiredInput;

function requireInput () {
	if (hasRequiredInput) return input;
	hasRequiredInput = 1;

	let { nanoid } = /*@__PURE__*/ requireNonSecure();
	let { isAbsolute, resolve } = path$2;
	let { SourceMapConsumer, SourceMapGenerator } = requireSourceMap();
	let { fileURLToPath, pathToFileURL } = require$$3;

	let CssSyntaxError = requireCssSyntaxError();
	let PreviousMap = requirePreviousMap();
	let terminalHighlight = requireTerminalHighlight();

	let lineToIndexCache = Symbol('lineToIndexCache');

	let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
	let pathAvailable = Boolean(resolve && isAbsolute);

	function getLineToIndex(input) {
	  if (input[lineToIndexCache]) return input[lineToIndexCache]
	  let lines = input.css.split('\n');
	  let lineToIndex = new Array(lines.length);
	  let prevIndex = 0;

	  for (let i = 0, l = lines.length; i < l; i++) {
	    lineToIndex[i] = prevIndex;
	    prevIndex += lines[i].length + 1;
	  }

	  input[lineToIndexCache] = lineToIndex;
	  return lineToIndex
	}

	class Input {
	  get from() {
	    return this.file || this.id
	  }

	  constructor(css, opts = {}) {
	    if (
	      css === null ||
	      typeof css === 'undefined' ||
	      (typeof css === 'object' && !css.toString)
	    ) {
	      throw new Error(`PostCSS received ${css} instead of CSS string`)
	    }

	    this.css = css.toString();

	    if (this.css[0] === '\uFEFF' || this.css[0] === '\uFFFE') {
	      this.hasBOM = true;
	      this.css = this.css.slice(1);
	    } else {
	      this.hasBOM = false;
	    }

	    this.document = this.css;
	    if (opts.document) this.document = opts.document.toString();

	    if (opts.from) {
	      if (
	        !pathAvailable ||
	        /^\w+:\/\//.test(opts.from) ||
	        isAbsolute(opts.from)
	      ) {
	        this.file = opts.from;
	      } else {
	        this.file = resolve(opts.from);
	      }
	    }

	    if (pathAvailable && sourceMapAvailable) {
	      let map = new PreviousMap(this.css, opts);
	      if (map.text) {
	        this.map = map;
	        let file = map.consumer().file;
	        if (!this.file && file) this.file = this.mapResolve(file);
	      }
	    }

	    if (!this.file) {
	      this.id = '<input css ' + nanoid(6) + '>';
	    }
	    if (this.map) this.map.file = this.from;
	  }

	  error(message, line, column, opts = {}) {
	    let endColumn, endLine, endOffset, offset, result;

	    if (line && typeof line === 'object') {
	      let start = line;
	      let end = column;
	      if (typeof start.offset === 'number') {
	        offset = start.offset;
	        let pos = this.fromOffset(offset);
	        line = pos.line;
	        column = pos.col;
	      } else {
	        line = start.line;
	        column = start.column;
	        offset = this.fromLineAndColumn(line, column);
	      }
	      if (typeof end.offset === 'number') {
	        endOffset = end.offset;
	        let pos = this.fromOffset(endOffset);
	        endLine = pos.line;
	        endColumn = pos.col;
	      } else {
	        endLine = end.line;
	        endColumn = end.column;
	        endOffset = this.fromLineAndColumn(end.line, end.column);
	      }
	    } else if (!column) {
	      offset = line;
	      let pos = this.fromOffset(offset);
	      line = pos.line;
	      column = pos.col;
	    } else {
	      offset = this.fromLineAndColumn(line, column);
	    }

	    let origin = this.origin(line, column, endLine, endColumn);
	    if (origin) {
	      result = new CssSyntaxError(
	        message,
	        origin.endLine === undefined
	          ? origin.line
	          : { column: origin.column, line: origin.line },
	        origin.endLine === undefined
	          ? origin.column
	          : { column: origin.endColumn, line: origin.endLine },
	        origin.source,
	        origin.file,
	        opts.plugin
	      );
	    } else {
	      result = new CssSyntaxError(
	        message,
	        endLine === undefined ? line : { column, line },
	        endLine === undefined ? column : { column: endColumn, line: endLine },
	        this.css,
	        this.file,
	        opts.plugin
	      );
	    }

	    result.input = { column, endColumn, endLine, endOffset, line, offset, source: this.css };
	    if (this.file) {
	      if (pathToFileURL) {
	        result.input.url = pathToFileURL(this.file).toString();
	      }
	      result.input.file = this.file;
	    }

	    return result
	  }

	  fromLineAndColumn(line, column) {
	    let lineToIndex = getLineToIndex(this);
	    let index = lineToIndex[line - 1];
	    return index + column - 1
	  }

	  fromOffset(offset) {
	    let lineToIndex = getLineToIndex(this);
	    let lastLine = lineToIndex[lineToIndex.length - 1];

	    let min = 0;
	    if (offset >= lastLine) {
	      min = lineToIndex.length - 1;
	    } else {
	      let max = lineToIndex.length - 2;
	      let mid;
	      while (min < max) {
	        mid = min + ((max - min) >> 1);
	        if (offset < lineToIndex[mid]) {
	          max = mid - 1;
	        } else if (offset >= lineToIndex[mid + 1]) {
	          min = mid + 1;
	        } else {
	          min = mid;
	          break
	        }
	      }
	    }
	    return {
	      col: offset - lineToIndex[min] + 1,
	      line: min + 1
	    }
	  }

	  mapResolve(file) {
	    if (/^\w+:\/\//.test(file)) {
	      return file
	    }
	    return resolve(this.map.consumer().sourceRoot || this.map.root || '.', file)
	  }

	  origin(line, column, endLine, endColumn) {
	    if (!this.map) return false
	    let consumer = this.map.consumer();

	    let from = consumer.originalPositionFor({ column, line });
	    if (!from.source) return false

	    let to;
	    if (typeof endLine === 'number') {
	      to = consumer.originalPositionFor({ column: endColumn, line: endLine });
	    }

	    let fromUrl;

	    if (isAbsolute(from.source)) {
	      fromUrl = pathToFileURL(from.source);
	    } else {
	      fromUrl = new URL(
	        from.source,
	        this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
	      );
	    }

	    let result = {
	      column: from.column,
	      endColumn: to && to.column,
	      endLine: to && to.line,
	      line: from.line,
	      url: fromUrl.toString()
	    };

	    if (fromUrl.protocol === 'file:') {
	      if (fileURLToPath) {
	        result.file = fileURLToPath(fromUrl);
	      } else {
	        /* c8 ignore next 2 */
	        throw new Error(`file: protocol is not available in this PostCSS build`)
	      }
	    }

	    let source = consumer.sourceContentFor(from.source);
	    if (source) result.source = source;

	    return result
	  }

	  toJSON() {
	    let json = {};
	    for (let name of ['hasBOM', 'css', 'file', 'id']) {
	      if (this[name] != null) {
	        json[name] = this[name];
	      }
	    }
	    if (this.map) {
	      json.map = { ...this.map };
	      if (json.map.consumerCache) {
	        json.map.consumerCache = undefined;
	      }
	    }
	    return json
	  }
	}

	input = Input;
	Input.default = Input;

	if (terminalHighlight && terminalHighlight.registerInput) {
	  terminalHighlight.registerInput(Input);
	}
	return input;
}

var root;
var hasRequiredRoot;

function requireRoot () {
	if (hasRequiredRoot) return root;
	hasRequiredRoot = 1;

	let Container = requireContainer();

	let LazyResult, Processor;

	class Root extends Container {
	  constructor(defaults) {
	    super(defaults);
	    this.type = 'root';
	    if (!this.nodes) this.nodes = [];
	  }

	  normalize(child, sample, type) {
	    let nodes = super.normalize(child);

	    if (sample) {
	      if (type === 'prepend') {
	        if (this.nodes.length > 1) {
	          sample.raws.before = this.nodes[1].raws.before;
	        } else {
	          delete sample.raws.before;
	        }
	      } else if (this.first !== sample) {
	        for (let node of nodes) {
	          node.raws.before = sample.raws.before;
	        }
	      }
	    }

	    return nodes
	  }

	  removeChild(child, ignore) {
	    let index = this.index(child);

	    if (!ignore && index === 0 && this.nodes.length > 1) {
	      this.nodes[1].raws.before = this.nodes[index].raws.before;
	    }

	    return super.removeChild(child)
	  }

	  toResult(opts = {}) {
	    let lazy = new LazyResult(new Processor(), this, opts);
	    return lazy.stringify()
	  }
	}

	Root.registerLazyResult = dependant => {
	  LazyResult = dependant;
	};

	Root.registerProcessor = dependant => {
	  Processor = dependant;
	};

	root = Root;
	Root.default = Root;

	Container.registerRoot(Root);
	return root;
}

var list_1;
var hasRequiredList;

function requireList () {
	if (hasRequiredList) return list_1;
	hasRequiredList = 1;

	let list = {
	  comma(string) {
	    return list.split(string, [','], true)
	  },

	  space(string) {
	    let spaces = [' ', '\n', '\t'];
	    return list.split(string, spaces)
	  },

	  split(string, separators, last) {
	    let array = [];
	    let current = '';
	    let split = false;

	    let func = 0;
	    let inQuote = false;
	    let prevQuote = '';
	    let escape = false;

	    for (let letter of string) {
	      if (escape) {
	        escape = false;
	      } else if (letter === '\\') {
	        escape = true;
	      } else if (inQuote) {
	        if (letter === prevQuote) {
	          inQuote = false;
	        }
	      } else if (letter === '"' || letter === "'") {
	        inQuote = true;
	        prevQuote = letter;
	      } else if (letter === '(') {
	        func += 1;
	      } else if (letter === ')') {
	        if (func > 0) func -= 1;
	      } else if (func === 0) {
	        if (separators.includes(letter)) split = true;
	      }

	      if (split) {
	        if (current !== '') array.push(current.trim());
	        current = '';
	        split = false;
	      } else {
	        current += letter;
	      }
	    }

	    if (last || current !== '') array.push(current.trim());
	    return array
	  }
	};

	list_1 = list;
	list.default = list;
	return list_1;
}

var rule;
var hasRequiredRule;

function requireRule () {
	if (hasRequiredRule) return rule;
	hasRequiredRule = 1;

	let Container = requireContainer();
	let list = requireList();

	class Rule extends Container {
	  get selectors() {
	    return list.comma(this.selector)
	  }

	  set selectors(values) {
	    let match = this.selector ? this.selector.match(/,\s*/) : null;
	    let sep = match ? match[0] : ',' + this.raw('between', 'beforeOpen');
	    this.selector = values.join(sep);
	  }

	  constructor(defaults) {
	    super(defaults);
	    this.type = 'rule';
	    if (!this.nodes) this.nodes = [];
	  }
	}

	rule = Rule;
	Rule.default = Rule;

	Container.registerRule(Rule);
	return rule;
}

var fromJSON_1;
var hasRequiredFromJSON;

function requireFromJSON () {
	if (hasRequiredFromJSON) return fromJSON_1;
	hasRequiredFromJSON = 1;

	let AtRule = requireAtRule();
	let Comment = requireComment();
	let Declaration = requireDeclaration();
	let Input = requireInput();
	let PreviousMap = requirePreviousMap();
	let Root = requireRoot();
	let Rule = requireRule();

	function fromJSON(json, inputs) {
	  if (Array.isArray(json)) return json.map(n => fromJSON(n))

	  let { inputs: ownInputs, ...defaults } = json;
	  if (ownInputs) {
	    inputs = [];
	    for (let input of ownInputs) {
	      let inputHydrated = { ...input, __proto__: Input.prototype };
	      if (inputHydrated.map) {
	        inputHydrated.map = {
	          ...inputHydrated.map,
	          __proto__: PreviousMap.prototype
	        };
	      }
	      inputs.push(inputHydrated);
	    }
	  }
	  if (defaults.nodes) {
	    defaults.nodes = json.nodes.map(n => fromJSON(n, inputs));
	  }
	  if (defaults.source) {
	    let { inputId, ...source } = defaults.source;
	    defaults.source = source;
	    if (inputId != null) {
	      defaults.source.input = inputs[inputId];
	    }
	  }
	  if (defaults.type === 'root') {
	    return new Root(defaults)
	  } else if (defaults.type === 'decl') {
	    return new Declaration(defaults)
	  } else if (defaults.type === 'rule') {
	    return new Rule(defaults)
	  } else if (defaults.type === 'comment') {
	    return new Comment(defaults)
	  } else if (defaults.type === 'atrule') {
	    return new AtRule(defaults)
	  } else {
	    throw new Error('Unknown node type: ' + json.type)
	  }
	}

	fromJSON_1 = fromJSON;
	fromJSON.default = fromJSON;
	return fromJSON_1;
}

var mapGenerator;
var hasRequiredMapGenerator;

function requireMapGenerator () {
	if (hasRequiredMapGenerator) return mapGenerator;
	hasRequiredMapGenerator = 1;

	let { dirname, relative, resolve, sep } = path$2;
	let { SourceMapConsumer, SourceMapGenerator } = requireSourceMap();
	let { pathToFileURL } = require$$3;

	let Input = requireInput();

	let sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
	let pathAvailable = Boolean(dirname && resolve && relative && sep);

	class MapGenerator {
	  constructor(stringify, root, opts, cssString) {
	    this.stringify = stringify;
	    this.mapOpts = opts.map || {};
	    this.root = root;
	    this.opts = opts;
	    this.css = cssString;
	    this.originalCSS = cssString;
	    this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;

	    this.memoizedFileURLs = new Map();
	    this.memoizedPaths = new Map();
	    this.memoizedURLs = new Map();
	  }

	  addAnnotation() {
	    let content;

	    if (this.isInline()) {
	      content =
	        'data:application/json;base64,' + this.toBase64(this.map.toString());
	    } else if (typeof this.mapOpts.annotation === 'string') {
	      content = this.mapOpts.annotation;
	    } else if (typeof this.mapOpts.annotation === 'function') {
	      content = this.mapOpts.annotation(this.opts.to, this.root);
	    } else {
	      content = this.outputFile() + '.map';
	    }
	    let eol = '\n';
	    if (this.css.includes('\r\n')) eol = '\r\n';

	    this.css += eol + '/*# sourceMappingURL=' + content + ' */';
	  }

	  applyPrevMaps() {
	    for (let prev of this.previous()) {
	      let from = this.toUrl(this.path(prev.file));
	      let root = prev.root || dirname(prev.file);
	      let map;

	      if (this.mapOpts.sourcesContent === false) {
	        map = new SourceMapConsumer(prev.text);
	        if (map.sourcesContent) {
	          map.sourcesContent = null;
	        }
	      } else {
	        map = prev.consumer();
	      }

	      this.map.applySourceMap(map, from, this.toUrl(this.path(root)));
	    }
	  }

	  clearAnnotation() {
	    if (this.mapOpts.annotation === false) return

	    if (this.root) {
	      let node;
	      for (let i = this.root.nodes.length - 1; i >= 0; i--) {
	        node = this.root.nodes[i];
	        if (node.type !== 'comment') continue
	        if (node.text.startsWith('# sourceMappingURL=')) {
	          this.root.removeChild(i);
	        }
	      }
	    } else if (this.css) {
	      let startIndex;
	      while ((startIndex = this.css.lastIndexOf('/*#')) !== -1) {
	        let endIndex = this.css.indexOf('*/', startIndex + 3);
	        if (endIndex === -1) break
	        while (startIndex > 0 && this.css[startIndex - 1] === '\n') {
	          startIndex--;
	        }
	        this.css = this.css.slice(0, startIndex) + this.css.slice(endIndex + 2);
	      }
	    }
	  }

	  generate() {
	    this.clearAnnotation();
	    if (pathAvailable && sourceMapAvailable && this.isMap()) {
	      return this.generateMap()
	    } else {
	      let result = '';
	      this.stringify(this.root, i => {
	        result += i;
	      });
	      return [result]
	    }
	  }

	  generateMap() {
	    if (this.root) {
	      this.generateString();
	    } else if (this.previous().length === 1) {
	      let prev = this.previous()[0].consumer();
	      prev.file = this.outputFile();
	      this.map = SourceMapGenerator.fromSourceMap(prev, {
	        ignoreInvalidMapping: true
	      });
	    } else {
	      this.map = new SourceMapGenerator({
	        file: this.outputFile(),
	        ignoreInvalidMapping: true
	      });
	      this.map.addMapping({
	        generated: { column: 0, line: 1 },
	        original: { column: 0, line: 1 },
	        source: this.opts.from
	          ? this.toUrl(this.path(this.opts.from))
	          : '<no source>'
	      });
	    }

	    if (this.isSourcesContent()) this.setSourcesContent();
	    if (this.root && this.previous().length > 0) this.applyPrevMaps();
	    if (this.isAnnotation()) this.addAnnotation();

	    if (this.isInline()) {
	      return [this.css]
	    } else {
	      return [this.css, this.map]
	    }
	  }

	  generateString() {
	    this.css = '';
	    this.map = new SourceMapGenerator({
	      file: this.outputFile(),
	      ignoreInvalidMapping: true
	    });

	    let line = 1;
	    let column = 1;

	    let noSource = '<no source>';
	    let mapping = {
	      generated: { column: 0, line: 0 },
	      original: { column: 0, line: 0 },
	      source: ''
	    };

	    let last, lines;
	    this.stringify(this.root, (str, node, type) => {
	      this.css += str;

	      if (node && type !== 'end') {
	        mapping.generated.line = line;
	        mapping.generated.column = column - 1;
	        if (node.source && node.source.start) {
	          mapping.source = this.sourcePath(node);
	          mapping.original.line = node.source.start.line;
	          mapping.original.column = node.source.start.column - 1;
	          this.map.addMapping(mapping);
	        } else {
	          mapping.source = noSource;
	          mapping.original.line = 1;
	          mapping.original.column = 0;
	          this.map.addMapping(mapping);
	        }
	      }

	      lines = str.match(/\n/g);
	      if (lines) {
	        line += lines.length;
	        last = str.lastIndexOf('\n');
	        column = str.length - last;
	      } else {
	        column += str.length;
	      }

	      if (node && type !== 'start') {
	        let p = node.parent || { raws: {} };
	        let childless =
	          node.type === 'decl' || (node.type === 'atrule' && !node.nodes);
	        if (!childless || node !== p.last || p.raws.semicolon) {
	          if (node.source && node.source.end) {
	            mapping.source = this.sourcePath(node);
	            mapping.original.line = node.source.end.line;
	            mapping.original.column = node.source.end.column - 1;
	            mapping.generated.line = line;
	            mapping.generated.column = column - 2;
	            this.map.addMapping(mapping);
	          } else {
	            mapping.source = noSource;
	            mapping.original.line = 1;
	            mapping.original.column = 0;
	            mapping.generated.line = line;
	            mapping.generated.column = column - 1;
	            this.map.addMapping(mapping);
	          }
	        }
	      }
	    });
	  }

	  isAnnotation() {
	    if (this.isInline()) {
	      return true
	    }
	    if (typeof this.mapOpts.annotation !== 'undefined') {
	      return this.mapOpts.annotation
	    }
	    if (this.previous().length) {
	      return this.previous().some(i => i.annotation)
	    }
	    return true
	  }

	  isInline() {
	    if (typeof this.mapOpts.inline !== 'undefined') {
	      return this.mapOpts.inline
	    }

	    let annotation = this.mapOpts.annotation;
	    if (typeof annotation !== 'undefined' && annotation !== true) {
	      return false
	    }

	    if (this.previous().length) {
	      return this.previous().some(i => i.inline)
	    }
	    return true
	  }

	  isMap() {
	    if (typeof this.opts.map !== 'undefined') {
	      return !!this.opts.map
	    }
	    return this.previous().length > 0
	  }

	  isSourcesContent() {
	    if (typeof this.mapOpts.sourcesContent !== 'undefined') {
	      return this.mapOpts.sourcesContent
	    }
	    if (this.previous().length) {
	      return this.previous().some(i => i.withContent())
	    }
	    return true
	  }

	  outputFile() {
	    if (this.opts.to) {
	      return this.path(this.opts.to)
	    } else if (this.opts.from) {
	      return this.path(this.opts.from)
	    } else {
	      return 'to.css'
	    }
	  }

	  path(file) {
	    if (this.mapOpts.absolute) return file
	    if (file.charCodeAt(0) === 60 /* `<` */) return file
	    if (/^\w+:\/\//.test(file)) return file
	    let cached = this.memoizedPaths.get(file);
	    if (cached) return cached

	    let from = this.opts.to ? dirname(this.opts.to) : '.';

	    if (typeof this.mapOpts.annotation === 'string') {
	      from = dirname(resolve(from, this.mapOpts.annotation));
	    }

	    let path = relative(from, file);
	    this.memoizedPaths.set(file, path);

	    return path
	  }

	  previous() {
	    if (!this.previousMaps) {
	      this.previousMaps = [];
	      if (this.root) {
	        this.root.walk(node => {
	          if (node.source && node.source.input.map) {
	            let map = node.source.input.map;
	            if (!this.previousMaps.includes(map)) {
	              this.previousMaps.push(map);
	            }
	          }
	        });
	      } else {
	        let input = new Input(this.originalCSS, this.opts);
	        if (input.map) this.previousMaps.push(input.map);
	      }
	    }

	    return this.previousMaps
	  }

	  setSourcesContent() {
	    let already = {};
	    if (this.root) {
	      this.root.walk(node => {
	        if (node.source) {
	          let from = node.source.input.from;
	          if (from && !already[from]) {
	            already[from] = true;
	            let fromUrl = this.usesFileUrls
	              ? this.toFileUrl(from)
	              : this.toUrl(this.path(from));
	            this.map.setSourceContent(fromUrl, node.source.input.css);
	          }
	        }
	      });
	    } else if (this.css) {
	      let from = this.opts.from
	        ? this.toUrl(this.path(this.opts.from))
	        : '<no source>';
	      this.map.setSourceContent(from, this.css);
	    }
	  }

	  sourcePath(node) {
	    if (this.mapOpts.from) {
	      return this.toUrl(this.mapOpts.from)
	    } else if (this.usesFileUrls) {
	      return this.toFileUrl(node.source.input.from)
	    } else {
	      return this.toUrl(this.path(node.source.input.from))
	    }
	  }

	  toBase64(str) {
	    if (Buffer) {
	      return Buffer.from(str).toString('base64')
	    } else {
	      return window.btoa(unescape(encodeURIComponent(str)))
	    }
	  }

	  toFileUrl(path) {
	    let cached = this.memoizedFileURLs.get(path);
	    if (cached) return cached

	    if (pathToFileURL) {
	      let fileURL = pathToFileURL(path).toString();
	      this.memoizedFileURLs.set(path, fileURL);

	      return fileURL
	    } else {
	      throw new Error(
	        '`map.absolute` option is not available in this PostCSS build'
	      )
	    }
	  }

	  toUrl(path) {
	    let cached = this.memoizedURLs.get(path);
	    if (cached) return cached

	    if (sep === '\\') {
	      path = path.replace(/\\/g, '/');
	    }

	    let url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
	    this.memoizedURLs.set(path, url);

	    return url
	  }
	}

	mapGenerator = MapGenerator;
	return mapGenerator;
}

var parser;
var hasRequiredParser;

function requireParser () {
	if (hasRequiredParser) return parser;
	hasRequiredParser = 1;

	let AtRule = requireAtRule();
	let Comment = requireComment();
	let Declaration = requireDeclaration();
	let Root = requireRoot();
	let Rule = requireRule();
	let tokenizer = requireTokenize();

	const SAFE_COMMENT_NEIGHBOR = {
	  empty: true,
	  space: true
	};

	function findLastWithPosition(tokens) {
	  for (let i = tokens.length - 1; i >= 0; i--) {
	    let token = tokens[i];
	    let pos = token[3] || token[2];
	    if (pos) return pos
	  }
	}

	class Parser {
	  constructor(input) {
	    this.input = input;

	    this.root = new Root();
	    this.current = this.root;
	    this.spaces = '';
	    this.semicolon = false;

	    this.createTokenizer();
	    this.root.source = { input, start: { column: 1, line: 1, offset: 0 } };
	  }

	  atrule(token) {
	    let node = new AtRule();
	    node.name = token[1].slice(1);
	    if (node.name === '') {
	      this.unnamedAtrule(node, token);
	    }
	    this.init(node, token[2]);

	    let type;
	    let prev;
	    let shift;
	    let last = false;
	    let open = false;
	    let params = [];
	    let brackets = [];

	    while (!this.tokenizer.endOfFile()) {
	      token = this.tokenizer.nextToken();
	      type = token[0];

	      if (type === '(' || type === '[') {
	        brackets.push(type === '(' ? ')' : ']');
	      } else if (type === '{' && brackets.length > 0) {
	        brackets.push('}');
	      } else if (type === brackets[brackets.length - 1]) {
	        brackets.pop();
	      }

	      if (brackets.length === 0) {
	        if (type === ';') {
	          node.source.end = this.getPosition(token[2]);
	          node.source.end.offset++;
	          this.semicolon = true;
	          break
	        } else if (type === '{') {
	          open = true;
	          break
	        } else if (type === '}') {
	          if (params.length > 0) {
	            shift = params.length - 1;
	            prev = params[shift];
	            while (prev && prev[0] === 'space') {
	              prev = params[--shift];
	            }
	            if (prev) {
	              node.source.end = this.getPosition(prev[3] || prev[2]);
	              node.source.end.offset++;
	            }
	          }
	          this.end(token);
	          break
	        } else {
	          params.push(token);
	        }
	      } else {
	        params.push(token);
	      }

	      if (this.tokenizer.endOfFile()) {
	        last = true;
	        break
	      }
	    }

	    node.raws.between = this.spacesAndCommentsFromEnd(params);
	    if (params.length) {
	      node.raws.afterName = this.spacesAndCommentsFromStart(params);
	      this.raw(node, 'params', params);
	      if (last) {
	        token = params[params.length - 1];
	        node.source.end = this.getPosition(token[3] || token[2]);
	        node.source.end.offset++;
	        this.spaces = node.raws.between;
	        node.raws.between = '';
	      }
	    } else {
	      node.raws.afterName = '';
	      node.params = '';
	    }

	    if (open) {
	      node.nodes = [];
	      this.current = node;
	    }
	  }

	  checkMissedSemicolon(tokens) {
	    let colon = this.colon(tokens);
	    if (colon === false) return

	    let founded = 0;
	    let token;
	    for (let j = colon - 1; j >= 0; j--) {
	      token = tokens[j];
	      if (token[0] !== 'space') {
	        founded += 1;
	        if (founded === 2) break
	      }
	    }
	    // If the token is a word, e.g. `!important`, `red` or any other valid property's value.
	    // Then we need to return the colon after that word token. [3] is the "end" colon of that word.
	    // And because we need it after that one we do +1 to get the next one.
	    throw this.input.error(
	      'Missed semicolon',
	      token[0] === 'word' ? token[3] + 1 : token[2]
	    )
	  }

	  colon(tokens) {
	    let brackets = 0;
	    let prev, token, type;
	    for (let [i, element] of tokens.entries()) {
	      token = element;
	      type = token[0];

	      if (type === '(') {
	        brackets += 1;
	      }
	      if (type === ')') {
	        brackets -= 1;
	      }
	      if (brackets === 0 && type === ':') {
	        if (!prev) {
	          this.doubleColon(token);
	        } else if (prev[0] === 'word' && prev[1] === 'progid') {
	          continue
	        } else {
	          return i
	        }
	      }

	      prev = token;
	    }
	    return false
	  }

	  comment(token) {
	    let node = new Comment();
	    this.init(node, token[2]);
	    node.source.end = this.getPosition(token[3] || token[2]);
	    node.source.end.offset++;

	    let text = token[1].slice(2, -2);
	    if (!text.trim()) {
	      node.text = '';
	      node.raws.left = text;
	      node.raws.right = '';
	    } else {
	      let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
	      node.text = match[2];
	      node.raws.left = match[1];
	      node.raws.right = match[3];
	    }
	  }

	  createTokenizer() {
	    this.tokenizer = tokenizer(this.input);
	  }

	  decl(tokens, customProperty) {
	    let node = new Declaration();
	    this.init(node, tokens[0][2]);

	    let last = tokens[tokens.length - 1];
	    if (last[0] === ';') {
	      this.semicolon = true;
	      tokens.pop();
	    }

	    node.source.end = this.getPosition(
	      last[3] || last[2] || findLastWithPosition(tokens)
	    );
	    node.source.end.offset++;

	    while (tokens[0][0] !== 'word') {
	      if (tokens.length === 1) this.unknownWord(tokens);
	      node.raws.before += tokens.shift()[1];
	    }
	    node.source.start = this.getPosition(tokens[0][2]);

	    node.prop = '';
	    while (tokens.length) {
	      let type = tokens[0][0];
	      if (type === ':' || type === 'space' || type === 'comment') {
	        break
	      }
	      node.prop += tokens.shift()[1];
	    }

	    node.raws.between = '';

	    let token;
	    while (tokens.length) {
	      token = tokens.shift();

	      if (token[0] === ':') {
	        node.raws.between += token[1];
	        break
	      } else {
	        if (token[0] === 'word' && /\w/.test(token[1])) {
	          this.unknownWord([token]);
	        }
	        node.raws.between += token[1];
	      }
	    }

	    if (node.prop[0] === '_' || node.prop[0] === '*') {
	      node.raws.before += node.prop[0];
	      node.prop = node.prop.slice(1);
	    }

	    let firstSpaces = [];
	    let next;
	    while (tokens.length) {
	      next = tokens[0][0];
	      if (next !== 'space' && next !== 'comment') break
	      firstSpaces.push(tokens.shift());
	    }

	    this.precheckMissedSemicolon(tokens);

	    for (let i = tokens.length - 1; i >= 0; i--) {
	      token = tokens[i];
	      if (token[1].toLowerCase() === '!important') {
	        node.important = true;
	        let string = this.stringFrom(tokens, i);
	        string = this.spacesFromEnd(tokens) + string;
	        if (string !== ' !important') node.raws.important = string;
	        break
	      } else if (token[1].toLowerCase() === 'important') {
	        let cache = tokens.slice(0);
	        let str = '';
	        for (let j = i; j > 0; j--) {
	          let type = cache[j][0];
	          if (str.trim().startsWith('!') && type !== 'space') {
	            break
	          }
	          str = cache.pop()[1] + str;
	        }
	        if (str.trim().startsWith('!')) {
	          node.important = true;
	          node.raws.important = str;
	          tokens = cache;
	        }
	      }

	      if (token[0] !== 'space' && token[0] !== 'comment') {
	        break
	      }
	    }

	    let hasWord = tokens.some(i => i[0] !== 'space' && i[0] !== 'comment');

	    if (hasWord) {
	      node.raws.between += firstSpaces.map(i => i[1]).join('');
	      firstSpaces = [];
	    }
	    this.raw(node, 'value', firstSpaces.concat(tokens), customProperty);

	    if (node.value.includes(':') && !customProperty) {
	      this.checkMissedSemicolon(tokens);
	    }
	  }

	  doubleColon(token) {
	    throw this.input.error(
	      'Double colon',
	      { offset: token[2] },
	      { offset: token[2] + token[1].length }
	    )
	  }

	  emptyRule(token) {
	    let node = new Rule();
	    this.init(node, token[2]);
	    node.selector = '';
	    node.raws.between = '';
	    this.current = node;
	  }

	  end(token) {
	    if (this.current.nodes && this.current.nodes.length) {
	      this.current.raws.semicolon = this.semicolon;
	    }
	    this.semicolon = false;

	    this.current.raws.after = (this.current.raws.after || '') + this.spaces;
	    this.spaces = '';

	    if (this.current.parent) {
	      this.current.source.end = this.getPosition(token[2]);
	      this.current.source.end.offset++;
	      this.current = this.current.parent;
	    } else {
	      this.unexpectedClose(token);
	    }
	  }

	  endFile() {
	    if (this.current.parent) this.unclosedBlock();
	    if (this.current.nodes && this.current.nodes.length) {
	      this.current.raws.semicolon = this.semicolon;
	    }
	    this.current.raws.after = (this.current.raws.after || '') + this.spaces;
	    this.root.source.end = this.getPosition(this.tokenizer.position());
	  }

	  freeSemicolon(token) {
	    this.spaces += token[1];
	    if (this.current.nodes) {
	      let prev = this.current.nodes[this.current.nodes.length - 1];
	      if (prev && prev.type === 'rule' && !prev.raws.ownSemicolon) {
	        prev.raws.ownSemicolon = this.spaces;
	        this.spaces = '';
	        prev.source.end = this.getPosition(token[2]);
	        prev.source.end.offset += prev.raws.ownSemicolon.length;
	      }
	    }
	  }

	  // Helpers

	  getPosition(offset) {
	    let pos = this.input.fromOffset(offset);
	    return {
	      column: pos.col,
	      line: pos.line,
	      offset
	    }
	  }

	  init(node, offset) {
	    this.current.push(node);
	    node.source = {
	      input: this.input,
	      start: this.getPosition(offset)
	    };
	    node.raws.before = this.spaces;
	    this.spaces = '';
	    if (node.type !== 'comment') this.semicolon = false;
	  }

	  other(start) {
	    let end = false;
	    let type = null;
	    let colon = false;
	    let bracket = null;
	    let brackets = [];
	    let customProperty = start[1].startsWith('--');

	    let tokens = [];
	    let token = start;
	    while (token) {
	      type = token[0];
	      tokens.push(token);

	      if (type === '(' || type === '[') {
	        if (!bracket) bracket = token;
	        brackets.push(type === '(' ? ')' : ']');
	      } else if (customProperty && colon && type === '{') {
	        if (!bracket) bracket = token;
	        brackets.push('}');
	      } else if (brackets.length === 0) {
	        if (type === ';') {
	          if (colon) {
	            this.decl(tokens, customProperty);
	            return
	          } else {
	            break
	          }
	        } else if (type === '{') {
	          this.rule(tokens);
	          return
	        } else if (type === '}') {
	          this.tokenizer.back(tokens.pop());
	          end = true;
	          break
	        } else if (type === ':') {
	          colon = true;
	        }
	      } else if (type === brackets[brackets.length - 1]) {
	        brackets.pop();
	        if (brackets.length === 0) bracket = null;
	      }

	      token = this.tokenizer.nextToken();
	    }

	    if (this.tokenizer.endOfFile()) end = true;
	    if (brackets.length > 0) this.unclosedBracket(bracket);

	    if (end && colon) {
	      if (!customProperty) {
	        while (tokens.length) {
	          token = tokens[tokens.length - 1][0];
	          if (token !== 'space' && token !== 'comment') break
	          this.tokenizer.back(tokens.pop());
	        }
	      }
	      this.decl(tokens, customProperty);
	    } else {
	      this.unknownWord(tokens);
	    }
	  }

	  parse() {
	    let token;
	    while (!this.tokenizer.endOfFile()) {
	      token = this.tokenizer.nextToken();

	      switch (token[0]) {
	        case 'space':
	          this.spaces += token[1];
	          break

	        case ';':
	          this.freeSemicolon(token);
	          break

	        case '}':
	          this.end(token);
	          break

	        case 'comment':
	          this.comment(token);
	          break

	        case 'at-word':
	          this.atrule(token);
	          break

	        case '{':
	          this.emptyRule(token);
	          break

	        default:
	          this.other(token);
	          break
	      }
	    }
	    this.endFile();
	  }

	  precheckMissedSemicolon(/* tokens */) {
	    // Hook for Safe Parser
	  }

	  raw(node, prop, tokens, customProperty) {
	    let token, type;
	    let length = tokens.length;
	    let value = '';
	    let clean = true;
	    let next, prev;

	    for (let i = 0; i < length; i += 1) {
	      token = tokens[i];
	      type = token[0];
	      if (type === 'space' && i === length - 1 && !customProperty) {
	        clean = false;
	      } else if (type === 'comment') {
	        prev = tokens[i - 1] ? tokens[i - 1][0] : 'empty';
	        next = tokens[i + 1] ? tokens[i + 1][0] : 'empty';
	        if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
	          if (value.slice(-1) === ',') {
	            clean = false;
	          } else {
	            value += token[1];
	          }
	        } else {
	          clean = false;
	        }
	      } else {
	        value += token[1];
	      }
	    }
	    if (!clean) {
	      let raw = tokens.reduce((all, i) => all + i[1], '');
	      node.raws[prop] = { raw, value };
	    }
	    node[prop] = value;
	  }

	  rule(tokens) {
	    tokens.pop();

	    let node = new Rule();
	    this.init(node, tokens[0][2]);

	    node.raws.between = this.spacesAndCommentsFromEnd(tokens);
	    this.raw(node, 'selector', tokens);
	    this.current = node;
	  }

	  spacesAndCommentsFromEnd(tokens) {
	    let lastTokenType;
	    let spaces = '';
	    while (tokens.length) {
	      lastTokenType = tokens[tokens.length - 1][0];
	      if (lastTokenType !== 'space' && lastTokenType !== 'comment') break
	      spaces = tokens.pop()[1] + spaces;
	    }
	    return spaces
	  }

	  // Errors

	  spacesAndCommentsFromStart(tokens) {
	    let next;
	    let spaces = '';
	    while (tokens.length) {
	      next = tokens[0][0];
	      if (next !== 'space' && next !== 'comment') break
	      spaces += tokens.shift()[1];
	    }
	    return spaces
	  }

	  spacesFromEnd(tokens) {
	    let lastTokenType;
	    let spaces = '';
	    while (tokens.length) {
	      lastTokenType = tokens[tokens.length - 1][0];
	      if (lastTokenType !== 'space') break
	      spaces = tokens.pop()[1] + spaces;
	    }
	    return spaces
	  }

	  stringFrom(tokens, from) {
	    let result = '';
	    for (let i = from; i < tokens.length; i++) {
	      result += tokens[i][1];
	    }
	    tokens.splice(from, tokens.length - from);
	    return result
	  }

	  unclosedBlock() {
	    let pos = this.current.source.start;
	    throw this.input.error('Unclosed block', pos.line, pos.column)
	  }

	  unclosedBracket(bracket) {
	    throw this.input.error(
	      'Unclosed bracket',
	      { offset: bracket[2] },
	      { offset: bracket[2] + 1 }
	    )
	  }

	  unexpectedClose(token) {
	    throw this.input.error(
	      'Unexpected }',
	      { offset: token[2] },
	      { offset: token[2] + 1 }
	    )
	  }

	  unknownWord(tokens) {
	    throw this.input.error(
	      'Unknown word ' + tokens[0][1],
	      { offset: tokens[0][2] },
	      { offset: tokens[0][2] + tokens[0][1].length }
	    )
	  }

	  unnamedAtrule(node, token) {
	    throw this.input.error(
	      'At-rule without name',
	      { offset: token[2] },
	      { offset: token[2] + token[1].length }
	    )
	  }
	}

	parser = Parser;
	return parser;
}

var parse_1$2;
var hasRequiredParse$2;

function requireParse$2 () {
	if (hasRequiredParse$2) return parse_1$2;
	hasRequiredParse$2 = 1;

	let Container = requireContainer();
	let Input = requireInput();
	let Parser = requireParser();

	function parse(css, opts) {
	  let input = new Input(css, opts);
	  let parser = new Parser(input);
	  try {
	    parser.parse();
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production') {
	      if (e.name === 'CssSyntaxError' && opts && opts.from) {
	        if (/\.scss$/i.test(opts.from)) {
	          e.message +=
	            '\nYou tried to parse SCSS with ' +
	            'the standard CSS parser; ' +
	            'try again with the postcss-scss parser';
	        } else if (/\.sass/i.test(opts.from)) {
	          e.message +=
	            '\nYou tried to parse Sass with ' +
	            'the standard CSS parser; ' +
	            'try again with the postcss-sass parser';
	        } else if (/\.less$/i.test(opts.from)) {
	          e.message +=
	            '\nYou tried to parse Less with ' +
	            'the standard CSS parser; ' +
	            'try again with the postcss-less parser';
	        }
	      }
	    }
	    throw e
	  }

	  return parser.root
	}

	parse_1$2 = parse;
	parse.default = parse;

	Container.registerParse(parse);
	return parse_1$2;
}

var warning;
var hasRequiredWarning;

function requireWarning () {
	if (hasRequiredWarning) return warning;
	hasRequiredWarning = 1;

	class Warning {
	  constructor(text, opts = {}) {
	    this.type = 'warning';
	    this.text = text;

	    if (opts.node && opts.node.source) {
	      let range = opts.node.rangeBy(opts);
	      this.line = range.start.line;
	      this.column = range.start.column;
	      this.endLine = range.end.line;
	      this.endColumn = range.end.column;
	    }

	    for (let opt in opts) this[opt] = opts[opt];
	  }

	  toString() {
	    if (this.node) {
	      return this.node.error(this.text, {
	        index: this.index,
	        plugin: this.plugin,
	        word: this.word
	      }).message
	    }

	    if (this.plugin) {
	      return this.plugin + ': ' + this.text
	    }

	    return this.text
	  }
	}

	warning = Warning;
	Warning.default = Warning;
	return warning;
}

var result;
var hasRequiredResult;

function requireResult () {
	if (hasRequiredResult) return result;
	hasRequiredResult = 1;

	let Warning = requireWarning();

	class Result {
	  get content() {
	    return this.css
	  }

	  constructor(processor, root, opts) {
	    this.processor = processor;
	    this.messages = [];
	    this.root = root;
	    this.opts = opts;
	    this.css = '';
	    this.map = undefined;
	  }

	  toString() {
	    return this.css
	  }

	  warn(text, opts = {}) {
	    if (!opts.plugin) {
	      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
	        opts.plugin = this.lastPlugin.postcssPlugin;
	      }
	    }

	    let warning = new Warning(text, opts);
	    this.messages.push(warning);

	    return warning
	  }

	  warnings() {
	    return this.messages.filter(i => i.type === 'warning')
	  }
	}

	result = Result;
	Result.default = Result;
	return result;
}

/* eslint-disable no-console */

var warnOnce;
var hasRequiredWarnOnce;

function requireWarnOnce () {
	if (hasRequiredWarnOnce) return warnOnce;
	hasRequiredWarnOnce = 1;

	let printed = {};

	warnOnce = function warnOnce(message) {
	  if (printed[message]) return
	  printed[message] = true;

	  if (typeof console !== 'undefined' && console.warn) {
	    console.warn(message);
	  }
	};
	return warnOnce;
}

var lazyResult;
var hasRequiredLazyResult;

function requireLazyResult () {
	if (hasRequiredLazyResult) return lazyResult;
	hasRequiredLazyResult = 1;

	let Container = requireContainer();
	let Document = requireDocument();
	let MapGenerator = requireMapGenerator();
	let parse = requireParse$2();
	let Result = requireResult();
	let Root = requireRoot();
	let stringify = requireStringify$1();
	let { isClean, my } = requireSymbols();
	let warnOnce = requireWarnOnce();

	const TYPE_TO_CLASS_NAME = {
	  atrule: 'AtRule',
	  comment: 'Comment',
	  decl: 'Declaration',
	  document: 'Document',
	  root: 'Root',
	  rule: 'Rule'
	};

	const PLUGIN_PROPS = {
	  AtRule: true,
	  AtRuleExit: true,
	  Comment: true,
	  CommentExit: true,
	  Declaration: true,
	  DeclarationExit: true,
	  Document: true,
	  DocumentExit: true,
	  Once: true,
	  OnceExit: true,
	  postcssPlugin: true,
	  prepare: true,
	  Root: true,
	  RootExit: true,
	  Rule: true,
	  RuleExit: true
	};

	const NOT_VISITORS = {
	  Once: true,
	  postcssPlugin: true,
	  prepare: true
	};

	const CHILDREN = 0;

	function isPromise(obj) {
	  return typeof obj === 'object' && typeof obj.then === 'function'
	}

	function getEvents(node) {
	  let key = false;
	  let type = TYPE_TO_CLASS_NAME[node.type];
	  if (node.type === 'decl') {
	    key = node.prop.toLowerCase();
	  } else if (node.type === 'atrule') {
	    key = node.name.toLowerCase();
	  }

	  if (key && node.append) {
	    return [
	      type,
	      type + '-' + key,
	      CHILDREN,
	      type + 'Exit',
	      type + 'Exit-' + key
	    ]
	  } else if (key) {
	    return [type, type + '-' + key, type + 'Exit', type + 'Exit-' + key]
	  } else if (node.append) {
	    return [type, CHILDREN, type + 'Exit']
	  } else {
	    return [type, type + 'Exit']
	  }
	}

	function toStack(node) {
	  let events;
	  if (node.type === 'document') {
	    events = ['Document', CHILDREN, 'DocumentExit'];
	  } else if (node.type === 'root') {
	    events = ['Root', CHILDREN, 'RootExit'];
	  } else {
	    events = getEvents(node);
	  }

	  return {
	    eventIndex: 0,
	    events,
	    iterator: 0,
	    node,
	    visitorIndex: 0,
	    visitors: []
	  }
	}

	function cleanMarks(node) {
	  node[isClean] = false;
	  if (node.nodes) node.nodes.forEach(i => cleanMarks(i));
	  return node
	}

	let postcss = {};

	class LazyResult {
	  get content() {
	    return this.stringify().content
	  }

	  get css() {
	    return this.stringify().css
	  }

	  get map() {
	    return this.stringify().map
	  }

	  get messages() {
	    return this.sync().messages
	  }

	  get opts() {
	    return this.result.opts
	  }

	  get processor() {
	    return this.result.processor
	  }

	  get root() {
	    return this.sync().root
	  }

	  get [Symbol.toStringTag]() {
	    return 'LazyResult'
	  }

	  constructor(processor, css, opts) {
	    this.stringified = false;
	    this.processed = false;

	    let root;
	    if (
	      typeof css === 'object' &&
	      css !== null &&
	      (css.type === 'root' || css.type === 'document')
	    ) {
	      root = cleanMarks(css);
	    } else if (css instanceof LazyResult || css instanceof Result) {
	      root = cleanMarks(css.root);
	      if (css.map) {
	        if (typeof opts.map === 'undefined') opts.map = {};
	        if (!opts.map.inline) opts.map.inline = false;
	        opts.map.prev = css.map;
	      }
	    } else {
	      let parser = parse;
	      if (opts.syntax) parser = opts.syntax.parse;
	      if (opts.parser) parser = opts.parser;
	      if (parser.parse) parser = parser.parse;

	      try {
	        root = parser(css, opts);
	      } catch (error) {
	        this.processed = true;
	        this.error = error;
	      }

	      if (root && !root[my]) {
	        /* c8 ignore next 2 */
	        Container.rebuild(root);
	      }
	    }

	    this.result = new Result(processor, root, opts);
	    this.helpers = { ...postcss, postcss, result: this.result };
	    this.plugins = this.processor.plugins.map(plugin => {
	      if (typeof plugin === 'object' && plugin.prepare) {
	        return { ...plugin, ...plugin.prepare(this.result) }
	      } else {
	        return plugin
	      }
	    });
	  }

	  async() {
	    if (this.error) return Promise.reject(this.error)
	    if (this.processed) return Promise.resolve(this.result)
	    if (!this.processing) {
	      this.processing = this.runAsync();
	    }
	    return this.processing
	  }

	  catch(onRejected) {
	    return this.async().catch(onRejected)
	  }

	  finally(onFinally) {
	    return this.async().then(onFinally, onFinally)
	  }

	  getAsyncError() {
	    throw new Error('Use process(css).then(cb) to work with async plugins')
	  }

	  handleError(error, node) {
	    let plugin = this.result.lastPlugin;
	    try {
	      if (node) node.addToError(error);
	      this.error = error;
	      if (error.name === 'CssSyntaxError' && !error.plugin) {
	        error.plugin = plugin.postcssPlugin;
	        error.setMessage();
	      } else if (plugin.postcssVersion) {
	        if (process.env.NODE_ENV !== 'production') {
	          let pluginName = plugin.postcssPlugin;
	          let pluginVer = plugin.postcssVersion;
	          let runtimeVer = this.result.processor.version;
	          let a = pluginVer.split('.');
	          let b = runtimeVer.split('.');

	          if (a[0] !== b[0] || parseInt(a[1]) > parseInt(b[1])) {
	            // eslint-disable-next-line no-console
	            console.error(
	              'Unknown error from PostCSS plugin. Your current PostCSS ' +
	                'version is ' +
	                runtimeVer +
	                ', but ' +
	                pluginName +
	                ' uses ' +
	                pluginVer +
	                '. Perhaps this is the source of the error below.'
	            );
	          }
	        }
	      }
	    } catch (err) {
	      /* c8 ignore next 3 */
	      // eslint-disable-next-line no-console
	      if (console && console.error) console.error(err);
	    }
	    return error
	  }

	  prepareVisitors() {
	    this.listeners = {};
	    let add = (plugin, type, cb) => {
	      if (!this.listeners[type]) this.listeners[type] = [];
	      this.listeners[type].push([plugin, cb]);
	    };
	    for (let plugin of this.plugins) {
	      if (typeof plugin === 'object') {
	        for (let event in plugin) {
	          if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
	            throw new Error(
	              `Unknown event ${event} in ${plugin.postcssPlugin}. ` +
	                `Try to update PostCSS (${this.processor.version} now).`
	            )
	          }
	          if (!NOT_VISITORS[event]) {
	            if (typeof plugin[event] === 'object') {
	              for (let filter in plugin[event]) {
	                if (filter === '*') {
	                  add(plugin, event, plugin[event][filter]);
	                } else {
	                  add(
	                    plugin,
	                    event + '-' + filter.toLowerCase(),
	                    plugin[event][filter]
	                  );
	                }
	              }
	            } else if (typeof plugin[event] === 'function') {
	              add(plugin, event, plugin[event]);
	            }
	          }
	        }
	      }
	    }
	    this.hasListener = Object.keys(this.listeners).length > 0;
	  }

	  async runAsync() {
	    this.plugin = 0;
	    for (let i = 0; i < this.plugins.length; i++) {
	      let plugin = this.plugins[i];
	      let promise = this.runOnRoot(plugin);
	      if (isPromise(promise)) {
	        try {
	          await promise;
	        } catch (error) {
	          throw this.handleError(error)
	        }
	      }
	    }

	    this.prepareVisitors();
	    if (this.hasListener) {
	      let root = this.result.root;
	      while (!root[isClean]) {
	        root[isClean] = true;
	        let stack = [toStack(root)];
	        while (stack.length > 0) {
	          let promise = this.visitTick(stack);
	          if (isPromise(promise)) {
	            try {
	              await promise;
	            } catch (e) {
	              let node = stack[stack.length - 1].node;
	              throw this.handleError(e, node)
	            }
	          }
	        }
	      }

	      if (this.listeners.OnceExit) {
	        for (let [plugin, visitor] of this.listeners.OnceExit) {
	          this.result.lastPlugin = plugin;
	          try {
	            if (root.type === 'document') {
	              let roots = root.nodes.map(subRoot =>
	                visitor(subRoot, this.helpers)
	              );

	              await Promise.all(roots);
	            } else {
	              await visitor(root, this.helpers);
	            }
	          } catch (e) {
	            throw this.handleError(e)
	          }
	        }
	      }
	    }

	    this.processed = true;
	    return this.stringify()
	  }

	  runOnRoot(plugin) {
	    this.result.lastPlugin = plugin;
	    try {
	      if (typeof plugin === 'object' && plugin.Once) {
	        if (this.result.root.type === 'document') {
	          let roots = this.result.root.nodes.map(root =>
	            plugin.Once(root, this.helpers)
	          );

	          if (isPromise(roots[0])) {
	            return Promise.all(roots)
	          }

	          return roots
	        }

	        return plugin.Once(this.result.root, this.helpers)
	      } else if (typeof plugin === 'function') {
	        return plugin(this.result.root, this.result)
	      }
	    } catch (error) {
	      throw this.handleError(error)
	    }
	  }

	  stringify() {
	    if (this.error) throw this.error
	    if (this.stringified) return this.result
	    this.stringified = true;

	    this.sync();

	    let opts = this.result.opts;
	    let str = stringify;
	    if (opts.syntax) str = opts.syntax.stringify;
	    if (opts.stringifier) str = opts.stringifier;
	    if (str.stringify) str = str.stringify;

	    let map = new MapGenerator(str, this.result.root, this.result.opts);
	    let data = map.generate();
	    this.result.css = data[0];
	    this.result.map = data[1];

	    return this.result
	  }

	  sync() {
	    if (this.error) throw this.error
	    if (this.processed) return this.result
	    this.processed = true;

	    if (this.processing) {
	      throw this.getAsyncError()
	    }

	    for (let plugin of this.plugins) {
	      let promise = this.runOnRoot(plugin);
	      if (isPromise(promise)) {
	        throw this.getAsyncError()
	      }
	    }

	    this.prepareVisitors();
	    if (this.hasListener) {
	      let root = this.result.root;
	      while (!root[isClean]) {
	        root[isClean] = true;
	        this.walkSync(root);
	      }
	      if (this.listeners.OnceExit) {
	        if (root.type === 'document') {
	          for (let subRoot of root.nodes) {
	            this.visitSync(this.listeners.OnceExit, subRoot);
	          }
	        } else {
	          this.visitSync(this.listeners.OnceExit, root);
	        }
	      }
	    }

	    return this.result
	  }

	  then(onFulfilled, onRejected) {
	    if (process.env.NODE_ENV !== 'production') {
	      if (!('from' in this.opts)) {
	        warnOnce(
	          'Without `from` option PostCSS could generate wrong source map ' +
	            'and will not find Browserslist config. Set it to CSS file path ' +
	            'or to `undefined` to prevent this warning.'
	        );
	      }
	    }
	    return this.async().then(onFulfilled, onRejected)
	  }

	  toString() {
	    return this.css
	  }

	  visitSync(visitors, node) {
	    for (let [plugin, visitor] of visitors) {
	      this.result.lastPlugin = plugin;
	      let promise;
	      try {
	        promise = visitor(node, this.helpers);
	      } catch (e) {
	        throw this.handleError(e, node.proxyOf)
	      }
	      if (node.type !== 'root' && node.type !== 'document' && !node.parent) {
	        return true
	      }
	      if (isPromise(promise)) {
	        throw this.getAsyncError()
	      }
	    }
	  }

	  visitTick(stack) {
	    let visit = stack[stack.length - 1];
	    let { node, visitors } = visit;

	    if (node.type !== 'root' && node.type !== 'document' && !node.parent) {
	      stack.pop();
	      return
	    }

	    if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
	      let [plugin, visitor] = visitors[visit.visitorIndex];
	      visit.visitorIndex += 1;
	      if (visit.visitorIndex === visitors.length) {
	        visit.visitors = [];
	        visit.visitorIndex = 0;
	      }
	      this.result.lastPlugin = plugin;
	      try {
	        return visitor(node.toProxy(), this.helpers)
	      } catch (e) {
	        throw this.handleError(e, node)
	      }
	    }

	    if (visit.iterator !== 0) {
	      let iterator = visit.iterator;
	      let child;
	      while ((child = node.nodes[node.indexes[iterator]])) {
	        node.indexes[iterator] += 1;
	        if (!child[isClean]) {
	          child[isClean] = true;
	          stack.push(toStack(child));
	          return
	        }
	      }
	      visit.iterator = 0;
	      delete node.indexes[iterator];
	    }

	    let events = visit.events;
	    while (visit.eventIndex < events.length) {
	      let event = events[visit.eventIndex];
	      visit.eventIndex += 1;
	      if (event === CHILDREN) {
	        if (node.nodes && node.nodes.length) {
	          node[isClean] = true;
	          visit.iterator = node.getIterator();
	        }
	        return
	      } else if (this.listeners[event]) {
	        visit.visitors = this.listeners[event];
	        return
	      }
	    }
	    stack.pop();
	  }

	  walkSync(node) {
	    node[isClean] = true;
	    let events = getEvents(node);
	    for (let event of events) {
	      if (event === CHILDREN) {
	        if (node.nodes) {
	          node.each(child => {
	            if (!child[isClean]) this.walkSync(child);
	          });
	        }
	      } else {
	        let visitors = this.listeners[event];
	        if (visitors) {
	          if (this.visitSync(visitors, node.toProxy())) return
	        }
	      }
	    }
	  }

	  warnings() {
	    return this.sync().warnings()
	  }
	}

	LazyResult.registerPostcss = dependant => {
	  postcss = dependant;
	};

	lazyResult = LazyResult;
	LazyResult.default = LazyResult;

	Root.registerLazyResult(LazyResult);
	Document.registerLazyResult(LazyResult);
	return lazyResult;
}

var noWorkResult;
var hasRequiredNoWorkResult;

function requireNoWorkResult () {
	if (hasRequiredNoWorkResult) return noWorkResult;
	hasRequiredNoWorkResult = 1;

	let MapGenerator = requireMapGenerator();
	let parse = requireParse$2();
	const Result = requireResult();
	let stringify = requireStringify$1();
	let warnOnce = requireWarnOnce();

	class NoWorkResult {
	  get content() {
	    return this.result.css
	  }

	  get css() {
	    return this.result.css
	  }

	  get map() {
	    return this.result.map
	  }

	  get messages() {
	    return []
	  }

	  get opts() {
	    return this.result.opts
	  }

	  get processor() {
	    return this.result.processor
	  }

	  get root() {
	    if (this._root) {
	      return this._root
	    }

	    let root;
	    let parser = parse;

	    try {
	      root = parser(this._css, this._opts);
	    } catch (error) {
	      this.error = error;
	    }

	    if (this.error) {
	      throw this.error
	    } else {
	      this._root = root;
	      return root
	    }
	  }

	  get [Symbol.toStringTag]() {
	    return 'NoWorkResult'
	  }

	  constructor(processor, css, opts) {
	    css = css.toString();
	    this.stringified = false;

	    this._processor = processor;
	    this._css = css;
	    this._opts = opts;
	    this._map = undefined;

	    let str = stringify;
	    this.result = new Result(this._processor, undefined, this._opts);
	    this.result.css = css;

	    let self = this;
	    Object.defineProperty(this.result, 'root', {
	      get() {
	        return self.root
	      }
	    });

	    let map = new MapGenerator(str, undefined, this._opts, css);
	    if (map.isMap()) {
	      let [generatedCSS, generatedMap] = map.generate();
	      if (generatedCSS) {
	        this.result.css = generatedCSS;
	      }
	      if (generatedMap) {
	        this.result.map = generatedMap;
	      }
	    } else {
	      map.clearAnnotation();
	      this.result.css = map.css;
	    }
	  }

	  async() {
	    if (this.error) return Promise.reject(this.error)
	    return Promise.resolve(this.result)
	  }

	  catch(onRejected) {
	    return this.async().catch(onRejected)
	  }

	  finally(onFinally) {
	    return this.async().then(onFinally, onFinally)
	  }

	  sync() {
	    if (this.error) throw this.error
	    return this.result
	  }

	  then(onFulfilled, onRejected) {
	    if (process.env.NODE_ENV !== 'production') {
	      if (!('from' in this._opts)) {
	        warnOnce(
	          'Without `from` option PostCSS could generate wrong source map ' +
	            'and will not find Browserslist config. Set it to CSS file path ' +
	            'or to `undefined` to prevent this warning.'
	        );
	      }
	    }

	    return this.async().then(onFulfilled, onRejected)
	  }

	  toString() {
	    return this._css
	  }

	  warnings() {
	    return []
	  }
	}

	noWorkResult = NoWorkResult;
	NoWorkResult.default = NoWorkResult;
	return noWorkResult;
}

var processor;
var hasRequiredProcessor;

function requireProcessor () {
	if (hasRequiredProcessor) return processor;
	hasRequiredProcessor = 1;

	let Document = requireDocument();
	let LazyResult = requireLazyResult();
	let NoWorkResult = requireNoWorkResult();
	let Root = requireRoot();

	class Processor {
	  constructor(plugins = []) {
	    this.version = '8.5.8';
	    this.plugins = this.normalize(plugins);
	  }

	  normalize(plugins) {
	    let normalized = [];
	    for (let i of plugins) {
	      if (i.postcss === true) {
	        i = i();
	      } else if (i.postcss) {
	        i = i.postcss;
	      }

	      if (typeof i === 'object' && Array.isArray(i.plugins)) {
	        normalized = normalized.concat(i.plugins);
	      } else if (typeof i === 'object' && i.postcssPlugin) {
	        normalized.push(i);
	      } else if (typeof i === 'function') {
	        normalized.push(i);
	      } else if (typeof i === 'object' && (i.parse || i.stringify)) {
	        if (process.env.NODE_ENV !== 'production') {
	          throw new Error(
	            'PostCSS syntaxes cannot be used as plugins. Instead, please use ' +
	              'one of the syntax/parser/stringifier options as outlined ' +
	              'in your PostCSS runner documentation.'
	          )
	        }
	      } else {
	        throw new Error(i + ' is not a PostCSS plugin')
	      }
	    }
	    return normalized
	  }

	  process(css, opts = {}) {
	    if (
	      !this.plugins.length &&
	      !opts.parser &&
	      !opts.stringifier &&
	      !opts.syntax
	    ) {
	      return new NoWorkResult(this, css, opts)
	    } else {
	      return new LazyResult(this, css, opts)
	    }
	  }

	  use(plugin) {
	    this.plugins = this.plugins.concat(this.normalize([plugin]));
	    return this
	  }
	}

	processor = Processor;
	Processor.default = Processor;

	Root.registerProcessor(Processor);
	Document.registerProcessor(Processor);
	return processor;
}

var postcss_1;
var hasRequiredPostcss;

function requirePostcss () {
	if (hasRequiredPostcss) return postcss_1;
	hasRequiredPostcss = 1;

	let AtRule = requireAtRule();
	let Comment = requireComment();
	let Container = requireContainer();
	let CssSyntaxError = requireCssSyntaxError();
	let Declaration = requireDeclaration();
	let Document = requireDocument();
	let fromJSON = requireFromJSON();
	let Input = requireInput();
	let LazyResult = requireLazyResult();
	let list = requireList();
	let Node = requireNode();
	let parse = requireParse$2();
	let Processor = requireProcessor();
	let Result = requireResult();
	let Root = requireRoot();
	let Rule = requireRule();
	let stringify = requireStringify$1();
	let Warning = requireWarning();

	function postcss(...plugins) {
	  if (plugins.length === 1 && Array.isArray(plugins[0])) {
	    plugins = plugins[0];
	  }
	  return new Processor(plugins)
	}

	postcss.plugin = function plugin(name, initializer) {
	  let warningPrinted = false;
	  function creator(...args) {
	    // eslint-disable-next-line no-console
	    if (console && console.warn && !warningPrinted) {
	      warningPrinted = true;
	      // eslint-disable-next-line no-console
	      console.warn(
	        name +
	          ': postcss.plugin was deprecated. Migration guide:\n' +
	          'https://evilmartians.com/chronicles/postcss-8-plugin-migration'
	      );
	      if (process.env.LANG && process.env.LANG.startsWith('cn')) {
	        /* c8 ignore next 7 */
	        // eslint-disable-next-line no-console
	        console.warn(
	          name +
	            ': 里面 postcss.plugin 被弃用. 迁移指南:\n' +
	            'https://www.w3ctech.com/topic/2226'
	        );
	      }
	    }
	    let transformer = initializer(...args);
	    transformer.postcssPlugin = name;
	    transformer.postcssVersion = new Processor().version;
	    return transformer
	  }

	  let cache;
	  Object.defineProperty(creator, 'postcss', {
	    get() {
	      if (!cache) cache = creator();
	      return cache
	    }
	  });

	  creator.process = function (css, processOpts, pluginOpts) {
	    return postcss([creator(pluginOpts)]).process(css, processOpts)
	  };

	  return creator
	};

	postcss.stringify = stringify;
	postcss.parse = parse;
	postcss.fromJSON = fromJSON;
	postcss.list = list;

	postcss.comment = defaults => new Comment(defaults);
	postcss.atRule = defaults => new AtRule(defaults);
	postcss.decl = defaults => new Declaration(defaults);
	postcss.rule = defaults => new Rule(defaults);
	postcss.root = defaults => new Root(defaults);
	postcss.document = defaults => new Document(defaults);

	postcss.CssSyntaxError = CssSyntaxError;
	postcss.Declaration = Declaration;
	postcss.Container = Container;
	postcss.Processor = Processor;
	postcss.Document = Document;
	postcss.Comment = Comment;
	postcss.Warning = Warning;
	postcss.AtRule = AtRule;
	postcss.Result = Result;
	postcss.Input = Input;
	postcss.Rule = Rule;
	postcss.Root = Root;
	postcss.Node = Node;

	LazyResult.registerPostcss(postcss);

	postcss_1 = postcss;
	postcss.default = postcss;
	return postcss_1;
}

var postcssExports = requirePostcss();
var postcss = /*@__PURE__*/getDefaultExportFromCjs(postcssExports);

postcss.stringify;
postcss.fromJSON;
postcss.plugin;
postcss.parse;
postcss.list;

postcss.document;
postcss.comment;
postcss.atRule;
postcss.rule;
postcss.decl;
postcss.root;

postcss.CssSyntaxError;
postcss.Declaration;
postcss.Container;
postcss.Processor;
postcss.Document;
postcss.Comment;
postcss.Warning;
postcss.AtRule;
postcss.Result;
postcss.Input;
postcss.Rule;
postcss.Root;
postcss.Node;

function _nullishCoalesce$8(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain$b(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



function toArray(v) {
  if (Array.isArray(v))
    return v;
  return [v];
}

const _hashCache = new Map();
function hash(str) {
  if (_hashCache.has(str)) return _hashCache.get(str);
  const oStr = str;
  str = str.replace(/\r/g, '');
  let hash = 5381;
  let i = str.length;

  while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
  const res = (hash >>> 0).toString(36);
  _hashCache.set(oStr, res);
  return res;
}

function indent(code, tab = 2) {
  const spaces = Array(tab).fill(' ').join('');
  return code
    .split('\n')
    .map((line) => spaces + line)
    .join('\n');
}

function wrapit(
  code,
  start = '{',
  end = '}',
  tab = 2,
  minify = false
) {
  if (minify) return `${start}${code}${end}`;
  return `${start}\n${indent(code, tab)}\n${end}`;
}

function minifyCssPattern(css) {
  return css
    .replace(/(?<=[\s:])0(?:px|em|rem|ex|ch|vw|vh|vmin|vmax|%|pt|pc|in|cm|mm)(?=[;\s}])/g, '0')
    .replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3(?=[;\s}])/gi, '#$1$2$3')
    .replace(/0\./g, '.'); // 0.5 -> .5
}

function isNumber$1(
  amount,
  start = -Infinity,
  end = Infinity,
  type = 'int'
) {
  const isInt = /^-?\d+$/.test(amount);
  if (type === 'int') {
    if (!isInt) return false;
  } else {
    const isFloat = /^-?\d+\.\d+$/.test(amount);
    if (!(isInt || isFloat)) return false;
  }
  const num = parseFloat(amount);
  return num >= start && num <= end;
}

function isFraction(amount) {
  return /^\d+\/\d+$/.test(amount);
}

function isSize(amount) {
  return /^-?(\d+(\.\d+)?)+(rem|em|px|rpx|vh|vw|ch|ex|cm|mm|in|pt|pc)$/.test(amount);
}

function isSpace(str) {
  return /^\s*$/.test(str);
}

function roundUp(num, precision = 0) {
  precision = Math.pow(10, precision);
  return Math.round(num * precision) / precision;
}

function fracToPercent(amount) {
  const matches = amount.match(/[^/]+/g);
  if (!matches || matches.length < 2) return;
  const a = +matches[0];
  const b = +matches[1];
  return roundUp((a / b) * 100, 6) + '%';
}

function hex2RGB(hex) {
  const RGB_HEX = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/i;
  const [, short, long] = String(hex).match(RGB_HEX) || [];

  if (long) {
    const value = Number.parseInt(long, 16);
    return [value >> 16, (value >> 8) & 0xff, value & 0xff];
  } else if (short) {
    return Array.from(short, (s) => Number.parseInt(s, 16)).map(
      (n) => (n << 4) | n
    );
  }
}

function camelToDash(str) {
  // Use exact the same regex as Post CSS
  return str.replace(/([A-Z])/g, '-$1').replace(/^ms-/, '-ms-').toLowerCase();
}

function dashToCamel(str) {
  if (!/-/.test(str)) return str;
  return str.toLowerCase().replace(/-(.)/g, (_, group) => group.toUpperCase());
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNestedValue(obj, key) {
  const topKey = key.match(/^[^.[]+/);
  if (!topKey) return;
  let topValue = obj[topKey[0]];
  if (!topValue) return;
  let index = topKey[0].length;
  while(index < key.length) {
    const square = key.slice(index, ).match(/\[[^\s\]]+?\]/);
    const dot = key.slice(index, ).match(/\.[^.[]+$|\.[^.[]+(?=\.)/);
    if (( !square && !dot ) || ( _optionalChain$b([square, 'optionalAccess', _2 => _2.index]) === undefined && _optionalChain$b([dot, 'optionalAccess', _3 => _3.index]) === undefined )) return topValue;
    if (typeof topValue !== 'object') return;
    if (dot && dot.index !== undefined && (_optionalChain$b([square, 'optionalAccess', _4 => _4.index]) === undefined || dot.index < square.index)) {
      const arg = dot[0].slice(1,);
      topValue = topValue[arg];
      index += dot.index + dot[0].length;
    } else if (square && square.index !== undefined) {
      const arg = square[0].slice(1, -1).trim().replace(/^['"]+|['"]+$/g, '');
      topValue = topValue[arg];
      index += square.index + square[0].length;
    }
  }
  return topValue;
}

function negateValue(value) {
  if (/(^0\w)|(^-)|(^0$)/.test(value)) return value;
  return '-' + value;
}

function searchFrom(
  text,
  target,
  startIndex = 0,
  endIndex
) {
  // search from partial of string
  const subText = text.substring(startIndex, endIndex);
  const relativeIndex = subText.search(target);
  return relativeIndex === -1 ? -1 : startIndex + relativeIndex;
}

function connectList(a, b, append = true) {
  return append ? [...(_nullishCoalesce$8(a, () => ( []))), ...(_nullishCoalesce$8(b, () => ( [])))] : [...(_nullishCoalesce$8(b, () => ( []))), ...(_nullishCoalesce$8(a, () => ( [])))];
}







function toType(
  value,
  type
) {
  switch (type) {
  case 'object':
    return value && typeof value === 'object' ? value : {};
  case 'string':
    if (typeof value === 'string') return value ;
    break;
  case 'number':
    if (typeof value === 'number') return value ;
    break;
  }
}

function deepCopy(source) {
  if (source === null || typeof source !== 'object') {
    return source;
  }
  if (Array.isArray(source)) {
    return (source ).map((item) => deepCopy(item)) ;
  }
  if (source instanceof Date) {
    return new Date(source.getTime()) ;
  }

  // Fast path for plain objects
  const proto = Object.getPrototypeOf(source);
  if (proto === Object.prototype || proto === null) {
    const copy = Object.create(proto);
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        copy[key] = deepCopy((source )[key]);
      }
    }
    return copy;
  }

  return Object.getOwnPropertyNames(source).reduce((o, prop) => {
    const descriptor = Object.getOwnPropertyDescriptor(source, prop);
    if (descriptor) {
      Object.defineProperty(o, prop, descriptor);
      if (source && typeof source === 'object') {
        o[prop] = deepCopy(
          ((source ) )[prop]
        );
      }
    }
    return o;
  }, Object.create(proto));
}

function isTagName(name) {
  return ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embd', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'].includes(name);
}

function flatColors(colors, head) {
  let flatten = {};
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string' || typeof value === 'function') {
      flatten[(head && key === 'DEFAULT') ? head : head ? `${head}-${key}`: key] = value;
    } else {
      flatten = { ...flatten, ...flatColors(value, head ? `${head}-${key}`: key) };
    }
  }
  return flatten;
}

function testRegexr(text, expressions) {
  for (const exp of expressions) {
    if (exp.test(text)) return true;
  }
  return false;
}

function searchPropEnd(text, startIndex = 0) {
  let index = startIndex;
  let output = -1;
  let openSingleQuote = false;
  let openDoubleQuote = false;
  let openBracket = false;
  let isEscaped = false;
  while (index < text.length) {
    switch (text.charAt(index)) {
    case '\\':
      isEscaped = !isEscaped;
      break;
    case '\'':
      if (!openDoubleQuote && !openBracket && !isEscaped) openSingleQuote = !openSingleQuote;
      isEscaped = false;
      break;
    case '"':
      if (!openSingleQuote && !openBracket && !isEscaped) openDoubleQuote = !openDoubleQuote;
      isEscaped = false;
      break;
    case '(':
      if (!openBracket && !openSingleQuote && !openDoubleQuote && !isEscaped) openBracket = true;
      isEscaped = false;
      break;
    case ')':
      if (openBracket && !isEscaped) openBracket = false;
      isEscaped = false;
      break;
    case ';':
      if (!isEscaped && !openSingleQuote && !openDoubleQuote && !openBracket) output = index;
      isEscaped = false;
      break;
    default:
      isEscaped = false;
      break;
    }
    if (output !== -1) break;
    index++;
  }
  return output;
}

function searchNotEscape(text, chars = ['{']) {
  if (!Array.isArray(chars)) chars = [ chars ];
  let i = 0;
  while (i < text.length) {
    if (chars.includes(text.charAt(i)) && text.charAt(i - 1) !== '\\') {
      return i;
    }
    i ++;
  }
  return -1;
}

function splitSelectors(selectors) {

  const splitted = [];
  let parens = 0;
  let angulars = 0;
  let soFar = '';
  for (let i = 0, len = selectors.length; i < len; i++) {
    const char = selectors[i];
    if (char === '(') {
      parens += 1;
    } else if (char === ')') {
      parens -= 1;
    } else if (char === '[') {
      angulars += 1;
    } else if (char === ']') {
      angulars -= 1;
    } else if (char === ',') {
      if (!parens && !angulars) {
        splitted.push(soFar.trim());
        soFar = '';
        continue;
      }
    }
    soFar += char;
  }
  splitted.push(soFar.trim());
  return splitted;
}

function guessClassName(selector) {
  if (selector.indexOf(',') >= 0) {
    const splittedSelectors = splitSelectors(selector);
    if (splittedSelectors.length !== 1)
      return splittedSelectors.map(
        (i) => guessClassName(i) 
      );
  }
  // not classes, contains attribute selectors, nested selectors - treat as static
  if (selector.charAt(0) !== '.' || searchNotEscape(selector, ['[', '>', '+', '~']) >= 0 || selector.trim().indexOf(' ') >= 0 || searchNotEscape(selector.slice(1), '.') >=0)
    return { selector, isClass: false };
  const pseudo = searchNotEscape(selector, ':');
  const className = (_optionalChain$b([selector, 'access', _5 => _5.match, 'call', _6 => _6(/^\.([\w-]|(\\\W))+/), 'optionalAccess', _7 => _7[0], 'access', _8 => _8.slice, 'call', _9 => _9(1,)]) || '').replace(/\\/g, '');
  if (pseudo === -1) return { selector: className, isClass: true };
  return { selector: className, isClass: true, pseudo: selector.slice(pseudo,) };
}
/**
 * Increase string a value with unit
 *
 * @example '2px' + 1 = '3px'
 * @example '15em' + (-2) = '13em'
 */



function increaseWithUnit(target, delta) {
  if (typeof target === 'number')
    return target + delta;
  const value = _optionalChain$b([target, 'access', _10 => _10.match, 'call', _11 => _11(/^-?[0-9]+\.?[0-9]*/), 'optionalAccess', _12 => _12[0]]) || '';
  const unit = target.slice(value.length);
  const result = (parseFloat(value) + delta);
  if (Number.isNaN(result))
    return target;
  return result + unit;
}


function splitColorGroup(color) {
  const sep = color.indexOf('/');
  if (sep === -1) return [ color, undefined ];
  return [ color.slice(0, sep), color.slice(sep+1) ];
}

function _nullishCoalesce$7(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain$a(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
 













class Property {
  __init() {this.meta = { type: 'utilities', group: 'plugin', order: 0, offset: 0, corePlugin: false };}
  
  
  
  

  constructor(
    name,
    value,
    comment,
    important = false
  ) {Property.prototype.__init.call(this);
    this.name = name;
    this.value = value;
    this.comment = comment;
    this.important = important;
  }

   static _singleParse(
    css
  ) {
    css = css.trim();
    if (!css) return;
    if (css.charAt(0) === '@') return InlineAtRule.parse(css);
    const split = css.search(':');
    const end = searchPropEnd(css);
    if (split === -1) return;
    let important = false;
    let prop = css.substring(split + 1, end === -1 ? undefined : end).trim();
    if (/!important;?$/.test(prop)) {
      important = true;
      prop = prop.replace(/!important/, '').trimRight();
    }
    return new Property(
      css.substring(0, split).trim(),
      prop,
      undefined,
      important
    );
  }

  static parse(
    css
  ) {
    if (!/;\s*$/.test(css)) css += ';'; // Fix for the situation where the last semicolon is omitted
    const properties = [];
    let index = 0;
    let end = searchPropEnd(css, index);
    while (end !== -1) {
      const parsed = this._singleParse(css.substring(searchFrom(css, /\S/, index), end + 1));
      if (parsed) properties.push(parsed);
      index = end + 1;
      end = searchPropEnd(css, index);
    }
    const count = properties.length;
    if (count > 1) return properties;
    if (count === 1) return properties[0];
  }

  clone() {
    return deepCopy(this);
  }

  toStyle(selector) {
    const style = new Style(selector, this, this.important);
    style.meta = this.meta;
    return style;
  }

  build(minify = false) {
    const createProperty = (name, value) => {
      if (minify) {
        return `${name}:${value}${this.important ? '!important' : ''};`;
      } else {
        const p = `${name}: ${value}${this.important ? ' !important' : ''};`;
        return this.comment ? p + ` /* ${this.comment} */` : p;
      }
    };
    if (!this.value) return '';
    return typeof this.name === 'string'
      ? createProperty(this.name, this.value)
      : this.name
        .map((i) => createProperty(i, this.value))
        .join(minify ? '' : '\n');
  }

  updateMeta(type, group, order, offset = 0, corePlugin = false) {
    this.meta = {
      type,
      group,
      order,
      offset,
      corePlugin,
    };
    return this;
  }
}

class InlineAtRule extends Property {
  
  constructor(name, value, important = false) {
    super(name, value, undefined, important);
    this.name = name;
  }
  static parse(css) {
    const matchName = css.match(/@[^\s;{}]+/);
    if (matchName) {
      const name = matchName[0].substring(1);
      let important = false;
      let expression =
        matchName.index !== undefined
          ? _optionalChain$a([css
, 'access', _ => _.substring, 'call', _2 => _2(matchName.index + name.length + 1)
, 'access', _3 => _3.match, 'call', _4 => _4(/(?:(['"]).*?\1|[^;])*/), 'optionalAccess', _5 => _5[0]
, 'access', _6 => _6.trim, 'call', _7 => _7()])
          : undefined;
      if (expression && /!important;?$/.test(expression)) {
        important = true;
        expression = expression.replace(/!important/, '').trimRight();
      }
      return new InlineAtRule(
        name,
        expression === '' ? undefined : expression,
        important
      );
    }
  }
  build() {
    return this.value
      ? `@${this.name} ${this.value}${this.important ? ' !important' : ''};`
      : `@${this.name}${this.important ? ' !important' : ''};`;
  }
}

class Style {
  __init2() {this.meta = { type: 'components', group: 'plugin', order: 0, offset: 0, corePlugin: false };}
  
  
  
  
  
  
  
  
  
  
  
  

  constructor(
    selector,
    property,
    important = false
  ) {Style.prototype.__init2.call(this);
    this.selector = selector;
    this.important = important;
    this.property = toArray(property || []);
  }

  get rule() {
    let selectors = (_nullishCoalesce$7(this.selector, () => ( ''))).trim().split(/\s*,\s*/g);
    this._parentSelectors && (selectors = selectors.map(i => `${_optionalChain$a([this, 'access', _8 => _8._parentSelectors, 'optionalAccess', _9 => _9.join, 'call', _10 => _10(' ')])} ${i}`));
    (_nullishCoalesce$7(this._wrapSelectors, () => ( []))).forEach((func) => (selectors = selectors.map(i => func(i))));
    this._pseudoClasses && (selectors = selectors.map(i => i + `:${_optionalChain$a([this, 'access', _11 => _11._pseudoClasses, 'optionalAccess', _12 => _12.join, 'call', _13 => _13(':')])}`));
    this._pseudoElements && (selectors = selectors.map(i => i + `::${_optionalChain$a([this, 'access', _14 => _14._pseudoElements, 'optionalAccess', _15 => _15.join, 'call', _16 => _16('::')])}`));
    this._brotherSelectors && (selectors = selectors.map(i => i + `.${_optionalChain$a([this, 'access', _17 => _17._brotherSelectors, 'optionalAccess', _18 => _18.join, 'call', _19 => _19('.')])}`));
    this._childSelectors && (selectors = selectors.map(i => i + ` ${_optionalChain$a([this, 'access', _20 => _20._childSelectors, 'optionalAccess', _21 => _21.join, 'call', _22 => _22(' ')])}`));
    (_nullishCoalesce$7(this._wrapRules, () => ( []))).forEach((func) => (selectors = selectors.map(i => func(i))));
    return selectors.join(', ');
  }

  get pseudoClasses() {
    return this._pseudoClasses;
  }

  get pseudoElements() {
    return this._pseudoElements;
  }

  get parentSelectors() {
    return this._parentSelectors;
  }

  get childSelectors() {
    return this._childSelectors;
  }

  get brotherSelectors() {
    return this._brotherSelectors;
  }

  get wrapProperties() {
    return this._wrapProperties;
  }

  get wrapSelectors() {
    return this._wrapSelectors;
  }

  get wrapRules() {
    return this._wrapRules;
  }

  get simple() {
    // is this style only has property and no wrap?
    return !(this.atRules || this._pseudoClasses || this._pseudoElements || this._parentSelectors || this._childSelectors || this._brotherSelectors || this._wrapProperties || this._wrapSelectors || this._wrapRules);
  }

  get isAtrule() {
    return !(this.atRules === undefined || this.atRules.length === 0);
  }

  static generate(
    parent,
    property,
    root,
  ) {
    if (!root)
      root = _optionalChain$a([parent, 'optionalAccess', _23 => _23.startsWith, 'call', _24 => _24('@')])
        ? new Style().atRule(parent)
        : new Style(parent);

    let output = [];

    for (const [key, value] of Object.entries(_nullishCoalesce$7(property, () => ( {})))) {
      let propertyValue = value;
      if (Array.isArray(propertyValue) && propertyValue.every(e => typeof e === 'object')) {
        propertyValue = Object.assign({}, ...propertyValue);
      }
      if (typeof propertyValue === 'string') {
        root.add(new Property(camelToDash(key), propertyValue));
      } else if (Array.isArray(propertyValue)) {
        propertyValue.map(i => _optionalChain$a([root, 'optionalAccess', _25 => _25.add, 'call', _26 => _26(new Property(camelToDash(key), i))]));
      } else {
        const wrap = deepCopy(root);
        wrap.property = [];
        let child;
        if (key.startsWith('@')) {
          child = wrap.atRule(key, false);
        } else {
          if (wrap.selector === undefined) {
            wrap.selector = key;
            child = wrap;
          } else {
            if (/^[a-z]+$/.test(key) && !isTagName(key)) {
              wrap.wrapProperty(property => `${key}-${property}`);
              child = wrap;
            } else {
              const _hKey = (selector, key) => (/&/.test(key) ? key : `& ${key}`).replace('&', selector);
              wrap.wrapSelector((selector) =>
                selector
                  .trim()
                  .split(/\s*,\s*/g)
                  .map((s) =>
                    key
                      .split(/\s*,\s*/g)
                      .map((i) => _hKey(s, i))
                      .join(', ')
                  )
                  .join(', ')
              );
              child = wrap;
            }
          }
        }
        output = output.concat(Style.generate(key.startsWith('@') ? undefined : key, propertyValue, child));
      }
    }
    if (root.property.length > 0) output.unshift(root);
    return output;
  }

  atRule(atrule, append = true) {
    if (!atrule) return this;
    if (this.atRules) {
      append ? this.atRules.push(atrule) : this.atRules.unshift(atrule);
    } else {
      this.atRules = [atrule];
    }
    return this;
  }

  pseudoClass(string) {
    if (this._pseudoClasses) {
      this._pseudoClasses.push(string);
    } else {
      this._pseudoClasses = [string];
    }
    return this;
  }

  pseudoElement(string) {
    if (this._pseudoElements) {
      this._pseudoElements.push(string);
    } else {
      this._pseudoElements = [string];
    }
    return this;
  }

  brother(string) {
    if (this._brotherSelectors) {
      this._brotherSelectors.push(string);
    } else {
      this._brotherSelectors = [string];
    }
    return this;
  }

  parent(string) {
    if (this._parentSelectors) {
      this._parentSelectors.push(string);
    } else {
      this._parentSelectors = [string];
    }
    return this;
  }

  child(string) {
    if (this._childSelectors) {
      this._childSelectors.push(string);
    } else {
      this._childSelectors = [string];
    }
    return this;
  }

  wrapProperty(func) {
    if (this._wrapProperties) {
      this._wrapProperties.push(func);
    } else {
      this._wrapProperties = [func];
    }
    return this;
  }

  wrapSelector(func) {
    if (this._wrapSelectors) {
      this._wrapSelectors.push(func);
    } else {
      this._wrapSelectors = [func];
    }
    return this;
  }

  wrapRule(func) {
    if (this._wrapRules) {
      this._wrapRules.push(func);
    } else {
      this._wrapRules = [func];
    }
    return this;
  }

  add(item) {
    item = toArray(item);
    if (this.important) item.forEach((i) => (i.important = true));
    this.property = [...this.property, ...item];
    return this;
  }

  extend(item, onlyProperty = false, append = true) {
    if (!item) return this;
    if (item.wrapProperties) {
      const props = [];
      item.property.forEach((p) => {
        const pc = new Property(p.name, p.value, p.comment);
        _optionalChain$a([item, 'access', _27 => _27.wrapProperties, 'optionalAccess', _28 => _28.forEach, 'call', _29 => _29((wrap) => {
          pc.name = Array.isArray(pc.name)
            ? pc.name.map((i) => wrap(i))
            : wrap(pc.name);
        })]);
        if (item.important) pc.important = true;
        props.push(pc);
      });
      this.property = connectList(this.property, props, append);
    } else {
      if (item.important) item.property.forEach((i) => (i.important = true));
      this.property = connectList(this.property, item.property, append);
    }
    if (onlyProperty) return this;
    item.selector && (this.selector = item.selector);
    this.meta = item.meta;
    item.atRules &&
      (this.atRules = connectList(item.atRules, this.atRules, append)); // atrule is build in reverse
    item._brotherSelectors &&
      (this._brotherSelectors = connectList(
        this._brotherSelectors,
        item._brotherSelectors,
        append
      ));
    item._childSelectors &&
      (this._childSelectors = connectList(
        this._childSelectors,
        item._childSelectors,
        append
      ));
    item._parentSelectors &&
      (this._parentSelectors = connectList(
        this._parentSelectors,
        item._parentSelectors,
        append
      ));
    item._pseudoClasses &&
      (this._pseudoClasses = connectList(
        this._pseudoClasses,
        item._pseudoClasses,
        append
      ));
    item._pseudoElements &&
      (this._pseudoElements = connectList(
        this._pseudoElements,
        item._pseudoElements,
        append
      ));
    item._wrapRules &&
      (this._wrapRules = connectList(this._wrapRules, item._wrapRules, append));
    item._wrapSelectors &&
      (this._wrapSelectors = connectList(
        this._wrapSelectors,
        item._wrapSelectors,
        append
      ));
    return this;
  }

  clean() {
    // remove duplicated property
    const property = [];
    const cache = [];
    this.property.forEach((i) => {
      const inline = i.build();
      if (!cache.includes(inline)) {
        cache.push(inline);
        property.push(i);
      }
    });
    this.property = property;
    return this;
  }

  flat() {
    const properties = [];
    this.property.forEach((p) => {
      if (Array.isArray(p.name)) {
        p.name.forEach((i) => {
          properties.push(new Property(i, p.value, p.comment));
        });
      } else {
        properties.push(p);
      }
    });
    this.property = properties;
    return this;
  }

  clone(selector, property) {
    const newStyle = deepCopy(this);
    if (selector) newStyle.selector = selector;
    if (property) newStyle.property = Array.isArray(property) ? property: [ property ];
    return newStyle;
  }

  sort() {
    // sort property
    this.property = this.property.sort((a, b) => {
      return `${a.name}`.substring(0, 2) > `${b.name}`.substring(0, 2) ? 1 : -1;
    });
    return this;
  }

  build(minify = false, prefixer = true) {
    let properties = this.property;
    if (!prefixer) properties = properties.filter(p => {
      if (p.value && /-(webkit|ms|moz|o)-/.test(p.value)) return false;
      if (Array.isArray(p.name)) {
        p.name = p.name.filter(i => !/^-(webkit|ms|moz|o)-/.test(i));
        return true;
      }
      return !/^-(webkit|ms|moz|o)-/.test(p.name);
    });
    let result = properties.map(p => {
      if (this._wrapProperties) {
        let name = p.name;
        this._wrapProperties.forEach(w => (name = Array.isArray(name) ? name.map(n => w(n)) : w(name)));
        return new Property(name, p.value, p.comment, this.important ? true : p.important).build(minify);
      }
      return this.important ? new Property(p.name, p.value, p.comment, true).build(minify) : p.build(minify);
    }).join(minify ? '' : '\n');
    if (!this.selector && !this.atRules) return result.replace(/;}/g, '}');
    if (this.selector) result = (minify ? this.rule.replace(/,\s/g, ',') : this.rule + ' ') + wrapit(result, undefined, undefined, undefined, result !== '' ? minify : true);
    if (this.atRules) {
      for (const rule of this.atRules) {
        result = minify ? `${rule.replace(/\s/g, '')}${wrapit(result, undefined, undefined, undefined, minify)}` : `${rule} ${wrapit(result, undefined, undefined, undefined, result !== '' ? minify : true)}`;
      }
    }
    return minify ? result.replace(/;}/g, '}') : result;
  }

  updateMeta(type, group, order, offset = 0, corePlugin = false, respectSelector = false) {
    this.meta = {
      type,
      group,
      order,
      offset,
      corePlugin,
      respectSelector,
    };
    return this;
  }
}

class Keyframes extends Style {
  constructor(
    selector,
    property,
    important,
  ) {
    super(selector, property, important);
  }

  // root param only for consist with style
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static generate(name, children, root = undefined, prefixer = true) {
    const styles = [];
    const webkitStyles = [];
    for (const [key, value] of Object.entries(children)) {
      const style = new Keyframes(key).atRule(`@keyframes ${name}`);
      const webkitStyle = new Keyframes(key).atRule(
        `@-webkit-keyframes ${name}`
      );
      for (const [pkey, pvalue] of Object.entries(value)) {
        let prop = pkey;
        if (pkey === 'transform') {
          prop = prefixer ? ['-webkit-transform', 'transform'] : 'transform';
        } else if (
          ['animationTimingFunction', 'animation-timing-function'].includes(pkey)
        ) {
          prop = prefixer ? [
            '-webkit-animation-timing-function',
            'animation-timing-function',
          ] : 'animation-timing-function';
        }
        style.add(new Property(prop, pvalue));
        webkitStyle.add(new Property(prop, pvalue));
      }
      styles.push(style);
      if (prefixer) webkitStyles.push(webkitStyle);
    }
    return [...styles, ...webkitStyles];
  }
}

class Container extends Style {
  constructor(
    selector,
    property,
    important,
  ) {
    super(selector, property, important);
  }
}

const minMaxWidth = /(!?\(\s*min(-device-)?-width).*?\(\s*max(-device)?-width/i;
const minWidth = /\(\s*min(-device)?-width/i;
const maxMinWidth = /(!?\(\s*max(-device)?-width).*?\(\s*min(-device)?-width/i;
const maxWidth = /\(\s*max(-device)?-width/i;

const isMinWidth = _testQuery(minMaxWidth, maxMinWidth, minWidth);
const isMaxWidth = _testQuery(maxMinWidth, minMaxWidth, maxWidth);

const minMaxHeight = /(!?\(\s*min(-device)?-height).*?\(\s*max(-device)?-height/i;
const minHeight = /\(\s*min(-device)?-height/i;
const maxMinHeight = /(!?\(\s*max(-device)?-height).*?\(\s*min(-device)?-height/i;
const maxHeight = /\(\s*max(-device)?-height/i;

const isMinHeight = _testQuery(minMaxHeight, maxMinHeight, minHeight);
const isMaxHeight = _testQuery(maxMinHeight, minMaxHeight, maxHeight);

const isPrint = /print/i;
const isPrintOnly = /^print\$/i;
const isAtRule = /^\s*@/i;
const isMedia = /^\s*@media/i;

const maxValue = Number.MAX_VALUE;

function _getQueryLength(length) {
  const result = /(-?\d*\.?\d+)(ch|em|ex|px|rpx|rem)/.exec(length);

  if (result === null) {
    return maxValue;
  }

  const number = result[1];
  const unit = result[2];

  switch (unit) {
  case 'ch':
    return parseFloat(number) * 8.8984375;
  case 'em':
  case 'rem':
    return parseFloat(number) * 16;
  case 'ex':
    return parseFloat(number) * 8.296875;
  case 'px':
  case 'rpx':
    return parseFloat(number);
  }

  return +number;
}

function _testQuery(
  doubleTestTrue,
  doubleTestFalse,
  singleTest
) {
  return function (query) {
    if (doubleTestTrue.test(query)) {
      return true;
    } else if (doubleTestFalse.test(query)) {
      return false;
    }
    return singleTest.test(query);
  };
}

function _testAtRule(a, b) {
  const isMediaA = isMedia.test(a);
  const isMediaB = isMedia.test(b);

  if (isMediaA && isMediaB) return null;

  const isAtRuleA = isAtRule.test(a);
  const isAtRuleB = isAtRule.test(b);

  if (isAtRuleA) return 1;
  if (isAtRuleB) return -1;

  return 0; // don't sort selector name, may cause overwrite bug.
}

function _testIsPrint(a, b) {
  const isPrintA = isPrint.test(a);
  const isPrintOnlyA = isPrintOnly.test(a);

  const isPrintB = isPrint.test(b);
  const isPrintOnlyB = isPrintOnly.test(b);

  if (isPrintA && isPrintB) {
    if (!isPrintOnlyA && isPrintOnlyB) {
      return 1;
    }
    if (isPrintOnlyA && !isPrintOnlyB) {
      return -1;
    }
    return a.localeCompare(b);
  }
  if (isPrintA) {
    return 1;
  }
  if (isPrintB) {
    return -1;
  }

  return null;
}

function sortMediaQuery(a, b) {

  const testAtRule = _testAtRule(a, b);
  if (testAtRule !== null) return testAtRule;
  const testIsPrint = _testIsPrint(a, b);
  if (testIsPrint !== null) return testIsPrint;

  const minA = isMinWidth(a) || isMinHeight(a);
  const maxA = isMaxWidth(a) || isMaxHeight(a);

  const minB = isMinWidth(b) || isMinHeight(b);
  const maxB = isMaxWidth(b) || isMaxHeight(b);

  if (minA && maxB) {
    return -1;
  }
  if (maxA && minB) {
    return 1;
  }

  const lengthA = _getQueryLength(a);
  const lengthB = _getQueryLength(b);

  if (lengthA === maxValue && lengthB === maxValue) {
    return a.localeCompare(b);
  } else if (lengthA === maxValue) {
    return 1;
  } else if (lengthB === maxValue) {
    return -1;
  }

  if (lengthA > lengthB) {
    if (maxA) {
      return -1;
    }
    return 1;
  }

  if (lengthA < lengthB) {
    if (maxA) {
      return 1;
    }
    return -1;
  }

  return a.localeCompare(b);
}

function _nullishCoalesce$6(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain$9(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

function getWeights(a) {
  const first = a.charAt(0);
  const second = a.charAt(1);
  if (first === ':' && second === ':') return 59; // ::moz ...
  if (first === '#') return 500; // #id ...
  if (first !== '.') return first.charCodeAt(0); // html, body ...
  return 499;
}

function sortMeta(a, b) {
  if (a.meta.type === 'base' && b.meta.type === 'base') return getWeights(_nullishCoalesce$6(a.selector, () => ( ''))) - getWeights(_nullishCoalesce$6(b.selector, () => ( '')));
  return sortMediaQuery(_optionalChain$9([a, 'access', _ => _.meta, 'access', _2 => _2.variants, 'optionalAccess', _3 => _3[0]]) || '', _optionalChain$9([b, 'access', _4 => _4.meta, 'access', _5 => _5.variants, 'optionalAccess', _6 => _6[0]]) || '') || (a.meta.order - b.meta.order) || (a.meta.offset - b.meta.offset) || +b.meta.corePlugin - +a.meta.corePlugin;
}

function sortGroup(a, b) {
  return sortMediaQuery(_optionalChain$9([a, 'access', _7 => _7.meta, 'access', _8 => _8.variants, 'optionalAccess', _9 => _9[0]]) || '', _optionalChain$9([b, 'access', _10 => _10.meta, 'access', _11 => _11.variants, 'optionalAccess', _12 => _12[0]]) || '') || (a.meta.order - b.meta.order);
}

function _optionalChain$8(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

function _buildAtrule(atrule, children, minify = false, prefixer = true) {
  return `${ atrule }${ minify ? '' : ' ' }${ wrapit(_buildStyleList(children, minify, prefixer), undefined, undefined, undefined, minify) }`;
}

function _buildStyleList(styleList, minify = false, prefixer = true) {
  let currentAtrule;
  let currentStyle;
  let styleStack = [];
  const output = [];
  for (const style of styleList) {
    if (style.isAtrule) {
      if (currentStyle) {
        output.push(currentStyle.clean().build(minify, prefixer));
        currentStyle = undefined;
      }
      const newAtrule = (style.atRules ).pop();
      if (currentAtrule) {
        if (currentAtrule === newAtrule && newAtrule !== '@font-face') { // @font-face shouldn't been combined
          styleStack.push(style);
        } else {
          output.push(_buildAtrule(currentAtrule, styleStack, minify, prefixer));
          currentAtrule = newAtrule;
          styleStack = [ style ];
        }
      } else {
        currentAtrule = newAtrule;
        styleStack = [ style ];
      }
    } else {
      if (currentAtrule) {
        output.push(_buildAtrule(currentAtrule, styleStack, minify, prefixer));
        currentAtrule = undefined;
        styleStack = [];
      }
      if (currentStyle) {
        if (style.rule === currentStyle.rule) {
          if (style.important) style.property.forEach(p => p.important = true);
          if (style.wrapProperties) style.property.forEach(p => _optionalChain$8([style, 'access', _ => _.wrapProperties, 'optionalAccess', _2 => _2.forEach, 'call', _3 => _3(wrap => p.name = Array.isArray(p.name) ? p.name.map(i => wrap(i)) : wrap(p.name))]));
          currentStyle.add(style.property);
        } else {
          output.push(currentStyle.clean().build(minify, prefixer));
          currentStyle = style;
        }
      } else {
        currentStyle = style;
      }
    }
  }
  if (currentAtrule) output.push(_buildAtrule(currentAtrule, styleStack, minify, prefixer));
  if (currentStyle) output.push(currentStyle.clean().build(minify, prefixer));
  return output.join(minify ? '' : '\n');
}

function compileStyleSheet (styleList, minify = false, prefixer = true) {
  return _buildStyleList(deepCopy(styleList), minify, prefixer);
}

function _optionalChain$7(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

class StyleSheet {
  
  __init() {this.prefixer = true;}

  constructor(children) {StyleSheet.prototype.__init.call(this);
    this.children = children || [];
  }

  add(item) {
    if (!item) return this;
    if (Array.isArray(item)) {
      this.children = [...this.children, ...item];
    } else {
      this.children.push(item);
    }
    return this;
  }

  extend(styleSheet, append = true, dedup = false) {
    if (styleSheet) {
      let extended = styleSheet.children;
      if (dedup) {
        const hashes = extended.map(i => hash(i.build()));
        extended = extended.filter(i => !hashes.includes(hash(i.build())));
      }
      this.prefixer = styleSheet.prefixer;
      this.children = append? [...this.children, ...extended]: [...extended, ...this.children];
    }
    return this;
  }

  combine() {
    const styleMap = {};
    this.children.forEach((style, index) => {
      const hashValue = hash(style.atRules + style.meta.type + style.rule);
      if (hashValue in styleMap) {
        if (_optionalChain$7([style, 'access', _ => _.atRules, 'optionalAccess', _2 => _2.includes, 'call', _3 => _3('@font-face')])) {
          // keeps multiple @font-face
          styleMap[hashValue + index] = style;
        } else {
          styleMap[hashValue] = styleMap[hashValue].extend(style, true);
        }
      } else {
        styleMap[hashValue] = style;
      }
    });
    this.children = Object.values(styleMap).map((i) => i.clean());
    return this;
  }

  layer(type) {
    const styleSheet = new StyleSheet(this.children.filter(i => i.meta.type === type));
    styleSheet.prefixer = this.prefixer;
    return styleSheet;
  }

  split() {
    return {
      base: this.layer('base'),
      components: this.layer('components'),
      utilities: this.layer('utilities'),
    };
  }

  clone() {
    return deepCopy(this);
  }

  sort() {
    this.children = this.children.sort(sortMeta);
    return this;
  }

  sortby(compareFn) {
    this.children = this.children.sort(compareFn);
    return this;
  }

  build(minify = false, layer = false) {
    let outputString = '';
    if (layer) {
      const { base, components, utilities } = this.split();
      const bStyle = base.build(minify);
      const cStyle = components.build(minify);
      const uStyle = utilities.build(minify);
      const output = [ `@layer base, components, utilities;` ];
      if (bStyle) output.push(`@layer base {${minify?'':'\n'}${bStyle}\n}`);
      if (cStyle) output.push(`@layer components {${minify?'':'\n'}${cStyle}\n}`);
      if (uStyle) output.push(`@layer utilities {${minify?'':'\n'}${uStyle}\n}`);
      outputString = output.join(minify ? '' : '\n');
    } else {
      outputString = compileStyleSheet(this.children, minify, this.prefixer);
    }
    return minify ? minifyCssPattern(outputString) : outputString;
  }
}

function linearGradient(value) {
  // Stupid method, will be changed in the next version...
  const map = {
    'linear-gradient(to top, var(--tw-gradient-stops))': [
      '-o-linear-gradient(bottom, var(--tw-gradient-stops))',
      '-webkit-gradient(linear, left bottom, left top, from(var(--tw-gradient-stops)))',
      'linear-gradient(to top, var(--tw-gradient-stops))',
    ],
    'linear-gradient(to top right, var(--tw-gradient-stops))': [
      '-o-linear-gradient(bottom left, var(--tw-gradient-stops))',
      '-webkit-gradient(linear, left bottom, right top, from(var(--tw-gradient-stops)))',
      'linear-gradient(to top right, var(--tw-gradient-stops))',
    ],
    'linear-gradient(to right, var(--tw-gradient-stops))': [
      '-o-linear-gradient(left, var(--tw-gradient-stops))',
      '-webkit-gradient(linear, left top, right top, from(var(--tw-gradient-stops)))',
      'linear-gradient(to right, var(--tw-gradient-stops))',
    ],
    'linear-gradient(to bottom right, var(--tw-gradient-stops))': [
      '-o-linear-gradient(top left, var(--tw-gradient-stops))',
      '-webkit-gradient(linear, left top, right bottom, from(var(--tw-gradient-stops)))',
      'linear-gradient(to bottom right, var(--tw-gradient-stops))',
    ],
    'linear-gradient(to bottom, var(--tw-gradient-stops))': [
      '-o-linear-gradient(top, var(--tw-gradient-stops))',
      '-webkit-gradient(linear, left top, left bottom, from(var(--tw-gradient-stops)))',
      'linear-gradient(to bottom, var(--tw-gradient-stops))',
    ],
    'linear-gradient(to bottom left, var(--tw-gradient-stops))': [
      '-o-linear-gradient(top right, var(--tw-gradient-stops))',
      '-webkit-gradient(linear, right top, left bottom, from(var(--tw-gradient-stops)))',
      'linear-gradient(to bottom left, var(--tw-gradient-stops))',
    ],
    'linear-gradient(to left, var(--tw-gradient-stops))': [
      '-o-linear-gradient(right, var(--tw-gradient-stops))',
      '-webkit-gradient(linear, right top, left top, from(var(--tw-gradient-stops)))',
      'linear-gradient(to left, var(--tw-gradient-stops))',
    ],
    'linear-gradient(to top left, var(--tw-gradient-stops))': [
      '-o-linear-gradient(bottom right, var(--tw-gradient-stops))',
      '-webkit-gradient(linear, right bottom, left top, from(var(--tw-gradient-stops)))',
      'linear-gradient(to top left, var(--tw-gradient-stops))',
    ],
  };
  if (Object.keys(map).includes(value)) return map[value];
  return value;
}

function minMaxContent(value) {
  if (value === 'min-content') {
    return ['-webkit-min-content', 'min-content'];
  } else if (value === 'max-content') {
    return ['-webkit-max-content', 'max-content'];
  }
  return value;
}

function isString(value) {
  return typeof value === 'string';
}

function negative(scale

) {
  return Object.keys(scale)
    .filter((key) => scale[key] !== '0')
    .reduce(
      (negativeScale, key) => ({
        ...negativeScale,
        [`-${key}`]: negateValue(scale[key]),
      }),
      {}
    );
}

function breakpoints(
  screens = {}
) {
  return Object.keys(screens)
    .filter((key) => typeof screens[key] === 'string')
    .reduce(
      (breakpoints, key) => ({
        ...breakpoints,
        [`screen-${key}`]: screens[key],
      }),
      {}
    );
}

function generateFontSize(font) {
  if (typeof font === 'string') return [ new Property('font-size', font) ];
  const properties = [];
  if (font[0]) properties.push(new Property('font-size', font[0]));
  if (typeof font[1] === 'string') {
    properties.push(new Property('line-height', font[1]));
  } else if (font[1]){
    if (font[1].lineHeight) properties.push(new Property('line-height', font[1].lineHeight));
    if (font[1].letterSpacing) properties.push(new Property('letter-spacing', font[1].letterSpacing));
  }
  return properties;
}

function expandDirection(
  value,
  divide = false
) {
  const map = {
    '': ['*'],
    y: ['top', 'bottom'],
    x: ['left', 'right'],
    t: divide ? ['top-left', 'top-right'] : ['top'],
    r: divide ? ['top-right', 'bottom-right'] : ['right'],
    b: divide ? ['bottom-right', 'bottom-left'] : ['bottom'],
    l: divide ? ['top-left', 'bottom-left'] : ['left'],
    tl: ['top-left'],
    tr: ['top-right'],
    br: ['bottom-right'],
    bl: ['bottom-left'],
  };
  if (value in map) return map[value];
}

function generatePlaceholder(selector, property, prefixer = false)  {
  if (!prefixer) return [ new Style(selector, property).pseudoElement('placeholder') ];
  return [
    new Style(selector, property).pseudoElement('-webkit-input-placeholder'),
    new Style(selector, property).pseudoElement('-moz-placeholder'),
    new Style(selector, property).pseudoClass('-ms-input-placeholder'),
    new Style(selector, property).pseudoElement('-ms-input-placeholder'),
    new Style(selector, property).pseudoElement('placeholder'),
  ];
}

function generateOrientations(orientations

) {
  const variants  = {};

  Object.entries(orientations).forEach(([name, orientation]) => {
    variants[name] = () => new Style().atRule(`@media (orientation: ${orientation})`);
  });

  return variants;
}

const colors$1 = {
	aliceblue: [240, 248, 255],
	antiquewhite: [250, 235, 215],
	aqua: [0, 255, 255],
	aquamarine: [127, 255, 212],
	azure: [240, 255, 255],
	beige: [245, 245, 220],
	bisque: [255, 228, 196],
	black: [0, 0, 0],
	blanchedalmond: [255, 235, 205],
	blue: [0, 0, 255],
	blueviolet: [138, 43, 226],
	brown: [165, 42, 42],
	burlywood: [222, 184, 135],
	cadetblue: [95, 158, 160],
	chartreuse: [127, 255, 0],
	chocolate: [210, 105, 30],
	coral: [255, 127, 80],
	cornflowerblue: [100, 149, 237],
	cornsilk: [255, 248, 220],
	crimson: [220, 20, 60],
	cyan: [0, 255, 255],
	darkblue: [0, 0, 139],
	darkcyan: [0, 139, 139],
	darkgoldenrod: [184, 134, 11],
	darkgray: [169, 169, 169],
	darkgreen: [0, 100, 0],
	darkgrey: [169, 169, 169],
	darkkhaki: [189, 183, 107],
	darkmagenta: [139, 0, 139],
	darkolivegreen: [85, 107, 47],
	darkorange: [255, 140, 0],
	darkorchid: [153, 50, 204],
	darkred: [139, 0, 0],
	darksalmon: [233, 150, 122],
	darkseagreen: [143, 188, 143],
	darkslateblue: [72, 61, 139],
	darkslategray: [47, 79, 79],
	darkslategrey: [47, 79, 79],
	darkturquoise: [0, 206, 209],
	darkviolet: [148, 0, 211],
	deeppink: [255, 20, 147],
	deepskyblue: [0, 191, 255],
	dimgray: [105, 105, 105],
	dimgrey: [105, 105, 105],
	dodgerblue: [30, 144, 255],
	firebrick: [178, 34, 34],
	floralwhite: [255, 250, 240],
	forestgreen: [34, 139, 34],
	fuchsia: [255, 0, 255],
	gainsboro: [220, 220, 220],
	ghostwhite: [248, 248, 255],
	gold: [255, 215, 0],
	goldenrod: [218, 165, 32],
	gray: [128, 128, 128],
	green: [0, 128, 0],
	greenyellow: [173, 255, 47],
	grey: [128, 128, 128],
	honeydew: [240, 255, 240],
	hotpink: [255, 105, 180],
	indianred: [205, 92, 92],
	indigo: [75, 0, 130],
	ivory: [255, 255, 240],
	khaki: [240, 230, 140],
	lavender: [230, 230, 250],
	lavenderblush: [255, 240, 245],
	lawngreen: [124, 252, 0],
	lemonchiffon: [255, 250, 205],
	lightblue: [173, 216, 230],
	lightcoral: [240, 128, 128],
	lightcyan: [224, 255, 255],
	lightgoldenrodyellow: [250, 250, 210],
	lightgray: [211, 211, 211],
	lightgreen: [144, 238, 144],
	lightgrey: [211, 211, 211],
	lightpink: [255, 182, 193],
	lightsalmon: [255, 160, 122],
	lightseagreen: [32, 178, 170],
	lightskyblue: [135, 206, 250],
	lightslategray: [119, 136, 153],
	lightslategrey: [119, 136, 153],
	lightsteelblue: [176, 196, 222],
	lightyellow: [255, 255, 224],
	lime: [0, 255, 0],
	limegreen: [50, 205, 50],
	linen: [250, 240, 230],
	magenta: [255, 0, 255],
	maroon: [128, 0, 0],
	mediumaquamarine: [102, 205, 170],
	mediumblue: [0, 0, 205],
	mediumorchid: [186, 85, 211],
	mediumpurple: [147, 112, 219],
	mediumseagreen: [60, 179, 113],
	mediumslateblue: [123, 104, 238],
	mediumspringgreen: [0, 250, 154],
	mediumturquoise: [72, 209, 204],
	mediumvioletred: [199, 21, 133],
	midnightblue: [25, 25, 112],
	mintcream: [245, 255, 250],
	mistyrose: [255, 228, 225],
	moccasin: [255, 228, 181],
	navajowhite: [255, 222, 173],
	navy: [0, 0, 128],
	oldlace: [253, 245, 230],
	olive: [128, 128, 0],
	olivedrab: [107, 142, 35],
	orange: [255, 165, 0],
	orangered: [255, 69, 0],
	orchid: [218, 112, 214],
	palegoldenrod: [238, 232, 170],
	palegreen: [152, 251, 152],
	paleturquoise: [175, 238, 238],
	palevioletred: [219, 112, 147],
	papayawhip: [255, 239, 213],
	peachpuff: [255, 218, 185],
	peru: [205, 133, 63],
	pink: [255, 192, 203],
	plum: [221, 160, 221],
	powderblue: [176, 224, 230],
	purple: [128, 0, 128],
	rebeccapurple: [102, 51, 153],
	red: [255, 0, 0],
	rosybrown: [188, 143, 143],
	royalblue: [65, 105, 225],
	saddlebrown: [139, 69, 19],
	salmon: [250, 128, 114],
	sandybrown: [244, 164, 96],
	seagreen: [46, 139, 87],
	seashell: [255, 245, 238],
	sienna: [160, 82, 45],
	silver: [192, 192, 192],
	skyblue: [135, 206, 235],
	slateblue: [106, 90, 205],
	slategray: [112, 128, 144],
	slategrey: [112, 128, 144],
	snow: [255, 250, 250],
	springgreen: [0, 255, 127],
	steelblue: [70, 130, 180],
	tan: [210, 180, 140],
	teal: [0, 128, 128],
	thistle: [216, 191, 216],
	tomato: [255, 99, 71],
	turquoise: [64, 224, 208],
	violet: [238, 130, 238],
	wheat: [245, 222, 179],
	white: [255, 255, 255],
	whitesmoke: [245, 245, 245],
	yellow: [255, 255, 0],
	yellowgreen: [154, 205, 50],
};

for (const key in colors$1) Object.freeze(colors$1[key]);
var colorNames = Object.freeze(colors$1);

const reverseNames = Object.create(null);

// Create a list of reverse color names
for (const name in colorNames) {
	if (Object.hasOwn(colorNames, name)) {
		reverseNames[colorNames[name]] = name;
	}
}

const cs = {
	to: {},
	get: {},
};

cs.get = function (string) {
	const prefix = string.slice(0, 3).toLowerCase();
	let value;
	let model;
	switch (prefix) {
		case 'hsl': {
			value = cs.get.hsl(string);
			model = 'hsl';
			break;
		}

		case 'hwb': {
			value = cs.get.hwb(string);
			model = 'hwb';
			break;
		}

		default: {
			value = cs.get.rgb(string);
			model = 'rgb';
			break;
		}
	}

	if (!value) {
		return null;
	}

	return {model, value};
};

cs.get.rgb = function (string) {
	if (!string) {
		return null;
	}

	const abbr = /^#([a-f\d]{3,4})$/i;
	const hex = /^#([a-f\d]{6})([a-f\d]{2})?$/i;
	const rgba = /^rgba?\(\s*([+-]?(?:\d*\.)?\d+(?:e\d+)?)(?=[\s,])\s*(?:,\s*)?([+-]?(?:\d*\.)?\d+(?:e\d+)?)(?=[\s,])\s*(?:,\s*)?([+-]?(?:\d*\.)?\d+(?:e\d+)?)\s*(?:[\s,|/]\s*([+-]?(?:\d*\.)?\d+(?:e\d+)?)(%?)\s*)?\)$/i;
	const per = /^rgba?\(\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[\s,|/]\s*([+-]?[\d.]+)(%?)\s*)?\)$/i;
	const keyword = /^(\w+)$/;

	let rgb = [0, 0, 0, 1];
	let match;
	let i;
	let hexAlpha;

	if (match = string.match(hex)) {
		hexAlpha = match[2];
		match = match[1];

		for (i = 0; i < 3; i++) {
			// https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
			const i2 = i * 2;
			rgb[i] = Number.parseInt(match.slice(i2, i2 + 2), 16);
		}

		if (hexAlpha) {
			rgb[3] = Number.parseInt(hexAlpha, 16) / 255;
		}
	} else if (match = string.match(abbr)) {
		match = match[1];
		hexAlpha = match[3];

		for (i = 0; i < 3; i++) {
			rgb[i] = Number.parseInt(match[i] + match[i], 16);
		}

		if (hexAlpha) {
			rgb[3] = Number.parseInt(hexAlpha + hexAlpha, 16) / 255;
		}
	} else if (match = string.match(rgba)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Number.parseFloat(match[i + 1]);
		}

		if (match[4]) {
			rgb[3] = match[5] ? Number.parseFloat(match[4]) * 0.01 : Number.parseFloat(match[4]);
		}
	} else if (match = string.match(per)) {
		for (i = 0; i < 3; i++) {
			rgb[i] = Math.round(Number.parseFloat(match[i + 1]) * 2.55);
		}

		if (match[4]) {
			rgb[3] = match[5] ? Number.parseFloat(match[4]) * 0.01 : Number.parseFloat(match[4]);
		}
	} else if (match = string.toLowerCase().match(keyword)) {
		if (match[1] === 'transparent') {
			return [0, 0, 0, 0];
		}

		if (!Object.hasOwn(colorNames, match[1])) {
			return null;
		}

		// eslint-disable-next-line unicorn/prefer-spread
		rgb = colorNames[match[1]].slice();
		rgb[3] = 1;

		return rgb;
	} else {
		return null;
	}

	for (i = 0; i < 3; i++) {
		rgb[i] = clamp(rgb[i], 0, 255);
	}

	rgb[3] = clamp(rgb[3], 0, 1);

	return rgb;
};

cs.get.hsl = function (string) {
	if (!string) {
		return null;
	}

	const hsl = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d.]+)%\s*,?\s*([+-]?[\d.]+)%\s*(?:[,|/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:e[+-]?\d+)?)\s*)?\)$/i;
	const match = string.match(hsl);

	if (match) {
		const alpha = Number.parseFloat(match[4]);
		const h = ((Number.parseFloat(match[1]) % 360) + 360) % 360;
		const s = clamp(Number.parseFloat(match[2]), 0, 100);
		const l = clamp(Number.parseFloat(match[3]), 0, 100);
		const a = clamp(Number.isNaN(alpha) ? 1 : alpha, 0, 1);

		return [h, s, l, a];
	}

	return null;
};

cs.get.hwb = function (string) {
	if (!string) {
		return null;
	}

	const hwb = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*[\s,]\s*([+-]?[\d.]+)%\s*[\s,]\s*([+-]?[\d.]+)%\s*(?:[\s,]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:e[+-]?\d+)?)\s*)?\)$/i;
	const match = string.match(hwb);

	if (match) {
		const alpha = Number.parseFloat(match[4]);
		const h = ((Number.parseFloat(match[1]) % 360) + 360) % 360;
		const w = clamp(Number.parseFloat(match[2]), 0, 100);
		const b = clamp(Number.parseFloat(match[3]), 0, 100);
		const a = clamp(Number.isNaN(alpha) ? 1 : alpha, 0, 1);
		return [h, w, b, a];
	}

	return null;
};

cs.to.hex = function (...rgba) {
	return (
		'#' +
		hexDouble(rgba[0]) +
		hexDouble(rgba[1]) +
		hexDouble(rgba[2]) +
		(rgba[3] < 1
			? (hexDouble(Math.round(rgba[3] * 255)))
			: '')
	);
};

cs.to.rgb = function (...rgba) {
	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
		: 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
};

cs.to.rgb.percent = function (...rgba) {
	const r = Math.round(rgba[0] / 255 * 100);
	const g = Math.round(rgba[1] / 255 * 100);
	const b = Math.round(rgba[2] / 255 * 100);

	return rgba.length < 4 || rgba[3] === 1
		? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
		: 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
};

cs.to.hsl = function (...hsla) {
	return hsla.length < 4 || hsla[3] === 1
		? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
		: 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
};

// Hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
cs.to.hwb = function (...hwba) {
	let a = '';
	if (hwba.length >= 4 && hwba[3] !== 1) {
		a = ', ' + hwba[3];
	}

	return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
};

cs.to.keyword = function (...rgb) {
	return reverseNames[rgb.slice(0, 3)];
};

// Helpers
function clamp(number_, min, max) {
	return Math.min(Math.max(min, number_), max);
}

function hexDouble(number_) {
	const string_ = Math.round(number_).toString(16).toUpperCase();
	return (string_.length < 2) ? '0' + string_ : string_;
}

function _optionalChain$6(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
function hsl2rgb(h, s, l) {
  l /= 100;
  if (h >= 360) h %= 360;

  const c = (1 - Math.abs(2 * l - 1)) * (s / 100);
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c/2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c + m; g = x + m; b = m;
  } else if (60 <= h && h < 120) {
    r = x + m; g = c + m; b = m;
  } else if (120 <= h && h < 180) {
    r = m; g = c + m; b = x + m;
  } else if (180 <= h && h < 240) {
    r = m; g = x + m; b = c + m;
  } else if (240 <= h && h < 300) {
    r = x + m; g = m; b = c + m;
  } else if (300 <= h && h < 360) {
    r = c + m; g = m; b = x + m;
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ];
}

function hwb2rgb(h, w, b) {
  const rgb = hsl2rgb(h, 100, 50);

  for (let i = 0; i < 3; ++i) {
    let c = rgb[i] / 255;

    c *= 1 - w/100 - b/100;
    c += w/100;

    rgb[i] = Math.round(c * 255);
  }

  return rgb;
}

function toRGBA(color) {
  if (/^hsla?/.test(color)) {
    const color_array = cs.get.hsl(color);
    if (!color_array) return;
    return [...hsl2rgb(color_array[0], color_array[1], color_array[2]), color_array[3]];
  } else if (/^rgba?/.test(color)) {
    const color_array = cs.get.rgb(color);
    if (!color_array) return;
    return color_array;
  } else if (color.startsWith('hwb')) {
    const color_array = cs.get.hwb(color);
    if (!color_array) return;
    return [...hwb2rgb(color_array[0], color_array[1], color_array[2]), color_array[3]];
  }
  return _optionalChain$6([cs, 'access', _ => _.get, 'call', _2 => _2(color), 'optionalAccess', _3 => _3.value]);
}

function toColor(color_string)  {
  const rgba = toRGBA(color_string);
  const color = rgba ? rgba.slice(0, 3).join(', ') : color_string;
  const opacity = rgba ? rgba[3].toString() : '1';

  return { color, opacity };
}

function generateScreens(screens

) {
  const variants = {};

  const breakpoints = Object.entries(screens).sort(([, sizeA], [, sizeB]) =>
    sortWeight(sizeA) - sortWeight(sizeB)
  );

  breakpoints.forEach(([name, size], index) => {
    if (isString(size)) {
      const [, nextSize] = breakpoints[index + 1] || [];
      variants[name] = styleForBreakpoint({ min: size });
      variants[`<${name}`] = styleForBreakpoint({ max: increaseWithUnit(size, -0.1) });
      variants[`@${name}`] = styleForBreakpoint(
        nextSize ? { min: size, max: increaseWithUnit(nextSize , -0.1) } : { min: size }
      );
      variants[`-${name}`] = styleForBreakpoint({ max: size });
      variants[`+${name}`] = styleForBreakpoint(
        nextSize ? { min: size, max: nextSize  } : { min: size }
      );
    } else {
      variants[name] = styleForBreakpoint(size);
    }
  });

  return variants;
}

function styleForBreakpoint(rule) {
  const mediaConditions = 'raw' in rule ? rule.raw : [
    rule.min && `(min-width: ${rule.min})`,
    rule.max && `(max-width: ${rule.max})`,
  ].filter(condition => condition).join(' and ');
  return () => new Style().atRule(`@media ${mediaConditions}`);
}

// NOTE: Non-size breakpoints should come first, to avoid using them in the
// +breakpoint definition.
function sortWeight(breakpoint) {
  return isString(breakpoint) ? parseInt(breakpoint) : Number.NEGATIVE_INFINITY;
}

function generateThemes (
  darkMode
) {
  if (!darkMode) return {};
  return {
    '@dark': () => new Style().atRule('@media (prefers-color-scheme: dark)'),
    '@light': () => new Style().atRule('@media (prefers-color-scheme: light)'),
    '.dark': () => new Style().parent('.dark'),
    '.light': () => new Style().parent('.light'),
    dark: () => darkMode === 'media'? new Style().atRule('@media (prefers-color-scheme: dark)'): new Style().parent('.dark'),
    light: () => darkMode === 'media'? new Style().atRule('@media (prefers-color-scheme: light)'): new Style().parent('.light'),
  } ;
}

const pseudoClassNames = [
  'hover',
  'focus',
  'active',
  'visited',
  'link',
  'target',
  'focus-visible',
  'focus-within',
  'checked',

  'default',
  'disabled',
  'enabled',
  'indeterminate',
  'invalid',
  'valid',
  'optional',
  'required',
  'placeholder-shown',
  'read-only',
  'read-write',

  'first-of-type',

  'last-of-type',

  'only-child',

  'only-of-type',


  'root',
  'empty',
];

const variantOrder = [
  ...pseudoClassNames,

  'not-checked',
  'not-disabled',
  'not-first-of-type',
  'not-last-of-type',
  'first',
  'not-first',
  'last',
  'not-last',
  'not-only-child',
  'not-only-of-type',
  'even',
  'odd',
  'even-of-type',
  'odd-of-type',

  'before',
  'after',
  'first-letter',
  'first-line',
  'file-selector-button',
  'file',
  'selection',
  'marker',
  'svg',
  'all',
  'children',
  'siblings',
  'sibling',
  'ltr',
  'rtl',
  ...pseudoClassNames.map(pseudoClassName => `group-${pseudoClassName}`),
  'motion-safe',
  'motion-reduce',
  ...pseudoClassNames.map(pseudoClassName => `peer-${pseudoClassName}`),
  ...pseudoClassNames.map(pseudoClassName => `peer-not-${pseudoClassName}`),
];

var layerOrder; (function (layerOrder) {
  const base = 10; layerOrder[layerOrder["base"] = base] = "base";
  const components = 150; layerOrder[layerOrder["components"] = components] = "components";
  const shortcuts = 160; layerOrder[layerOrder["shortcuts"] = shortcuts] = "shortcuts";
  const utilities = 20000; layerOrder[layerOrder["utilities"] = utilities] = "utilities";
})(layerOrder || (layerOrder = {}));

var pluginOrder; (function (pluginOrder) {
  const columns = 80; pluginOrder[pluginOrder['columns'] = columns] = 'columns';
  const container = 100; pluginOrder[pluginOrder['container'] = container] = 'container';
  const space = 200; pluginOrder[pluginOrder['space'] = space] = 'space';
  const divideWidth = 300; pluginOrder[pluginOrder['divideWidth'] = divideWidth] = 'divideWidth';
  const divideColor = 400; pluginOrder[pluginOrder['divideColor'] = divideColor] = 'divideColor';
  const divideStyle = 500; pluginOrder[pluginOrder['divideStyle'] = divideStyle] = 'divideStyle';
  const divideOpacity = 600; pluginOrder[pluginOrder['divideOpacity'] = divideOpacity] = 'divideOpacity';
  const accessibility = 700; pluginOrder[pluginOrder['accessibility'] = accessibility] = 'accessibility';
  const appearance = 800; pluginOrder[pluginOrder['appearance'] = appearance] = 'appearance';
  const backgroundAttachment = 900; pluginOrder[pluginOrder['backgroundAttachment'] = backgroundAttachment] = 'backgroundAttachment';
  const backgroundClip = 1000; pluginOrder[pluginOrder['backgroundClip'] = backgroundClip] = 'backgroundClip';
  const backgroundColor = 1100; pluginOrder[pluginOrder['backgroundColor'] = backgroundColor] = 'backgroundColor';
  const backgroundImage = 1200; pluginOrder[pluginOrder['backgroundImage'] = backgroundImage] = 'backgroundImage';
  const gradientColorStops = 1300; pluginOrder[pluginOrder['gradientColorStops'] = gradientColorStops] = 'gradientColorStops';
  const backgroundOpacity = 1400; pluginOrder[pluginOrder['backgroundOpacity'] = backgroundOpacity] = 'backgroundOpacity';
  const backgroundPosition = 1500; pluginOrder[pluginOrder['backgroundPosition'] = backgroundPosition] = 'backgroundPosition';
  const backgroundRepeat = 1600; pluginOrder[pluginOrder['backgroundRepeat'] = backgroundRepeat] = 'backgroundRepeat';
  const backgroundSize = 1700; pluginOrder[pluginOrder['backgroundSize'] = backgroundSize] = 'backgroundSize';
  const backgroundOrigin = 1750; pluginOrder[pluginOrder['backgroundOrigin'] = backgroundOrigin] = 'backgroundOrigin';
  const borderCollapse = 1800; pluginOrder[pluginOrder['borderCollapse'] = borderCollapse] = 'borderCollapse';
  const borderColor = 1900; pluginOrder[pluginOrder['borderColor'] = borderColor] = 'borderColor';
  const borderOpacity = 2000; pluginOrder[pluginOrder['borderOpacity'] = borderOpacity] = 'borderOpacity';
  const borderRadius = 2100; pluginOrder[pluginOrder['borderRadius'] = borderRadius] = 'borderRadius';
  const borderStyle = 2200; pluginOrder[pluginOrder['borderStyle'] = borderStyle] = 'borderStyle';
  const borderWidth = 2300; pluginOrder[pluginOrder['borderWidth'] = borderWidth] = 'borderWidth';
  const boxDecorationBreak = 2350; pluginOrder[pluginOrder['boxDecorationBreak'] = boxDecorationBreak] = 'boxDecorationBreak';
  const boxSizing = 2400; pluginOrder[pluginOrder['boxSizing'] = boxSizing] = 'boxSizing';
  const cursor = 2500; pluginOrder[pluginOrder['cursor'] = cursor] = 'cursor';
  const captionSide = 2550; pluginOrder[pluginOrder['captionSide'] = captionSide] = 'captionSide';
  const emptyCells = 2560; pluginOrder[pluginOrder['emptyCells'] = emptyCells] = 'emptyCells';
  const display = 2600; pluginOrder[pluginOrder['display'] = display] = 'display';
  const flexBasis = 2699; pluginOrder[pluginOrder['flexBasis'] = flexBasis] = 'flexBasis';
  const flexDirection = 2700; pluginOrder[pluginOrder['flexDirection'] = flexDirection] = 'flexDirection';
  const flexWrap = 2800; pluginOrder[pluginOrder['flexWrap'] = flexWrap] = 'flexWrap';
  const placeItems = 2900; pluginOrder[pluginOrder['placeItems'] = placeItems] = 'placeItems';
  const placeContent = 3000; pluginOrder[pluginOrder['placeContent'] = placeContent] = 'placeContent';
  const placeSelf = 3100; pluginOrder[pluginOrder['placeSelf'] = placeSelf] = 'placeSelf';
  const alignItems = 3200; pluginOrder[pluginOrder['alignItems'] = alignItems] = 'alignItems';
  const alignContent = 3300; pluginOrder[pluginOrder['alignContent'] = alignContent] = 'alignContent';
  const alignSelf = 3400; pluginOrder[pluginOrder['alignSelf'] = alignSelf] = 'alignSelf';
  const justifyItems = 3500; pluginOrder[pluginOrder['justifyItems'] = justifyItems] = 'justifyItems';
  const justifyContent = 3600; pluginOrder[pluginOrder['justifyContent'] = justifyContent] = 'justifyContent';
  const justifySelf = 3700; pluginOrder[pluginOrder['justifySelf'] = justifySelf] = 'justifySelf';
  const flex = 3800; pluginOrder[pluginOrder['flex'] = flex] = 'flex';
  const flexGrow = 3900; pluginOrder[pluginOrder['flexGrow'] = flexGrow] = 'flexGrow';
  const flexShrink = 4000; pluginOrder[pluginOrder['flexShrink'] = flexShrink] = 'flexShrink';
  const order = 4100; pluginOrder[pluginOrder['order'] = order] = 'order';
  const float = 4200; pluginOrder[pluginOrder['float'] = float] = 'float';
  const clear = 4300; pluginOrder[pluginOrder['clear'] = clear] = 'clear';
  const fontFamily = 4400; pluginOrder[pluginOrder['fontFamily'] = fontFamily] = 'fontFamily';
  const fontWeight = 4500; pluginOrder[pluginOrder['fontWeight'] = fontWeight] = 'fontWeight';
  const height = 4600; pluginOrder[pluginOrder['height'] = height] = 'height';
  const fontSize = 4700; pluginOrder[pluginOrder['fontSize'] = fontSize] = 'fontSize';
  const lineHeight = 4800; pluginOrder[pluginOrder['lineHeight'] = lineHeight] = 'lineHeight';
  const listStylePosition = 4900; pluginOrder[pluginOrder['listStylePosition'] = listStylePosition] = 'listStylePosition';
  const listStyleType = 5000; pluginOrder[pluginOrder['listStyleType'] = listStyleType] = 'listStyleType';
  const margin = 5100; pluginOrder[pluginOrder['margin'] = margin] = 'margin';
  const maxHeight = 5200; pluginOrder[pluginOrder['maxHeight'] = maxHeight] = 'maxHeight';
  const maxWidth = 5300; pluginOrder[pluginOrder['maxWidth'] = maxWidth] = 'maxWidth';
  const minHeight = 5400; pluginOrder[pluginOrder['minHeight'] = minHeight] = 'minHeight';
  const minWidth = 5500; pluginOrder[pluginOrder['minWidth'] = minWidth] = 'minWidth';
  const objectFit = 5600; pluginOrder[pluginOrder['objectFit'] = objectFit] = 'objectFit';
  const objectPosition = 5700; pluginOrder[pluginOrder['objectPosition'] = objectPosition] = 'objectPosition';
  const opacity = 5800; pluginOrder[pluginOrder['opacity'] = opacity] = 'opacity';
  const outline = 5900; pluginOrder[pluginOrder['outline'] = outline] = 'outline';
  const overflow = 6000; pluginOrder[pluginOrder['overflow'] = overflow] = 'overflow';
  const overscrollBehavior = 6100; pluginOrder[pluginOrder['overscrollBehavior'] = overscrollBehavior] = 'overscrollBehavior';
  const padding = 6200; pluginOrder[pluginOrder['padding'] = padding] = 'padding';
  const placeholderColor = 6300; pluginOrder[pluginOrder['placeholderColor'] = placeholderColor] = 'placeholderColor';
  const placeholderOpacity = 6400; pluginOrder[pluginOrder['placeholderOpacity'] = placeholderOpacity] = 'placeholderOpacity';
  const caretColor = 6450; pluginOrder[pluginOrder['caretColor'] = caretColor] = 'caretColor';
  const caretOpacity = 6460; pluginOrder[pluginOrder['caretOpacity'] = caretOpacity] = 'caretOpacity';
  const tabSize = 6470; pluginOrder[pluginOrder['tabSize'] = tabSize] = 'tabSize';
  const pointerEvents = 6500; pluginOrder[pluginOrder['pointerEvents'] = pointerEvents] = 'pointerEvents';
  const position = 6600; pluginOrder[pluginOrder['position'] = position] = 'position';
  const inset = 6700; pluginOrder[pluginOrder['inset'] = inset] = 'inset';
  const resize = 6800; pluginOrder[pluginOrder['resize'] = resize] = 'resize';
  const boxShadow = 6900; pluginOrder[pluginOrder['boxShadow'] = boxShadow] = 'boxShadow';
  const boxShadowColor = 6950; pluginOrder[pluginOrder['boxShadowColor'] = boxShadowColor] = 'boxShadowColor';
  const ringWidth = 7000; pluginOrder[pluginOrder['ringWidth'] = ringWidth] = 'ringWidth';
  const ringOffsetColor = 7100; pluginOrder[pluginOrder['ringOffsetColor'] = ringOffsetColor] = 'ringOffsetColor';
  const ringOffsetWidth = 7200; pluginOrder[pluginOrder['ringOffsetWidth'] = ringOffsetWidth] = 'ringOffsetWidth';
  const ringColor = 7300; pluginOrder[pluginOrder['ringColor'] = ringColor] = 'ringColor';
  const ringOpacity = 7400; pluginOrder[pluginOrder['ringOpacity'] = ringOpacity] = 'ringOpacity';
  const fill = 7500; pluginOrder[pluginOrder['fill'] = fill] = 'fill';
  const stroke = 7600; pluginOrder[pluginOrder['stroke'] = stroke] = 'stroke';
  const strokeWidth = 7700; pluginOrder[pluginOrder['strokeWidth'] = strokeWidth] = 'strokeWidth';
  const strokeDashArray = 7750; pluginOrder[pluginOrder['strokeDashArray'] = strokeDashArray] = 'strokeDashArray';
  const strokeDashOffset = 7760; pluginOrder[pluginOrder['strokeDashOffset'] = strokeDashOffset] = 'strokeDashOffset';
  const tableLayout = 7800; pluginOrder[pluginOrder['tableLayout'] = tableLayout] = 'tableLayout';
  const textAlign = 7900; pluginOrder[pluginOrder['textAlign'] = textAlign] = 'textAlign';
  const textColor = 8000; pluginOrder[pluginOrder['textColor'] = textColor] = 'textColor';
  const textOpacity = 8100; pluginOrder[pluginOrder['textOpacity'] = textOpacity] = 'textOpacity';
  const textOverflow = 8200; pluginOrder[pluginOrder['textOverflow'] = textOverflow] = 'textOverflow';
  const textShadow = 8250; pluginOrder[pluginOrder['textShadow'] = textShadow] = 'textShadow';
  const fontStyle = 8300; pluginOrder[pluginOrder['fontStyle'] = fontStyle] = 'fontStyle';
  const textTransform = 8400; pluginOrder[pluginOrder['textTransform'] = textTransform] = 'textTransform';
  const textDecorationStyle = 8450; pluginOrder[pluginOrder['textDecorationStyle'] = textDecorationStyle] = 'textDecorationStyle';
  const textDecorationLength = 8455; pluginOrder[pluginOrder['textDecorationLength'] = textDecorationLength] = 'textDecorationLength';
  const textDecorationColor = 8460; pluginOrder[pluginOrder['textDecorationColor'] = textDecorationColor] = 'textDecorationColor';
  const textDecorationOpacity = 8470; pluginOrder[pluginOrder['textDecorationOpacity'] = textDecorationOpacity] = 'textDecorationOpacity';
  const textDecorationOffset = 8480; pluginOrder[pluginOrder['textDecorationOffset'] = textDecorationOffset] = 'textDecorationOffset';
  const textDecorationThickness = 8490; pluginOrder[pluginOrder['textDecorationThickness'] = textDecorationThickness] = 'textDecorationThickness';
  const textDecoration = 8500; pluginOrder[pluginOrder['textDecoration'] = textDecoration] = 'textDecoration';
  const textIndent = 8550; pluginOrder[pluginOrder['textIndent'] = textIndent] = 'textIndent';
  const textStrokeColor = 8560; pluginOrder[pluginOrder['textStrokeColor'] = textStrokeColor] = 'textStrokeColor';
  const textStrokeWidth = 8570; pluginOrder[pluginOrder['textStrokeWidth'] = textStrokeWidth] = 'textStrokeWidth';
  const content = 8580; pluginOrder[pluginOrder['content'] = content] = 'content';
  const fontSmoothing = 8600; pluginOrder[pluginOrder['fontSmoothing'] = fontSmoothing] = 'fontSmoothing';
  const fontVariantNumeric = 8700; pluginOrder[pluginOrder['fontVariantNumeric'] = fontVariantNumeric] = 'fontVariantNumeric';
  const letterSpacing = 8800; pluginOrder[pluginOrder['letterSpacing'] = letterSpacing] = 'letterSpacing';
  const userSelect = 8900; pluginOrder[pluginOrder['userSelect'] = userSelect] = 'userSelect';
  const verticalAlign = 9000; pluginOrder[pluginOrder['verticalAlign'] = verticalAlign] = 'verticalAlign';
  const visibility = 9100; pluginOrder[pluginOrder['visibility'] = visibility] = 'visibility';
  const backfaceVisibility = 9150; pluginOrder[pluginOrder['backfaceVisibility'] = backfaceVisibility] = 'backfaceVisibility';
  const whitespace = 9200; pluginOrder[pluginOrder['whitespace'] = whitespace] = 'whitespace';
  const wordBreak = 9300; pluginOrder[pluginOrder['wordBreak'] = wordBreak] = 'wordBreak';
  const writingMode = 9340; pluginOrder[pluginOrder['writingMode'] = writingMode] = 'writingMode';
  const hyphens = 9350; pluginOrder[pluginOrder['hyphens'] = hyphens] = 'hyphens';
  const width = 9400; pluginOrder[pluginOrder['width'] = width] = 'width';
  const zIndex = 9500; pluginOrder[pluginOrder['zIndex'] = zIndex] = 'zIndex';
  const isolation = 9550; pluginOrder[pluginOrder['isolation'] = isolation] = 'isolation';
  const gap = 9600; pluginOrder[pluginOrder['gap'] = gap] = 'gap';
  const gridAutoFlow = 9700; pluginOrder[pluginOrder['gridAutoFlow'] = gridAutoFlow] = 'gridAutoFlow';
  const gridTemplateColumns = 9800; pluginOrder[pluginOrder['gridTemplateColumns'] = gridTemplateColumns] = 'gridTemplateColumns';
  const gridAutoColumns = 9900; pluginOrder[pluginOrder['gridAutoColumns'] = gridAutoColumns] = 'gridAutoColumns';
  const gridColumn = 10000; pluginOrder[pluginOrder['gridColumn'] = gridColumn] = 'gridColumn';
  const gridColumnStart = 10100; pluginOrder[pluginOrder['gridColumnStart'] = gridColumnStart] = 'gridColumnStart';
  const gridColumnEnd = 10200; pluginOrder[pluginOrder['gridColumnEnd'] = gridColumnEnd] = 'gridColumnEnd';
  const gridTemplateRows = 10300; pluginOrder[pluginOrder['gridTemplateRows'] = gridTemplateRows] = 'gridTemplateRows';
  const gridAutoRows = 10400; pluginOrder[pluginOrder['gridAutoRows'] = gridAutoRows] = 'gridAutoRows';
  const gridRow = 10500; pluginOrder[pluginOrder['gridRow'] = gridRow] = 'gridRow';
  const gridRowStart = 10600; pluginOrder[pluginOrder['gridRowStart'] = gridRowStart] = 'gridRowStart';
  const gridRowEnd = 10700; pluginOrder[pluginOrder['gridRowEnd'] = gridRowEnd] = 'gridRowEnd';
  const transform = 10800; pluginOrder[pluginOrder['transform'] = transform] = 'transform';
  const transformOrigin = 10900; pluginOrder[pluginOrder['transformOrigin'] = transformOrigin] = 'transformOrigin';
  const scale = 11000; pluginOrder[pluginOrder['scale'] = scale] = 'scale';
  const rotate = 11100; pluginOrder[pluginOrder['rotate'] = rotate] = 'rotate';
  const translate = 11200; pluginOrder[pluginOrder['translate'] = translate] = 'translate';
  const skew = 11300; pluginOrder[pluginOrder['skew'] = skew] = 'skew';
  const perspective = 11350; pluginOrder[pluginOrder['perspective'] = perspective] = 'perspective';
  const perspectiveOrigin = 11360; pluginOrder[pluginOrder['perspectiveOrigin'] = perspectiveOrigin] = 'perspectiveOrigin';
  const transitionProperty = 11400; pluginOrder[pluginOrder['transitionProperty'] = transitionProperty] = 'transitionProperty';
  const transitionTimingFunction = 11500; pluginOrder[pluginOrder['transitionTimingFunction'] = transitionTimingFunction] = 'transitionTimingFunction';
  const transitionDuration = 11600; pluginOrder[pluginOrder['transitionDuration'] = transitionDuration] = 'transitionDuration';
  const transitionDelay = 11700; pluginOrder[pluginOrder['transitionDelay'] = transitionDelay] = 'transitionDelay';
  const keyframes = 11800; pluginOrder[pluginOrder['keyframes'] = keyframes] = 'keyframes';
  const animation = 11900; pluginOrder[pluginOrder['animation'] = animation] = 'animation';
  const imageRendering = 11950; pluginOrder[pluginOrder['imageRendering'] = imageRendering] = 'imageRendering';
  const mixBlendMode = 12000; pluginOrder[pluginOrder['mixBlendMode'] = mixBlendMode] = 'mixBlendMode';
  const backgroundBlendMode = 12100; pluginOrder[pluginOrder['backgroundBlendMode'] = backgroundBlendMode] = 'backgroundBlendMode';
  const filter = 12200; pluginOrder[pluginOrder['filter'] = filter] = 'filter';
  const blur = 12300; pluginOrder[pluginOrder['blur'] = blur] = 'blur';
  const brightness = 12400; pluginOrder[pluginOrder['brightness'] = brightness] = 'brightness';
  const contrast = 12500; pluginOrder[pluginOrder['contrast'] = contrast] = 'contrast';
  const dropShadow = 12600; pluginOrder[pluginOrder['dropShadow'] = dropShadow] = 'dropShadow';
  const grayscale = 12700; pluginOrder[pluginOrder['grayscale'] = grayscale] = 'grayscale';
  const hueRotate = 12800; pluginOrder[pluginOrder['hueRotate'] = hueRotate] = 'hueRotate';
  const invert = 12900; pluginOrder[pluginOrder['invert'] = invert] = 'invert';
  const saturate = 13000; pluginOrder[pluginOrder['saturate'] = saturate] = 'saturate';
  const sepia = 13100; pluginOrder[pluginOrder['sepia'] = sepia] = 'sepia';
  const backdropFilter = 13200; pluginOrder[pluginOrder['backdropFilter'] = backdropFilter] = 'backdropFilter';
  const backdropBlur = 13300; pluginOrder[pluginOrder['backdropBlur'] = backdropBlur] = 'backdropBlur';
  const backdropBrightness = 13400; pluginOrder[pluginOrder['backdropBrightness'] = backdropBrightness] = 'backdropBrightness';
  const backdropContrast = 13500; pluginOrder[pluginOrder['backdropContrast'] = backdropContrast] = 'backdropContrast';
  const backdropGrayscale = 13600; pluginOrder[pluginOrder['backdropGrayscale'] = backdropGrayscale] = 'backdropGrayscale';
  const backdropHueRotate = 13700; pluginOrder[pluginOrder['backdropHueRotate'] = backdropHueRotate] = 'backdropHueRotate';
  const backdropInvert = 13800; pluginOrder[pluginOrder['backdropInvert'] = backdropInvert] = 'backdropInvert';
  const backdropOpacity = 13900; pluginOrder[pluginOrder['backdropOpacity'] = backdropOpacity] = 'backdropOpacity';
  const backdropSaturate = 14000; pluginOrder[pluginOrder['backdropSaturate'] = backdropSaturate] = 'backdropSaturate';
  const backdropSepia = 14100; pluginOrder[pluginOrder['backdropSepia'] = backdropSepia] = 'backdropSepia';
  const willChange = 14200; pluginOrder[pluginOrder['willChange'] = willChange] = 'willChange';
  const touchAction = 14300; pluginOrder[pluginOrder['touchAction'] = touchAction] = 'touchAction';
  const scrollBehavior = 14400; pluginOrder[pluginOrder['scrollBehavior'] = scrollBehavior] = 'scrollBehavior';
  const accentColor = 14500; pluginOrder[pluginOrder['accentColor'] = accentColor] = 'accentColor';
})(pluginOrder || (pluginOrder = {}));

/*
 * See MDN web docs for more information
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
 */

function generateStates(
  variantOrder
) {
  const peseudoClassStates = pseudoClassNames.reduce((o, pseudoClassName) => (o[pseudoClassName] = () => new Style().pseudoClass(pseudoClassName), o), {});
  const peerStates = pseudoClassNames.reduce((o, pseudoClassName) => (o[`peer-${pseudoClassName}`] = () => new Style().parent(`.peer:${pseudoClassName} ~`), o), {});

  const notPeerStates = pseudoClassNames.reduce((o, pseudoClassName) => (o[`peer-not-${pseudoClassName}`] = () => new Style().parent(`.peer:not(:${pseudoClassName}) ~`), o), {});

  const groupStates = pseudoClassNames.reduce((o, pseudoClassName) => (o[`group-${pseudoClassName}`] = () => new Style().parent(`.group:${pseudoClassName}`), o), {});

  const states = {
    ...peseudoClassStates,
    'not-checked': () => new Style().pseudoClass('not(:checked)'),
    'not-disabled': () => new Style().pseudoClass('not(:disabled)'),
    'not-first-of-type': () => new Style().pseudoClass('not(:first-of-type)'),
    'not-last-of-type': () => new Style().pseudoClass('not(:last-of-type)'),
    first: () => new Style().pseudoClass('first-child'),
    'not-first': () => new Style().pseudoClass('not(:first-child)'),
    last: () => new Style().pseudoClass('last-child'),
    'not-last': () => new Style().pseudoClass('not(:last-child)'),
    'not-only-child': () => new Style().pseudoClass('not(:only-child)'),
    'not-only-of-type': () => new Style().pseudoClass('not(:only-of-type)'),
    even: () => new Style().pseudoClass('nth-child(even)'),
    odd: () => new Style().pseudoClass('nth-child(odd)'),
    'even-of-type': () => new Style().pseudoClass('nth-of-type(even)'),
    'odd-of-type': () => new Style().pseudoClass('nth-of-type(odd)'),

    // Pseudo elements
    before: () => new Style().pseudoElement('before'),
    after: () => new Style().pseudoElement('after'),
    'first-letter': () => new Style().pseudoElement('first-letter'),
    'first-line': () => new Style().pseudoElement('first-line'),
    'file-selector-button': () => new Style().pseudoElement('file-selector-button'),
    file: () => new Style().pseudoElement('file-selector-button'),
    selection: () => new Style().wrapSelector(selector => `${selector} *::selection, ${selector}::selection`),
    marker: () => new Style().wrapSelector(selector => `${selector} *::marker, ${selector}::marker`),

    svg: () => new Style().child('svg'),
    all: () => new Style().child('*'),
    children: () => new Style().child('> *'),
    siblings: () => new Style().child('~ *'),
    sibling: () => new Style().child('+ *'),
    // https://www.w3schools.com/CSS/css_pseudo_elements.asp

    // Directions
    ltr: () => new Style().wrapSelector(selector => `[dir='ltr'] ${selector}, [dir='ltr']${selector}`),
    rtl: () => new Style().wrapSelector(selector => `[dir='rtl'] ${selector}, [dir='rtl']${selector}`),

    // Group states
    // You'll need to add className="group" to an ancestor to make these work
    // https://github.com/ben-rogerson/twin.macro/blob/master/docs/group.md
    ...groupStates,

    // Motion control
    // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
    'motion-safe': () => new Style().atRule('@media (prefers-reduced-motion: no-preference)'),
    'motion-reduce': () => new Style().atRule('@media (prefers-reduced-motion: reduce)'),

    ...peerStates,
    ...notPeerStates,
  };
  const orderedStates = {};
  variantOrder.forEach((v) => {
    if (v in states) {
      orderedStates[v] = states[v];
    }
  });
  return orderedStates;
}

function _nullishCoalesce$5(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain$5(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



 






function resolveVariants(config) {
  return {
    orientation: generateOrientations((_nullishCoalesce$5(_optionalChain$5([(config.theme ), 'optionalAccess', _ => _.orientation]), () => ( {}))) ),
    screen: generateScreens((_nullishCoalesce$5(_optionalChain$5([(config.theme ), 'optionalAccess', _2 => _2.screens]), () => ( {}))) ),
    theme: generateThemes(config.darkMode),
    state: generateStates(_nullishCoalesce$5(config.variantOrder, () => ( []))),
  };
}

function _optionalChain$4(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// (Last Update: Aug 22 2020) [https://github.com/sindresorhus/modern-normalize/blob/master/modern-normalize.css]


const preflights






 = [

  /*! modern-normalize v1.0.0 | MIT License | https://github.com/sindresorhus/modern-normalize */

  /*
Document
========
*/

  /**
Use a better box model (opinionated).
*/
  // {
  //   keys: ['*'],
  //   global: true,
  //   selector: '*, *::before, *::after',
  //   properties: {
  //     '-webkit-box-sizing': 'border-box',
  //     'box-sizing': 'border-box'
  //   }
  // },
  // overwrite by windi

  /**
Use a more readable tab size (opinionated).
*/

  {
    keys: ['root'],
    global: true,
    selector: ':root',
    properties: {
      '-moz-tab-size': (theme) => theme('tabSize.DEFAULT', '4'),
      '-o-tab-size': (theme) => theme('tabSize.DEFAULT', '4'),
      'tab-size': (theme) => theme('tabSize.DEFAULT', '4'),
    },
  },

  /**
1. Correct the line height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
*/

  {
    keys: ['html'],
    global: true,
    selector: 'html',
    properties: {
    // 'line-height': '1.15', /* 1 */ overwrite by windi
      '-webkit-text-size-adjust': '100%', /* 2 */
    },
  },

  /*
Sections
========
*/

  /**
Remove the margin in all browsers.
*/

  {
    keys: ['body'],
    global: true,
    selector: 'body',
    properties: {
      'margin': '0', /* 1 */
    },
  },

  /**
Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
*/

  // {
  //   keys: ['body'],
  //   global: true,
  //   selector: 'body',
  //   properties: {
  //     'font-family': "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"
  //   }
  // },
  // overide by windi

  /*
Grouping content
================
*/

  /**
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
*/

  {
    keys: ['hr'],
    properties: {
      'height': '0', /* 1 */
      'color': 'inherit', /* 2 */
    },
  },

  /*
Text-level semantics
====================
*/

  /**
Add the correct text decoration in Chrome, Edge, and Safari.
*/

  {
    keys: ['title'],
    global: true,
    selector: 'abbr[title]',
    properties: {
      '-webkit-text-decoration': 'underline dotted',
      'text-decoration': 'underline dotted',
    },
  },

  /**
Add the correct font weight in Edge and Safari.
*/

  {
    keys: ['b', 'strong'],
    properties: {
      'font-weight': 'bolder',
    },
  },

  /**
1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)
2. Correct the odd 'em' font sizing in all browsers.
*/

  {
    keys: ['code', 'kbd', 'samp', 'pre'],
    properties: {
    // 'font-family': "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace", /* 1 */ overwrite by windi
      'font-size': '1em', /* 2 */
    },
  },

  /**
Add the correct font size in all browsers.
*/

  {
    keys: ['small'],
    properties: {
      'font-size': '80%',
    },
  },

  /**
Prevent 'sub' and 'sup' elements from affecting the line height in all browsers.
*/

  {
    keys: ['sub', 'sup'],
    properties: {
      'font-size': '75%',
      'line-height': '0',
      'position': 'relative',
      'vertical-align': 'baseline',
    },
  },

  {
    keys: ['sub'],
    properties: {
      'bottom': '-0.25em',
    },
  },

  {
    keys: ['sup'],
    properties: {
      'top': '-0.5em',
    },
  },

  /*
Tabular data
============
*/

  /**
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
*/

  {
    keys: ['table'],
    properties: {
      'text-indent': '0', /* 1 */
      'border-color': 'inherit', /* 2 */
    },
  },

  /*
Forms
=====
*/

  /**
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
*/

  {
    keys: ['button', 'input', 'optgroup', 'select', 'textarea'],
    properties: {
      'font-family': 'inherit', /* 1 */
      'font-size': '100%', /* 1 */
      'line-height': '1.15', /* 1 */
      'margin': '0', /* 2 */
    },
  },

  /**
Remove the inheritance of text transform in Edge and Firefox.
1. Remove the inheritance of text transform in Firefox.
*/

  {
    keys: ['button', 'select'],
    properties: {
      'text-transform': 'none', /* 1 */
    },
  },

  /**
Correct the inability to style clickable types in iOS and Safari.
*/

  {
    keys: ['button'],
    selector: 'button, [type=\'button\'], [type=\'reset\'], [type=\'submit\']',
    properties: {
      '-webkit-appearance': 'button', /* 1 */
    },
  },

  /**
Remove the inner border and padding in Firefox.
*/

  {
    keys: ['inner'],
    global: true,
    selector: '::moz-focus-inner',
    properties: {
      'border-style': 'none',
      'padding': '0',
    },
  },

  /**
Restore the focus styles unset by the previous rule.
*/

  {
    keys: ['focusring'],
    global: true,
    selector: ':-moz-focusring',
    properties: {
      'outline': '1px dotted ButtonText',
    },
  },

  /**
Remove the additional ':invalid' styles in Firefox.
See: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737
*/

  {
    keys: ['invalid'],
    global: true,
    selector: ':-moz-ui-invalid',
    properties: {
      'box-shadow': 'none',
    },
  },

  /**
Remove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.
*/

  {
    keys: ['legend'],
    properties: {
      'padding': '0',
    },
  },

  /**
Add the correct vertical alignment in Chrome and Firefox.
*/

  {
    keys: ['progress'],
    properties: {
      'vertical-align': 'baseline',
    },
  },

  /**
Correct the cursor style of increment and decrement buttons in Safari.
*/

  {
    keys: ['spin'],
    global: true,
    selector: '::-webkit-inner-spin-button, ::-webkit-outer-spin-button',
    properties: {
      'height': 'auto',
    },
  },

  /**
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

  {
    keys: ['search'],
    global: true,
    selector: '[type=\'search\']',
    properties: {
      '-webkit-appearance': 'textfield', /* 1 */
      'outline-offset': '-2px', /* 2 */

    },
  },

  /**
Remove the inner padding in Chrome and Safari on macOS.
*/

  {
    keys: ['search'],
    global: true,
    selector: '::-webkit-search-decoration',
    properties: {
      '-webkit-appearance': 'none',
    },
  },

  /**
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to 'inherit' in Safari.
*/

  {
    keys: ['file'],
    global: true,
    selector: '::-webkit-file-upload-button',
    properties: {
      '-webkit-appearance': 'button',
      'font': 'inherit',
    },
  },

  /*
Interactive
===========
*/

  /*
Add the correct display in Chrome and Safari.
*/

  {
    keys: ['summary'],
    properties: {
      'display': 'list-item',
    },
  },

  /**
 * Manually forked from SUIT CSS Base: https://github.com/suitcss/base
 * A thin layer on top of normalize.css that provides a starting point more
 * suitable for web applications.
 */

  /**
 * Removes the default spacing and border for appropriate elements.
 */

  {
    keys: ['blockquote', 'dl', 'dd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'figure', 'p', 'pre'],
    properties: {
      'margin': '0',
    },
  },

  {
    keys: ['button'],
    properties: {
      'background-color': 'transparent',
      'background-image': 'none' },
  },

  /**
 * Work around a Firefox/IE bug where the transparent `button` background
 * results in a loss of the default `button` focus styles.
 */

  {
    keys: ['fieldset'],
    properties: {
      'margin': '0',
      'padding': '0',
    },
  },

  {
    keys: ['ol', 'ul'],
    properties: {
      'list-style': 'none',
      'margin': '0',
      'padding': '0',
    },
  },

  /**
 * Tailwind custom reset styles
 */

  /**
 * 1. Use the user's configured `sans` font-family (with Tailwind's default
 *    sans-serif font stack as a fallback) as a sane default.
 * 2. Use Tailwind's default "normal" line-height so the user isn't forced
 *    to override it to ensure consistency even when using the default theme.
 */

  {
    keys: ['html'],
    global: true,
    selector: 'html',
    properties: {
      'font-family': (theme) => theme('fontFamily.sans', 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"') , /* 1 */
      'line-height': '1.5', /* 2 */
    },
  },

  /**
 * Inherit font-family and line-height from `html` so users can set them as
 * a class directly on the `html` element.
 */

  {
    keys: ['body'],
    global: true,
    selector: 'body',
    properties: {
      'font-family': 'inherit',
      'line-height': 'inherit',
    },
  },

  /**
 * 1. Prevent padding and border from affecting element width.
 *
 *    We used to set this in the html element and inherit from
 *    the parent element for everything else. This caused issues
 *    in shadow-dom-enhanced elements like <details> where the content
 *    is wrapped by a div with box-sizing set to `content-box`.
 *
 *    https://github.com/mozdevs/cssremedy/issues/4
 *
 *
 * 2. Allow adding a border to an element by just adding a border-width.
 *
 *    By default, the way the browser specifies that an element should have no
 *    border is by setting it's border-style to `none` in the user-agent
 *    stylesheet.
 *
 *    In order to easily add borders to elements by just setting the `border-width`
 *    property, we change the default border-style for all elements to `solid`, and
 *    use border-width to hide them instead. This way our `border` utilities only
 *    need to set the `border-width` property instead of the entire `border`
 *    shorthand, making our border utilities much more straightforward to compose.
 *
 */

  {
    keys: ['*'],
    global: true,
    selector: '*, ::before, ::after',
    properties: {
      '-webkit-box-sizing': 'border-box',
      'box-sizing': 'border-box',
      'border-width': '0',
      'border-style': 'solid',
      'border-color': (theme) => theme('borderColor.DEFAULT', 'currentColor') ,
    },
  },

  /*
 * Ensure horizontal rules are visible by default
 */

  {
    keys: ['hr'],
    properties: {
      'border-top-width': '1px',
    },
  },

  /**
 * Undo the `border-style: none` reset that Normalize applies to images so that
 * our `border-{width}` utilities have the expected effect.
 *
 * The Normalize reset is unnecessary for us since we default the border-width
 * to 0 on all elements.
 *
 */

  {
    keys: ['img'],
    properties: {
      'border-style': 'solid',
    },
  },

  {
    keys: ['textarea'],
    properties: {
      'resize': 'vertical',
    },
  },

  // input::placeholder,
  // textarea::placeholder {
  //   color: theme('colors.gray.400', #a1a1aa);
  // }
  // support prefixer

  {
    keys: ['input'],
    selector: 'input::placeholder',
    properties: {
      'opacity': '1',
      'color': (theme) => theme('colors.gray.400', '#a1a1aa') ,
    },
  },

  {
    keys: ['input'],
    selector: 'input::webkit-input-placeholder',
    properties: {
      'opacity': '1',
      'color': (theme) => theme('colors.gray.400', '#a1a1aa') ,
    },
  },

  {
    keys: ['input'],
    selector: 'input::-moz-placeholder',
    properties: {
      'opacity': '1',
      'color': (theme) => theme('colors.gray.400', '#a1a1aa') ,
    },
  },

  {
    keys: ['input'],
    selector: 'input:-ms-input-placeholder',
    properties: {
      'opacity': '1',
      'color': (theme) => theme('colors.gray.400', '#a1a1aa') ,
    },
  },

  {
    keys: ['input'],
    selector: 'input::-ms-input-placeholder',
    properties: {
      'opacity': '1',
      'color': (theme) => theme('colors.gray.400', '#a1a1aa') ,
    },
  },

  {
    keys: ['textarea'],
    selector: 'textarea::placeholder',
    properties: {
      'opacity': '1',
      'color': (theme) => theme('colors.gray.400', '#a1a1aa') ,
    },
  },

  {
    keys: ['textarea'],
    selector: 'textarea::webkit-input-placeholder',
    properties: {
      'opacity': '1',
      'color': (theme) => theme('colors.gray.400', '#a1a1aa') ,
    },
  },

  {
    keys: ['textarea'],
    selector: 'textarea::-moz-placeholder',
    properties: {
      'opacity': '1',
      'color': (theme) => theme('colors.gray.400', '#a1a1aa') ,
    },
  },

  {
    keys: ['textarea'],
    selector: 'textarea:-ms-input-placeholder',
    properties: {
      'opacity': '1',
      'color': (theme) => theme('colors.gray.400', '#a1a1aa') ,
    },
  },

  {
    keys: ['textarea'],
    selector: 'textarea::-ms-input-placeholder',
    properties: {
      'opacity': '1',
      'color': (theme) => theme('colors.gray.400', '#a1a1aa') ,
    },
  },

  {
    keys: ['button'],
    selector: 'button, [role="button"]',
    properties: {
      'cursor': 'pointer',
    },
  },

  {
    keys: ['table'],
    properties: {
      'border-collapse': 'collapse',
    },
  },

  {
    keys: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    properties: {
      'font-size': 'inherit',
      'font-weight': 'inherit',
    },
  },

  /**
 * Reset links to optimize for opt-in styling instead of
 * opt-out.
 */

  {
    keys: ['a'],
    properties: {
      'color': 'inherit',
      'text-decoration': 'inherit',
    },
  },

  /**
 * Reset form element properties that are easy to forget to
 * style explicitly so you don't inadvertently introduce
 * styles that deviate from your design system. These styles
 * supplement a partial reset that is already applied by
 * normalize.css.
 */

  {
    keys: ['button', 'input', 'optgroup', 'select', 'textarea'],
    properties: {
      'padding': '0',
      'line-height': 'inherit',
      'color': 'inherit',
    },
  },

  /**
 * Use the configured 'mono' font family for elements that
 * are expected to be rendered with a monospace font, falling
 * back to the system monospace stack if there is no configured
 * 'mono' font family.
 */

  {
    keys: ['pre', 'code', 'kbd', 'samp'],
    properties: {
      'font-family': (theme) => theme('fontFamily.mono', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace') ,
    },
  },

  /**
 * Make replaced elements `display: block` by default as that's
 * the behavior you want almost all of the time. Inspired by
 * CSS Remedy, with `svg` added as well.
 *
 * https://github.com/mozdevs/cssremedy/issues/14
 */

  {
    keys: ['img', 'svg', 'video', 'canvas', 'audio', 'iframe', 'embed', 'object'],
    properties: {
      'display': 'block',
      'vertical-align': 'middle',
    },
  },

  /**
 * Constrain images and videos to the parent width and preserve
 * their instrinsic aspect ratio.
 *
 * https://github.com/mozdevs/cssremedy/issues/14
 */

  {
    keys: ['img', 'video'],
    properties: {
      'max-width': '100%',
      'height': 'auto',
    },
  },

  // added by ringWidth
  // https://windicss.org/utilities/borders.html#ring-width
  {
    keys: ['*'],
    global: true,
    selector: '*',
    properties: {
      '--tw-ring-inset': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-ring-offset-width': theme => theme('ringOffsetWidth.DEFAULT', '0px') ,
      '--tw-ring-offset-color': theme => theme('ringOffsetColor.DEFAULT', '#fff') ,
      '--tw-ring-color': theme => `rgba(${_optionalChain$4([hex2RGB, 'call', _ => _(theme('ringColor.DEFAULT', '#93C5FD') ), 'optionalAccess', _2 => _2.join, 'call', _3 => _3(', ')])}, ${theme('ringOpacity.DEFAULT', '0.5') })`,
      '--tw-ring-offset-shadow': '0 0 #0000',
      '--tw-ring-shadow': '0 0 #0000',
    },
  },

  // added by boxShadow
  // https://windicss.org/utilities/effects.html#box-shadow
  {
    keys: ['*'],
    global: true,
    selector: '*',
    properties: {
      '--tw-shadow': '0 0 #0000',
    },
  },
];

const fontVariants = {
  '--tw-ordinal': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-slashed-zero': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-figure': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-spacing': 'var(--tw-empty,/*!*/ /*!*/)',
  '--tw-numeric-fraction': 'var(--tw-empty,/*!*/ /*!*/)',
  'font-variant-numeric': 'var(--tw-ordinal) var(--tw-slashed-zero) var(--tw-numeric-figure) var(--tw-numeric-spacing) var(--tw-numeric-fraction)',
};

const staticUtilities = {
  // https://windicss.org/utilities/behaviors.html#box-decoration-break
  'decoration-slice': {
    'utility': {
      '-webkit-box-decoration-break': 'slice',
      'box-decoration-break': 'slice',
    },
    'meta': {
      'group': 'boxDecorationBreak',
      'order': 1,
    },
  },

  'decoration-clone': {
    'utility': {
      '-webkit-box-decoration-break': 'clone',
      'box-decoration-break': 'clone',
    },
    'meta': {
      'group': 'boxDecorationBreak',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/flexbox.html#flex-basis
  'basis-auto': {
    'utility': {
      'flex-basis': 'auto',
    },
    'meta': {
      'group': 'flexBasis',
      'order': 1,
    },
  },
  'basis-full': {
    'utility': {
      'flex-basis': '100%',
    },
    'meta': {
      'group': 'flexBasis',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/sizing.html#box-sizing
  'box-border': {
    'utility': {
      '-webkit-box-sizing': 'border-box',
      'box-sizing': 'border-box',
    },
    'meta': {
      'group': 'boxSizing',
      'order': 1,
    },
  },
  'box-content': {
    'utility': {
      '-webkit-box-sizing': 'content-box',
      'box-sizing': 'content-box',
    },
    'meta': {
      'group': 'boxSizing',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/display.html
  'block': {
    'utility': {
      'display': 'block',
    },
    'meta': {
      'group': 'display',
      'order': 1,
    },
  },
  'inline-block': {
    'utility': {
      'display': 'inline-block',
    },
    'meta': {
      'group': 'display',
      'order': 2,
    },
  },
  'inline': {
    'utility': {
      'display': 'inline',
    },
    'meta': {
      'group': 'display',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/flexbox.html
  'flex': {
    'utility': {
      'display': [
        '-webkit-box',
        '-ms-flexbox',
        '-webkit-flex',
        'flex',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 4,
    },
  },
  'inline-flex': {
    'utility': {
      'display': [
        '-webkit-inline-box',
        '-ms-inline-flexbox',
        '-webkit-inline-flex',
        'inline-flex',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/tables.html
  'table': {
    'utility': {
      'display': 'table',
    },
    'meta': {
      'group': 'display',
      'order': 6,
    },
  },
  'inline-table': {
    'utility': {
      'display': 'inline-table',
    },
    'meta': {
      'group': 'display',
      'order': 7,
    },
  },
  'table-caption': {
    'utility': {
      'display': 'table-caption',
    },
    'meta': {
      'group': 'display',
      'order': 8,
    },
  },
  'table-cell': {
    'utility': {
      'display': 'table-cell',
    },
    'meta': {
      'group': 'display',
      'order': 9,
    },
  },
  'table-column': {
    'utility': {
      'display': 'table-column',
    },
    'meta': {
      'group': 'display',
      'order': 10,
    },
  },
  'table-column-group': {
    'utility': {
      'display': 'table-column-group',
    },
    'meta': {
      'group': 'display',
      'order': 11,
    },
  },
  'table-footer-group': {
    'utility': {
      'display': 'table-footer-group',
    },
    'meta': {
      'group': 'display',
      'order': 12,
    },
  },
  'table-header-group': {
    'utility': {
      'display': 'table-header-group',
    },
    'meta': {
      'group': 'display',
      'order': 13,
    },
  },
  'table-row-group': {
    'utility': {
      'display': 'table-row-group',
    },
    'meta': {
      'group': 'display',
      'order': 14,
    },
  },
  'table-row': {
    'utility': {
      'display': 'table-row',
    },
    'meta': {
      'group': 'display',
      'order': 15,
    },
  },
  'flow-root': {
    'utility': {
      'display': 'flow-root',
    },
    'meta': {
      'group': 'display',
      'order': 16,
    },
  },

  // https://windicss.org/utilities/grid.html
  'grid': {
    'utility': {
      'display': [
        '-ms-grid',
        'grid',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 17,
    },
  },
  'inline-grid': {
    'utility': {
      'display': [
        '-ms-inline-grid',
        'inline-grid',
      ],
    },
    'meta': {
      'group': 'display',
      'order': 18,
    },
  },
  'contents': {
    'utility': {
      'display': 'contents',
    },
    'meta': {
      'group': 'display',
      'order': 19,
    },
  },
  'list-item': {
    'utility': {
      'display': 'list-item',
    },
    'meta': {
      'group': 'display',
      'order': 20,
    },
  },
  'hidden': {
    'utility': {
      'display': 'none',
    },
    'meta': {
      'group': 'display',
      'order': 21,
    },
  },

  // https://windicss.org/utilities/columns.html
  'break-after-auto': {
    'utility': {
      'break-after': 'auto',
    },
    'meta': {
      'group': 'columns',
      'order': 1,
    },
  },
  'break-after-avoid': {
    'utility': {
      'break-after': 'avoid',
    },
    'meta': {
      'group': 'columns',
      'order': 2,
    },
  },
  'break-after-all': {
    'utility': {
      'break-after': 'all',
    },
    'meta': {
      'group': 'columns',
      'order': 3,
    },
  },
  'break-after-avoid-page': {
    'utility': {
      'break-after': 'avoid-page',
    },
    'meta': {
      'group': 'columns',
      'order': 4,
    },
  },
  'break-after-page': {
    'utility': {
      'break-after': 'page',
    },
    'meta': {
      'group': 'columns',
      'order': 5,
    },
  },
  'break-after-left': {
    'utility': {
      'break-after': 'left',
    },
    'meta': {
      'group': 'columns',
      'order': 6,
    },
  },
  'break-after-right': {
    'utility': {
      'break-after': 'right',
    },
    'meta': {
      'group': 'columns',
      'order': 7,
    },
  },
  'break-after-column': {
    'utility': {
      'break-after': 'column',
    },
    'meta': {
      'group': 'columns',
      'order': 8,
    },
  },
  'break-before-auto': {
    'utility': {
      'break-before': 'auto',
    },
    'meta': {
      'group': 'columns',
      'order': 9,
    },
  },
  'break-before-avoid': {
    'utility': {
      'break-before': 'avoid',
    },
    'meta': {
      'group': 'columns',
      'order': 10,
    },
  },
  'break-before-all': {
    'utility': {
      'break-before': 'all',
    },
    'meta': {
      'group': 'columns',
      'order': 11,
    },
  },
  'break-before-avoid-page': {
    'utility': {
      'break-before': 'avoid-page',
    },
    'meta': {
      'group': 'columns',
      'order': 12,
    },
  },
  'break-before-page': {
    'utility': {
      'break-before': 'page',
    },
    'meta': {
      'group': 'columns',
      'order': 13,
    },
  },
  'break-before-left': {
    'utility': {
      'break-before': 'left',
    },
    'meta': {
      'group': 'columns',
      'order': 14,
    },
  },
  'break-before-right': {
    'utility': {
      'break-before': 'right',
    },
    'meta': {
      'group': 'columns',
      'order': 15,
    },
  },
  'break-before-column': {
    'utility': {
      'break-before': 'column',
    },
    'meta': {
      'group': 'columns',
      'order': 16,
    },
  },
  'break-inside-auto': {
    'utility': {
      'break-inside': 'auto',
    },
    'meta': {
      'group': 'columns',
      'order': 17,
    },
  },
  'break-inside-avoid': {
    'utility': {
      'break-inside': 'avoid',
    },
    'meta': {
      'group': 'columns',
      'order': 18,
    },
  },
  'break-inside-avoid-page': {
    'utility': {
      'break-inside': 'avoid-page',
    },
    'meta': {
      'group': 'columns',
      'order': 19,
    },
  },
  'break-inside-avoid-column': {
    'utility': {
      'break-inside': 'avoid-column',
    },
    'meta': {
      'group': 'columns',
      'order': 20,
    },
  },

  // https://windicss.org/utilities/positioning.html#floats
  'float-right': {
    'utility': {
      'float': 'right',
    },
    'meta': {
      'group': 'float',
      'order': 1,
    },
  },
  'float-left': {
    'utility': {
      'float': 'left',
    },
    'meta': {
      'group': 'float',
      'order': 2,
    },
  },
  'float-none': {
    'utility': {
      'float': 'none',
    },
    'meta': {
      'group': 'float',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/positioning.html#clear
  'clear-left': {
    'utility': {
      'clear': 'left',
    },
    'meta': {
      'group': 'clear',
      'order': 1,
    },
  },
  'clear-right': {
    'utility': {
      'clear': 'right',
    },
    'meta': {
      'group': 'clear',
      'order': 2,
    },
  },
  'clear-both': {
    'utility': {
      'clear': 'both',
    },
    'meta': {
      'group': 'clear',
      'order': 3,
    },
  },
  'clear-none': {
    'utility': {
      'clear': 'none',
    },
    'meta': {
      'group': 'clear',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/positioning.html#isolation
  'isolate': {
    'utility': {
      'isolation': 'isolate',
    },
    'meta': {
      'group': 'isolation',
      'order': 1,
    },
  },
  'isolation-auto': {
    'utility': {
      'isolation': 'auto',
    },
    'meta': {
      'group': 'isolation',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/positioning.html#object-fit
  'object-contain': {
    'utility': {
      '-o-object-fit': 'contain',
      'object-fit': 'contain',
    },
    'meta': {
      'group': 'objectFit',
      'order': 1,
    },
  },
  'object-cover': {
    'utility': {
      '-o-object-fit': 'cover',
      'object-fit': 'cover',
    },
    'meta': {
      'group': 'objectFit',
      'order': 2,
    },
  },
  'object-fill': {
    'utility': {
      '-o-object-fit': 'fill',
      'object-fit': 'fill',
    },
    'meta': {
      'group': 'objectFit',
      'order': 3,
    },
  },
  'object-none': {
    'utility': {
      '-o-object-fit': 'none',
      'object-fit': 'none',
    },
    'meta': {
      'group': 'objectFit',
      'order': 4,
    },
  },
  'object-scale-down': {
    'utility': {
      '-o-object-fit': 'scale-down',
      'object-fit': 'scale-down',
    },
    'meta': {
      'group': 'objectFit',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/behaviors.html#overflow
  'overflow-auto': {
    'utility': {
      'overflow': 'auto',
    },
    'meta': {
      'group': 'overflow',
      'order': 1,
    },
  },
  'overflow-hidden': {
    'utility': {
      'overflow': 'hidden',
    },
    'meta': {
      'group': 'overflow',
      'order': 2,
    },
  },
  'overflow-clip': {
    'utility': {
      'overflow': 'clip',
    },
    'meta': {
      'group': 'overflow',
      'order': 3,
    },
  },
  'overflow-visible': {
    'utility': {
      'overflow': 'visible',
    },
    'meta': {
      'group': 'overflow',
      'order': 4,
    },
  },
  'overflow-scroll': {
    'utility': {
      'overflow': 'scroll',
    },
    'meta': {
      'group': 'overflow',
      'order': 5,
    },
  },
  'overflow-x-auto': {
    'utility': {
      'overflow-x': 'auto',
    },
    'meta': {
      'group': 'overflow',
      'order': 6,
    },
  },
  'overflow-y-auto': {
    'utility': {
      'overflow-y': 'auto',
    },
    'meta': {
      'group': 'overflow',
      'order': 7,
    },
  },
  'overflow-x-hidden': {
    'utility': {
      'overflow-x': 'hidden',
    },
    'meta': {
      'group': 'overflow',
      'order': 8,
    },
  },
  'overflow-y-hidden': {
    'utility': {
      'overflow-y': 'hidden',
    },
    'meta': {
      'group': 'overflow',
      'order': 9,
    },
  },
  'overflow-x-clip': {
    'utility': {
      'overflow-x': 'clip',
    },
    'meta': {
      'group': 'overflow',
      'order': 10,
    },
  },
  'overflow-y-clip': {
    'utility': {
      'overflow-y': 'clip',
    },
    'meta': {
      'group': 'overflow',
      'order': 11,
    },
  },
  'overflow-x-visible': {
    'utility': {
      'overflow-x': 'visible',
    },
    'meta': {
      'group': 'overflow',
      'order': 12,
    },
  },
  'overflow-y-visible': {
    'utility': {
      'overflow-y': 'visible',
    },
    'meta': {
      'group': 'overflow',
      'order': 13,
    },
  },
  'overflow-x-scroll': {
    'utility': {
      'overflow-x': 'scroll',
    },
    'meta': {
      'group': 'overflow',
      'order': 14,
    },
  },
  'overflow-y-scroll': {
    'utility': {
      'overflow-y': 'scroll',
    },
    'meta': {
      'group': 'overflow',
      'order': 15,
    },
  },

  // https://windicss.org/utilities/behaviors.html#overscroll-behavior
  'overscroll-auto': {
    'utility': {
      'overscroll-behavior': 'auto',
      '-ms-scroll-chaining': 'chained',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 1,
    },
  },
  'overscroll-contain': {
    'utility': {
      'overscroll-behavior': 'contain',
      '-ms-scroll-chaining': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 2,
    },
  },
  'overscroll-none': {
    'utility': {
      'overscroll-behavior': 'none',
      '-ms-scroll-chaining': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 3,
    },
  },
  'overscroll-y-auto': {
    'utility': {
      'overscroll-behavior-y': 'auto',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 4,
    },
  },
  'overscroll-y-contain': {
    'utility': {
      'overscroll-behavior-y': 'contain',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 5,
    },
  },
  'overscroll-y-none': {
    'utility': {
      'overscroll-behavior-y': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 6,
    },
  },
  'overscroll-x-auto': {
    'utility': {
      'overscroll-behavior-x': 'auto',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 7,
    },
  },
  'overscroll-x-contain': {
    'utility': {
      'overscroll-behavior-x': 'contain',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 8,
    },
  },
  'overscroll-x-none': {
    'utility': {
      'overscroll-behavior-x': 'none',
    },
    'meta': {
      'group': 'overscrollBehavior',
      'order': 9,
    },
  },

  // https://windicss.org/utilities/positioning.html#position
  'static': {
    'utility': {
      'position': 'static',
    },
    'meta': {
      'group': 'position',
      'order': 1,
    },
  },
  'fixed': {
    'utility': {
      'position': 'fixed',
    },
    'meta': {
      'group': 'position',
      'order': 2,
    },
  },
  'absolute': {
    'utility': {
      'position': 'absolute',
    },
    'meta': {
      'group': 'position',
      'order': 3,
    },
  },
  'relative': {
    'utility': {
      'position': 'relative',
    },
    'meta': {
      'group': 'position',
      'order': 4,
    },
  },
  'sticky': {
    'utility': {
      'position': [
        '-webkit-sticky',
        'sticky',
      ],
    },
    'meta': {
      'group': 'position',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/display.html#visibility
  'visible': {
    'utility': {
      'visibility': 'visible',
    },
    'meta': {
      'group': 'visibility',
      'order': 1,
    },
  },
  'invisible': {
    'utility': {
      'visibility': 'hidden',
    },
    'meta': {
      'group': 'visibility',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/display.html#backface-visibility
  'backface-visible': {
    'utility': {
      '-webkit-backface-visibility': 'visible',
      'backface-visibility': 'visible',
    },
    'meta': {
      'group': 'backfaceVisibility',
      'order': 1,
    },
  },
  'backface-hidden': {
    'utility': {
      '-webkit-backface-visibility': 'hidden',
      'backface-visibility': 'hidden',
    },
    'meta': {
      'group': 'backfaceVisibility',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/flexbox.html#flex-direction
  'flex-row': {
    'utility': {
      '-webkit-box-orient': 'horizontal',
      '-webkit-box-direction': 'normal',
      '-ms-flex-direction': 'row',
      '-webkit-flex-direction': 'row',
      'flex-direction': 'row',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 1,
    },
  },
  'flex-row-reverse': {
    'utility': {
      '-webkit-box-orient': 'horizontal',
      '-webkit-box-direction': 'reverse',
      '-ms-flex-direction': 'row-reverse',
      '-webkit-flex-direction': 'row-reverse',
      'flex-direction': 'row-reverse',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 2,
    },
  },
  'flex-col': {
    'utility': {
      '-webkit-box-orient': 'vertical',
      '-webkit-box-direction': 'normal',
      '-ms-flex-direction': 'column',
      '-webkit-flex-direction': 'column',
      'flex-direction': 'column',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 3,
    },
  },
  'flex-col-reverse': {
    'utility': {
      '-webkit-box-orient': 'vertical',
      '-webkit-box-direction': 'reverse',
      '-ms-flex-direction': 'column-reverse',
      '-webkit-flex-direction': 'column-reverse',
      'flex-direction': 'column-reverse',
    },
    'meta': {
      'group': 'flexDirection',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/flexbox.html#flex-wrap
  'flex-wrap': {
    'utility': {
      '-ms-flex-wrap': 'wrap',
      '-webkit-flex-wrap': 'wrap',
      'flex-wrap': 'wrap',
    },
    'meta': {
      'group': 'flexWrap',
      'order': 1,
    },
  },
  'flex-wrap-reverse': {
    'utility': {
      '-ms-flex-wrap': 'wrap-reverse',
      '-webkit-flex-wrap': 'wrap-reverse',
      'flex-wrap': 'wrap-reverse',
    },
    'meta': {
      'group': 'flexWrap',
      'order': 2,
    },
  },
  'flex-nowrap': {
    'utility': {
      '-ms-flex-wrap': 'nowrap',
      '-webkit-flex-wrap': 'nowrap',
      'flex-wrap': 'nowrap',
    },
    'meta': {
      'group': 'flexWrap',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/grid.html#grid-column-span
  'col-auto': {
    'utility': {
      'grid-column': 'auto',
    },
    'meta': {
      'group': 'gridColumn',
      'order': 1,
    },
  },

  // https://windicss.org/utilities/grid.html#grid-row-span
  'row-auto': {
    'utility': {
      'grid-row': 'auto',
    },
    'meta': {
      'group': 'gridRow',
      'order': 1,
    },
  },

  // https://windicss.org/utilities/grid.html#grid-auto-flow
  'grid-flow-row': {
    'utility': {
      'grid-auto-flow': 'row',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 1,
    },
  },
  'grid-flow-col': {
    'utility': {
      'grid-auto-flow': 'column',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 2,
    },
  },
  'grid-flow-row-dense': {
    'utility': {
      'grid-auto-flow': 'row dense',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 3,
    },
  },
  'grid-flow-col-dense': {
    'utility': {
      'grid-auto-flow': 'column dense',
    },
    'meta': {
      'group': 'gridAutoFlow',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/positioning.html#justify-content
  'justify-start': {
    'utility': {
      '-webkit-box-pack': 'start',
      '-ms-flex-pack': 'start',
      '-webkit-justify-content': 'flex-start',
      'justify-content': 'flex-start',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 1,
    },
  },
  'justify-end': {
    'utility': {
      '-webkit-box-pack': 'end',
      '-ms-flex-pack': 'end',
      '-webkit-justify-content': 'flex-end',
      'justify-content': 'flex-end',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 2,
    },
  },
  'justify-center': {
    'utility': {
      '-webkit-box-pack': 'center',
      '-ms-flex-pack': 'center',
      '-webkit-justify-content': 'center',
      'justify-content': 'center',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 3,
    },
  },
  'justify-between': {
    'utility': {
      '-webkit-box-pack': 'justify',
      '-ms-flex-pack': 'justify',
      '-webkit-justify-content': 'space-between',
      'justify-content': 'space-between',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 4,
    },
  },
  'justify-around': {
    'utility': {
      '-ms-flex-pack': 'distribute',
      '-webkit-justify-content': 'space-around',
      'justify-content': 'space-around',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 5,
    },
  },
  'justify-evenly': {
    'utility': {
      '-webkit-box-pack': 'space-evenly',
      '-ms-flex-pack': 'space-evenly',
      '-webkit-justify-content': 'space-evenly',
      'justify-content': 'space-evenly',
    },
    'meta': {
      'group': 'justifyContent',
      'order': 6,
    },
  },

  // https://windicss.org/utilities/positioning.html#justify-items
  'justify-items-auto': {
    'utility': {
      'justify-items': 'auto',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 1,
    },
  },
  'justify-items-start': {
    'utility': {
      'justify-items': 'start',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 2,
    },
  },
  'justify-items-end': {
    'utility': {
      'justify-items': 'end',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 3,
    },
  },
  'justify-items-center': {
    'utility': {
      'justify-items': 'center',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 4,
    },
  },
  'justify-items-stretch': {
    'utility': {
      'justify-items': 'stretch',
    },
    'meta': {
      'group': 'justifyItems',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/positioning.html#justify-self
  'justify-self-auto': {
    'utility': {
      '-ms-grid-column-align': 'auto',
      'justify-self': 'auto',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 1,
    },
  },
  'justify-self-start': {
    'utility': {
      '-ms-grid-column-align': 'start',
      'justify-self': 'start',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 2,
    },
  },
  'justify-self-end': {
    'utility': {
      '-ms-grid-column-align': 'end',
      'justify-self': 'end',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 3,
    },
  },
  'justify-self-center': {
    'utility': {
      '-ms-grid-column-align': 'center',
      'justify-self': 'center',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 4,
    },
  },
  'justify-self-stretch': {
    'utility': {
      '-ms-grid-column-align': 'stretch',
      'justify-self': 'stretch',
    },
    'meta': {
      'group': 'justifySelf',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/positioning.html#align-content
  'content-center': {
    'utility': {
      '-ms-flex-line-pack': 'center',
      '-webkit-align-content': 'center',
      'align-content': 'center',
    },
    'meta': {
      'group': 'alignContent',
      'order': 1,
    },
  },
  'content-start': {
    'utility': {
      '-ms-flex-line-pack': 'start',
      '-webkit-align-content': 'flex-start',
      'align-content': 'flex-start',
    },
    'meta': {
      'group': 'alignContent',
      'order': 2,
    },
  },
  'content-end': {
    'utility': {
      '-ms-flex-line-pack': 'end',
      '-webkit-align-content': 'flex-end',
      'align-content': 'flex-end',
    },
    'meta': {
      'group': 'alignContent',
      'order': 3,
    },
  },
  'content-between': {
    'utility': {
      '-ms-flex-line-pack': 'justify',
      '-webkit-align-content': 'space-between',
      'align-content': 'space-between',
    },
    'meta': {
      'group': 'alignContent',
      'order': 4,
    },
  },
  'content-around': {
    'utility': {
      '-ms-flex-line-pack': 'distribute',
      '-webkit-align-content': 'space-around',
      'align-content': 'space-around',
    },
    'meta': {
      'group': 'alignContent',
      'order': 5,
    },
  },
  'content-evenly': {
    'utility': {
      '-ms-flex-line-pack': 'space-evenly',
      '-webkit-align-content': 'space-evenly',
      'align-content': 'space-evenly',
    },
    'meta': {
      'group': 'alignContent',
      'order': 6,
    },
  },

  // https://windicss.org/utilities/positioning.html#align-items
  'items-start': {
    'utility': {
      '-webkit-box-align': 'start',
      '-ms-flex-align': 'start',
      '-webkit-align-items': 'flex-start',
      'align-items': 'flex-start',
    },
    'meta': {
      'group': 'alignItems',
      'order': 1,
    },
  },
  'items-end': {
    'utility': {
      '-webkit-box-align': 'end',
      '-ms-flex-align': 'end',
      '-webkit-align-items': 'flex-end',
      'align-items': 'flex-end',
    },
    'meta': {
      'group': 'alignItems',
      'order': 2,
    },
  },
  'items-center': {
    'utility': {
      '-webkit-box-align': 'center',
      '-ms-flex-align': 'center',
      '-webkit-align-items': 'center',
      'align-items': 'center',
    },
    'meta': {
      'group': 'alignItems',
      'order': 3,
    },
  },
  'items-baseline': {
    'utility': {
      '-webkit-box-align': 'baseline',
      '-ms-flex-align': 'baseline',
      '-webkit-align-items': 'baseline',
      'align-items': 'baseline',
    },
    'meta': {
      'group': 'alignItems',
      'order': 4,
    },
  },
  'items-stretch': {
    'utility': {
      '-webkit-box-align': 'stretch',
      '-ms-flex-align': 'stretch',
      '-webkit-align-items': 'stretch',
      'align-items': 'stretch',
    },
    'meta': {
      'group': 'alignItems',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/positioning.html#align-self
  'self-auto': {
    'utility': {
      '-ms-flex-item-align': 'auto',
      '-ms-grid-row-align': 'auto',
      '-webkit-align-self': 'auto',
      'align-self': 'auto',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 1,
    },
  },
  'self-start': {
    'utility': {
      '-ms-flex-item-align': 'start',
      '-webkit-align-self': 'flex-start',
      'align-self': 'flex-start',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 2,
    },
  },
  'self-end': {
    'utility': {
      '-ms-flex-item-align': 'end',
      '-webkit-align-self': 'flex-end',
      'align-self': 'flex-end',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 3,
    },
  },
  'self-center': {
    'utility': {
      '-ms-flex-item-align': 'center',
      '-ms-grid-row-align': 'center',
      '-webkit-align-self': 'center',
      'align-self': 'center',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 4,
    },
  },
  'self-stretch': {
    'utility': {
      '-ms-flex-item-align': 'stretch',
      '-ms-grid-row-align': 'stretch',
      '-webkit-align-self': 'stretch',
      'align-self': 'stretch',
    },
    'meta': {
      'group': 'alignSelf',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/positioning.html#place-content
  'place-content-center': {
    'utility': {
      'place-content': 'center',
    },
    'meta': {
      'group': 'placeContent',
      'order': 1,
    },
  },
  'place-content-start': {
    'utility': {
      'place-content': 'start',
    },
    'meta': {
      'group': 'placeContent',
      'order': 2,
    },
  },
  'place-content-end': {
    'utility': {
      'place-content': 'end',
    },
    'meta': {
      'group': 'placeContent',
      'order': 3,
    },
  },
  'place-content-between': {
    'utility': {
      'place-content': 'space-between',
    },
    'meta': {
      'group': 'placeContent',
      'order': 4,
    },
  },
  'place-content-around': {
    'utility': {
      'place-content': 'space-around',
    },
    'meta': {
      'group': 'placeContent',
      'order': 5,
    },
  },
  'place-content-evenly': {
    'utility': {
      'place-content': 'space-evenly',
    },
    'meta': {
      'group': 'placeContent',
      'order': 6,
    },
  },
  'place-content-stretch': {
    'utility': {
      'place-content': 'stretch',
    },
    'meta': {
      'group': 'placeContent',
      'order': 7,
    },
  },

  // https://windicss.org/utilities/positioning.html#place-items
  'place-items-auto': {
    'utility': {
      'place-items': 'auto',
    },
    'meta': {
      'group': 'placeItems',
      'order': 1,
    },
  },
  'place-items-start': {
    'utility': {
      'place-items': 'start',
    },
    'meta': {
      'group': 'placeItems',
      'order': 2,
    },
  },
  'place-items-end': {
    'utility': {
      'place-items': 'end',
    },
    'meta': {
      'group': 'placeItems',
      'order': 3,
    },
  },
  'place-items-center': {
    'utility': {
      'place-items': 'center',
    },
    'meta': {
      'group': 'placeItems',
      'order': 4,
    },
  },
  'place-items-stretch': {
    'utility': {
      'place-items': 'stretch',
    },
    'meta': {
      'group': 'placeItems',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/positioning.html#place-self
  'place-self-auto': {
    'utility': {
      '-ms-grid-row-align': 'auto',
      '-ms-grid-column-align': 'auto',
      'place-self': 'auto',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 1,
    },
  },
  'place-self-start': {
    'utility': {
      '-ms-grid-row-align': 'start',
      '-ms-grid-column-align': 'start',
      'place-self': 'start',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 2,
    },
  },
  'place-self-end': {
    'utility': {
      '-ms-grid-row-align': 'end',
      '-ms-grid-column-align': 'end',
      'place-self': 'end',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 3,
    },
  },
  'place-self-center': {
    'utility': {
      '-ms-grid-row-align': 'center',
      '-ms-grid-column-align': 'center',
      'place-self': 'center',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 4,
    },
  },
  'place-self-stretch': {
    'utility': {
      '-ms-grid-row-align': 'stretch',
      '-ms-grid-column-align': 'stretch',
      'place-self': 'stretch',
    },
    'meta': {
      'group': 'placeSelf',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/typography.html#font-smoothing
  'antialiased': {
    'utility': {
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
    },
    'meta': {
      'group': 'fontSmoothing',
      'order': 1,
    },
  },
  'subpixel-antialiased': {
    'utility': {
      '-webkit-font-smoothing': 'auto',
      '-moz-osx-font-smoothing': 'auto',
    },
    'meta': {
      'group': 'fontSmoothing',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/typography.html#font-style
  'italic': {
    'utility': {
      'font-style': 'italic',
    },
    'meta': {
      'group': 'fontStyle',
      'order': 1,
    },
  },
  'not-italic': {
    'utility': {
      'font-style': 'normal',
    },
    'meta': {
      'group': 'fontStyle',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/typography.html#font-variant-numeric
  'normal-nums': {
    'utility': {
      'font-variant-numeric': 'normal',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 1,
    },
  },
  'ordinal': {
    'utility': {
      ...fontVariants,
      '--tw-ordinal': 'ordinal',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 2,
    },
  },
  'slashed-zero': {
    'utility': {
      ...fontVariants,
      '--tw-slashed-zero': 'slashed-zero',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 3,
    },
  },
  'lining-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-figure': 'lining-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 4,
    },
  },
  'oldstyle-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-figure': 'oldstyle-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 5,
    },
  },
  'proportional-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-spacing': 'proportional-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 6,
    },
  },
  'tabular-nums': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-spacing': 'tabular-nums',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 7,
    },
  },
  'diagonal-fractions': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-fraction': 'diagonal-fractions',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 8,
    },
  },
  'stacked-fractions': {
    'utility': {
      ...fontVariants,
      '--tw-numeric-fraction': 'stacked-fractions',
    },
    'meta': {
      'group': 'fontVariantNumeric',
      'order': 9,
    },
  },

  // https://windicss.org/utilities/behaviors.html#list-style-position
  'list-inside': {
    'utility': {
      'list-style-position': 'inside',
    },
    'meta': {
      'group': 'listStylePosition',
      'order': 1,
    },
  },
  'list-outside': {
    'utility': {
      'list-style-position': 'outside',
    },
    'meta': {
      'group': 'listStylePosition',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/typography.html#text-alignment
  'text-left': {
    'utility': {
      'text-align': 'left',
    },
    'meta': {
      'group': 'textAlign',
      'order': 1,
    },
  },
  'text-center': {
    'utility': {
      'text-align': 'center',
    },
    'meta': {
      'group': 'textAlign',
      'order': 2,
    },
  },
  'text-right': {
    'utility': {
      'text-align': 'right',
    },
    'meta': {
      'group': 'textAlign',
      'order': 3,
    },
  },
  'text-justify': {
    'utility': {
      'text-align': 'justify',
    },
    'meta': {
      'group': 'textAlign',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/typography.html#text-decoration
  'underline': {
    'utility': {
      '-webkit-text-decoration-line': 'underline',
      'text-decoration-line': 'underline',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 1,
    },
  },
  'overline': {
    'utility': {
      '-webkit-text-decoration-line': 'overline',
      'text-decoration-line': 'overline',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 2,
    },
  },
  'line-through': {
    'utility': {
      '-webkit-text-decoration-line': 'line-through',
      'text-decoration-line': 'line-through',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 3,
    },
  },
  'no-underline': {
    'utility': {
      'text-decoration': 'none',
    },
    'meta': {
      'group': 'textDecoration',
      'order': 4,
    },
  },

  // http://localhost:3001/utilities/typography.html#text-decoration-style
  'decoration-solid': {
    'utility': {
      '-webkit-text-decoration-style': 'solid',
      'text-decoration-style': 'solid',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 1,
    },
  },
  'decoration-double': {
    'utility': {
      '-webkit-text-decoration-style': 'double',
      'text-decoration-style': 'double',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 2,
    },
  },
  'decoration-dotted': {
    'utility': {
      '-webkit-text-decoration-style': 'dotted',
      'text-decoration-style': 'dotted',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 3,
    },
  },
  'decoration-dashed': {
    'utility': {
      '-webkit-text-decoration-style': 'dashed',
      'text-decoration-style': 'dashed',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 4,
    },
  },
  'decoration-wavy': {
    'utility': {
      '-webkit-text-decoration-style': 'wavy',
      'text-decoration-style': 'wavy',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 5,
    },
  },

  // http://localhost:3001/utilities/typography.html#text-decoration-style - Fallback to .decoration-{style}
  'underline-solid': {
    'utility': {
      '-webkit-text-decoration-style': 'solid',
      'text-decoration-style': 'solid',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 1,
    },
  },
  'underline-double': {
    'utility': {
      '-webkit-text-decoration-style': 'double',
      'text-decoration-style': 'double',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 2,
    },
  },
  'underline-dotted': {
    'utility': {
      '-webkit-text-decoration-style': 'dotted',
      'text-decoration-style': 'dotted',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 3,
    },
  },
  'underline-dashed': {
    'utility': {
      '-webkit-text-decoration-style': 'dashed',
      'text-decoration-style': 'dashed',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 4,
    },
  },
  'underline-wavy': {
    'utility': {
      '-webkit-text-decoration-style': 'wavy',
      'text-decoration-style': 'wavy',
    },
    'meta': {
      'group': 'textDecorationStyle',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/typography.html#text-transform
  'uppercase': {
    'utility': {
      'text-transform': 'uppercase',
    },
    'meta': {
      'group': 'textTransform',
      'order': 1,
    },
  },
  'lowercase': {
    'utility': {
      'text-transform': 'lowercase',
    },
    'meta': {
      'group': 'textTransform',
      'order': 2,
    },
  },
  'capitalize': {
    'utility': {
      'text-transform': 'capitalize',
    },
    'meta': {
      'group': 'textTransform',
      'order': 3,
    },
  },
  'normal-case': {
    'utility': {
      'text-transform': 'none',
    },
    'meta': {
      'group': 'textTransform',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/typography.html#text-overflow
  'truncate': {
    'utility': {
      'overflow': 'hidden',
      '-o-text-overflow': 'ellipsis',
      'text-overflow': 'ellipsis',
      'white-space': 'nowrap',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 1,
    },
  },
  'overflow-ellipsis': { // deprecated
    'utility': {
      '-o-text-overflow': 'ellipsis',
      'text-overflow': 'ellipsis',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 2,
    },
  },
  'text-ellipsis': {
    'utility': {
      '-o-text-overflow': 'ellipsis',
      'text-overflow': 'ellipsis',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 3,
    },
  },
  'text-clip': {
    'utility': {
      '-o-text-overflow': 'clip',
      'text-overflow': 'clip',
    },
    'meta': {
      'group': 'textOverflow',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/typography.html#vertical-alignment
  'align-baseline': {
    'utility': {
      'vertical-align': 'baseline',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 1,
    },
  },
  'align-top': {
    'utility': {
      'vertical-align': 'top',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 2,
    },
  },
  'align-middle': {
    'utility': {
      'vertical-align': 'middle',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 3,
    },
  },
  'align-bottom': {
    'utility': {
      'vertical-align': 'bottom',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 4,
    },
  },
  'align-text-top': {
    'utility': {
      'vertical-align': 'text-top',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 5,
    },
  },
  'align-text-bottom': {
    'utility': {
      'vertical-align': 'text-bottom',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 6,
    },
  },
  'align-sub': {
    'utility': {
      'vertical-align': 'sub',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 7,
    },
  },
  'align-super': {
    'utility': {
      'vertical-align': 'super',
    },
    'meta': {
      'group': 'verticalAlign',
      'order': 8,
    },
  },

  // https://windicss.org/utilities/typography.html#whitespace
  'whitespace-normal': {
    'utility': {
      'white-space': 'normal',
    },
    'meta': {
      'group': 'whitespace',
      'order': 1,
    },
  },
  'whitespace-nowrap': {
    'utility': {
      'white-space': 'nowrap',
    },
    'meta': {
      'group': 'whitespace',
      'order': 2,
    },
  },
  'whitespace-pre': {
    'utility': {
      'white-space': 'pre',
    },
    'meta': {
      'group': 'whitespace',
      'order': 3,
    },
  },
  'whitespace-pre-line': {
    'utility': {
      'white-space': 'pre-line',
    },
    'meta': {
      'group': 'whitespace',
      'order': 4,
    },
  },
  'whitespace-pre-wrap': {
    'utility': {
      'white-space': 'pre-wrap',
    },
    'meta': {
      'group': 'whitespace',
      'order': 5,
    },
  },

  // https://windicss.org/utilities/typography.html#word-break
  'break-normal': {
    'utility': {
      'word-break': 'normal',
      'overflow-wrap': 'normal',
    },
    'meta': {
      'group': 'wordBreak',
      'order': 1,
    },
  },
  'break-words': {
    'utility': {
      'overflow-wrap': 'break-word',
    },
    'meta': {
      'group': 'wordBreak',
      'order': 2,
    },
  },
  'break-all': {
    'utility': {
      'word-break': 'break-all',
    },
    'meta': {
      'group': 'wordBreak',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/typography.html#writing-mode
  'write-normal': {
    'utility': {
      '-webkit-writing-mode': 'horizontal-tb',
      '-ms-writing-mode': 'lr-tb',
      'writing-mode': 'horizontal-tb',
    },
    'meta': {
      'group': 'writingMode',
      'order': 1,
    },
  },

  'write-vertical-right': {
    'utility': {
      '-webkit-writing-mode': 'vertical-rl',
      '-ms-writing-mode': 'tb-rl',
      'writing-mode': 'vertical-rl',
    },
    'meta': {
      'group': 'writingMode',
      'order': 2,
    },
  },

  'write-vertical-left': {
    'utility': {
      '-webkit-writing-mode': 'vertical-lr',
      '-ms-writing-mode': 'tb-lr',
      'writing-mode': 'vertical-lr',
    },
    'meta': {
      'group': 'writingMode',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/typography.html#writing-orientation
  'write-orient-mixed': {
    'utility': {
      '-webkit-text-orientation': 'mixed',
      'text-orientation': 'mixed',
    },
    'meta': {
      'group': 'writingMode',
      'order': 4,
    },
  },

  'write-orient-upright': {
    'utility': {
      '-webkit-text-orientation': 'upright',
      'text-orientation': 'upright',
    },
    'meta': {
      'group': 'writingMode',
      'order': 5,
    },
  },

  'write-orient-sideways': {
    'utility': {
      '-webkit-text-orientation': 'sideways',
      'text-orientation': 'sideways',
    },
    'meta': {
      'group': 'writingMode',
      'order': 6,
    },
  },

  // https://windicss.org/utilities/typography.html#hyphens
  'hyphens-none': {
    'utility': {
      '-webkit-hyphens': 'none',
      '-ms-hyphens': 'none',
      'hyphens': 'none',
    },
    'meta': {
      'group': 'hyphens',
      'order': 1,
    },
  },
  'hyphens-manual': {
    'utility': {
      '-webkit-hyphens': 'manual',
      '-ms-hyphens': 'manual',
      'hyphens': 'manual',
    },
    'meta': {
      'group': 'hyphens',
      'order': 2,
    },
  },
  'hyphens-auto': {
    'utility': {
      '-webkit-hyphens': 'auto',
      '-ms-hyphens': 'auto',
      'hyphens': 'auto',
    },
    'meta': {
      'group': 'hyphens',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/backgrounds.html#background-attachment
  'bg-fixed': {
    'utility': {
      'background-attachment': 'fixed',
    },
    'meta': {
      'group': 'backgroundAttachment',
      'order': 1,
    },
  },
  'bg-local': {
    'utility': {
      'background-attachment': 'local',
    },
    'meta': {
      'group': 'backgroundAttachment',
      'order': 2,
    },
  },
  'bg-scroll': {
    'utility': {
      'background-attachment': 'scroll',
    },
    'meta': {
      'group': 'backgroundAttachment',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/backgrounds.html#background-clip
  'bg-clip-border': {
    'utility': {
      '-webkit-background-clip': 'border-box',
      'background-clip': 'border-box',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 1,
    },
  },
  'bg-clip-padding': {
    'utility': {
      '-webkit-background-clip': 'padding-box',
      'background-clip': 'padding-box',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 2,
    },
  },
  'bg-clip-content': {
    'utility': {
      '-webkit-background-clip': 'content-box',
      'background-clip': 'content-box',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 3,
    },
  },
  'bg-clip-text': {
    'utility': {
      '-webkit-background-clip': 'text',
      'background-clip': 'text',
    },
    'meta': {
      'group': 'backgroundClip',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/backgrounds.html#background-repeat
  'bg-repeat': {
    'utility': {
      'background-repeat': 'repeat',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 1,
    },
  },
  'bg-no-repeat': {
    'utility': {
      'background-repeat': 'no-repeat',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 2,
    },
  },
  'bg-repeat-x': {
    'utility': {
      'background-repeat': 'repeat-x',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 3,
    },
  },
  'bg-repeat-y': {
    'utility': {
      'background-repeat': 'repeat-y',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 4,
    },
  },
  'bg-repeat-round': {
    'utility': {
      'background-repeat': 'round',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 5,
    },
  },
  'bg-repeat-space': {
    'utility': {
      'background-repeat': 'space',
    },
    'meta': {
      'group': 'backgroundRepeat',
      'order': 6,
    },
  },

  // https://windicss.org/utilities/backgrounds.html#background-origin
  'bg-origin-border': {
    'utility': {
      'background-origin': 'border-box',
    },
    'meta': {
      'group': 'backgroundOrigin',
      'order': 1,
    },
  },
  'bg-origin-padding': {
    'utility': {
      'background-origin': 'padding-box',
    },
    'meta': {
      'group': 'backgroundOrigin',
      'order': 2,
    },
  },
  'bg-origin-content': {
    'utility': {
      'background-origin': 'content-box',
    },
    'meta': {
      'group': 'backgroundOrigin',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/borders.html#border-style
  'border-solid': {
    'utility': {
      'border-style': 'solid',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 1,
    },
  },
  'border-dashed': {
    'utility': {
      'border-style': 'dashed',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 2,
    },
  },
  'border-dotted': {
    'utility': {
      'border-style': 'dotted',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 3,
    },
  },
  'border-double': {
    'utility': {
      'border-style': 'double',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 4,
    },
  },
  'border-none': {
    'utility': {
      'border-style': 'none',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 5,
    },
  },
  'border-hidden': {
    'utility': {
      'border-style': 'hidden',
    },
    'meta': {
      'group': 'borderStyle',
      'order': 6,
    },
  },

  // https://windicss.org/utilities/behaviors.html#image-rendering
  'image-render-auto': {
    'utility': {
      'image-rendering': 'auto',
    },
    'meta': {
      'group': 'imageRendering',
      'order': 1,
    },
  },
  'image-render-pixel': {
    'utility': {
      '-ms-interpolation-mode': 'nearest-neighbor',
      'image-rendering': ['-webkit-optimize-contrast', '-moz-crisp-edges', '-o-pixelated', 'pixelated'],
    },
    'meta': {
      'group': 'imageRendering',
      'order': 2,
    },
  },
  'image-render-edge': {
    'utility': {
      'image-rendering': 'crisp-edges',
    },
    'meta': {
      'group': 'imageRendering',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/effects.html#mix-blend-mode
  'mix-blend-normal': {
    'utility': {
      'mix-blend-mode': 'normal',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 1,
    },
  },
  'mix-blend-multiply': {
    'utility': {
      'mix-blend-mode': 'multiply',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 2,
    },
  },
  'mix-blend-screen': {
    'utility': {
      'mix-blend-mode': 'screen',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 3,
    },
  },
  'mix-blend-overlay': {
    'utility': {
      'mix-blend-mode': 'overlay',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 4,
    },
  },
  'mix-blend-darken': {
    'utility': {
      'mix-blend-mode': 'darken',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 5,
    },
  },
  'mix-blend-lighten': {
    'utility': {
      'mix-blend-mode': 'lighten',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 6,
    },
  },
  'mix-blend-color-dodge': {
    'utility': {
      'mix-blend-mode': 'color-dodge',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 7,
    },
  },
  'mix-blend-color-burn': {
    'utility': {
      'mix-blend-mode': 'color-burn',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 8,
    },
  },
  'mix-blend-hard-light': {
    'utility': {
      'mix-blend-mode': 'hard-light',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 9,
    },
  },
  'mix-blend-soft-light': {
    'utility': {
      'mix-blend-mode': 'soft-light',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 10,
    },
  },
  'mix-blend-difference': {
    'utility': {
      'mix-blend-mode': 'difference',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 11,
    },
  },
  'mix-blend-exclusion': {
    'utility': {
      'mix-blend-mode': 'exclusion',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 12,
    },
  },
  'mix-blend-hue': {
    'utility': {
      'mix-blend-mode': 'hue',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 13,
    },
  },
  'mix-blend-saturation': {
    'utility': {
      'mix-blend-mode': 'saturation',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 14,
    },
  },
  'mix-blend-color': {
    'utility': {
      'mix-blend-mode': 'color',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 15,
    },
  },
  'mix-blend-luminosity': {
    'utility': {
      'mix-blend-mode': 'luminosity',
    },
    'meta': {
      'group': 'mixBlendMode',
      'order': 16,
    },
  },
  // https://windicss.org/utilities/backgrounds.html#background-blend-mode
  'bg-blend-normal': {
    'utility': {
      'background-blend-mode': 'normal',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 1,
    },
  },
  'bg-blend-multiply': {
    'utility': {
      'background-blend-mode': 'multiply',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 2,
    },
  },
  'bg-blend-screen': {
    'utility': {
      'background-blend-mode': 'screen',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 3,
    },
  },
  'bg-blend-overlay': {
    'utility': {
      'background-blend-mode': 'overlay',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 4,
    },
  },
  'bg-blend-darken': {
    'utility': {
      'background-blend-mode': 'darken',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 5,
    },
  },
  'bg-blend-lighten': {
    'utility': {
      'background-blend-mode': 'lighten',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 6,
    },
  },
  'bg-blend-color-dodge': {
    'utility': {
      'background-blend-mode': 'color-dodge',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 7,
    },
  },
  'bg-blend-color-burn': {
    'utility': {
      'background-blend-mode': 'color-burn',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 8,
    },
  },
  'bg-blend-hard-light': {
    'utility': {
      'background-blend-mode': 'hard-light',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 9,
    },
  },
  'bg-blend-soft-light': {
    'utility': {
      'background-blend-mode': 'soft-light',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 10,
    },
  },
  'bg-blend-difference': {
    'utility': {
      'background-blend-mode': 'difference',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 11,
    },
  },
  'bg-blend-exclusion': {
    'utility': {
      'background-blend-mode': 'exclusion',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 12,
    },
  },
  'bg-blend-hue': {
    'utility': {
      'background-blend-mode': 'hue',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 13,
    },
  },
  'bg-blend-saturation': {
    'utility': {
      'background-blend-mode': 'saturation',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 14,
    },
  },
  'bg-blend-color': {
    'utility': {
      'background-blend-mode': 'color',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 15,
    },
  },
  'bg-blend-luminosity': {
    'utility': {
      'background-blend-mode': 'luminosity',
    },
    'meta': {
      'group': 'backgroundBlendMode',
      'order': 16,
    },
  },

  // https://windicss.org/utilities/filters.html#filter
  'filter': {
    'utility': {
      '--tw-blur': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-invert': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-drop-shadow': 'var(--tw-empty,/*!*/ /*!*/)',
      '-webkit-filter': 'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)',
      'filter': 'var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)',
    },
    'meta': {
      'group': 'filter',
      'order': 1,
    },
  },

  'filter-none': {
    'utility': {
      '-webkit-filter': 'none',
      'filter': 'none',
    },
    'meta': {
      'group': 'filter',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/filters.html#backdrop-filter
  'backdrop-filter': {
    'utility': {
      '--tw-backdrop-blur': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-brightness': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-contrast': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-grayscale': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-hue-rotate': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-invert': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-opacity': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-saturate': 'var(--tw-empty,/*!*/ /*!*/)',
      '--tw-backdrop-sepia': 'var(--tw-empty,/*!*/ /*!*/)',
      '-webkit-backdrop-filter': 'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)',
      'backdrop-filter': 'var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia)',
    },
    'meta': {
      'group': 'backdropFilter',
      'order': 1,
    },
  },

  'backdrop-filter-none': {
    'utility': {
      '-webkit-backdrop-filter': 'none',
      'backdrop-filter': 'none',
    },
    'meta': {
      'group': 'backdropFilter',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/tables.html#table-border-collapse
  'border-collapse': {
    'utility': {
      'border-collapse': 'collapse',
    },
    'meta': {
      'group': 'borderCollapse',
      'order': 1,
    },
  },
  'border-separate': {
    'utility': {
      'border-collapse': 'separate',
    },
    'meta': {
      'group': 'borderCollapse',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/tables.html#table-caption-side
  'caption-top': {
    'utility': {
      'caption-side': 'top',
    },
    'meta': {
      'group': 'captionSide',
      'order': 1,
    },
  },

  'caption-bottom': {
    'utility': {
      'caption-side': 'bottom',
    },
    'meta': {
      'group': 'captionSide',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/tables.html#table-empty-cells
  'empty-cells-visible': {
    'utility': {
      'empty-cells': 'show',
    },
    'meta': {
      'group': 'emptyCells',
      'order': 1,
    },
  },

  'empty-cells-hidden': {
    'utility': {
      'empty-cells': 'hide',
    },
    'meta': {
      'group': 'emptyCells',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/tables.html#table-layout
  'table-auto': {
    'utility': {
      'table-layout': 'auto',
    },
    'meta': {
      'group': 'tableLayout',
      'order': 1,
    },
  },
  'table-fixed': {
    'utility': {
      'table-layout': 'fixed',
    },
    'meta': {
      'group': 'tableLayout',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/transforms.html
  'transform': {
    'utility': {
      '--tw-translate-x': '0',
      '--tw-translate-y': '0',
      '--tw-translate-z': '0',
      '--tw-rotate': '0',
      '--tw-rotate-x': '0',
      '--tw-rotate-y': '0',
      '--tw-rotate-z': '0',
      '--tw-skew-x': '0',
      '--tw-skew-y': '0',
      '--tw-scale-x': '1',
      '--tw-scale-y': '1',
      '--tw-scale-z': '1',
      '-webkit-transform': 'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
      '-ms-transform': 'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
      'transform': 'translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
    },
    'meta': {
      'group': 'transform',
      'order': 1,
    },
  },
  'transform-gpu': {
    'utility': {
      '--tw-translate-x': '0',
      '--tw-translate-y': '0',
      '--tw-translate-z': '0',
      '--tw-rotate': '0',
      '--tw-rotate-x': '0',
      '--tw-rotate-y': '0',
      '--tw-rotate-z': '0',
      '--tw-skew-x': '0',
      '--tw-skew-y': '0',
      '--tw-scale-x': '1',
      '--tw-scale-y': '1',
      '--tw-scale-z': '1',
      '-webkit-transform': 'translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
      '-ms-transform': 'translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
      'transform': 'translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z))',
    },
    'meta': {
      'group': 'transform',
      'order': 2,
    },
  },
  'transform-none': {
    'utility': {
      '-webkit-transform': 'none',
      '-ms-transform': 'none',
      'transform': 'none',
    },
    'meta': {
      'group': 'transform',
      'order': 3,
    },
  },

  // https://windicss.org/utilities/transforms.html#transform-type
  'preserve-flat': {
    'utility': {
      '-webkit-transform-style': 'flat',
      'transform-style': 'flat',
    },
    'meta': {
      'group': 'transform',
      'order': 4,
    },
  },

  'preserve-3d': {
    'utility': {
      '-webkit-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    'meta': {
      'group': 'transform',
      'order': 5,
    },
  },

  'animated': {
    'utility': {
      '-webkit-animation-duration': '1000ms',
      '-webkit-animation-fill-mode': 'both',
      'animation-duration': '1000ms',
      'animation-fill-mode': 'both',
    },
    'meta': {
      'group': 'animation',
      'order': 3,
    },
  },

  'animate-reverse': {
    'utility': {
      '-webkit-animation-direction': 'reverse',
      'animation-direction': 'reverse',
    },
    'meta': {
      'group': 'animation',
      'order': 4,
    },
  },

  'animate-alternate': {
    'utility': {
      '-webkit-animation-direction': 'alternate',
      'animation-direction': 'alternate',
    },
    'meta': {
      'group': 'animation',
      'order': 5,
    },
  },

  'animate-alternate-reverse': {
    'utility': {
      '-webkit-animation-direction': 'alternate-reverse',
      'animation-direction': 'alternate-reverse',
    },
    'meta': {
      'group': 'animation',
      'order': 6,
    },
  },

  'animate-fill-none': {
    'utility': {
      '-webkit-animation-fill-mode': 'none',
      'animation-fill-mode': 'none',
    },
    'meta': {
      'group': 'animation',
      'order': 7,
    },
  },

  'animate-fill-forwards': {
    'utility': {
      '-webkit-animation-fill-mode': 'forwards',
      'animation-fill-mode': 'forwards',
    },
    'meta': {
      'group': 'animation',
      'order': 8,
    },
  },

  'animate-fill-backwards': {
    'utility': {
      '-webkit-animation-fill-mode': 'backwards',
      'animation-fill-mode': 'backwards',
    },
    'meta': {
      'group': 'animation',
      'order': 9,
    },
  },

  'animate-fill-both': {
    'utility': {
      '-webkit-animation-fill-mode': 'both',
      'animation-fill-mode': 'both',
    },
    'meta': {
      'group': 'animation',
      'order': 10,
    },
  },

  'animate-paused': {
    'utility': {
      '-webkit-animation-play-state': 'paused',
      'animation-play-state': 'paused',
    },
    'meta': {
      'group': 'animation',
      'order': 11,
    },
  },

  'animate-running': {
    'utility': {
      '-webkit-animation-play-state': 'running',
      'animation-play-state': 'running',
    },
    'meta': {
      'group': 'animation',
      'order': 12,
    },
  },

  // https://windicss.org/utilities/behaviors.html#appearance
  'appearance-none': {
    'utility': {
      '-webkit-appearance': 'none',
      '-moz-appearance': 'none',
      'appearance': 'none',
    },
    'meta': {
      'group': 'appearance',
      'order': 1,
    },
  },

  // https://windicss.org/utilities/behaviors.html#pointer-events
  'pointer-events-none': {
    'utility': {
      'pointer-events': 'none',
    },
    'meta': {
      'group': 'pointerEvents',
      'order': 1,
    },
  },
  'pointer-events-auto': {
    'utility': {
      'pointer-events': 'auto',
    },
    'meta': {
      'group': 'pointerEvents',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/behaviors.html#resize
  'resize-none': {
    'utility': {
      'resize': 'none',
    },
    'meta': {
      'group': 'resize',
      'order': 1,
    },
  },
  'resize-y': {
    'utility': {
      'resize': 'vertical',
    },
    'meta': {
      'group': 'resize',
      'order': 2,
    },
  },
  'resize-x': {
    'utility': {
      'resize': 'horizontal',
    },
    'meta': {
      'group': 'resize',
      'order': 3,
    },
  },
  'resize': {
    'utility': {
      'resize': 'both',
    },
    'meta': {
      'group': 'resize',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/behaviors.html#user-select
  'select-none': {
    'utility': {
      '-webkit-user-select': 'none',
      '-moz-user-select': 'none',
      '-ms-user-select': 'none',
      'user-select': 'none',
    },
    'meta': {
      'group': 'userSelect',
      'order': 1,
    },
  },
  'select-text': {
    'utility': {
      '-webkit-user-select': 'text',
      '-moz-user-select': 'text',
      '-ms-user-select': 'text',
      'user-select': 'text',
    },
    'meta': {
      'group': 'userSelect',
      'order': 2,
    },
  },
  'select-all': {
    'utility': {
      '-webkit-user-select': 'all',
      '-moz-user-select': 'all',
      '-ms-user-select': 'all',
      'user-select': 'all',
    },
    'meta': {
      'group': 'userSelect',
      'order': 3,
    },
  },
  'select-auto': {
    'utility': {
      '-webkit-user-select': 'auto',
      '-moz-user-select': 'auto',
      '-ms-user-select': 'auto',
      'user-select': 'auto',
    },
    'meta': {
      'group': 'userSelect',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/svg.html#fill-color
  // https://windicss.org/utilities/svg.html#stroke-color
  'fill-current': {
    'utility': {
      'fill': 'currentColor',
    },
    'meta': {
      'group': 'fill',
      'order': 1,
    },
  },
  'stroke-current': {
    'utility': {
      'stroke': 'currentColor',
    },
    'meta': {
      'group': 'stroke',
      'order': 1,
    },
  },
  // https://windicss.org/utilities/svg.html#stroke-linecap
  'stroke-cap-auto': {
    'utility': {
      'stroke-linecap': 'butt',
    },
    'meta': {
      'group': 'stroke',
      'order': 2,
    },
  },
  'stroke-cap-square': {
    'utility': {
      'stroke-linecap': 'square',
    },
    'meta': {
      'group': 'stroke',
      'order': 3,
    },
  },
  'stroke-cap-round': {
    'utility': {
      'stroke-linecap': 'round',
    },
    'meta': {
      'group': 'stroke',
      'order': 4,
    },
  },
  // https://windicss.org/utilities/svg.html#stroke-linejoin
  'stroke-join-auto': {
    'utility': {
      'stroke-linejoin': 'miter',
    },
    'meta': {
      'group': 'stroke',
      'order': 5,
    },
  },
  'stroke-join-arcs': {
    'utility': {
      'stroke-linejoin': 'arcs',
    },
    'meta': {
      'group': 'stroke',
      'order': 6,
    },
  },
  'stroke-join-bevel': {
    'utility': {
      'stroke-linejoin': 'bevel',
    },
    'meta': {
      'group': 'stroke',
      'order': 7,
    },
  },
  'stroke-join-clip': {
    'utility': {
      'stroke-linejoin': 'miter-clip',
    },
    'meta': {
      'group': 'stroke',
      'order': 8,
    },
  },
  'stroke-join-round': {
    'utility': {
      'stroke-linejoin': 'round',
    },
    'meta': {
      'group': 'stroke',
      'order': 9,
    },
  },
  // https://windicss.org/utilities/behaviors.html#screen-readers-access
  'sr-only': {
    'utility': {
      'position': 'absolute',
      'width': '1px',
      'height': '1px',
      'padding': '0',
      'margin': '-1px',
      'overflow': 'hidden',
      'clip': 'rect(0, 0, 0, 0)',
      'white-space': 'nowrap',
      'border-width': '0',
    },
    'meta': {
      'group': 'accessibility',
      'order': 1,
    },
  },
  'not-sr-only': {
    'utility': {
      'position': 'static',
      'width': 'auto',
      'height': 'auto',
      'padding': '0',
      'margin': '0',
      'overflow': 'visible',
      'clip': 'auto',
      'white-space': 'normal',
    },
    'meta': {
      'group': 'accessibility',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/behaviors.html#will-change
  'will-change-auto': {
    'utility': {
      'will-change': 'auto',
    },
    'meta': {
      'group': 'willChange',
      'order': 1,
    },
  },
  'will-change-scroll': {
    'utility': {
      'will-change': 'scroll',
    },
    'meta': {
      'group': 'willChange',
      'order': 2,
    },
  },
  'will-change-contents': {
    'utility': {
      'will-change': 'contents',
    },
    'meta': {
      'group': 'willChange',
      'order': 3,
    },
  },
  'will-change-transform': {
    'utility': {
      'will-change': 'transform',
    },
    'meta': {
      'group': 'willChange',
      'order': 4,
    },
  },

  // https://windicss.org/utilities/behaviors.html#touch-action
  'touch-auto': {
    'utility': {
      'touch-action': 'auto',
    },
    'meta': {
      'group': 'touchAction',
      'order': 1,
    },
  },
  'touch-none': {
    'utility': {
      'touch-action': 'none',
    },
    'meta': {
      'group': 'touchAction',
      'order': 2,
    },
  },
  'touch-pan-x': {
    'utility': {
      'touch-action': 'pan-x',
    },
    'meta': {
      'group': 'touchAction',
      'order': 3,
    },
  },
  'touch-pan-left': {
    'utility': {
      'touch-action': 'pan-left',
    },
    'meta': {
      'group': 'touchAction',
      'order': 4,
    },
  },
  'touch-pan-right': {
    'utility': {
      'touch-action': 'pan-right',
    },
    'meta': {
      'group': 'touchAction',
      'order': 5,
    },
  },
  'touch-pan-y': {
    'utility': {
      'touch-action': 'pan-y',
    },
    'meta': {
      'group': 'touchAction',
      'order': 6,
    },
  },
  'touch-pan-up': {
    'utility': {
      'touch-action': 'pan-up',
    },
    'meta': {
      'group': 'touchAction',
      'order': 7,
    },
  },
  'touch-pan-down': {
    'utility': {
      'touch-action': 'pan-down',
    },
    'meta': {
      'group': 'touchAction',
      'order': 8,
    },
  },
  'touch-pinch-zoom': {
    'utility': {
      'touch-action': 'pinch-zoom',
    },
    'meta': {
      'group': 'touchAction',
      'order': 9,
    },
  },
  'touch-manipulation': {
    'utility': {
      'touch-action': 'manipulation',
    },
    'meta': {
      'group': 'touchAction',
      'order': 10,
    },
  },

  // https://windicss.org/utilities/behaviors.html#scroll-behavior
  'scroll-auto': {
    'utility': {
      'scroll-behavior': 'auto',
    },
    'meta': {
      'group': 'scrollBehavior',
      'order': 1,
    },
  },
  'scroll-smooth': {
    'utility': {
      'scroll-behavior': 'smooth',
    },
    'meta': {
      'group': 'scrollBehavior',
      'order': 2,
    },
  },

  // https://windicss.org/utilities/borders/outline.html
  'outline-none': {
    'utility': {
      'outline': '2px solid transparent',
      'outline-offset': '2px',
    },
    'meta': {
      'group': 'outline',
      'order': 1,
    },
  },
  'outline': {
    'utility': {
      'outline-style': 'solid',
    },
    'meta': {
      'group': 'outline',
      'order': 2,
    },
  },
  'outline-dashed': {
    'utility': {
      'outline-style': 'dashed',
    },
    'meta': {
      'group': 'outline',
      'order': 3,
    },
  },
  'outline-dotted': {
    'utility': {
      'outline-style': 'dotted',
    },
    'meta': {
      'group': 'outline',
      'order': 4,
    },
  },
  'outline-double': {
    'utility': {
      'outline-style': 'double',
    },
    'meta': {
      'group': 'outline',
      'order': 5,
    },
  },
  'outline-hidden': {
    'utility': {
      'outline-style': 'hidden',
    },
    'meta': {
      'group': 'outline',
      'order': 6,
    },
  },
};

function _nullishCoalesce$4(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain$3(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



function isNumberLead(i) {
  return /^\d/.test(i) ? i : undefined;
}

function notNumberLead(i) {
  return /^\d/.test(i) ? undefined : i;
}

// https://windicss.org/utilities/container.html
function container(utility, { theme }) {
  if (utility.raw === 'container') {
    const className = utility.class;
    const baseStyle = new Container(utility.class, new Property('width', '100%'));
    const paddingDefault = toType(theme('container.padding'), 'string') ? toType(theme('container.padding'), 'string') : toType(theme('container.padding.DEFAULT'), 'string');

    if (paddingDefault) {
      baseStyle.add(new Property('padding-left', paddingDefault));
      baseStyle.add(new Property('padding-right', paddingDefault));
    }

    const center = theme('container.center');

    if (center && typeof center === 'boolean') {
      baseStyle.add(new Property(['margin-left', 'margin-right'], 'auto'));
    }

    const output = [baseStyle];
    const screens = toType(theme('container.screens', theme('screens')), 'object');

    for (const [screen, size] of Object.entries(screens)) {
      if (!isString(size)) continue;
      const props = [new Property('max-width', `${size}`)];
      const padding = theme(`container.padding.${screen}`);
      if (padding && typeof padding === 'string') {
        props.push(new Property('padding-left', padding));
        props.push(new Property('padding-right', padding));
      }
      output.push(new Container(className, props).atRule(`@media (min-width: ${size})`));
    }

    output.forEach(style => style.updateMeta('utilities', 'container', pluginOrder.container, 0, true));

    return output;
  }
}

// https://windicss.org/utilities/positioning.html#object-position
function objectPosition(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _ => _.handler
, 'access', _2 => _2.handleBody, 'call', _3 => _3(theme('objectPosition'))
, 'access', _4 => _4.createProperty, 'call', _5 => _5(['-o-object-position', 'object-position'])
, 'optionalAccess', _6 => _6.updateMeta, 'call', _7 => _7('utilities', 'objectPosition', pluginOrder.objectPosition, 0, true)]);
}

// https://windicss.org/utilities/positioning.html#top-right-bottom-left
function inset(utility, { theme }) {
  return utility.handler
    .handleStatic(theme('inset'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .callback(value => {
      switch (utility.identifier) {
      case 'top':
      case 'right':
      case 'bottom':
      case 'left':
        return new Property(utility.identifier, value).updateMeta('utilities', 'inset', pluginOrder.inset, 4, true);
      case 'inset':
        if (utility.raw.match(/^-?inset-x/)) return new Property(['right', 'left'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 3, true);
        if (utility.raw.match(/^-?inset-y/)) return new Property(['top', 'bottom'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 2, true);
        return new Property(['top', 'right', 'bottom', 'left'], value).updateMeta('utilities', 'inset', pluginOrder.inset, 1, true);
      }
    });
}

// https://windicss.org/utilities/positioning.html#z-index
function zIndex(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _8 => _8.handler
, 'access', _9 => _9.handleStatic, 'call', _10 => _10(theme('zIndex'))
, 'access', _11 => _11.handleNumber, 'call', _12 => _12(0, 99999, 'int')
, 'access', _13 => _13.handleNegative, 'call', _14 => _14()
, 'access', _15 => _15.handleVariable, 'call', _16 => _16()
, 'access', _17 => _17.createProperty, 'call', _18 => _18('z-index')
, 'optionalAccess', _19 => _19.updateMeta, 'call', _20 => _20('utilities', 'zIndex', pluginOrder.zIndex, 0, true)]);
}

// https://windicss.org/utilities/flexbox.html#flex
// https://windicss.org/utilities/flexbox.html#flex-grow
// https://windicss.org/utilities/flexbox.html#flex-shrink
function flex(utility, { theme }) {
  const className = utility.raw;
  if (className.startsWith('flex-grow')) {
    const map = toType(theme('flexGrow'), 'object') ;
    const amount = className.replace(/flex-grow-?/, '') || 'DEFAULT';
    if (Object.keys(map).includes(amount)) return new Property(['-webkit-box-flex', '-ms-flex-positive', '-webkit-flex-grow', 'flex-grow'], map[amount]).toStyle(utility.class).updateMeta('utilities', 'flexGrow', pluginOrder.flexGrow, 0, true);
    return _optionalChain$3([utility, 'access', _21 => _21.handler, 'access', _22 => _22.handleSquareBrackets, 'call', _23 => _23(), 'access', _24 => _24.createProperty, 'call', _25 => _25(['-webkit-box-flex', '-ms-flex-positive', '-webkit-flex-grow', 'flex-grow']), 'optionalAccess', _26 => _26.updateMeta, 'call', _27 => _27('utilities', 'flexGrow', pluginOrder.flexGrow, 1, true)]);
  } else if (className.startsWith('flex-shrink')) {
    const map = toType(theme('flexShrink'), 'object') ;
    const amount = className.replace(/flex-shrink-?/, '') || 'DEFAULT';
    if (Object.keys(map).includes(amount)) return new Property(['-ms-flex-negative', '-webkit-flex-shrink', 'flex-shrink'], map[amount]).toStyle(utility.class).updateMeta('utilities', 'flexShrink', pluginOrder.flexShrink, 0, true);
    return _optionalChain$3([utility, 'access', _28 => _28.handler, 'access', _29 => _29.handleSquareBrackets, 'call', _30 => _30(), 'access', _31 => _31.createProperty, 'call', _32 => _32(['-ms-flex-negative', '-webkit-flex-shrink', 'flex-shrink']), 'optionalAccess', _33 => _33.updateMeta, 'call', _34 => _34('utilities', 'flexShrink', pluginOrder.flexShrink, 1, true)]);
  } else {
    return _optionalChain$3([utility, 'access', _35 => _35.handler, 'access', _36 => _36.handleStatic, 'call', _37 => _37(theme('flex')), 'access', _38 => _38.handleSquareBrackets, 'call', _39 => _39(), 'access', _40 => _40.createStyle, 'call', _41 => _41(utility.class, value => {
      value = value.trim();
      return [
        new Property('-webkit-box-flex', value.startsWith('0') || value === 'none' ? '0' : '1'),
        new Property(['-ms-flex', '-webkit-flex', 'flex'], value),
      ];
    }), 'optionalAccess', _42 => _42.updateMeta, 'call', _43 => _43('utilities', 'flex', pluginOrder.flex, 0, true)]);
  }
}

// https://windicss.org/utilities/flexbox.html#flex-basis
function basis(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _44 => _44.handler
, 'access', _45 => _45.handleStatic, 'call', _46 => _46(theme('spacing'))
, 'access', _47 => _47.handleNumber, 'call', _48 => _48(1, Infinity, undefined, number => `${number / 4}rem`)
, 'access', _49 => _49.handleSize, 'call', _50 => _50()
, 'access', _51 => _51.handleFraction, 'call', _52 => _52()
, 'access', _53 => _53.handleVariable, 'call', _54 => _54()
, 'access', _55 => _55.handleSquareBrackets, 'call', _56 => _56()
, 'access', _57 => _57.createProperty, 'call', _58 => _58('flex-basis')
, 'optionalAccess', _59 => _59.updateMeta, 'call', _60 => _60('utilities', 'flexBasis', pluginOrder.flexBasis, 1, true)]);
}

// https://windicss.org/utilities/positioning.html#order
function order(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _61 => _61.handler
, 'access', _62 => _62.handleStatic, 'call', _63 => _63(theme('order'))
, 'access', _64 => _64.handleNumber, 'call', _65 => _65(1, 9999, 'int')
, 'access', _66 => _66.handleNegative, 'call', _67 => _67()
, 'access', _68 => _68.handleVariable, 'call', _69 => _69()
, 'access', _70 => _70.createStyle, 'call', _71 => _71(utility.class, (value) => [
      new Property('-webkit-box-ordinal-group', value.includes('var') ? `calc(${value}+1)` : (parseInt(value) + 1).toString()),
      new Property(['-webkit-order', '-ms-flex-order', 'order'], value),
    ])
, 'optionalAccess', _72 => _72.updateMeta, 'call', _73 => _73('utilities', 'order', pluginOrder.order, utility.raw.charAt(0) === '-' ? 2 : 1, true)]);
}

// https://windicss.org/utilities/grid.html#grid-template-columns
// https://windicss.org/utilities/grid.html#grid-template-rows
function gridTemplate(utility, { theme }) {
  const type = utility.raw.match(/^grid-rows-/) ? 'rows' : utility.raw.match(/^grid-cols-/) ? 'columns' : undefined;
  if (!type) return;
  const group = type === 'rows' ? 'gridTemplateRows' : 'gridTemplateColumns';
  return _optionalChain$3([utility, 'access', _74 => _74.handler
, 'access', _75 => _75.handleStatic, 'call', _76 => _76(theme(group))
, 'access', _77 => _77.handleSquareBrackets, 'call', _78 => _78(i => i
      .replace(/\(.*?\)|,/g, (r) => r === ',' ? ' ' : r /* ignore content inside nested-brackets */)
      .replace(/_/g, ' ')
    )
, 'access', _79 => _79.createProperty, 'call', _80 => _80(`grid-template-${type}`, (value) => value === 'none' ? 'none' : value)
, 'optionalAccess', _81 => _81.updateMeta, 'call', _82 => _82('utilities', group, pluginOrder[group], 1, true)])
    || _optionalChain$3([utility, 'access', _83 => _83.handler
, 'access', _84 => _84.handleNumber, 'call', _85 => _85(1, undefined, 'int')
, 'access', _86 => _86.handleVariable, 'call', _87 => _87()
, 'access', _88 => _88.createProperty, 'call', _89 => _89(`grid-template-${type}`, (value) => `repeat(${value}, minmax(0, 1fr))`)
, 'optionalAccess', _90 => _90.updateMeta, 'call', _91 => _91('utilities', group, pluginOrder[group], 2, true)]);
}

// https://windicss.org/utilities/grid.html#grid-column-span
// https://windicss.org/utilities/grid.html#grid-column-start
// https://windicss.org/utilities/grid.html#grid-column-end
function gridColumn(utility, { theme }) {
  const body = utility.body;
  // col span
  const spans = toType(theme('gridColumn'), 'object') ;
  if (Object.keys(spans).includes(body)) return new Property(['-ms-grid-column-span', 'grid-column'], spans[body]).updateMeta('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true);
  if (utility.raw.startsWith('col-span')) {
    return _optionalChain$3([utility, 'access', _92 => _92.handler
, 'access', _93 => _93.handleNumber, 'call', _94 => _94(1, undefined, 'int')
, 'access', _95 => _95.handleVariable, 'call', _96 => _96()
, 'access', _97 => _97.createProperty, 'call', _98 => _98(['-ms-grid-column-span', 'grid-column'], (value) => `span ${value} / span ${value}`)
, 'optionalAccess', _99 => _99.updateMeta, 'call', _100 => _100('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true)]);
  }
  // col end
  if (utility.raw.startsWith('col-end')) {
    return _optionalChain$3([utility, 'access', _101 => _101.handler
, 'access', _102 => _102.handleStatic, 'call', _103 => _103(theme('gridColumnEnd'))
, 'access', _104 => _104.handleSquareBrackets, 'call', _105 => _105()
, 'access', _106 => _106.handleNumber, 'call', _107 => _107(1, undefined, 'int')
, 'access', _108 => _108.handleVariable, 'call', _109 => _109()
, 'access', _110 => _110.createProperty, 'call', _111 => _111('grid-column-end')
, 'optionalAccess', _112 => _112.updateMeta, 'call', _113 => _113('utilities', 'gridColumnEnd', pluginOrder.gridColumnEnd, 1, true)]);
  }
  // col start
  if (utility.raw.startsWith('col-start')) {
    return _optionalChain$3([utility, 'access', _114 => _114.handler
, 'access', _115 => _115.handleStatic, 'call', _116 => _116(theme('gridColumnStart'))
, 'access', _117 => _117.handleSquareBrackets, 'call', _118 => _118()
, 'access', _119 => _119.handleNumber, 'call', _120 => _120(1, undefined, 'int')
, 'access', _121 => _121.handleVariable, 'call', _122 => _122()
, 'access', _123 => _123.createProperty, 'call', _124 => _124('grid-column-start')
, 'optionalAccess', _125 => _125.updateMeta, 'call', _126 => _126('utilities', 'gridColumnStart', pluginOrder.gridColumnStart, 1, true)]);
  }
  return _optionalChain$3([utility, 'access', _127 => _127.handler
, 'access', _128 => _128.handleSquareBrackets, 'call', _129 => _129()
, 'access', _130 => _130.createProperty, 'call', _131 => _131(['-ms-grid-column-span', 'grid-column'], (value) => `span ${value} / span ${value}`)
, 'optionalAccess', _132 => _132.updateMeta, 'call', _133 => _133('utilities', 'gridColumn', pluginOrder.gridColumn, 1, true)]);
}

// https://windicss.org/utilities/grid.html#grid-row-span
// https://windicss.org/utilities/grid.html#grid-row-start
// https://windicss.org/utilities/grid.html#grid-row-end
function gridRow(utility, { theme }) {
  const body = utility.body;
  // row span
  const spans = toType(theme('gridRow'), 'object') ;
  if (Object.keys(spans).includes(body)) return new Property(['-ms-grid-row-span', 'grid-row'], spans[body]).updateMeta('utilities', 'gridRow', pluginOrder.gridRow, 1, true);
  if (utility.raw.startsWith('row-span')) {
    return _optionalChain$3([utility, 'access', _134 => _134.handler
, 'access', _135 => _135.handleNumber, 'call', _136 => _136(1, undefined, 'int')
, 'access', _137 => _137.handleVariable, 'call', _138 => _138()
, 'access', _139 => _139.createProperty, 'call', _140 => _140(['-ms-grid-row-span', 'grid-row'], (value) => `span ${value} / span ${value}`)
, 'optionalAccess', _141 => _141.updateMeta, 'call', _142 => _142('utilities', 'gridRow', pluginOrder.gridRow, 2, true)]);
  }
  // row end
  if (utility.raw.startsWith('row-end')) {
    return _optionalChain$3([utility, 'access', _143 => _143.handler
, 'access', _144 => _144.handleStatic, 'call', _145 => _145(theme('gridRowEnd'))
, 'access', _146 => _146.handleSquareBrackets, 'call', _147 => _147()
, 'access', _148 => _148.handleNumber, 'call', _149 => _149(1, undefined, 'int')
, 'access', _150 => _150.handleVariable, 'call', _151 => _151()
, 'access', _152 => _152.createProperty, 'call', _153 => _153('grid-row-end')
, 'optionalAccess', _154 => _154.updateMeta, 'call', _155 => _155('utilities', 'gridRowEnd', pluginOrder.gridRowEnd, 1, true)]);
  }
  // row start
  if (utility.raw.startsWith('row-start')) {
    return _optionalChain$3([utility, 'access', _156 => _156.handler
, 'access', _157 => _157.handleStatic, 'call', _158 => _158(theme('gridRowStart'))
, 'access', _159 => _159.handleSquareBrackets, 'call', _160 => _160()
, 'access', _161 => _161.handleNumber, 'call', _162 => _162(1, undefined, 'int')
, 'access', _163 => _163.handleVariable, 'call', _164 => _164()
, 'access', _165 => _165.createProperty, 'call', _166 => _166('grid-row-start')
, 'optionalAccess', _167 => _167.updateMeta, 'call', _168 => _168('utilities', 'gridRowStart', pluginOrder.gridRowStart, 1, true)]);
  }
  return _optionalChain$3([utility, 'access', _169 => _169.handler
, 'access', _170 => _170.handleSquareBrackets, 'call', _171 => _171()
, 'access', _172 => _172.createProperty, 'call', _173 => _173(['-ms-grid-row-span', 'grid-row'], (value) => `span ${value} / span ${value}`)
, 'optionalAccess', _174 => _174.updateMeta, 'call', _175 => _175('utilities', 'gridRow', pluginOrder.gridRow, 2, true)]);
}

// https://windicss.org/utilities/grid.html#grid-auto-columns
// https://windicss.org/utilities/grid.html#grid-auto-rows
function gridAuto(utility, { theme }) {
  const type = utility.raw.startsWith('auto-cols') ? 'columns' : utility.raw.startsWith('auto-rows') ? 'rows' : undefined;
  if (!type) return;
  const group = type === 'columns' ? 'gridAutoColumns' : 'gridAutoRows';
  const value = utility.handler.handleStatic(theme(group)).value;
  if (value) {
    const prefixer = minMaxContent(value);
    if (typeof prefixer === 'string') return new Property(`grid-auto-${type}`, prefixer).updateMeta('utilities', group, pluginOrder[group], 1, true);
    return new Style(utility.class, prefixer.map((i) => new Property(`grid-auto-${type}`, i))).updateMeta('utilities', group, pluginOrder[group], 2, true);
  }
}

// https://windicss.org/utilities/grid.html#gap
function gap(utility, { theme, config }) {
  return utility.handler
    .handleStatic(theme('gap'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleSize()
    .handleVariable()
    .callback(value => {
      if (utility.raw.match(/^gap-x-/)) return new Property(config('prefixer') ? ['-webkit-column-gap', '-moz-column-gap', 'grid-column-gap', 'column-gap'] : 'column-gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 2, true);
      if (utility.raw.match(/^gap-y-/)) return new Property(config('prefixer') ? ['-webkit-row-gap', '-moz-row-gap', 'grid-row-gap', 'row-gap'] : 'row-gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 3, true);
      return new Property(config('prefixer') ? ['grid-gap', 'gap'] : 'gap', value).updateMeta('utilities', 'gap', pluginOrder.gap, 1, true);
    });
}

// https://windicss.org/utilities/columns.html
function columns(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _176 => _176.handler
, 'access', _177 => _177.handleStatic, 'call', _178 => _178(theme('columns'))
, 'access', _179 => _179.handleSquareBrackets, 'call', _180 => _180()
, 'access', _181 => _181.handleSize, 'call', _182 => _182()
, 'access', _183 => _183.handleNxl, 'call', _184 => _184((number) => `${(number - 3) * 8 + 48}rem`)
, 'access', _185 => _185.handleVariable, 'call', _186 => _186()
, 'access', _187 => _187.createProperty, 'call', _188 => _188('columns')
, 'optionalAccess', _189 => _189.updateMeta, 'call', _190 => _190('utilities', 'columns', pluginOrder.columns, 1, true)]);
}

// https://windicss.org/utilities/spacing.html#padding
function padding(utility, { theme }) {
  return utility.handler
    .handleStatic(theme('padding'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleVariable()
    .callback(value => {
      const directions = expandDirection(utility.identifier.substring(1), false);
      if (directions) {
        if (directions[0] === '*') return new Property('padding', value).updateMeta('utilities', 'padding', pluginOrder.padding, -4, true);
        return new Property(directions.map((i) => `padding-${i}`), value).updateMeta('utilities', 'padding', pluginOrder.padding, -directions.length, true);
      }
    });
}

// https://windicss.org/utilities/spacing.html#margin
function margin(utility, { theme }) {
  return utility.handler
    .handleStatic(theme('margin'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleFraction()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .callback(value => {
      const directions = expandDirection(utility.identifier.substring(1), false);
      if (directions) {
        if (directions[0] === '*') return new Property('margin', value).updateMeta('utilities', 'margin', pluginOrder.margin, -4, true);
        return new Property(directions.map((i) => `margin-${i}`), value).updateMeta('utilities', 'margin', pluginOrder.margin, -directions.length, true);
      }
    });
}

// https://windicss.org/utilities/spacing.html#space-between-y
function space(utility, { theme }) {
  if (utility.raw === 'space-x-reverse') {
    return new Style(utility.class, [
      new Property('--tw-space-x-reverse', '1'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, 6, true);
  }
  if (utility.raw === 'space-y-reverse') {
    return new Style(utility.class, [
      new Property('--tw-space-y-reverse', '1'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, 5, true);
  }
  return utility.handler
    .handleStatic(theme('space'))
    .handleSquareBrackets()
    .handleSpacing()
    .handleSize()
    .handleNegative()
    .handleVariable()
    .callback(value => {
      if (utility.raw.match(/^-?space-x-/)) {
        return new Style(utility.class, [
          new Property('--tw-space-x-reverse', '0'),
          new Property('margin-right', `calc(${value} * var(--tw-space-x-reverse))`),
          new Property('margin-left', `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`),
        ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, (utility.raw.charAt(0) === '-' ? 4 : 2), true);
      }
      if (utility.raw.match(/^-?space-y-/)) {
        return new Style(utility.class, [
          new Property('--tw-space-y-reverse', '0'),
          new Property('margin-top', `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`),
          new Property('margin-bottom', `calc(${value} * var(--tw-space-y-reverse))`),
        ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'space', pluginOrder.space, (utility.raw.charAt(0) === '-' ? 3 : 1), true);
      }
    });
}

// https://windicss.org/utilities/sizing.html#width
// https://windicss.org/utilities/sizing.html#height
function size(utility, { theme }) {
  const name = utility.identifier === 'w' ? 'width' : 'height';
  const body = utility.body;
  const sizes = toType(theme(name), 'object') ;
  // handle static
  if (Object.keys(sizes).includes(body)) {
    const value = sizes[body];
    if (value === 'min-content') {
      return new Style(utility.class, [
        new Property(name, '-webkit-min-content'),
        new Property(name, '-moz-min-content'),
        new Property(name, 'min-content'),
      ]).updateMeta('utilities', name, pluginOrder[name], 2, true);
    }
    if (value === 'max-content') {
      return new Style(utility.class, [
        new Property(name, '-webkit-max-content'),
        new Property(name, '-moz-max-content'),
        new Property(name, 'max-content'),
      ]).updateMeta('utilities', name, pluginOrder[name], 3, true);
    }
    return new Style(utility.class, new Property(name, value)).updateMeta('utilities', name, pluginOrder[name], 1, true);
  }
  return _optionalChain$3([utility, 'access', _191 => _191.handler
, 'access', _192 => _192.handleSquareBrackets, 'call', _193 => _193()
, 'access', _194 => _194.handleSpacing, 'call', _195 => _195()
, 'access', _196 => _196.handleFraction, 'call', _197 => _197()
, 'access', _198 => _198.handleSize, 'call', _199 => _199()
, 'access', _200 => _200.handleNxl, 'call', _201 => _201((number) => `${(number - 3) * 8 + 48}rem`)
, 'access', _202 => _202.handleVariable, 'call', _203 => _203()
, 'access', _204 => _204.createProperty, 'call', _205 => _205(name)
, 'optionalAccess', _206 => _206.updateMeta, 'call', _207 => _207('utilities', name, pluginOrder[name], 4, true)]);
}

// https://windicss.org/utilities/sizing.html#min-width
// https://windicss.org/utilities/sizing.html#min-height
// https://windicss.org/utilities/sizing.html#max-width
// https://windicss.org/utilities/sizing.html#max-height
function minMaxSize(utility, { theme }) {
  if (!utility.raw.match(/^(min|max)-[w|h]-/))
    return;
  const body = utility.raw.replace(/^(min|max)-[w|h]-/, '');
  const prop = utility.raw.substring(0, 5).replace('h', 'height').replace('w', 'width');
  const group = dashToCamel(prop) ;
  const sizes = toType(theme(group), 'object') ;
  // handle static
  if (Object.keys(sizes).includes(body)) {
    const value = sizes[body];
    if (value === 'min-content') {
      return new Style(utility.class, [
        new Property(prop, '-webkit-min-content'),
        new Property(prop, '-moz-min-content'),
        new Property(prop, 'min-content'),
      ]).updateMeta('utilities', group, pluginOrder[group], 2, true);
    }
    if (value === 'max-content') {
      return new Style(utility.class, [
        new Property(prop, '-webkit-max-content'),
        new Property(prop, '-moz-max-content'),
        new Property(prop, 'max-content'),
      ]).updateMeta('utilities', group, pluginOrder[group], 3, true);
    }
    return new Style(utility.class, new Property(prop, value)).updateMeta('utilities', group, pluginOrder[group], 1, true);
  }

  return _optionalChain$3([utility, 'access', _208 => _208.handler
, 'access', _209 => _209.handleSquareBrackets, 'call', _210 => _210()
, 'access', _211 => _211.handleSpacing, 'call', _212 => _212()
, 'access', _213 => _213.handleFraction, 'call', _214 => _214()
, 'access', _215 => _215.handleSize, 'call', _216 => _216()
, 'access', _217 => _217.handleNxl, 'call', _218 => _218((number) => `${(number - 3) * 8 + 48}rem`)
, 'access', _219 => _219.handleVariable, 'call', _220 => _220()
, 'access', _221 => _221.createProperty, 'call', _222 => _222(prop)
, 'optionalAccess', _223 => _223.updateMeta, 'call', _224 => _224('utilities', group, pluginOrder[group], 4, true)]);
}

// https://windicss.org/utilities/typography.html#text-opacity
// https://windicss.org/utilities/typography.html#text-shadow
// https://windicss.org/utilities/typography.html#text-stroke
// https://windicss.org/utilities/typography.html#text-color
// https://windicss.org/utilities/typography.html#font-size
function text(utility, { theme }) {
  // handle font opacity
  if (utility.raw.startsWith('text-opacity')) {
    return _optionalChain$3([utility, 'access', _225 => _225.handler
, 'access', _226 => _226.handleStatic, 'call', _227 => _227(theme('textOpacity'))
, 'access', _228 => _228.handleNumber, 'call', _229 => _229(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _230 => _230.handleVariable, 'call', _231 => _231()
, 'access', _232 => _232.createProperty, 'call', _233 => _233('--tw-text-opacity')
, 'optionalAccess', _234 => _234.updateMeta, 'call', _235 => _235('utilities', 'textOpacity', pluginOrder.textOpacity, 1, true)]);
  }
  if (utility.raw.startsWith('text-shadow')) {
    return _optionalChain$3([(utility.raw === 'text-shadow'
      ? new Property('text-shadow', theme('textShadow.DEFAULT', '0px 0px 1px rgb(0 0 0 / 20%), 0px 0px 1px rgb(1 0 5 / 10%)') )
      : utility.handler
        .handleStatic(theme('textShadow'))
        .createProperty('text-shadow')
    ), 'optionalAccess', _236 => _236.updateMeta, 'call', _237 => _237('utilities', 'textShadow', pluginOrder.textShadow, 1, true)]);
  }
  if (utility.raw.startsWith('text-stroke')) {
    if (utility.raw === 'text-stroke') return new Style('text-stroke', [
      new Property('-webkit-text-stroke-color', theme('textStrokeColor.DEFAULT', '#e4e4e7') ),
      new Property('-webkit-text-stroke-width', theme('textStrokeWidth.DEFAULT', 'medium') ),
    ]).updateMeta('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 1, true);

    if (utility.raw.startsWith('text-stroke-opacity')) {
      return _optionalChain$3([utility, 'access', _238 => _238.handler
, 'access', _239 => _239.handleStatic, 'call', _240 => _240(theme('opacity'))
, 'access', _241 => _241.handleNumber, 'call', _242 => _242(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _243 => _243.handleVariable, 'call', _244 => _244()
, 'access', _245 => _245.createProperty, 'call', _246 => _246('--tw-ring-offset-opacity')
, 'optionalAccess', _247 => _247.updateMeta, 'call', _248 => _248('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 3, true)]);
    }

    return _optionalChain$3([utility, 'access', _249 => _249.clone, 'call', _250 => _250('textStroke' + utility.raw.slice(11)), 'access', _251 => _251.handler
, 'access', _252 => _252.handleColor, 'call', _253 => _253(theme('textStrokeColor'))
, 'access', _254 => _254.handleOpacity, 'call', _255 => _255(theme('opacity'))
, 'access', _256 => _256.handleVariable, 'call', _257 => _257()
, 'access', _258 => _258.createColorStyle, 'call', _259 => _259(utility.class, '-webkit-text-stroke-color', '--tw-text-stroke-opacity')
, 'optionalAccess', _260 => _260.updateMeta, 'call', _261 => _261('utilities', 'textStrokeColor', pluginOrder.textStrokeColor, 2, true)])
      || _optionalChain$3([utility, 'access', _262 => _262.handler
, 'access', _263 => _263.handleStatic, 'call', _264 => _264(theme('textStrokeWidth'))
, 'access', _265 => _265.handleNumber, 'call', _266 => _266(0, undefined, 'int', (number) => `${number}px`)
, 'access', _267 => _267.handleSize, 'call', _268 => _268()
, 'access', _269 => _269.createProperty, 'call', _270 => _270('-webkit-text-stroke-width')
, 'optionalAccess', _271 => _271.updateMeta, 'call', _272 => _272('utilities', 'textStrokeWidth', pluginOrder.textStrokeWidth, 1, true)]);
  }
  // handle text colors
  const textColor = _optionalChain$3([utility, 'access', _273 => _273.handler
, 'access', _274 => _274.handleColor, 'call', _275 => _275(theme('textColor'))
, 'access', _276 => _276.handleOpacity, 'call', _277 => _277(theme('textOpacity'))
, 'access', _278 => _278.handleSquareBrackets, 'call', _279 => _279(notNumberLead)
, 'access', _280 => _280.handleVariable, 'call', _281 => _281()
, 'access', _282 => _282.createColorStyle, 'call', _283 => _283(utility.class, 'color', '--tw-text-opacity')
, 'optionalAccess', _284 => _284.updateMeta, 'call', _285 => _285('utilities', 'textColor', pluginOrder.textColor, 0, true)]);
  if (textColor) return textColor;

  // handle font sizes
  const amount = utility.amount;
  const fontSizes = toType(theme('fontSize'), 'object') ;
  if (Object.keys(fontSizes).includes(amount)) return new Style(utility.class, generateFontSize(fontSizes[amount])).updateMeta('utilities', 'fontSize', pluginOrder.fontSize, 1, true);
  let value = utility.handler
    .handleSquareBrackets(isNumberLead)
    .handleNxl((number) => `${number}rem`)
    .handleSize()
    .value;
  if (utility.raw.startsWith('text-size-$')) value = utility.handler.handleVariable().value;
  if (value) return new Style(utility.class, [new Property('font-size', value), new Property('line-height', '1')]).updateMeta('utilities', 'fontSize', pluginOrder.fontSize, 2, true);
}

// https://windicss.org/utilities/typography.html#font-family
// https://windicss.org/utilities/typography.html#font-weight
function font(utility, { theme }) {
  const fonts = theme('fontFamily') ;
  const map = {};
  for (const [key, value] of Object.entries(fonts)) {
    map[key] = Array.isArray(value) ? value.join(',') : value;
  }
  return (
    _optionalChain$3([utility, 'access', _286 => _286.handler
, 'access', _287 => _287.handleStatic, 'call', _288 => _288(map)
, 'access', _289 => _289.createProperty, 'call', _290 => _290('font-family')
, 'optionalAccess', _291 => _291.updateMeta, 'call', _292 => _292('utilities', 'fontFamily', pluginOrder.fontFamily, 1, true)])
    || _optionalChain$3([utility, 'access', _293 => _293.handler
, 'access', _294 => _294.handleStatic, 'call', _295 => _295(theme('fontWeight'))
, 'access', _296 => _296.handleNumber, 'call', _297 => _297(0, 900, 'int')
, 'access', _298 => _298.handleVariable, 'call', _299 => _299()
, 'access', _300 => _300.createProperty, 'call', _301 => _301('font-weight')
, 'optionalAccess', _302 => _302.updateMeta, 'call', _303 => _303('utilities', 'fontWeight', pluginOrder.fontWeight, 1, true)])
  );
}

// https://windicss.org/utilities/typography.html#letter-spacing
function letterSpacing(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _304 => _304.handler
, 'access', _305 => _305.handleStatic, 'call', _306 => _306(theme('letterSpacing'))
, 'access', _307 => _307.handleSquareBrackets, 'call', _308 => _308()
, 'access', _309 => _309.handleSize, 'call', _310 => _310()
, 'access', _311 => _311.handleNegative, 'call', _312 => _312()
, 'access', _313 => _313.handleVariable, 'call', _314 => _314()
, 'access', _315 => _315.createProperty, 'call', _316 => _316('letter-spacing')
, 'optionalAccess', _317 => _317.updateMeta, 'call', _318 => _318('utilities', 'letterSpacing', pluginOrder.letterSpacing, 1, true)]);
}

// https://windicss.org/utilities/typography.html#text-decoration
function textDecoration(utility, { theme }) {
  return (
    // .decoration-{color}/{opacity}
    _optionalChain$3([utility, 'access', _319 => _319.handler
, 'access', _320 => _320.handleColor, 'call', _321 => _321(theme('textDecorationColor'))
, 'access', _322 => _322.handleOpacity, 'call', _323 => _323(theme('textDecorationOpacity'))
, 'access', _324 => _324.handleSquareBrackets, 'call', _325 => _325(notNumberLead)
, 'access', _326 => _326.handleVariable, 'call', _327 => _327()
, 'access', _328 => _328.createColorStyle, 'call', _329 => _329(utility.class, ['-webkit-text-decoration-color', 'text-decoration-color'], '--tw-text-decoration-opacity')
, 'optionalAccess', _330 => _330.updateMeta, 'call', _331 => _331('utilities', 'textDecorationColor', pluginOrder.textDecorationColor, 1, true)])
    // .decoration-{thickness}
    || _optionalChain$3([utility, 'access', _332 => _332.handler
, 'access', _333 => _333.handleStatic, 'call', _334 => _334(theme('textDecorationThickness'))
, 'access', _335 => _335.handleNumber, 'call', _336 => _336(0, undefined, 'int', number => `${number}px`)
, 'access', _337 => _337.handleSize, 'call', _338 => _338()
, 'access', _339 => _339.createProperty, 'call', _340 => _340('text-decoration-thickness')
, 'optionalAccess', _341 => _341.updateMeta, 'call', _342 => _342('utilities', 'textDecorationThickness', pluginOrder.textDecorationThickness, 1, true)])
  );
}

// https://windicss.org/utilities/typography.html#text-decoration
function textUnderline(utility, { theme }) {
  // .underline-offset-{offset}
  if (utility.raw.startsWith('underline-offset')) {
    return _optionalChain$3([utility, 'access', _343 => _343.handler
, 'access', _344 => _344.handleStatic, 'call', _345 => _345(theme('textDecorationOffset'))
, 'access', _346 => _346.handleNumber, 'call', _347 => _347(0, undefined, 'int', number => `${number}px`)
, 'access', _348 => _348.handleSize, 'call', _349 => _349()
, 'access', _350 => _350.createProperty, 'call', _351 => _351('text-underline-offset')
, 'optionalAccess', _352 => _352.updateMeta, 'call', _353 => _353('utilities', 'textDecorationOffset', pluginOrder.textDecorationOffset, 1, true)]);
  }

  // .underline-opacity-{opacity} - This is a fallback for .decoration-{color}/{opacity}
  if (utility.raw.startsWith('underline-opacity')) {
    return _optionalChain$3([utility, 'access', _354 => _354.handler
, 'access', _355 => _355.handleStatic, 'call', _356 => _356(theme('textDecorationOpacity'))
, 'access', _357 => _357.handleNumber, 'call', _358 => _358(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _359 => _359.handleVariable, 'call', _360 => _360()
, 'access', _361 => _361.createProperty, 'call', _362 => _362('--tw-line-opacity')
, 'optionalAccess', _363 => _363.updateMeta, 'call', _364 => _364('utilities', 'textDecorationOpacity', pluginOrder.textDecorationOpacity, 1, true)]);
  }

  // .underline-{color} - This is a fallback for .decoration-{color} to avoid breaking changes
  // .underline-{thickness} - This is a fallback for .decoration-{thickness} to avoid breaking changes
  return _optionalChain$3([utility, 'access', _365 => _365.handler
, 'access', _366 => _366.handleColor, 'call', _367 => _367(theme('textDecorationColor'))
, 'access', _368 => _368.handleOpacity, 'call', _369 => _369(theme('opacity'))
, 'access', _370 => _370.handleVariable, 'call', _371 => _371()
, 'access', _372 => _372.createColorStyle, 'call', _373 => _373(utility.class, ['-webkit-text-decoration-color', 'text-decoration-color'], '--tw-line-opacity')
, 'optionalAccess', _374 => _374.updateMeta, 'call', _375 => _375('utilities', 'textDecorationColor', pluginOrder.textDecorationColor, 0, true)])
    || _optionalChain$3([utility, 'access', _376 => _376.handler
, 'access', _377 => _377.handleStatic, 'call', _378 => _378(theme('textDecorationLength'))
, 'access', _379 => _379.handleNumber, 'call', _380 => _380(0, undefined, 'int', (number) => `${number}px`)
, 'access', _381 => _381.handleSize, 'call', _382 => _382()
, 'access', _383 => _383.createProperty, 'call', _384 => _384('text-decoration-thickness')
, 'optionalAccess', _385 => _385.updateMeta, 'call', _386 => _386('utilities', 'textDecorationLength', pluginOrder.textDecorationLength, 1, true)]);
}

// https://windicss.org/utilities/typography.html#line-height
function lineHeight(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _387 => _387.handler
, 'access', _388 => _388.handleStatic, 'call', _389 => _389(theme('lineHeight'))
, 'access', _390 => _390.handleNumber, 'call', _391 => _391(0, undefined, 'int', (number) => `${number * 0.25}rem`)
, 'access', _392 => _392.handleSquareBrackets, 'call', _393 => _393()
, 'access', _394 => _394.handleSize, 'call', _395 => _395()
, 'access', _396 => _396.handleVariable, 'call', _397 => _397()
, 'access', _398 => _398.createProperty, 'call', _399 => _399('line-height')
, 'optionalAccess', _400 => _400.updateMeta, 'call', _401 => _401('utilities', 'lineHeight', pluginOrder.lineHeight, 1, true)]);
}

// https://windicss.org/utilities/behaviors.html#list-style-type
function listStyleType(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _402 => _402.handler
, 'access', _403 => _403.handleBody, 'call', _404 => _404(theme('listStyleType'))
, 'access', _405 => _405.createProperty, 'call', _406 => _406('list-style-type')
, 'optionalAccess', _407 => _407.updateMeta, 'call', _408 => _408('utilities', 'listStyleType', pluginOrder.listStyleType, 1, true)]);
}

// https://windicss.org/utilities/behaviors.html#placeholder-color
// https://windicss.org/utilities/behaviors.html#placeholder-opacity
function placeholder(utility, { theme, config }) {
  // handle placeholder opacity
  if (utility.raw.startsWith('placeholder-opacity')) {
    return utility.handler
      .handleStatic(theme('placeholderOpacity'))
      .handleSquareBrackets()
      .handleNumber(0, 100, 'int', (number) => (number / 100).toString())
      .handleVariable()
      .callback(value => generatePlaceholder(utility.class, new Property('--tw-placeholder-opacity', value), config('prefixer') )
        .map(style => style.updateMeta('utilities', 'placeholderOpacity', pluginOrder.placeholderOpacity, 1, true)));
  }
  const color = utility.handler
    .handleColor(theme('placeholderColor'))
    .handleOpacity(theme('placeholderOpacity'))
    .handleSquareBrackets()
    .handleVariable()
    .createColorStyle(utility.class, 'color', '--tw-placeholder-opacity');
  if (color) return generatePlaceholder(color.selector || '', color.property, config('prefixer') ).map(i => i.updateMeta('utilities', 'placeholderColor', pluginOrder.placeholderColor, 2, true));
}

// https://windicss.org/utilities/behaviors.html#caret-color
// https://windicss.org/utilities/behaviors.html#caret-opacity
function caret(utility, { theme }) {
  // handle caret opacity
  if (utility.raw.startsWith('caret-opacity')) {
    return _optionalChain$3([utility, 'access', _409 => _409.handler
, 'access', _410 => _410.handleStatic, 'call', _411 => _411(theme('caretOpacity'))
, 'access', _412 => _412.handleNumber, 'call', _413 => _413(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _414 => _414.handleVariable, 'call', _415 => _415()
, 'access', _416 => _416.createProperty, 'call', _417 => _417('--tw-caret-opacity')
, 'optionalAccess', _418 => _418.updateMeta, 'call', _419 => _419('utilities', 'caretOpacity', pluginOrder.caretOpacity, 1, true)]);
  }
  return _optionalChain$3([utility, 'access', _420 => _420.handler
, 'access', _421 => _421.handleColor, 'call', _422 => _422(theme('caretColor'))
, 'access', _423 => _423.handleOpacity, 'call', _424 => _424(theme('caretOpacity'))
, 'access', _425 => _425.handleVariable, 'call', _426 => _426()
, 'access', _427 => _427.createColorStyle, 'call', _428 => _428(utility.class, 'caret-color', '--tw-caret-opacity')
, 'optionalAccess', _429 => _429.updateMeta, 'call', _430 => _430('utilities', 'caretColor', pluginOrder.caretColor, 0, true)]);
}

// https://windicss.org/utilities/typography.html#tab-size
function tabSize(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _431 => _431.handler
, 'access', _432 => _432.handleStatic, 'call', _433 => _433(theme('tabSize'))
, 'access', _434 => _434.handleNumber, 'call', _435 => _435(0, undefined, 'int')
, 'access', _436 => _436.handleSize, 'call', _437 => _437()
, 'access', _438 => _438.createProperty, 'call', _439 => _439(['-moz-tab-size', '-o-tab-size', 'tab-size'])
, 'optionalAccess', _440 => _440.updateMeta, 'call', _441 => _441('utilities', 'tabSize', pluginOrder.tabSize, 1, true)]);
}

// https://windicss.org/utilities/typography.html#text-indent
function textIndent(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _442 => _442.handler
, 'access', _443 => _443.handleStatic, 'call', _444 => _444(theme('textIndent'))
, 'access', _445 => _445.handleSize, 'call', _446 => _446()
, 'access', _447 => _447.handleFraction, 'call', _448 => _448()
, 'access', _449 => _449.handleNegative, 'call', _450 => _450()
, 'access', _451 => _451.createProperty, 'call', _452 => _452('text-indent')
, 'optionalAccess', _453 => _453.updateMeta, 'call', _454 => _454('utilities', 'textIndent', pluginOrder.textIndent, 1, true)]);
}

// https://windicss.org/utilities/backgrounds.html#background-color
// https://windicss.org/utilities/backgrounds.html#background-opacity
// https://windicss.org/utilities/backgrounds.html#background-position
// https://windicss.org/utilities/backgrounds.html#background-size
// https://windicss.org/utilities/backgrounds.html#background-image
function background(utility, { theme }) {
  const body = utility.body;
  // handle background positions
  const positions = toType(theme('backgroundPosition'), 'object') ;
  if (Object.keys(positions).includes(body)) return new Property('background-position', positions[body]).updateMeta('utilities', 'backgroundPosition', pluginOrder.backgroundPosition, 1, true);
  // handle background sizes
  const sizes = toType(theme('backgroundSize'), 'object') ;
  if (Object.keys(sizes).includes(body)) return new Property('background-size', sizes[body]).updateMeta('utilities', 'backgroundSize', pluginOrder.backgroundSize, 1, true);
  // handle background image
  const images = toType(theme('backgroundImage'), 'object') ;
  if (Object.keys(images).includes(body)) {
    const prefixer = linearGradient(images[body]);
    if (Array.isArray(prefixer)) return new Style(utility.class, prefixer.map((i) => new Property('background-image', i))).updateMeta('utilities', 'backgroundImage', pluginOrder.backgroundImage, 2, true);
    return new Property('background-image', prefixer).updateMeta('utilities', 'backgroundImage', pluginOrder.backgroundImage, 1, true);
  }
  // handle background opacity
  if (utility.raw.startsWith('bg-opacity'))
    return _optionalChain$3([utility, 'access', _455 => _455.handler
, 'access', _456 => _456.handleStatic, 'call', _457 => _457(theme('backgroundOpacity'))
, 'access', _458 => _458.handleSquareBrackets, 'call', _459 => _459()
, 'access', _460 => _460.handleNumber, 'call', _461 => _461(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _462 => _462.handleVariable, 'call', _463 => _463()
, 'access', _464 => _464.createProperty, 'call', _465 => _465('--tw-bg-opacity')
, 'optionalAccess', _466 => _466.updateMeta, 'call', _467 => _467('utilities', 'backgroundOpacity', pluginOrder.backgroundOpacity, 1, true)]);

  // handle background color
  return _optionalChain$3([utility, 'access', _468 => _468.handler
, 'access', _469 => _469.handleColor, 'call', _470 => _470(theme('backgroundColor'))
, 'access', _471 => _471.handleOpacity, 'call', _472 => _472(theme('backgroundOpacity'))
, 'access', _473 => _473.handleSquareBrackets, 'call', _474 => _474(notNumberLead)
, 'access', _475 => _475.handleVariable, 'call', _476 => _476()
, 'access', _477 => _477.createColorStyle, 'call', _478 => _478(utility.class, 'background-color', '--tw-bg-opacity')
, 'optionalAccess', _479 => _479.updateMeta, 'call', _480 => _480('utilities', 'backgroundColor', pluginOrder.backgroundColor, 0, true)]);
}

// https://windicss.org/utilities/backgrounds.html#gradient-from
function gradientColorFrom(utility, { theme }) {
  if (utility.raw.startsWith('from-opacity')) {
    return _optionalChain$3([utility, 'access', _481 => _481.handler
, 'access', _482 => _482.handleStatic, 'call', _483 => _483(theme('opacity'))
, 'access', _484 => _484.handleNumber, 'call', _485 => _485(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _486 => _486.handleVariable, 'call', _487 => _487()
, 'access', _488 => _488.createProperty, 'call', _489 => _489('--tw-from-opacity')
, 'optionalAccess', _490 => _490.updateMeta, 'call', _491 => _491('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 2, true)]);
  }
  const handler = utility.handler.handleColor(theme('gradientColorStops')).handleOpacity(theme('opacity')).handleVariable().handleSquareBrackets();
  if (handler.color || handler.value) {
    return new Style(utility.class, [
      new Property('--tw-gradient-from', handler.createColorValue('var(--tw-from-opacity, 1)')),
      new Property('--tw-gradient-stops', 'var(--tw-gradient-from), var(--tw-gradient-to, rgba(255, 255, 255, 0))'),
    ]).updateMeta('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 1, true);
  }
}

// https://windicss.org/utilities/backgrounds.html#gradient-via
function gradientColorVia(utility, { theme }) {
  if (utility.raw.startsWith('via-opacity')) {
    return _optionalChain$3([utility, 'access', _492 => _492.handler
, 'access', _493 => _493.handleStatic, 'call', _494 => _494(theme('opacity'))
, 'access', _495 => _495.handleNumber, 'call', _496 => _496(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _497 => _497.handleVariable, 'call', _498 => _498()
, 'access', _499 => _499.createProperty, 'call', _500 => _500('--tw-via-opacity')
, 'optionalAccess', _501 => _501.updateMeta, 'call', _502 => _502('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 4, true)]);
  }
  const handler = utility.handler.handleColor(theme('gradientColorStops')).handleOpacity(theme('opacity')).handleVariable().handleSquareBrackets();
  if (handler.color || handler.value) {
    return _optionalChain$3([new Style(utility.class,
      new Property('--tw-gradient-stops', `var(--tw-gradient-from), ${handler.createColorValue('var(--tw-via-opacity, 1)')}, var(--tw-gradient-to, rgba(255, 255, 255, 0))`)
    ), 'optionalAccess', _503 => _503.updateMeta, 'call', _504 => _504('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 3, true)]);
  }
}

// https://windicss.org/utilities/backgrounds.html#gradient-to
function gradientColorTo(utility, { theme }) {
  if (utility.raw.startsWith('to-opacity')) {
    return _optionalChain$3([utility, 'access', _505 => _505.handler
, 'access', _506 => _506.handleStatic, 'call', _507 => _507(theme('opacity'))
, 'access', _508 => _508.handleNumber, 'call', _509 => _509(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _510 => _510.handleVariable, 'call', _511 => _511()
, 'access', _512 => _512.createProperty, 'call', _513 => _513('--tw-to-opacity')
, 'optionalAccess', _514 => _514.updateMeta, 'call', _515 => _515('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 6, true)]);
  }
  const handler = utility.handler.handleColor(theme('gradientColorStops')).handleOpacity(theme('opacity')).handleVariable().handleSquareBrackets();
  if (handler.color || handler.value) {
    return _optionalChain$3([new Style(utility.class,
      new Property('--tw-gradient-to', handler.createColorValue('var(--tw-to-opacity, 1)'))
    ), 'optionalAccess', _516 => _516.updateMeta, 'call', _517 => _517('utilities', 'gradientColorStops', pluginOrder.gradientColorStops, 5, true)]);
  }
}

// https://windicss.org/utilities/borders.html#border-radius
function borderRadius(utility, { theme }) {
  const raw = ['rounded', 'rounded-t', 'rounded-l', 'rounded-r', 'rounded-b', 'rounded-tl', 'rounded-tr', 'rounded-br', 'rounded-bl'].includes(utility.raw) ? utility.raw + '-DEFAULT' : utility.raw;
  utility = utility.clone(raw);
  const directions = expandDirection(_optionalChain$3([raw, 'access', _518 => _518.match, 'call', _519 => _519(/rounded-[trbl][trbl]?-/), 'optionalAccess', _520 => _520[0], 'access', _521 => _521.slice, 'call', _522 => _522(8, -1)]) || '', true);
  if (!directions) return;
  return _optionalChain$3([utility, 'access', _523 => _523.handler
, 'access', _524 => _524.handleStatic, 'call', _525 => _525(theme('borderRadius'))
, 'access', _526 => _526.handleSquareBrackets, 'call', _527 => _527()
, 'access', _528 => _528.handleFraction, 'call', _529 => _529()
, 'access', _530 => _530.handleNxl, 'call', _531 => _531((number) => `${number * 0.5}rem`)
, 'access', _532 => _532.handleSize, 'call', _533 => _533()
, 'access', _534 => _534.handleVariable, 'call', _535 => _535()
, 'access', _536 => _536.createProperty, 'call', _537 => _537(directions[0] === '*' ? 'border-radius' : directions.map((i) => `border-${i}-radius`))
, 'optionalAccess', _538 => _538.updateMeta, 'call', _539 => _539('utilities', 'borderRadius', pluginOrder.borderRadius, -(directions[0] === '*' ? 3 : directions.length), true)]);
}

// https://windicss.org/utilities/borders.html#border-width
// https://windicss.org/utilities/borders.html#border-color
// https://windicss.org/utilities/borders.html#border-opacity
function border(utility, { theme }) {
  // handle border opacity
  if (utility.raw.startsWith('border-opacity')) {
    return _optionalChain$3([utility, 'access', _540 => _540.handler
, 'access', _541 => _541.handleStatic, 'call', _542 => _542(theme('borderOpacity'))
, 'access', _543 => _543.handleNumber, 'call', _544 => _544(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _545 => _545.handleVariable, 'call', _546 => _546()
, 'access', _547 => _547.createProperty, 'call', _548 => _548('--tw-border-opacity')
, 'optionalAccess', _549 => _549.updateMeta, 'call', _550 => _550('utilities', 'borderOpacity', pluginOrder.borderOpacity, 1, true)]);
  }

  // handle border color
  const borderColor = _optionalChain$3([utility, 'access', _551 => _551.handler
, 'access', _552 => _552.handleColor, 'call', _553 => _553(theme('borderColor'))
, 'access', _554 => _554.handleOpacity, 'call', _555 => _555(theme('borderOpacity'))
, 'access', _556 => _556.handleSquareBrackets, 'call', _557 => _557(notNumberLead)
, 'access', _558 => _558.handleVariable, 'call', _559 => _559((variable) => utility.raw.startsWith('border-$') ? `var(--${variable})` : undefined)
, 'access', _560 => _560.createColorStyle, 'call', _561 => _561(utility.class, 'border-color', '--tw-border-opacity')
, 'optionalAccess', _562 => _562.updateMeta, 'call', _563 => _563('utilities', 'borderColor', pluginOrder.borderColor, 2, true)]);
  if (borderColor) return borderColor;

  // handle border width
  const directions = _nullishCoalesce$4(expandDirection(utility.raw.substring(7, 8), false), () => ( ['*']));
  const borders = toType(theme('borderWidth'), 'object') ;
  const raw = ['border', 'border-t', 'border-r', 'border-b', 'border-l', 'border-x', 'border-y'].includes(utility.raw) ? `${utility.raw}-${_nullishCoalesce$4(borders.DEFAULT, () => ( '1px'))}` : utility.raw;

  // handle border side color
  const borderSide = utility.clone(raw.slice(7)).handler
    .handleColor(theme('borderColor'))
    .handleOpacity(theme('borderOpacity'));

  if (borderSide.value || borderSide.color) {
    if (borderSide.opacity) {
      return new Property(`border-${directions[0]}-color`, borderSide.createColorValue(borderSide.opacity)).updateMeta('utilities', 'borderColor', pluginOrder.borderColor, 4, true);
    }
    return _optionalChain$3([borderSide, 'access', _564 => _564.createColorStyle, 'call', _565 => _565(utility.class, `border-${directions[0]}-color`, '--tw-border-opacity'), 'optionalAccess', _566 => _566.updateMeta, 'call', _567 => _567('utilities', 'borderColor', pluginOrder.borderColor, 3, true)]);
  }

  utility = utility.clone(raw);
  return _optionalChain$3([utility, 'access', _568 => _568.handler
, 'access', _569 => _569.handleStatic, 'call', _570 => _570(borders)
, 'access', _571 => _571.handleSquareBrackets, 'call', _572 => _572()
, 'access', _573 => _573.handleNumber, 'call', _574 => _574(0, undefined, 'int', (number) => /^border(-[tlbrxy])?$/.test(utility.key) ? `${number}px` : undefined)
, 'access', _575 => _575.handleSize, 'call', _576 => _576()
, 'access', _577 => _577.handleVariable, 'call', _578 => _578()
, 'access', _579 => _579.createProperty, 'call', _580 => _580(directions[0] === '*' ? 'border-width' : directions.map((i) => `border-${i}-width`))
, 'optionalAccess', _581 => _581.updateMeta, 'call', _582 => _582('utilities', 'borderWidth', pluginOrder.borderWidth, (directions[0] === '*' ? 1 : (directions.length + 1)), true)]);
}

// https://windicss.org/utilities/borders.html#divide-width
// https://windicss.org/utilities/borders.html#divide-color
// https://windicss.org/utilities/borders.html#divide-opacity
// https://windicss.org/utilities/borders.html#divide-style
function divide(utility, { theme }) {
  // handle divide style
  if (['solid', 'dashed', 'dotted', 'double', 'none'].includes(utility.amount)) return new Property('border-style', utility.amount).toStyle(utility.class).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideStyle', pluginOrder.divideStyle, 1, true);
  // handle divide opacity
  if (utility.raw.startsWith('divide-opacity'))
    return _optionalChain$3([utility, 'access', _583 => _583.handler
, 'access', _584 => _584.handleStatic, 'call', _585 => _585(theme('divideOpacity'))
, 'access', _586 => _586.handleNumber, 'call', _587 => _587(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _588 => _588.handleVariable, 'call', _589 => _589()
, 'access', _590 => _590.createProperty, 'call', _591 => _591('--tw-divide-opacity')
, 'optionalAccess', _592 => _592.toStyle, 'call', _593 => _593(utility.class)
, 'access', _594 => _594.child, 'call', _595 => _595('> :not([hidden]) ~ :not([hidden])')
, 'access', _596 => _596.updateMeta, 'call', _597 => _597('utilities', 'divideOpacity', pluginOrder.divideOpacity, 1, true)]);
  // handle divide color
  const divideColor = _optionalChain$3([utility, 'access', _598 => _598.handler
, 'access', _599 => _599.handleColor, 'call', _600 => _600(theme('divideColor'))
, 'access', _601 => _601.handleOpacity, 'call', _602 => _602(theme('divideOpacity'))
, 'access', _603 => _603.handleVariable, 'call', _604 => _604((variable) => utility.raw.startsWith('divide-$') ? `var(--${variable})` : undefined)
, 'access', _605 => _605.createColorStyle, 'call', _606 => _606(utility.class, 'border-color', '--tw-divide-opacity')
, 'optionalAccess', _607 => _607.child, 'call', _608 => _608('> :not([hidden]) ~ :not([hidden])')
, 'access', _609 => _609.updateMeta, 'call', _610 => _610('utilities', 'divideColor', pluginOrder.divideColor, 0, true)]);
  if (divideColor) return divideColor;
  // handle divide width
  switch (utility.raw) {
  case 'divide-x-reverse':
    return new Style(utility.class, new Property('--tw-divide-x-reverse', '1')).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 6, true);
  case 'divide-y-reverse':
    return new Style(utility.class, new Property('--tw-divide-y-reverse', '1')).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 5, true);
  case 'divide-y':
    return new Style(utility.class, [
      new Property('--tw-divide-y-reverse', '0'),
      new Property('border-top-width', 'calc(1px * calc(1 - var(--tw-divide-y-reverse)))'),
      new Property('border-bottom-width', 'calc(1px * var(--tw-divide-y-reverse))'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 3, true);
  case 'divide-x':
    return new Style(utility.class, [
      new Property('--tw-divide-x-reverse', '0'),
      new Property('border-right-width', 'calc(1px * var(--tw-divide-x-reverse))'),
      new Property('border-left-width', 'calc(1px * calc(1 - var(--tw-divide-x-reverse)))'),
    ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 4, true);
  }
  return utility.handler
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number) => `${number}px`)
    .handleSize()
    .handleVariable()
    .callback(value => {
      const centerMatch = utility.raw.match(/^-?divide-[x|y]/);
      if (centerMatch) {
        const center = centerMatch[0].replace(/^-?divide-/, '');
        switch (center) {
        case 'x':
          return new Style(utility.class, [
            new Property('--tw-divide-x-reverse', '0'),
            new Property('border-right-width', `calc(${value} * var(--tw-divide-x-reverse))`),
            new Property('border-left-width', `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`),
          ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 2, true);
        case 'y':
          return new Style(utility.class, [
            new Property('--tw-divide-y-reverse', '0'),
            new Property('border-top-width', `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`),
            new Property('border-bottom-width', `calc(${value} * var(--tw-divide-y-reverse))`),
          ]).child('> :not([hidden]) ~ :not([hidden])').updateMeta('utilities', 'divideWidth', pluginOrder.divideWidth, 1, true);
        }
      }
    });
}

// https://windicss.org/utilities/borders.html#ring-offset-width
// https://windicss.org/utilities/borders.html#ring-offset-color
function ringOffset(utility, { theme }) {
  let value;
  // handle ring offset width variable
  if (utility.raw.startsWith('ringOffset-width-$')) {
    value = utility.handler.handleVariable().value;
    if (value) return new Property('--tw-ring-offset-width', value).toStyle(utility.class.replace('ringOffset', 'ring-offset')).updateMeta('utilities', 'ringOffsetWidth', pluginOrder.ringOffsetWidth, 2, true);
  }

  if (utility.raw.startsWith('ringOffset-opacity')) {
    return _optionalChain$3([utility, 'access', _611 => _611.handler
, 'access', _612 => _612.handleStatic, 'call', _613 => _613(theme('opacity'))
, 'access', _614 => _614.handleNumber, 'call', _615 => _615(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _616 => _616.handleVariable, 'call', _617 => _617()
, 'access', _618 => _618.createProperty, 'call', _619 => _619('--tw-ring-offset-opacity')
, 'optionalAccess', _620 => _620.updateMeta, 'call', _621 => _621('utilities', 'ringOffsetColor', pluginOrder.ringOffsetColor, 2, true)]);
  }

  // handle ring offset color || ring offset width
  return _optionalChain$3([utility, 'access', _622 => _622.handler
, 'access', _623 => _623.handleColor, 'call', _624 => _624(theme('ringOffsetColor'))
, 'access', _625 => _625.handleOpacity, 'call', _626 => _626('ringOpacity')
, 'access', _627 => _627.handleVariable, 'call', _628 => _628()
, 'access', _629 => _629.handleSquareBrackets, 'call', _630 => _630()
, 'access', _631 => _631.createColorStyle, 'call', _632 => _632(utility.class.replace('ringOffset', 'ring-offset'), '--tw-ring-offset-color', '--tw-ring-offset-opacity')
, 'optionalAccess', _633 => _633.updateMeta, 'call', _634 => _634('utilities', 'ringOffsetColor', pluginOrder.ringOffsetColor, 1, true)])
    || _optionalChain$3([utility, 'access', _635 => _635.handler
, 'access', _636 => _636.handleStatic, 'call', _637 => _637(theme('ringOffsetWidth'))
, 'access', _638 => _638.handleSquareBrackets, 'call', _639 => _639(isNumberLead)
, 'access', _640 => _640.handleNumber, 'call', _641 => _641(0, undefined, 'float', (number) => `${number}px`)
, 'access', _642 => _642.handleSize, 'call', _643 => _643()
, 'access', _644 => _644.createStyle, 'call', _645 => _645(utility.class.replace('ringOffset', 'ring-offset'), value => new Property('--tw-ring-offset-width', value))
, 'optionalAccess', _646 => _646.updateMeta, 'call', _647 => _647('utilities', 'ringOffsetWidth', pluginOrder.ringOffsetWidth, 1, true)]);
}

// https://windicss.org/utilities/borders.html#ring-width
// https://windicss.org/utilities/borders.html#ring-color
// https://windicss.org/utilities/borders.html#ring-opacity
function ring(utility, utils) {
  // handle ring offset
  if (utility.raw.startsWith('ring-offset')) return ringOffset(utility.clone(utility.raw.replace('ring-offset', 'ringOffset')), utils);
  // handle ring opacity
  if (utility.raw.startsWith('ring-opacity'))
    return _optionalChain$3([utility, 'access', _648 => _648.handler
, 'access', _649 => _649.handleStatic, 'call', _650 => _650(utils.theme('ringOpacity'))
, 'access', _651 => _651.handleSquareBrackets, 'call', _652 => _652()
, 'access', _653 => _653.handleNumber, 'call', _654 => _654(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _655 => _655.handleVariable, 'call', _656 => _656()
, 'access', _657 => _657.createProperty, 'call', _658 => _658('--tw-ring-opacity')
, 'optionalAccess', _659 => _659.updateMeta, 'call', _660 => _660('utilities', 'ringOpacity', pluginOrder.ringOpacity, 1, true)]);
  // handle ring color
  const ringColor = _optionalChain$3([utility, 'access', _661 => _661.handler
, 'access', _662 => _662.handleColor, 'call', _663 => _663(utils.theme('ringColor'))
, 'access', _664 => _664.handleOpacity, 'call', _665 => _665(utils.theme('ringOpacity'))
, 'access', _666 => _666.handleSquareBrackets, 'call', _667 => _667(notNumberLead)
, 'access', _668 => _668.handleVariable, 'call', _669 => _669((variable) => utility.raw.startsWith('ring-$') ? `var(--${variable})` : undefined)
, 'access', _670 => _670.createColorStyle, 'call', _671 => _671(utility.class, '--tw-ring-color', '--tw-ring-opacity')
, 'optionalAccess', _672 => _672.updateMeta, 'call', _673 => _673('utilities', 'ringColor', pluginOrder.ringColor, 0, true)]);

  if (ringColor) return ringColor;
  // handle ring width
  if (utility.raw === 'ring-inset') return new Property('--tw-ring-inset', 'inset').updateMeta('utilities', 'ringWidth', pluginOrder.ringWidth, 3, true);
  const value = utility.raw === 'ring'
    ? (_nullishCoalesce$4(toType(utils.theme('ringWidth.DEFAULT'), 'string'), () => ( '3px')))
    : utility.handler
      .handleStatic(utils.theme('ringWidth'))
      .handleSquareBrackets()
      .handleNumber(0, undefined, 'float', (number) => `${number}px`)
      .handleSize()
      .handleVariable()
      .value;
  if (!value) return;
  return new Style(utility.class, [
    new Property('--tw-ring-offset-shadow', 'var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)'),
    new Property('--tw-ring-shadow', `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`),
    new Property(['-webkit-box-shadow', 'box-shadow'], 'var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000)'),
  ]).updateMeta('utilities', 'ringWidth', pluginOrder.ringWidth, (utility.raw === 'ring' ? 1 : 2), true);
}

// https://windicss.org/utilities/filters.html#filter-blur
function blur(utility, { theme }) {
  if (utility.raw === 'blur') utility.raw = 'blur-DEFAULT';
  return _optionalChain$3([utility, 'access', _674 => _674.handler
, 'access', _675 => _675.handleBody, 'call', _676 => _676(theme('blur'))
, 'access', _677 => _677.handleSquareBrackets, 'call', _678 => _678()
, 'access', _679 => _679.handleNumber, 'call', _680 => _680(0, undefined, 'int', (number) => `${number}px`)
, 'access', _681 => _681.handleSize, 'call', _682 => _682()
, 'access', _683 => _683.createProperty, 'call', _684 => _684('--tw-blur', value => `blur(${value})`)
, 'optionalAccess', _685 => _685.updateMeta, 'call', _686 => _686('utilities', 'blur', pluginOrder.blur, 1, true)]);
}

// https://windicss.org/utilities/filters.html#filter-brightness
function brightness(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _687 => _687.handler
, 'access', _688 => _688.handleBody, 'call', _689 => _689(theme('brightness'))
, 'access', _690 => _690.handleSquareBrackets, 'call', _691 => _691()
, 'access', _692 => _692.handleNumber, 'call', _693 => _693(0, undefined, 'int', (number) => `${number / 100}`)
, 'access', _694 => _694.createProperty, 'call', _695 => _695('--tw-brightness', value => `brightness(${value})`)
, 'optionalAccess', _696 => _696.updateMeta, 'call', _697 => _697('utilities', 'brightness', pluginOrder.brightness, 1, true)]);
}

// https://windicss.org/utilities/filters.html#filter-contrast
function contrast(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _698 => _698.handler
, 'access', _699 => _699.handleBody, 'call', _700 => _700(theme('contrast'))
, 'access', _701 => _701.handleSquareBrackets, 'call', _702 => _702()
, 'access', _703 => _703.handleNumber, 'call', _704 => _704(0, undefined, 'int', (number) => `${number / 100}`)
, 'access', _705 => _705.createProperty, 'call', _706 => _706('--tw-contrast', value => `contrast(${value})`)
, 'optionalAccess', _707 => _707.updateMeta, 'call', _708 => _708('utilities', 'contrast', pluginOrder.contrast, 1, true)]);
}

// https://windicss.org/utilities/filters.html#filter-drop-shadow
function dropShadow(utility, { theme }) {
  let value;
  if (utility.raw === 'drop-shadow') {
    value = theme('dropShadow.DEFAULT', ['0 1px 2px rgba(0, 0, 0, 0.1)', '0 1px 1px rgba(0, 0, 0, 0.06)']) ;
  } else {
    const dropShadows = theme('dropShadow') ;
    const amount = utility.amount;
    if (utility.raw.startsWith('drop-shadow') && amount in dropShadows) value = dropShadows[amount];
  }
  if (value) return new Property('--tw-drop-shadow', Array.isArray(value) ? value.map(i => `drop-shadow(${i})`).join(' ') : `drop-shadow(${value})`).updateMeta('utilities', 'dropShadow', pluginOrder.dropShadow, 1, true);
}

// https://windicss.org/utilities/filters.html#filter-grayscale
function grayscale(utility, { theme }) {
  if (utility.raw === 'grayscale') utility.raw = 'grayscale-DEFAULT';
  return _optionalChain$3([utility, 'access', _709 => _709.handler
, 'access', _710 => _710.handleBody, 'call', _711 => _711(theme('grayscale'))
, 'access', _712 => _712.handleSquareBrackets, 'call', _713 => _713()
, 'access', _714 => _714.handleNumber, 'call', _715 => _715(0, 100, 'int', (number) => `${number / 100}`)
, 'access', _716 => _716.createProperty, 'call', _717 => _717('--tw-grayscale', value => `grayscale(${value})`)
, 'optionalAccess', _718 => _718.updateMeta, 'call', _719 => _719('utilities', 'grayscale', pluginOrder.grayscale, 1, true)]);
}

// https://windicss.org/utilities/filters.html#filter-hue-rotate
function hueRotate(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _720 => _720.handler
, 'access', _721 => _721.handleBody, 'call', _722 => _722(theme('hueRotate'))
, 'access', _723 => _723.handleSquareBrackets, 'call', _724 => _724()
, 'access', _725 => _725.handleNumber, 'call', _726 => _726(0, undefined, 'float', (number) => `${number}deg`)
, 'access', _727 => _727.handleNegative, 'call', _728 => _728()
, 'access', _729 => _729.createProperty, 'call', _730 => _730('--tw-hue-rotate', value => `hue-rotate(${value})`)
, 'optionalAccess', _731 => _731.updateMeta, 'call', _732 => _732('utilities', 'hueRotate', pluginOrder.hueRotate, 1, true)]);
}

// https://windicss.org/utilities/filters.html#filter-invert
function invert(utility, { theme }) {
  if (utility.raw === 'invert') utility.raw = 'invert-DEFAULT';
  return _optionalChain$3([utility, 'access', _733 => _733.handler
, 'access', _734 => _734.handleBody, 'call', _735 => _735(theme('invert'))
, 'access', _736 => _736.handleSquareBrackets, 'call', _737 => _737()
, 'access', _738 => _738.handleNumber, 'call', _739 => _739(0, 100, 'int', (number) => `${number / 100}`)
, 'access', _740 => _740.createProperty, 'call', _741 => _741('--tw-invert', value => `invert(${value})`)
, 'optionalAccess', _742 => _742.updateMeta, 'call', _743 => _743('utilities', 'invert', pluginOrder.invert, 1, true)]);
}

// https://windicss.org/utilities/filters.html#filter-saturate
function saturate(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _744 => _744.handler
, 'access', _745 => _745.handleBody, 'call', _746 => _746(theme('saturate'))
, 'access', _747 => _747.handleSquareBrackets, 'call', _748 => _748()
, 'access', _749 => _749.handleNumber, 'call', _750 => _750(0, undefined, 'int', (number) => `${number / 100}`)
, 'access', _751 => _751.createProperty, 'call', _752 => _752('--tw-saturate', value => `saturate(${value})`)
, 'optionalAccess', _753 => _753.updateMeta, 'call', _754 => _754('utilities', 'saturate', pluginOrder.saturate, 1, true)]);
}

// https://windicss.org/utilities/filters.html#filter-sepia
function sepia(utility, { theme }) {
  if (utility.raw === 'sepia') utility.raw = 'sepia-DEFAULT';
  return _optionalChain$3([utility, 'access', _755 => _755.handler
, 'access', _756 => _756.handleBody, 'call', _757 => _757(theme('sepia'))
, 'access', _758 => _758.handleSquareBrackets, 'call', _759 => _759()
, 'access', _760 => _760.handleNumber, 'call', _761 => _761(0, 100, 'int', (number) => `${number / 100}`)
, 'access', _762 => _762.createProperty, 'call', _763 => _763('--tw-sepia', value => `sepia(${value})`)
, 'optionalAccess', _764 => _764.updateMeta, 'call', _765 => _765('utilities', 'sepia', pluginOrder.sepia, 1, true)]);
}

// https://windicss.org/utilities/filters.html#backdrop-filter
// https://windicss.org/utilities/filters.html#backdrop-blur
// https://windicss.org/utilities/filters.html#backdrop-brightness
// https://windicss.org/utilities/filters.html#backdrop-contrast
// https://windicss.org/utilities/filters.html#backdrop-grayscale
// https://windicss.org/utilities/filters.html#backdrop-hue-rotate
// https://windicss.org/utilities/filters.html#backdrop-invert
// https://windicss.org/utilities/filters.html#backdrop-opacity
// https://windicss.org/utilities/filters.html#backdrop-saturate
// https://windicss.org/utilities/filters.html#backdrop-sepia
function backdrop(utility, { theme }) {
  utility = utility.clone(utility.raw.slice(9));
  switch (utility.match(/[^-]+/)) {
  case 'blur':
    if (utility.raw === 'blur') utility.raw = 'blur-DEFAULT';
    return _optionalChain$3([utility, 'access', _766 => _766.handler
, 'access', _767 => _767.handleBody, 'call', _768 => _768(theme('backdropBlur'))
, 'access', _769 => _769.handleSquareBrackets, 'call', _770 => _770()
, 'access', _771 => _771.handleNumber, 'call', _772 => _772(0, undefined, 'int', (number) => `${number}px`)
, 'access', _773 => _773.handleSize, 'call', _774 => _774()
, 'access', _775 => _775.createProperty, 'call', _776 => _776('--tw-backdrop-blur', value => `blur(${value})`)
, 'optionalAccess', _777 => _777.updateMeta, 'call', _778 => _778('utilities', 'backdropBlur', pluginOrder.backdropBlur, 1, true)]);
  case 'brightness':
    return _optionalChain$3([utility, 'access', _779 => _779.handler
, 'access', _780 => _780.handleBody, 'call', _781 => _781(theme('backdropBrightness'))
, 'access', _782 => _782.handleSquareBrackets, 'call', _783 => _783()
, 'access', _784 => _784.handleNumber, 'call', _785 => _785(0, undefined, 'int', (number) => `${number / 100}`)
, 'access', _786 => _786.createProperty, 'call', _787 => _787('--tw-backdrop-brightness', value => `brightness(${value})`)
, 'optionalAccess', _788 => _788.updateMeta, 'call', _789 => _789('utilities', 'backdropBrightness', pluginOrder.backdropBrightness, 1, true)]);
  case 'contrast':
    return _optionalChain$3([utility, 'access', _790 => _790.handler
, 'access', _791 => _791.handleBody, 'call', _792 => _792(theme('backdropContrast'))
, 'access', _793 => _793.handleSquareBrackets, 'call', _794 => _794()
, 'access', _795 => _795.handleNumber, 'call', _796 => _796(0, undefined, 'int', (number) => `${number / 100}`)
, 'access', _797 => _797.createProperty, 'call', _798 => _798('--tw-backdrop-contrast', value => `contrast(${value})`)
, 'optionalAccess', _799 => _799.updateMeta, 'call', _800 => _800('utilities', 'backdropContrast', pluginOrder.backdropContrast, 1, true)]);
  case 'grayscale':
    if (utility.raw === 'grayscale') utility.raw = 'grayscale-DEFAULT';
    return _optionalChain$3([utility, 'access', _801 => _801.handler
, 'access', _802 => _802.handleBody, 'call', _803 => _803(theme('backdropGrayscale'))
, 'access', _804 => _804.handleSquareBrackets, 'call', _805 => _805()
, 'access', _806 => _806.handleNumber, 'call', _807 => _807(0, 100, 'int', (number) => `${number / 100}`)
, 'access', _808 => _808.createProperty, 'call', _809 => _809('--tw-backdrop-grayscale', value => `grayscale(${value})`)
, 'optionalAccess', _810 => _810.updateMeta, 'call', _811 => _811('utilities', 'backdropGrayscale', pluginOrder.backdropGrayscale, 1, true)]);
  case 'hue':
    return _optionalChain$3([utility, 'access', _812 => _812.handler
, 'access', _813 => _813.handleBody, 'call', _814 => _814(theme('backdropHueRotate'))
, 'access', _815 => _815.handleSquareBrackets, 'call', _816 => _816()
, 'access', _817 => _817.handleNumber, 'call', _818 => _818(0, undefined, 'float', (number) => `${number}deg`)
, 'access', _819 => _819.handleNegative, 'call', _820 => _820()
, 'access', _821 => _821.createProperty, 'call', _822 => _822('--tw-backdrop-hue-rotate', value => `hue-rotate(${value})`)
, 'optionalAccess', _823 => _823.updateMeta, 'call', _824 => _824('utilities', 'backdropHueRotate', pluginOrder.backdropHueRotate, 1, true)]);
  case 'invert':
    if (utility.raw === 'invert') utility.raw = 'invert-DEFAULT';
    return _optionalChain$3([utility, 'access', _825 => _825.handler
, 'access', _826 => _826.handleBody, 'call', _827 => _827(theme('backdropInvert'))
, 'access', _828 => _828.handleSquareBrackets, 'call', _829 => _829()
, 'access', _830 => _830.handleNumber, 'call', _831 => _831(0, 100, 'int', (number) => `${number / 100}`)
, 'access', _832 => _832.createProperty, 'call', _833 => _833('--tw-backdrop-invert', value => `invert(${value})`)
, 'optionalAccess', _834 => _834.updateMeta, 'call', _835 => _835('utilities', 'backdropInvert', pluginOrder.backdropInvert, 1, true)]);
  case 'opacity':
    return _optionalChain$3([utility, 'access', _836 => _836.handler
, 'access', _837 => _837.handleBody, 'call', _838 => _838(theme('backdropOpacity'))
, 'access', _839 => _839.handleSquareBrackets, 'call', _840 => _840()
, 'access', _841 => _841.handleNumber, 'call', _842 => _842(0, 100, 'int', (number) => `${number / 100}`)
, 'access', _843 => _843.createProperty, 'call', _844 => _844('--tw-backdrop-opacity', value => `opacity(${value})`)
, 'optionalAccess', _845 => _845.updateMeta, 'call', _846 => _846('utilities', 'backdropOpacity', pluginOrder.backdropOpacity, 1, true)]);
  case 'saturate':
    return _optionalChain$3([utility, 'access', _847 => _847.handler
, 'access', _848 => _848.handleBody, 'call', _849 => _849(theme('backdropSaturate'))
, 'access', _850 => _850.handleSquareBrackets, 'call', _851 => _851()
, 'access', _852 => _852.handleNumber, 'call', _853 => _853(0, undefined, 'int', (number) => `${number / 100}`)
, 'access', _854 => _854.createProperty, 'call', _855 => _855('--tw-backdrop-saturate', value => `saturate(${value})`)
, 'optionalAccess', _856 => _856.updateMeta, 'call', _857 => _857('utilities', 'backdropSaturate', pluginOrder.backdropSaturate, 1, true)]);
  case 'sepia':
    if (utility.raw === 'sepia') utility.raw = 'sepia-DEFAULT';
    return _optionalChain$3([utility, 'access', _858 => _858.handler
, 'access', _859 => _859.handleBody, 'call', _860 => _860(theme('backdropSepia'))
, 'access', _861 => _861.handleSquareBrackets, 'call', _862 => _862()
, 'access', _863 => _863.handleNumber, 'call', _864 => _864(0, 100, 'int', (number) => `${number / 100}`)
, 'access', _865 => _865.createProperty, 'call', _866 => _866('--tw-backdrop-sepia', value => `sepia(${value})`)
, 'optionalAccess', _867 => _867.updateMeta, 'call', _868 => _868('utilities', 'backdropSepia', pluginOrder.backdropSepia, 1, true)]);
  }
}

// https://windicss.org/utilities/effects.html#box-shadow
function boxShadow(utility, { theme }) {
  const body = utility.body || 'DEFAULT';
  const shadows = toType(theme('boxShadow'), 'object') ;

  if (Object.keys(shadows).includes(body)) {
    const coloredShadow = shadows[body].replace(/rgba?\([0-9.,/\s]*\)/g, 'var(--tw-shadow-color)');
    return new Style(utility.class, [
      new Property('--tw-shadow', shadows[body]),
      new Property('--tw-shadow-colored', coloredShadow),
      new Property('-webkit-box-shadow', 'var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)'),
      new Property('box-shadow', 'var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow)'),
    ]).updateMeta('utilities', 'boxShadow', pluginOrder.boxShadow, 0, true);
  }

  const color = utility.handler
    .handleColor(theme('boxShadowColor'))
    .handleOpacity(theme('opacity'))
    .handleSquareBrackets()
    .handleVariable();

  return new Style(utility.class, [
    new Property('--tw-shadow-color', color.createColorValue(color.opacity || '1')),
    new Property('--tw-shadow', 'var(--tw-shadow-colored)'),
  ]).updateMeta('utilities', 'boxShadowColor', pluginOrder.boxShadowColor, 0, true);
}

// https://windicss.org/utilities/effects.html#opacity
function opacity(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _869 => _869.handler
, 'access', _870 => _870.handleStatic, 'call', _871 => _871(theme('opacity'))
, 'access', _872 => _872.handleSquareBrackets, 'call', _873 => _873()
, 'access', _874 => _874.handleNumber, 'call', _875 => _875(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _876 => _876.handleVariable, 'call', _877 => _877()
, 'access', _878 => _878.createProperty, 'call', _879 => _879('opacity')
, 'optionalAccess', _880 => _880.updateMeta, 'call', _881 => _881('utilities', 'opacity', pluginOrder.opacity, 0, true)]);
}

// https://windicss.org/utilities/transitions.html#transition-property
function transition(utility, { theme }) {
  const body = utility.body;
  const props = toType(theme('transitionProperty'), 'object') ;
  for (const [key, value] of Object.entries(props)) {
    if (body === key || (body === '' && key === 'DEFAULT')) {
      if (value === 'none') return new Property(['-webkit-transition-property', '-o-transition-property', 'transition-property'], 'none').updateMeta('utilities', 'transitionProperty', pluginOrder.transitionProperty, 1, true);
      return new Style(utility.class, [
        new Property('-webkit-transition-property', value.replace(/(?=(transform|box-shadow))/g, '-webkit-')),
        new Property('-o-transition-property', value),
        new Property('transition-property', value.replace(/transform/g, 'transform, -webkit-transform').replace(/box-shadow/g, 'box-shadow, -webkit-box-shadow')),
        new Property(['-webkit-transition-timing-function', '-o-transition-timing-function', 'transition-timing-function'], _nullishCoalesce$4(toType(theme('transitionTimingFunction.DEFAULT'), 'string'), () => ( 'cubic-bezier(0.4, 0, 0.2, 1)'))),
        new Property(['-webkit-transition-duration', '-o-transition-duration', 'transition-duration'], _nullishCoalesce$4(toType(theme('transitionDuration.DEFAULT'), 'string'), () => ( '150ms'))),
      ]).updateMeta('utilities', 'transitionProperty', pluginOrder.transitionProperty, 2, true);
    }
  }
}

// https://windicss.org/utilities/transitions.html#transition-duration
function duration(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _882 => _882.handler
, 'access', _883 => _883.handleStatic, 'call', _884 => _884(theme('transitionDuration'))
, 'access', _885 => _885.handleSquareBrackets, 'call', _886 => _886()
, 'access', _887 => _887.handleTime, 'call', _888 => _888(0, undefined, 'float')
, 'access', _889 => _889.handleNumber, 'call', _890 => _890(0, undefined, 'int', (number) => `${number}ms`)
, 'access', _891 => _891.handleVariable, 'call', _892 => _892()
, 'access', _893 => _893.createProperty, 'call', _894 => _894(['-webkit-transition-duration', '-o-transition-duration', 'transition-duration'])
, 'optionalAccess', _895 => _895.updateMeta, 'call', _896 => _896('utilities', 'transitionDuration', pluginOrder.transitionDuration, 1, true)]);
}

// https://windicss.org/utilities/transitions.html#transition-timing-function
function transitionTimingFunction(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _897 => _897.handler
, 'access', _898 => _898.handleBody, 'call', _899 => _899(theme('transitionTimingFunction'))
, 'access', _900 => _900.createProperty, 'call', _901 => _901(['-webkit-transition-timing-function', '-o-transition-timing-function', 'transition-timing-function'])
, 'optionalAccess', _902 => _902.updateMeta, 'call', _903 => _903('utilities', 'transitionTimingFunction', pluginOrder.transitionTimingFunction, 1, true)]);
}

// https://windicss.org/utilities/transitions.html#transition-delay
function delay(utility, { theme }) {
  return _optionalChain$3([utility, 'access', _904 => _904.handler
, 'access', _905 => _905.handleStatic, 'call', _906 => _906(theme('transitionDelay'))
, 'access', _907 => _907.handleSquareBrackets, 'call', _908 => _908()
, 'access', _909 => _909.handleTime, 'call', _910 => _910(0, undefined, 'float')
, 'access', _911 => _911.handleNumber, 'call', _912 => _912(0, undefined, 'int', (number) => `${number}ms`)
, 'access', _913 => _913.handleVariable, 'call', _914 => _914()
, 'access', _915 => _915.createProperty, 'call', _916 => _916(['-webkit-transition-delay', '-o-transition-delay', 'transition-delay'])
, 'optionalAccess', _917 => _917.updateMeta, 'call', _918 => _918('utilities', 'transitionDelay', pluginOrder.transitionDelay, 0, true)]);
}

// https://windicss.org/utilities/behaviors.html#animation
function animation(utility, { theme, config }) {
  const body = utility.body;
  if (utility.raw.startsWith('animate-ease')) {
    return _optionalChain$3([utility, 'access', _919 => _919.clone, 'call', _920 => _920(utility.raw.slice(8)), 'access', _921 => _921.handler
, 'access', _922 => _922.handleBody, 'call', _923 => _923(theme('animationTimingFunction'))
, 'access', _924 => _924.handleSquareBrackets, 'call', _925 => _925()
, 'access', _926 => _926.createProperty, 'call', _927 => _927(['-webkit-animation-timing-function', 'animation-timing-function'])
, 'optionalAccess', _928 => _928.updateMeta, 'call', _929 => _929('utilities', 'animation', pluginOrder.animation, 20, true)]);
  }
  if (utility.raw.startsWith('animate-duration')) {
    return _optionalChain$3([utility, 'access', _930 => _930.clone, 'call', _931 => _931(utility.raw.slice(8)), 'access', _932 => _932.handler
, 'access', _933 => _933.handleStatic, 'call', _934 => _934(theme('animationDuration'))
, 'access', _935 => _935.handleSquareBrackets, 'call', _936 => _936()
, 'access', _937 => _937.handleTime, 'call', _938 => _938(0, undefined, 'float')
, 'access', _939 => _939.handleNumber, 'call', _940 => _940(0, undefined, 'int', (number) => `${number}ms`)
, 'access', _941 => _941.handleVariable, 'call', _942 => _942()
, 'access', _943 => _943.createProperty, 'call', _944 => _944(['-webkit-animation-duration', 'animation-duration'])
, 'optionalAccess', _945 => _945.updateMeta, 'call', _946 => _946('utilities', 'animation', pluginOrder.animation, 21, true)]);
  }
  if (utility.raw.startsWith('animate-delay')) {
    return _optionalChain$3([utility, 'access', _947 => _947.clone, 'call', _948 => _948(utility.raw.slice(8)), 'access', _949 => _949.handler
, 'access', _950 => _950.handleStatic, 'call', _951 => _951(theme('animationDelay'))
, 'access', _952 => _952.handleSquareBrackets, 'call', _953 => _953()
, 'access', _954 => _954.handleTime, 'call', _955 => _955(0, undefined, 'float')
, 'access', _956 => _956.handleNumber, 'call', _957 => _957(0, undefined, 'int', (number) => `${number}ms`)
, 'access', _958 => _958.handleVariable, 'call', _959 => _959()
, 'access', _960 => _960.createProperty, 'call', _961 => _961(['-webkit-animation-delay', 'animation-delay'])
, 'optionalAccess', _962 => _962.updateMeta, 'call', _963 => _963('utilities', 'animation', pluginOrder.animation, 22, true)]);
  }
  const animateIterationCount = utility.handler.handleBody(theme('animationIterationCount')).handleNumber(0, undefined, 'int').handleSquareBrackets().value;
  if (animateIterationCount) return new Property(['-webkit-animation-iteration-count', 'animation-iteration-count'], animateIterationCount).updateMeta('utilities', 'animation', pluginOrder.animation, 23, true);
  const animations = toType(theme('animation'), 'object') ;
  if (Object.keys(animations).includes(body)) {
    let value = animations[body];
    const prop = config('prefixer') ? ['-webkit-animation', 'animation'] : 'animation';
    if (value === 'none') return new Property(prop, 'none').updateMeta('utilities', 'animation', pluginOrder.animation, 1, true);
    let styles, keyframe;
    if (typeof value === 'string') {
      keyframe = _optionalChain$3([value, 'access', _964 => _964.match, 'call', _965 => _965(/^\w+/), 'optionalAccess', _966 => _966[0]]);
      styles = [new Style(utility.class, new Property(prop, value))];
    } else {
      keyframe = value['animation'] || value['animationName'] || value['animation-name'];
      if (config('prefixer')) {
        const props = {};
        for (const [k, v] of Object.entries(value)) {
          if (k.startsWith('animation') || k.startsWith('backface')) {
            props['-webkit-' + k] = v;
          } else if (k.startsWith('transform')) {
            props['-webkit-' + k] = v;
            props['-ms-' + k] = v;
          }
          props[k] = v;
        }
        value = props;
      }
      styles = Style.generate(utility.class, value).map(i => i.updateMeta('utilities', 'animation', pluginOrder.animation, 2, true));
    }

    if (styles) {
      return [
        ...styles.map(i => i.updateMeta('utilities', 'animation', pluginOrder.animation, 2, true)),
        ...keyframe ? Keyframes.generate(
          keyframe,
          (_nullishCoalesce$4(theme(`keyframes.${keyframe}`), () => ( {}))) ,
          undefined,
          config('prefixer', false) 
        ).map(i => i.updateMeta('utilities', 'keyframes', pluginOrder.keyframes, 1, true)) : [],
      ];
    }
  }
}

// https://windicss.org/utilities/transforms.html#transform-origin
function transformOrigin(utility, { theme }) {
  const body = utility.body;
  const origins = toType(theme('transformOrigin'), 'object') ;
  if (Object.keys(origins).includes(body)) return new Property(['-webkit-transform-origin', '-ms-transform-origin', 'transform-origin'], origins[body]).updateMeta('utilities', 'transformOrigin', pluginOrder.transformOrigin, 0, true);
}

// https://windicss.org/utilities/transforms.html#transform-scale
function scale(utility, { theme }) {
  return utility.handler
    .handleStatic(theme('scale'))
    .handleNumber(0, undefined, 'int', (number) => (number / 100).toString())
    .handleVariable()
    .callback(value => {
      if (utility.raw.startsWith('scale-x')) return new Property('--tw-scale-x', value).updateMeta('utilities', 'scale', pluginOrder.scale, 2, true);
      if (utility.raw.startsWith('scale-y')) return new Property('--tw-scale-y', value).updateMeta('utilities', 'scale', pluginOrder.scale, 3, true);
      if (utility.raw.startsWith('scale-z')) return new Property('--tw-scale-z', value).updateMeta('utilities', 'scale', pluginOrder.scale, 4, true);
      return new Property(['--tw-scale-x', '--tw-scale-y', '--tw-scale-z'], value).updateMeta('utilities', 'scale', pluginOrder.scale, 1, true);
    });
}

// https://windicss.org/utilities/transforms.html#transform-rotate
function rotate(utility, { theme }) {
  return utility.handler
    .handleStatic(theme('rotate'))
    .handleSquareBrackets()
    .handleNumber(0, undefined, 'float', (number) => `${number}deg`)
    .handleNegative()
    .handleVariable()
    .callback(value => {
      const abs = utility.absolute;
      if (abs.startsWith('rotate-x')) return new Property('--tw-rotate-x', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 2, true);
      if (abs.startsWith('rotate-y')) return new Property('--tw-rotate-y', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 3, true);
      if (abs.startsWith('rotate-z')) return new Property('--tw-rotate-z', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 4, true);
      return new Property('--tw-rotate', value).updateMeta('utilities', 'rotate', pluginOrder.rotate, 1, true);
    });
}

// https://windicss.org/utilities/transforms.html#transform-translate
function translate(utility, { theme }) {
  const centerMatch = utility.raw.match(/^-?translate-[x|y|z]/);
  if (centerMatch) {
    const center = centerMatch[0].replace(/^-?translate-/, '');
    return _optionalChain$3([utility, 'access', _967 => _967.handler
, 'access', _968 => _968.handleStatic, 'call', _969 => _969(theme('translate'))
, 'access', _970 => _970.handleSquareBrackets, 'call', _971 => _971()
, 'access', _972 => _972.handleSpacing, 'call', _973 => _973()
, 'access', _974 => _974.handleFraction, 'call', _975 => _975()
, 'access', _976 => _976.handleSize, 'call', _977 => _977()
, 'access', _978 => _978.handleNegative, 'call', _979 => _979()
, 'access', _980 => _980.handleVariable, 'call', _981 => _981()
, 'access', _982 => _982.createProperty, 'call', _983 => _983(`--tw-translate-${center}`)
, 'optionalAccess', _984 => _984.updateMeta, 'call', _985 => _985('utilities', 'translate', pluginOrder.translate, utility.raw.charAt(0) === '-' ? 2 : 1, true)]);
  }
}

// https://windicss.org/utilities/transforms.html#transform-skew
function skew(utility, { theme }) {
  const centerMatch = utility.raw.match(/^-?skew-[x|y]/);
  if (centerMatch) {
    const center = centerMatch[0].replace(/^-?skew-/, '');
    return _optionalChain$3([utility, 'access', _986 => _986.handler
, 'access', _987 => _987.handleStatic, 'call', _988 => _988(theme('skew'))
, 'access', _989 => _989.handleSquareBrackets, 'call', _990 => _990()
, 'access', _991 => _991.handleNumber, 'call', _992 => _992(0, undefined, 'float', (number) => `${number}deg`)
, 'access', _993 => _993.handleNegative, 'call', _994 => _994()
, 'access', _995 => _995.handleVariable, 'call', _996 => _996()
, 'access', _997 => _997.createProperty, 'call', _998 => _998(`--tw-skew-${center}`)
, 'optionalAccess', _999 => _999.updateMeta, 'call', _1000 => _1000('utilities', 'skew', pluginOrder.skew, utility.raw.charAt(0) === '-' ? 2 : 1, true)]);
  }
}

// https://windicss.org/utilities/transforms.html#perspective
function perspective(utility, { theme }) {
  if (utility.raw.startsWith('perspect-origin')) {
    const origin = _optionalChain$3([utility, 'access', _1001 => _1001.clone, 'call', _1002 => _1002('perspectOrigin' + utility.raw.slice(15)), 'access', _1003 => _1003.handler
, 'access', _1004 => _1004.handleBody, 'call', _1005 => _1005(theme('perspectiveOrigin'))
, 'access', _1006 => _1006.handleSquareBrackets, 'call', _1007 => _1007()
, 'access', _1008 => _1008.createProperty, 'call', _1009 => _1009(['-webkit-perspective-origin', 'perspective-origin'])
, 'optionalAccess', _1010 => _1010.updateMeta, 'call', _1011 => _1011('utilities', 'perspectiveOrigin', pluginOrder.perspectiveOrigin, 0, true)]);
    if (origin) return origin;
  }
  return _optionalChain$3([utility, 'access', _1012 => _1012.handler
, 'access', _1013 => _1013.handleStatic, 'call', _1014 => _1014(theme('perspective'))
, 'access', _1015 => _1015.handleNumber, 'call', _1016 => _1016(0, undefined, 'int', number => `${number}px`)
, 'access', _1017 => _1017.handleSize, 'call', _1018 => _1018()
, 'access', _1019 => _1019.handleSquareBrackets, 'call', _1020 => _1020()
, 'access', _1021 => _1021.createProperty, 'call', _1022 => _1022(['-webkit-perspective', 'perspective'])
, 'optionalAccess', _1023 => _1023.updateMeta, 'call', _1024 => _1024('utilities', 'perspective', pluginOrder.perspective, 0, true)]);
}

// https://windicss.org/utilities/behaviors.html#cursor
function cursor(utility, { theme }) {
  const body = utility.body;
  const cursors = toType(theme('cursor'), 'object') ;
  if (Object.keys(cursors).includes(body)) return new Property('cursor', cursors[body]).updateMeta('utilities', 'cursor', pluginOrder.cursor, 1, true);
}

// https://windicss.org/utilities/borders/outline.html
function outline(utility, { theme }) {
  if (utility.raw.startsWith('outline-offset')) {
    return _optionalChain$3([utility, 'access', _1025 => _1025.handler
, 'access', _1026 => _1026.handleStatic, 'call', _1027 => _1027(theme('outlineOffset'))
, 'access', _1028 => _1028.handleNumber, 'call', _1029 => _1029(0, undefined, 'int')
, 'access', _1030 => _1030.handleVariable, 'call', _1031 => _1031()
, 'access', _1032 => _1032.handleSquareBrackets, 'call', _1033 => _1033()
, 'access', _1034 => _1034.createProperty, 'call', _1035 => _1035('outline-offset')
, 'optionalAccess', _1036 => _1036.updateMeta, 'call', _1037 => _1037('utilities', 'outline', pluginOrder.outline, 0, true)]);
  }

  if (utility.raw.startsWith('outline-opacity')) {
    return _optionalChain$3([utility, 'access', _1038 => _1038.handler
, 'access', _1039 => _1039.handleStatic, 'call', _1040 => _1040(theme('opacity'))
, 'access', _1041 => _1041.handleNumber, 'call', _1042 => _1042(0, 1, 'float')
, 'access', _1043 => _1043.handleVariable, 'call', _1044 => _1044()
, 'access', _1045 => _1045.handleSquareBrackets, 'call', _1046 => _1046()
, 'access', _1047 => _1047.createProperty, 'call', _1048 => _1048('--tw-outline-opacity')
, 'optionalAccess', _1049 => _1049.updateMeta, 'call', _1050 => _1050('utilities', 'outline', pluginOrder.outline, 1, true)]);
  }

  const outlineColor = _optionalChain$3([utility, 'access', _1051 => _1051.handler
, 'access', _1052 => _1052.handleColor, 'call', _1053 => _1053(theme('outlineColor'))
, 'access', _1054 => _1054.handleOpacity, 'call', _1055 => _1055(theme('opacity'))
, 'access', _1056 => _1056.handleSquareBrackets, 'call', _1057 => _1057(notNumberLead)
, 'access', _1058 => _1058.handleVariable, 'call', _1059 => _1059((variable) => utility.raw.startsWith('outline-$') ? `var(--${variable})` : undefined)
, 'access', _1060 => _1060.createColorStyle, 'call', _1061 => _1061(utility.class, 'outline-color', '--tw-outline-opacity')
, 'optionalAccess', _1062 => _1062.updateMeta, 'call', _1063 => _1063('utilities', 'outline', pluginOrder.outline, 2, true)]);

  if (outlineColor) return outlineColor;

  return _optionalChain$3([utility, 'access', _1064 => _1064.handler
, 'access', _1065 => _1065.handleStatic, 'call', _1066 => _1066(theme('outlineWidth'))
, 'access', _1067 => _1067.handleNumber, 'call', _1068 => _1068(0, undefined, 'float', (number) => `${number}px`)
, 'access', _1069 => _1069.handleSquareBrackets, 'call', _1070 => _1070()
, 'access', _1071 => _1071.handleVariable, 'call', _1072 => _1072()
, 'access', _1073 => _1073.createProperty, 'call', _1074 => _1074('outline-width')
, 'optionalAccess', _1075 => _1075.updateMeta, 'call', _1076 => _1076('utilities', 'outline', pluginOrder.outline, 3, true)]);
}

// https://windicss.org/utilities/svg.html#fill-color
function fill(utility, { theme }) {
  if (utility.raw.startsWith('fill-opacity')) {
    return _optionalChain$3([utility, 'access', _1077 => _1077.handler
, 'access', _1078 => _1078.handleStatic, 'call', _1079 => _1079(theme('opacity'))
, 'access', _1080 => _1080.handleNumber, 'call', _1081 => _1081(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _1082 => _1082.handleVariable, 'call', _1083 => _1083()
, 'access', _1084 => _1084.createProperty, 'call', _1085 => _1085('--tw-fill-opacity')
, 'optionalAccess', _1086 => _1086.updateMeta, 'call', _1087 => _1087('utilities', 'fill', pluginOrder.ringOffsetColor, 2, true)]);
  }
  return _optionalChain$3([utility, 'access', _1088 => _1088.handler
, 'access', _1089 => _1089.handleColor, 'call', _1090 => _1090(theme('fill'))
, 'access', _1091 => _1091.handleOpacity, 'call', _1092 => _1092(theme('opacity'))
, 'access', _1093 => _1093.handleSquareBrackets, 'call', _1094 => _1094()
, 'access', _1095 => _1095.handleVariable, 'call', _1096 => _1096()
, 'access', _1097 => _1097.createColorStyle, 'call', _1098 => _1098(utility.class, 'fill', '--tw-fill-opacity')
, 'optionalAccess', _1099 => _1099.updateMeta, 'call', _1100 => _1100('utilities', 'fill', pluginOrder.fill, 1, true)]);
}

// https://windicss.org/utilities/svg.html#stroke-color
// https://windicss.org/utilities/svg.html#stroke-width
function stroke(utility, { theme }) {
  if (utility.raw.startsWith('stroke-dash')) {
    return _optionalChain$3([utility, 'access', _1101 => _1101.handler, 'access', _1102 => _1102.handleNumber, 'call', _1103 => _1103(), 'access', _1104 => _1104.createProperty, 'call', _1105 => _1105('stroke-dasharray'), 'optionalAccess', _1106 => _1106.updateMeta, 'call', _1107 => _1107('utilities', 'strokeDashArray', pluginOrder.strokeDashArray, 0, true)]);
  }
  if (utility.raw.startsWith('stroke-offset')) {
    return _optionalChain$3([utility, 'access', _1108 => _1108.handler, 'access', _1109 => _1109.handleNumber, 'call', _1110 => _1110(), 'access', _1111 => _1111.createProperty, 'call', _1112 => _1112('stroke-dashoffset'), 'optionalAccess', _1113 => _1113.updateMeta, 'call', _1114 => _1114('utilities', 'strokeDashOffset', pluginOrder.strokeDashOffset, 0, true)]);
  }

  if (utility.raw.startsWith('stroke-opacity')) {
    return _optionalChain$3([utility, 'access', _1115 => _1115.handler
, 'access', _1116 => _1116.handleStatic, 'call', _1117 => _1117(theme('opacity'))
, 'access', _1118 => _1118.handleNumber, 'call', _1119 => _1119(0, 100, 'int', (number) => (number / 100).toString())
, 'access', _1120 => _1120.handleVariable, 'call', _1121 => _1121()
, 'access', _1122 => _1122.createProperty, 'call', _1123 => _1123('--tw-stroke-opacity')
, 'optionalAccess', _1124 => _1124.updateMeta, 'call', _1125 => _1125('utilities', 'stroke', pluginOrder.stroke, 2, true)]);
  }
  return _optionalChain$3([utility, 'access', _1126 => _1126.handler
, 'access', _1127 => _1127.handleColor, 'call', _1128 => _1128(theme('stroke'))
, 'access', _1129 => _1129.handleOpacity, 'call', _1130 => _1130(theme('opacity'))
, 'access', _1131 => _1131.handleVariable, 'call', _1132 => _1132()
, 'access', _1133 => _1133.handleSquareBrackets, 'call', _1134 => _1134()
, 'access', _1135 => _1135.createColorStyle, 'call', _1136 => _1136(utility.class, 'stroke', '--tw-stroke-opacity')
, 'optionalAccess', _1137 => _1137.updateMeta, 'call', _1138 => _1138('utilities', 'stroke', pluginOrder.stroke, 1, true)])
    || (utility.raw.startsWith('stroke-$')
      ? _optionalChain$3([utility, 'access', _1139 => _1139.handler
, 'access', _1140 => _1140.handleVariable, 'call', _1141 => _1141()
, 'access', _1142 => _1142.createProperty, 'call', _1143 => _1143('stroke-width')
, 'optionalAccess', _1144 => _1144.updateMeta, 'call', _1145 => _1145('utilities', 'strokeWidth', pluginOrder.strokeWidth, 2, true)])
      : _optionalChain$3([utility, 'access', _1146 => _1146.handler
, 'access', _1147 => _1147.handleStatic, 'call', _1148 => _1148(theme('strokeWidth'))
, 'access', _1149 => _1149.handleNumber, 'call', _1150 => _1150(0, undefined, 'int')
, 'access', _1151 => _1151.createProperty, 'call', _1152 => _1152('stroke-width')
, 'optionalAccess', _1153 => _1153.updateMeta, 'call', _1154 => _1154('utilities', 'strokeWidth', pluginOrder.strokeWidth, 1, true)])
    );
}

function content(utility, { theme }) {
  if (!/^content-(?!$)/.test(utility.raw))
    return;
  return _optionalChain$3([utility, 'access', _1155 => _1155.handler
, 'access', _1156 => _1156.handleBody, 'call', _1157 => _1157(theme('content'))
, 'access', _1158 => _1158.handleSquareBrackets, 'call', _1159 => _1159()
, 'access', _1160 => _1160.handleVariable, 'call', _1161 => _1161()
, 'access', _1162 => _1162.handleString, 'call', _1163 => _1163((string) => `"${string}"`)
, 'access', _1164 => _1164.createProperty, 'call', _1165 => _1165('content')
, 'optionalAccess', _1166 => _1166.updateMeta, 'call', _1167 => _1167('utilities', 'content', pluginOrder.content, 1, true)]);
}

// https://windicss.org/utilities/behaviors.html#accent-color
function accent(utility, { theme }) {
  const color = utility.handler
    .handleColor(theme('boxShadowColor'))
    .handleOpacity(theme('opacity'))
    .handleSquareBrackets()
    .handleVariable()
    .createColorValue('1');

  return new Style(utility.class, new Property('accent-color', color))
    .updateMeta('utilities', 'accentColor', pluginOrder.accentColor, 0, true);
}

const dynamicUtilities = {
  columns: columns,
  container: container,
  space: space,
  divide: divide,
  bg: background,
  basis: basis,
  from: gradientColorFrom,
  via: gradientColorVia,
  to: gradientColorTo,
  border: border,
  rounded: borderRadius,
  cursor: cursor,
  flex: flex,
  order: order,
  font: font,
  h: size,
  leading: lineHeight,
  list: listStyleType,
  m: margin,
  my: margin,
  mx: margin,
  mt: margin,
  mr: margin,
  mb: margin,
  ml: margin,
  min: minMaxSize,
  max: minMaxSize,
  object: objectPosition,
  opacity: opacity,
  outline: outline,
  p: padding,
  py: padding,
  px: padding,
  pt: padding,
  pr: padding,
  pb: padding,
  pl: padding,
  placeholder: placeholder,
  caret: caret,
  tab: tabSize,
  indent: textIndent,
  inset: inset,
  top: inset,
  right: inset,
  bottom: inset,
  left: inset,
  shadow: boxShadow,
  ring: ring,
  blur: blur,
  brightness: brightness,
  contrast: contrast,
  drop: dropShadow,
  grayscale: grayscale,
  hue: hueRotate,
  invert: invert,
  saturate: saturate,
  sepia: sepia,
  backdrop: backdrop,
  fill: fill,
  stroke: stroke,
  text: text,
  tracking: letterSpacing,
  decoration: textDecoration,
  underline: textUnderline,
  w: size,
  z: zIndex,
  gap: gap,
  auto: gridAuto,
  grid: gridTemplate,
  col: gridColumn,
  row: gridRow,
  origin: transformOrigin,
  scale: scale,
  rotate: rotate,
  translate: translate,
  skew: skew,
  perspect: perspective,
  transition: transition,
  ease: transitionTimingFunction,
  duration: duration,
  delay: delay,
  content: content,
  animate: animation,
  accent: accent,
};

const sky = {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
};

const neutral = {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
};

const stone = {
  50: '#fafaf9',
  100: '#f5f5f4',
  200: '#e7e5e4',
  300: '#d6d3d1',
  400: '#a8a29e',
  500: '#78716c',
  600: '#57534e',
  700: '#44403c',
  800: '#292524',
  900: '#1c1917',
};

const slate = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94A3B8',
  500: '#64748B',
  600: '#475569',
  700: '#334155',
  800: '#1E293B',
  900: '#0F172A',
};

const zinc = {
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717A',
  600: '#52525B',
  700: '#3F3F46',
  800: '#27272A',
  900: '#18181B',
};

const gray = {
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
};

const colors =  {
  black: '#000',
  white: '#fff',
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  fuchsia: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
  },
  violet: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  sky,
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  lime: {
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#84cc16',
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
  },
  amber: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  red: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  gray,
  slate,
  zinc,
  neutral,
  stone,
  light: {
    50:  '#fdfdfd',
    100: '#fcfcfc',
    200: '#fafafa',
    300: '#f8f9fa',
    400: '#f6f6f6',
    500: '#f2f2f2',
    600: '#f1f3f5',
    700: '#e9ecef',
    800: '#dee2e6',
    900: '#dde1e3',
  },
  dark: {
    50: '#4a4a4a',
    100: '#3c3c3c',
    200: '#323232',
    300: '#2d2d2d',
    400: '#222222',
    500: '#1f1f1f',
    600: '#1c1c1e',
    700: '#1b1b1b',
    800: '#181818',
    900: '#0f0f0f',
  },
};

const keyframes = {
  spin: {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
  ping: {
    '0%': {
      transform: 'scale(1)',
      opacity: '1',
    },
    '75%, 100%': {
      transform: 'scale(2)',
      opacity: '0',
    },
  },
  pulse: {
    '0%, 100%': {
      opacity: '1',
    },
    '50%': {
      opacity: '.5',
    },
  },
  bounce: {
    '0%, 100%': {
      transform: 'translateY(-25%)',
      animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
    },
    '50%': {
      transform: 'translateY(0)',
      animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
    },
  },
  shock: {
    'from, 20%, 53%, 80%, to': {
      animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      transform: 'translate3d(0, 0, 0)',
    },
    '40%, 43%': {
      animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
      transform: 'translate3d(0, -30px, 0)',
    },
    '70%': {
      animationTimingFunction: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
      transform: 'translate3d(0, -15px, 0)',
    },
    '90%': {
      transform: 'translate3d(0, -4px, 0)',
    },
  },
  flash: {
    'from, 50%, to': {
      opacity: '1',
    },
    '25%, 75%': {
      opacity: '0',
    },
  },
  bubble: {
    'from': {
      transform: 'scale3d(1, 1, 1)',
    },
    '50%': {
      transform: 'scale3d(1.05, 1.05, 1.05)',
    },
    'to': {
      transform: 'scale3d(1, 1, 1)',
    },
  },
  rubberBand: {
    'from': {
      transform: 'scale3d(1, 1, 1)',
    },
    '30%': {
      transform: 'scale3d(1.25, 0.75, 1)',
    },
    '40%': {
      transform: 'scale3d(0.75, 1.25, 1)',
    },
    '50%': {
      transform: 'scale3d(1.15, 0.85, 1)',
    },
    '65%': {
      transform: 'scale3d(0.95, 1.05, 1)',
    },
    '75%': {
      transform: 'scale3d(1.05, 0.95, 1)',
    },
    'to': {
      transform: 'scale3d(1, 1, 1)',
    },
  },
  shakeX: {
    'from, to': {
      transform: 'translate3d(0, 0, 0)',
    },
    '10%, 30%, 50%, 70%, 90%': {
      transform: 'translate3d(-10px, 0, 0)',
    },
    '20%, 40%, 60%, 80%': {
      transform: 'translate3d(10px, 0, 0)',
    },
  },
  shakeY: {
    'from, to': {
      transform: 'translate3d(0, 0, 0)',
    },
    '10%, 30%, 50%, 70%, 90%': {
      transform: 'translate3d(0, -10px, 0)',
    },
    '20%, 40%, 60%, 80%': {
      transform: 'translate3d(0, 10px, 0)',
    },
  },
  headShake: {
    '0%': {
      transform: 'translateX(0)',
    },
    '6.5%': {
      transform: 'translateX(-6px) rotateY(-9deg)',
    },
    '18.5%': {
      transform: 'translateX(5px) rotateY(7deg)',
    },
    '31.5%': {
      transform: 'translateX(-3px) rotateY(-5deg)',
    },
    '43.5%': {
      transform: 'translateX(2px) rotateY(3deg)',
    },
    '50%': {
      transform: 'translateX(0)',
    },
  },
  swing: {
    '20%': {
      transform: 'rotate3d(0, 0, 1, 15deg)',
    },
    '40%': {
      transform: 'rotate3d(0, 0, 1, -10deg)',
    },
    '60%': {
      transform: 'rotate3d(0, 0, 1, 5deg)',
    },
    '80%': {
      transform: 'rotate3d(0, 0, 1, -5deg)',
    },
    'to': {
      transform: 'rotate3d(0, 0, 1, 0deg)',
    },
  },
  tada: {
    'from': {
      transform: 'scale3d(1, 1, 1)',
    },
    '10%, 20%': {
      transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)',
    },
    '30%, 50%, 70%, 90%': {
      transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)',
    },
    '40%, 60%, 80%': {
      transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)',
    },
    'to': {
      transform: 'scale3d(1, 1, 1)',
    },
  },
  wobble: {
    'from': {
      transform: 'translate3d(0, 0, 0)',
    },
    '15%': {
      transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)',
    },
    '30%': {

      transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)',
    },
    '45%': {
      transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)',
    },
    '60%': {
      transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)',
    },
    '75%': {
      transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  jello: {
    'from, 11.1% to': {
      transform: 'translate3d(0, 0, 0)',
    },
    '22.2%': {
      transform: 'skewX(-12.5deg) skewY(-12.5deg)',
    },
    '33.3%': {

      transform: 'skewX(6.25deg) skewY(6.25deg)',
    },
    '44.4%': {
      transform: 'skewX(-3.125deg) skewY(-3.125deg)',
    },
    '55.5%': {
      transform: 'skewX(1.5625deg) skewY(1.5625deg)',
    },
    '66.6%': {
      transform: 'skewX(-0.78125deg) skewY(-0.78125deg)',
    },
    '77.7%': {
      transform: 'skewX(0.390625deg) skewY(0.390625deg)',
    },
    '88.8%': {
      transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)',
    },
  },
  heartBeat: {
    '0%': {
      transform: 'scale(1)',
    },
    '14%': {
      transform: 'scale(1.3)',
    },
    '28%': {
      transform: 'scale(1)',
    },
    '42%': {
      transform: 'scale(1.3)',
    },
    '70%': {
      transform: 'scale(1)',
    },
  },
  hinge: {
    '0%': {
      transformOrigin: 'top left',
      animationTimingFunction: 'ease-in-out',
    },
    '20%, 60%': {
      transform: 'rotate3d(0, 0, 1, 80deg)',
      transformOrigin: 'top left',
      animationTimingFunction: 'ease-in-out',
    },
    '40%, 80%': {
      transform: 'rotate3d(0, 0, 1, 60deg)',
      transformOrigin: 'top left',
      animationTimingFunction: 'ease-in-out',
    },
    'to': {
      transform: 'translate3d(0, 700px, 0)',
      opacity: '0',
    },
  },
  jackInTheBox: {
    'from': {
      opacity: '0',
      transformOrigin: 'center bottom',
      transform: 'scale(0.1) rotate(30deg)',
    },
    '50%': {
      transform: 'rotate(-10deg)',
    },
    '70%': {
      transform: 'rotate(3deg)',
    },
    'to': {
      transform: 'scale(1)',
    },
  },

  // light speed
  lightSpeedInRight: {
    'from': {
      opacity: '0',
      transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
    },
    '60%': {
      opacity: '1',
      transform: 'skewX(20deg)',
    },
    '80%': {
      transform: 'skewX(-5deg)',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  lightSpeedInLeft: {
    'from': {
      opacity: '0',
      transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
    },
    '60%': {
      opacity: '1',
      transform: 'skewX(20deg)',
    },
    '80%': {
      transform: 'skewX(-5deg)',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  lightSpeedOutLeft: {
    'from': {
      opacity: '1',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(100%, 0, 0) skewX(30deg)',
    },
  },
  lightSpeedOutRight: {
    'from': {
      opacity: '1',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(100%, 0, 0) skewX(30deg)',
    },
  },
  // flip
  flip: {
    'from': {
      transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, -360deg)',
      animationTimingFunction: 'ease-out',
    },
    '40%': {
      transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg)',
      animationTimingFunction: 'ease-out',
    },
    '50%': {
      transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg)',
      animationTimingFunction: 'ease-in',
    },
    '80%': {
      transform: 'perspective(400px) scale3d(0.95, 0.95, 0.95) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg)',
      animationTimingFunction: 'ease-in',
    },
    'to': {
      transform: 'perspective(400px) scale3d(1, 1, 1) translate3d(0, 0, 0) rotate3d(0, 1, 0, 0deg)',
      animationTimingFunction: 'ease-in',
    },
  },
  flipInX: {
    'from': {
      transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)',
      animationTimingFunction: 'ease-in',
      opacity: '0',
    },
    '40%': {
      transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)',
      animationTimingFunction: 'ease-in',
    },
    '60%': {
      transform: 'perspective(400px) rotate3d(1, 0, 0, 10deg)',
      opacity: '1',
    },
    '80%': {
      transform: 'perspective(400px) rotate3d(1, 0, 0, -5deg)',
    },
    'to': {
      transform: 'perspective(400px)',
    },
  },
  flipInY: {
    'from': {
      transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)',
      animationTimingFunction: 'ease-in',
      opacity: '0',
    },
    '40%': {
      transform: 'perspective(400px) rotate3d(0, 1, 0, -20deg)',
      animationTimingFunction: 'ease-in',
    },
    '60%': {
      transform: 'perspective(400px) rotate3d(0, 1, 0, 10deg)',
      opacity: '1',
    },
    '80%': {
      transform: 'perspective(400px) rotate3d(0, 1, 0, -5deg)',
    },
    'to': {
      transform: 'perspective(400px)',
    },
  },
  flipOutX: {
    'from': {
      transform: 'perspective(400px)',
    },
    '30%': {
      transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)',
      opacity: '1',
    },
    'to': {
      transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)',
      opacity: '0',
    },
  },
  flipOutY: {
    'from': {
      transform: 'perspective(400px)',
    },
    '30%': {
      transform: 'perspective(400px) rotate3d(0, 1, 0, -15deg)',
      opacity: '1',
    },
    'to': {
      transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)',
      opacity: '0',
    },
  },
  // rotate in
  rotateIn: {
    'from': {
      transformOrigin: 'center',
      transform: 'rotate3d(0, 0, 1, -200deg)',
      opacity: '0',
    },
    'to': {
      transformOrigin: 'center',
      transform: 'translate3d(0, 0, 0)',
      opacity: '1',
    },
  },
  rotateInDownLeft: {
    'from': {
      transformOrigin: 'left bottom',
      transform: 'rotate3d(0, 0, 1, -45deg)',
      opacity: '0',
    },
    'to': {
      transformOrigin: 'left bottom',
      transform: 'translate3d(0, 0, 0)',
      opacity: '1',
    },
  },
  rotateInDownRight: {
    'from': {
      transformOrigin: 'right bottom',
      transform: 'rotate3d(0, 0, 1, 45deg)',
      opacity: '0',
    },
    'to': {
      transformOrigin: 'right bottom',
      transform: 'translate3d(0, 0, 0)',
      opacity: '1',
    },
  },
  rotateInUpLeft: {
    'from': {
      transformOrigin: 'left top',
      transform: 'rotate3d(0, 0, 1, 45deg)',
      opacity: '0',
    },
    'to': {
      transformOrigin: 'left top',
      transform: 'translate3d(0, 0, 0)',
      opacity: '1',
    },
  },
  rotateInUpRight: {
    'from': {
      transformOrigin: 'right bottom',
      transform: 'rotate3d(0, 0, 1, -90deg)',
      opacity: '0',
    },
    'to': {
      transformOrigin: 'right bottom',
      transform: 'translate3d(0, 0, 0)',
      opacity: '1',
    },
  },
  rotateOut: {
    'from': {
      transformOrigin: 'center',
      opacity: '1',
    },
    'to': {
      transformOrigin: 'center',
      transform: 'rotate3d(0, 0, 1, 200deg)',
      opacity: '0',
    },
  },
  rotateOutDownLeft: {
    'from': {
      transformOrigin: 'left bottom',
      opacity: '1',
    },
    'to': {
      transformOrigin: 'left bottom',
      transform: 'rotate3d(0, 0, 1, 45deg)',
      opacity: '0',
    },
  },
  rotateOutDownRight: {
    'from': {
      transformOrigin: 'right bottom',
      opacity: '1',
    },
    'to': {
      transformOrigin: 'right bottom',
      transform: 'rotate3d(0, 0, 1, -45deg)',
      opacity: '0',
    },
  },
  rotateOutUpLeft: {
    'from': {
      transformOrigin: 'left bottom',
      opacity: '1',
    },
    'to': {
      transformOrigin: 'left bottom',
      transform: 'rotate3d(0, 0, 1, -45deg)',
      opacity: '0',
    },
  },
  rotateOutUpRight: {
    'from': {
      transformOrigin: 'right bottom',
      opacity: '1',
    },
    'to': {
      transformOrigin: 'left bottom',
      transform: 'rotate3d(0, 0, 1, 90deg)',
      opacity: '0',
    },
  },
  // roll
  rollIn: {
    'from': {
      opacity: '0',
      transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  rollOut: {
    'from': {
      opacity: '1',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)',
    },
  },
  // zoom in
  zoomIn: {
    'from': {
      opacity: '0',
      transform: 'scale3d(0.3, 0.3, 0.3)',
    },
    '50%': {
      opacity: '1',
    },
  },
  zoomInDown: {
    'from': {
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0)',
      animationTimingFunction: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    '60%': {
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)',
      animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  },
  zoomInLeft: {
    'from': {
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(-1000px, 0, 0)',
      animationTimingFunction: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    '60%': {
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(10px, 0, 0)',
      animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  },
  zoomInRight: {
    'from': {
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(1000px, 0, 0)',
      animationTimingFunction: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    '60%': {
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(-10px, 0, 0)',
      animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  },
  zoomInUp: {
    'from': {
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0)',
      animationTimingFunction: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    '60%': {
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0)',
      animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  },
  // bounce in
  bounceIn: {
    'from, 20%, 40%, 60%, 80%, to': {
      animationTimingFunction: 'ease-in-out',
    },
    '0%': {
      opacity: '0',
      transform: 'scale3d(0.3, 0.3, 0.3)',
    },
    '20%': {
      transform: 'scale3d(1.1, 1.1, 1.1)',
    },
    '40%': {
      transform: 'scale3d(0.9, 0.9, 0.9)',
    },
    '60%': {
      transform: 'scale3d(1.03, 1.03, 1.03)',
      opacity: '1',
    },
    '80%': {
      transform: 'scale3d(0.97, 0.97, 0.97)',
    },
    'to': {
      opacity: '1',
      transform: 'scale3d(1, 1, 1)',
    },
  },
  bounceInDown: {
    'from, 60%, 75%, 90%, to': {
      animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    },
    '0%': {
      opacity: '0',
      transform: 'translate3d(0, -3000px, 0)',
    },
    '60%': {
      opacity: '1',
      transform: 'translate3d(0, 25px, 0)',
    },
    '75%': {
      transform: 'translate3d(0, -10px, 0)',
    },
    '90%': {
      transform: 'translate3d(0, 5px, 0)',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  bounceInLeft: {
    'from, 60%, 75%, 90%, to': {
      animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    },
    '0%': {
      opacity: '0',
      transform: 'translate3d(-3000px, 0, 0)',
    },
    '60%': {
      opacity: '1',
      transform: 'translate3d(25px, 0, 0)',
    },
    '75%': {
      transform: 'translate3d(-10px, 0, 0)',
    },
    '90%': {
      transform: 'translate3d(5px, 0, 0)',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  bounceInRight: {
    'from, 60%, 75%, 90%, to': {
      animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    },
    '0%': {
      opacity: '0',
      transform: 'translate3d(3000px, 0, 0)',
    },
    '60%': {
      opacity: '1',
      transform: 'translate3d(-25px, 0, 0)',
    },
    '75%': {
      transform: 'translate3d(10px, 0, 0)',
    },
    '90%': {
      transform: 'translate3d(-5px, 0, 0)',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  bounceInUp: {
    'from, 60%, 75%, 90%, to': {
      animationTimingFunction: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    },
    '0%': {
      opacity: '0',
      transform: 'translate3d(0, 3000px, 0)',
    },
    '60%': {
      opacity: '1',
      transform: 'translate3d(0, -20px, 0)',
    },
    '75%': {
      transform: 'translate3d(0, 10px, 0)',
    },
    '90%': {
      transform: 'translate3d(0, -5px, 0)',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  // bounce out
  bounceOut: {
    '20%': {
      transform: 'scale3d(0.9, 0.9, 0.9)',
    },
    '50%, 55%': {
      opacity: '1',
      transform: 'scale3d(1.1, 1.1, 1.1)',
    },
    'to': {
      opacity: '0',
      transform: 'scale3d(0.3, 0.3, 0.3)',
    },
  },
  bounceOutDown: {
    '20%': {
      transform: 'translate3d(0, 10px, 0)',
    },
    '40%, 45%': {
      opacity: '1',
      transform: 'translate3d(0, -20px, 0)',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(0, 2000px, 0)',
    },
  },
  bounceOutLeft: {
    '20%': {
      opacity: '1',
      transform: 'translate3d(20px, 0, 0)',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(-2000px, 0, 0)',
    },
  },
  bounceOutRight: {
    '20%': {
      opacity: '1',
      transform: 'translate3d(-20px, 0, 0)',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(2000px, 0, 0)',
    },
  },
  bounceOutUp: {
    '20%': {
      transform: 'translate3d(0, -10px, 0)',
    },
    '40%, 45%': {
      opacity: '1',
      transform: 'translate3d(0, 20px, 0)',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(0, -2000px, 0)',
    },
  },
  // zoom out
  zoomOut: {
    'from': {
      opacity: '1',
    },
    '50%': {
      opacity: '0',
      transform: 'scale3d(0.3, 0.3, 0.3)',
    },
    'to': {
      opacity: '0',
    },
  },
  zoomOutDown: {
    '40%': {
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0)',
      animationTimingFunction: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    'to': {
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, 2000px, 0)',
      transformOrigin: 'center bottom',
      animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  },
  zoomOutLeft: {
    '40%': {
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(42px, 0, 0)',
    },
    'to': {
      opacity: '0',
      transform: 'scale(0.1) translate3d(-2000px, 0, 0)',
      transformOrigin: 'left center',
    },
  },
  zoomOutRight: {
    '40%': {
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(-42px, 0, 0)',
    },
    'to': {
      opacity: '0',
      transform: 'scale(0.1) translate3d(2000px, 0, 0)',
      transformOrigin: 'right center',
    },
  },
  zoomOutUp: {
    '40%': {
      opacity: '1',
      transform: 'scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0)',
      animationTimingFunction: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    },
    'to': {
      opacity: '0',
      transform: 'scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0)',
      transformOrigin: 'center bottom',
      animationTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1)',
    },
  },
  // slide in
  slideInDown: {
    'from': {
      transform: 'translate3d(0, -100%, 0)',
      visibility: 'visible',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  slideInLeft: {
    'from': {
      transform: 'translate3d(-100%, 0, 0)',
      visibility: 'visible',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  slideInRight: {
    'from': {
      transform: 'translate3d(100%, 0, 0)',
      visibility: 'visible',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  slideInUp: {
    'from': {
      transform: 'translate3d(0, 100%, 0)',
      visibility: 'visible',
    },
    'to': {
      transform: 'translate3d(0, 0, 0)',
    },
  },
  // slide out
  slideOutDown: {
    'from': {
      transform: 'translate3d(0, 0, 0)',
    },
    'to': {
      visibility: 'hidden',
      transform: 'translate3d(0, 100%, 0)',
    },
  },
  slideOutLeft: {
    'from': {
      transform: 'translate3d(0, 0, 0)',
    },
    'to': {
      visibility: 'hidden',
      transform: 'translate3d(-100%, 0, 0)',
    },
  },
  slideOutRight: {
    'from': {
      transform: 'translate3d(0, 0, 0)',
    },
    'to': {
      visibility: 'hidden',
      transform: 'translate3d(100%, 0, 0)',
    },
  },
  slideOutUp: {
    'from': {
      transform: 'translate3d(0, 0, 0)',
    },
    'to': {
      visibility: 'hidden',
      transform: 'translate3d(0, -100%, 0)',
    },
  },
  // fade in
  fadeIn: {
    'from': {
      opacity: '0',
    },
    'to': {
      opacity: '1',
    },
  },
  fadeInDown: {
    'from': {
      opacity: '0',
      transform: 'translate3d(0, -100%, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInDownBig: {
    'from': {
      opacity: '0',
      transform: 'translate3d(0, -2000px, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInLeft: {
    'from': {
      opacity: '0',
      transform: 'translate3d(-100%, 0, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInLeftBig: {
    'from': {
      opacity: '0',
      transform: 'translate3d(-2000px, 0, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInRight: {
    'from': {
      opacity: '0',
      transform: 'translate3d(100%, 0, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInRightBig: {
    'from': {
      opacity: '0',
      transform: 'translate3d(2000px, 0, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInUp: {
    'from': {
      opacity: '0',
      transform: 'translate3d(0, 100%, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInUpBig: {
    'from': {
      opacity: '0',
      transform: 'translate3d(0, 2000px, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInTopLeft: {
    'from': {
      opacity: '0',
      transform: 'translate3d(-100%, -100%, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInTopRight: {
    'from': {
      opacity: '0',
      transform: 'translate3d(100%, -100%, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInBottomLeft: {
    'from': {
      opacity: '0',
      transform: 'translate3d(-100%, 100%, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  fadeInBottomRight: {
    'from': {
      opacity: '0',
      transform: 'translate3d(100%, 100%, 0)',
    },
    'to': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',
    },
  },
  // fade out
  fadeOut: {
    'from': {
      opacity: '1',
    },
    'to': {
      opacity: '0',
    },
  },
  fadeOutDown: {
    'from': {
      opacity: '1',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(0, 100%, 0)',
    },
  },
  fadeOutDownBig: {
    'from': {
      opacity: '1',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(0, 2000px, 0)',
    },
  },
  fadeOutLeft: {
    'from': {
      opacity: '1',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(-100%, 0, 0)',
    },
  },
  fadeOutLeftBig: {
    'from': {
      opacity: '1',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(-2000px, 0, 0)',
    },
  },
  fadeOutRight: {
    'from': {
      opacity: '1',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(100%, 0, 0)',
    },
  },
  fadeOutRightBig: {
    'from': {
      opacity: '1',

    },
    'to': {
      opacity: '0',
      transform: 'translate3d(2000px, 0, 0)',
    },
  },
  fadeOutUp: {
    'from': {
      opacity: '1',
    },
    'to': {
      opacity: '0',
      transform: 'translate3d(0, -100%, 0)',
    },
  },
  fadeOutUpBig: {
    'from': {
      opacity: '1',

    },
    'to': {
      opacity: '0',
      transform: 'translate3d(0, -2000px, 0)',
    },
  },
  fadeOutTopLeft: {
    'from': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',

    },
    'to': {
      opacity: '0',
      transform: 'translate3d(-100%, -100%, 0)',
    },
  },
  fadeOutTopRight: {
    'from': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',

    },
    'to': {
      opacity: '0',
      transform: 'translate3d(100%, -100%, 0)',
    },
  },
  fadeOutBottomLeft: {
    'from': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',

    },
    'to': {
      opacity: '0',
      transform: 'translate3d(-100%, 100%, 0)',
    },
  },
  fadeOutBottomRight: {
    'from': {
      opacity: '1',
      transform: 'translate3d(0, 0, 0)',

    },
    'to': {
      opacity: '0',
      transform: 'translate3d(100%, 100%, 0)',
    },
  },
  // back in
  backInUp: {
    '0%': {
      opacity: '0.7',
      transform: 'translateY(1200px) scale(0.7)',
    },
    '80%': {
      opacity: '0.7',
      transform: 'translateY(0px) scale(0.7)',
    },
    '100%': {
      opacity: '1',
      transform: 'scale(1)',
    },
  },
  backInDown: {
    '0%': {
      opacity: '0.7',
      transform: 'translateY(-1200px) scale(0.7)',
    },
    '80%': {
      opacity: '0.7',
      transform: 'translateY(0px) scale(0.7)',
    },
    '100%': {
      opacity: '1',
      transform: 'scale(1)',
    },
  },
  backInLeft: {
    '0%': {
      opacity: '0.7',
      transform: 'translateX(-2000px) scale(0.7)',
    },
    '80%': {
      opacity: '0.7',
      transform: 'translateX(0px) scale(0.7)',
    },
    '100%': {
      opacity: '1',
      transform: 'scale(1)',
    },
  },
  backInRight: {
    '0%': {
      opacity: '0.7',
      transform: 'translateX(2000px) scale(0.7)',
    },
    '80%': {
      opacity: '0.7',
      transform: 'translateY(0px) scale(0.7)',
    },
    '100%': {
      opacity: '1',
      transform: 'scale(1)',
    },
  },
  // back out
  backOutUp: {
    '0%': {
      opacity: '1',
      transform: 'scale(1)',
    },
    '80%': {
      opacity: '0.7',
      transform: 'translateY(0px) scale(0.7)',
    },
    '100%': {
      opacity: '0.7',
      transform: 'translateY(-700px) scale(0.7)',
    },
  },
  backOutDown: {
    '0%': {
      opacity: '1',
      transform: 'scale(1)',
    },
    '80%': {
      opacity: '0.7',
      transform: 'translateY(0px) scale(0.7)',
    },
    '100%': {
      opacity: '0.7',
      transform: 'translateY(700px) scale(0.7)',
    },
  },
  backOutLeft: {
    '0%': {
      opacity: '1',
      transform: 'scale(1)',
    },
    '80%': {
      opacity: '0.7',
      transform: 'translateX(-2000px) scale(0.7)',
    },
    '100%': {
      opacity: '0.7',
      transform: 'translateY(-700px) scale(0.7)',
    },
  },
  backOutRight: {
    '0%': {
      opacity: '1',
      transform: 'scale(1)',
    },
    '80%': {
      opacity: '0.7',
      transform: 'translateY(0px) scale(0.7)',
    },
    '100%': {
      opacity: '0.7',
      transform: 'translateX(2000px) scale(0.7)',
    },
  },
};

const createPlugin$1 = (
  plugin,
  config
) => {
  return {
    handler: plugin,
    config,
  };
};

createPlugin$1.withOptions = function(
  pluginFunction,
  configFunction = () => ({}),
) {
  const optionsFunction = function (options= {} ) {
    return {
      __options: options,
      handler: pluginFunction(options),
      config: configFunction(options),
    };
  };

  optionsFunction.__isOptionsFunction = true ;

  // Expose plugin dependencies so that `object-hash` returns a different
  // value if anything here changes, to ensure a rebuild is triggered.
  optionsFunction.__pluginFunction = pluginFunction;
  optionsFunction.__configFunction = configFunction;

  return optionsFunction;
};

function _nullishCoalesce$3(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } }

const defaultColors = {
  transparent: 'transparent',
  current: 'currentColor',
  inherit: 'inherit',
  light: colors.light,
  dark: colors.dark,
  black: colors.black,
  white: colors.white,
  slate: colors.slate,
  gray: colors.gray,
  zinc: colors.zinc,
  neutral: colors.neutral,
  stone: colors.stone,
  red: colors.red,
  yellow: colors.amber,
  green: colors.emerald,
  blue: colors.blue,
  indigo: colors.indigo,
  purple: colors.violet,
  pink: colors.pink,
  rose: colors.rose,
  fuchsia: colors.fuchsia,
  violet: colors.violet,
  cyan: colors.cyan,
  teal: colors.teal,
  emerald: colors.emerald,
  lime: colors.lime,
  amber: colors.amber,
  orange: colors.orange,
  sky: colors.sky,
  'light-blue': colors.sky,
  'warm-gray': colors.stone,
  'true-gray': colors.neutral,
  'cool-gray': colors.gray,
  'blue-gray': colors.slate,
};

// tShirtScale describes the sizes xs - 7xl
const tShirtScale = {
  'xs': '20rem',
  'sm': '24rem',
  'md': '28rem',
  'lg': '32rem',
  'xl': '36rem',
  '2xl': '42rem',
  '3xl': '48rem',
  '4xl': '56rem',
  '5xl': '64rem',
  '6xl': '72rem',
  '7xl': '80rem',
};

const baseConfig = {
  // purge: [],
  presets: [],
  prefixer: true,
  attributify: false,
  darkMode: 'class', // or 'media'
  theme: {
    orientation: {
      portrait: 'portrait',
      landscape: 'landscape',
    },
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    colors: defaultColors,
    spacing: {
      px: '1px',
      0: '0px',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
      // float -> float/4 rem
    },
    animation: {
      none: 'none',
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      bounce: 'bounce 1s infinite',
      'shock': {
        animation: 'shock',
        transformOrigin: 'center bottom',
      },
      'flash': 'flash',
      'bubble': 'bubble',
      'rubber-band': 'rubberBand',
      'shake-x': 'shakeX',
      'shake-y': 'shakeY',
      'head-shake': 'headShake 1s ease-in-out',
      'swing': {
        animation: 'swing',
        transformOrigin: 'top center',
      },
      'tada': 'tada',
      'wobble': 'wobble',
      'jello': 'jello',
      'heart-beat': 'heartBeat 1s ease-in-out',
      'hinge': 'hinge 2s',
      'jack-in': 'jackInTheBox',
      'light-speed-in-left': 'lightSpeedInLeft',
      'light-speed-in-right': 'lightSpeedInRight',
      'light-speed-out-left': 'lightSpeedOutLeft',
      'light-speed-out-right': 'lightSpeedOutRight',
      'flip': {
        animation: 'flip',
        backfaceVisibility: 'visible',
      },
      'flip-in-x': {
        animation: 'flipInX',
        backfaceVisibility: 'visible',
      },
      'flip-in-y': {
        animation: 'flipInY',
        backfaceVisibility: 'visible',
      },
      'flip-out-x': {
        animation: 'flipOutX',
        backfaceVisibility: 'visible',
      },
      'flip-out-y': {
        animation: 'flipOutY',
        backfaceVisibility: 'visible',
      },
      'rotate-in': 'rotateIn',
      'rotate-in-down-left': 'rotateInDownLeft',
      'rotate-in-down-right': 'rotateInDownRight',
      'rotate-in-up-left': 'rotateInUpLeft',
      'rotate-in-up-right': 'rotateInUpRight',
      'rotate-out': 'rotateOut',
      'rotate-out-down-left': 'rotateOutDownLeft',
      'rotate-out-down-right': 'rotateOutDownRight',
      'rotate-out-up-left': 'rotateOutUpLeft',
      'rotate-out-up-right': 'rotateOutUpRight',
      'roll-in': 'rollIn',
      'roll-out': 'rollOut',
      'zoom-in': 'zoomIn',
      'zoom-in-down': 'zoomInDown',
      'zoom-in-left': 'zoomInLeft',
      'zoom-in-right': 'zoomInRight',
      'zoom-in-up': 'zoomInUp',
      'bounce-in': 'bounceIn 750ms',
      'bounce-in-down': 'bounceInDown',
      'bounce-in-left': 'bounceInLeft',
      'bounce-in-right': 'bounceInRight',
      'bounce-in-up': 'bounceInUp',
      'bounce-out': 'bounceOut 750ms',
      'bounce-out-down': 'bounceOutDown',
      'bounce-out-left': 'bounceOutLeft',
      'bounce-out-right': 'bounceOutRight',
      'bounce-out-up': 'bounceOutUp',
      'zoom-out': 'zoomOut',
      'zoom-out-down': 'zoomOutDown',
      'zoom-out-left': 'zoomOutLeft',
      'zoom-out-right': 'zoomOutRight',
      'zoom-out-up': 'zoomOutUp',
      'slide-in-down': 'slideInDown',
      'slide-in-left': 'slideInLeft',
      'slide-in-right': 'slideInRight',
      'slide-in-up': 'slideInUp',
      'slide-out-down': 'slideOutDown',
      'slide-out-left': 'slideOutLeft',
      'slide-out-right': 'slideOutRight',
      'slide-out-up': 'slideOutUp',
      'fade-in': 'fadeIn',
      'fade-in-down': 'fadeInDown',
      'fade-in-down-big': 'fadeInDownBig',
      'fade-in-left': 'fadeInLeft',
      'fade-in-left-big': 'fadeInLeftBig',
      'fade-in-right': 'fadeInRight',
      'fade-in-right-big': 'fadeInRightBig',
      'fade-in-up': 'fadeInUp',
      'fade-in-up-big': 'fadeInUpBig',
      'fade-in-top-left': 'fadeInTopLeft',
      'fade-in-top-right': 'fadeInTopRight',
      'fade-in-bottom-left': 'fadeInBottomLeft',
      'fade-in-bottom-right': 'fadeInBottomRight',
      'fade-out': 'fadeOut',
      'fade-out-down': 'fadeOutDown',
      'fade-out-down-big': 'fadeOutDownBig',
      'fade-out-left': 'fadeOutLeft',
      'fade-out-left-big': 'fadeOutLeftBig',
      'fade-out-right': 'fadeOutRight',
      'fade-out-right-big': 'fadeOutRightBig',
      'fade-out-up': 'fadeOutUp',
      'fade-out-up-big': 'fadeOutUpBig',
      'back-in-up': 'backInUp',
      'back-in-down': 'backInDown',
      'back-in-left': 'backInLeft',
      'back-in-right': 'backInRight',
      'back-out-up': 'backOutUp',
      'back-out-down': 'backOutDown',
      'back-out-left': 'backOutLeft',
      'back-out-right': 'backOutRight',
    },
    animationDuration: {
      DEFAULT: '1000ms',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
      1500: '1500ms',
      2000: '2000ms',
      2500: '2500ms',
      3000: '3000ms',
      // int >=0 -> int ms
    },
    animationDelay: {
      DEFAULT: '500ms',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
      1500: '1500ms',
      2000: '2000ms',
      2500: '2500ms',
      3000: '3000ms',
      // int >=0 -> int ms
    },
    animationIterationCount: {
      DEFAULT: '1',
      loop: 'infinite',
      'repeat-1': '1',
      'repeat-2': '2',
      'repeat-3': '3',
      'repeat-4': '4',
      'repeat-5': '5',
      'repeat-6': '6',
      'repeat-7': '7',
      'repeat-8': '8',
      'repeat-9': '9',
      'repeat-10': '10',
      'repeat-11': '11',
      'repeat-12': '12',
    },
    animationTimingFunction: {
      DEFAULT: 'ease',
      linear: 'linear',
      in: 'ease-in',
      out: 'ease-out',
      'in-out': 'ease-in-out',
    },
    backdropBlur: (theme) => theme('blur'),
    backdropBrightness: (theme) => theme('brightness'),
    backdropContrast: (theme) => theme('contrast'),
    backdropGrayscale: (theme) => theme('grayscale'),
    backdropHueRotate: (theme) => theme('hueRotate'),
    backdropInvert: (theme) => theme('invert'),
    backdropOpacity: (theme) => theme('opacity'),
    backdropSaturate: (theme) => theme('saturate'),
    backdropSepia: (theme) => theme('sepia'),
    backgroundColor: (theme) => theme('colors'),
    backgroundImage: {
      none: 'none',
      'gradient-1': 'linear-gradient(135deg, #FDEB71 10%, #F8D800 100%)',
      'gradient-2': 'linear-gradient(135deg, #ABDCFF 10%, #0396FF 100%)',
      'gradient-3': 'linear-gradient(135deg, #FEB692 10%, #EA5455 100%)',
      'gradient-4': 'linear-gradient(135deg, #CE9FFC 10%, #7367F0 100%)',
      'gradient-5': 'linear-gradient(135deg, #90F7EC 10%, #32CCBC 100%)',
      'gradient-6': 'linear-gradient(135deg, #FFF6B7 10%, #F6416C 100%)',
      'gradient-7': 'linear-gradient(135deg, #81FBB8 10%, #28C76F 100%)',
      'gradient-8': 'linear-gradient(135deg, #E2B0FF 10%, #9F44D3 100%)',
      'gradient-9': 'linear-gradient(135deg, #F97794 10%, #623AA2 100%)',
      'gradient-10': 'linear-gradient(135deg, #FCCF31 10%, #F55555 100%)',
      'gradient-11': 'linear-gradient(135deg, #F761A1 10%, #8C1BAB 100%)',
      'gradient-12': 'linear-gradient(135deg, #43CBFF 10%, #9708CC 100%)',
      'gradient-13': 'linear-gradient(135deg, #5EFCE8 10%, #736EFE 100%)',
      'gradient-14': 'linear-gradient(135deg, #FAD7A1 10%, #E96D71 100%)',
      'gradient-15': 'linear-gradient(135deg, #FFD26F 10%, #3677FF 100%)',
      'gradient-16': 'linear-gradient(135deg, #A0FE65 10%, #FA016D 100%)',
      'gradient-17': 'linear-gradient(135deg, #FFDB01 10%, #0E197D 100%)',
      'gradient-18': 'linear-gradient(135deg, #FEC163 10%, #DE4313 100%)',
      'gradient-19': 'linear-gradient(135deg, #92FFC0 10%, #002661 100%)',
      'gradient-20': 'linear-gradient(135deg, #EEAD92 10%, #6018DC 100%)',
      'gradient-21': 'linear-gradient(135deg, #F6CEEC 10%, #D939CD 100%)',
      'gradient-22': 'linear-gradient(135deg, #52E5E7 10%, #130CB7 100%)',
      'gradient-23': 'linear-gradient(135deg, #F1CA74 10%, #A64DB6 100%)',
      'gradient-24': 'linear-gradient(135deg, #E8D07A 10%, #5312D6 100%)',
      'gradient-25': 'linear-gradient(135deg, #EECE13 10%, #B210FF 100%)',
      'gradient-26': 'linear-gradient(135deg, #79F1A4 10%, #0E5CAD 100%)',
      'gradient-27': 'linear-gradient(135deg, #FDD819 10%, #E80505 100%)',
      'gradient-28': 'linear-gradient(135deg, #FFF3B0 10%, #CA26FF 100%)',
      'gradient-29': 'linear-gradient(135deg, #FFF5C3 10%, #9452A5 100%)',
      'gradient-30': 'linear-gradient(135deg, #F05F57 10%, #360940 100%)',
      'gradient-31': 'linear-gradient(135deg, #2AFADF 10%, #4C83FF 100%)',
      'gradient-32': 'linear-gradient(135deg, #FFF886 10%, #F072B6 100%)',
      'gradient-33': 'linear-gradient(135deg, #97ABFF 10%, #123597 100%)',
      'gradient-34': 'linear-gradient(135deg, #F5CBFF 10%, #C346C2 100%)',
      'gradient-35': 'linear-gradient(135deg, #FFF720 10%, #3CD500 100%)',
      'gradient-36': 'linear-gradient(135deg, #FF6FD8 10%, #3813C2 100%)',
      'gradient-37': 'linear-gradient(135deg, #EE9AE5 10%, #5961F9 100%)',
      'gradient-38': 'linear-gradient(135deg, #FFD3A5 10%, #FD6585 100%)',
      'gradient-39': 'linear-gradient(135deg, #C2FFD8 10%, #465EFB 100%)',
      'gradient-40': 'linear-gradient(135deg, #FD6585 10%, #0D25B9 100%)',
      'gradient-41': 'linear-gradient(135deg, #FD6E6A 10%, #FFC600 100%)',
      'gradient-42': 'linear-gradient(135deg, #65FDF0 10%, #1D6FA3 100%)',
      'gradient-43': 'linear-gradient(135deg, #6B73FF 10%, #000DFF 100%)',
      'gradient-44': 'linear-gradient(135deg, #FF7AF5 10%, #513162 100%)',
      'gradient-45': 'linear-gradient(135deg, #F0FF00 10%, #58CFFB 100%)',
      'gradient-46': 'linear-gradient(135deg, #FFE985 10%, #FA742B 100%)',
      'gradient-47': 'linear-gradient(135deg, #FFA6B7 10%, #1E2AD2 100%)',
      'gradient-48': 'linear-gradient(135deg, #FFAA85 10%, #B3315F 100%)',
      'gradient-49': 'linear-gradient(135deg, #72EDF2 10%, #5151E5 100%)',
      'gradient-50': 'linear-gradient(135deg, #FF9D6C 10%, #BB4E75 100%)',
      'gradient-51': 'linear-gradient(135deg, #F6D242 10%, #FF52E5 100%)',
      'gradient-52': 'linear-gradient(135deg, #69FF97 10%, #00E4FF 100%)',
      'gradient-53': 'linear-gradient(135deg, #3B2667 10%, #BC78EC 100%)',
      'gradient-54': 'linear-gradient(135deg, #70F570 10%, #49C628 100%)',
      'gradient-55': 'linear-gradient(135deg, #3C8CE7 10%, #00EAFF 100%)',
      'gradient-56': 'linear-gradient(135deg, #FAB2FF 10%, #1904E5 100%)',
      'gradient-57': 'linear-gradient(135deg, #81FFEF 10%, #F067B4 100%)',
      'gradient-58': 'linear-gradient(135deg, #FFA8A8 10%, #FCFF00 100%)',
      'gradient-59': 'linear-gradient(135deg, #FFCF71 10%, #2376DD 100%)',
      'gradient-60': 'linear-gradient(135deg, #FF96F9 10%, #C32BAC 100%)',

      'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
      'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
      'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
      'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
      'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))',
    },
    backgroundOpacity: (theme) => theme('opacity'),
    backgroundPosition: {
      bottom: 'bottom',
      center: 'center',
      left: 'left',
      'left-bottom': 'left bottom',
      'left-top': 'left top',
      right: 'right',
      'right-bottom': 'right bottom',
      'right-top': 'right top',
      top: 'top',
    },
    backgroundSize: {
      auto: 'auto',
      cover: 'cover',
      contain: 'contain',
    },
    blur: {
      DEFAULT: '8px',
      0: '0',
      sm: '4px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      '2xl': '40px',
      '3xl': '64px',
    },
    borderColor: (theme) => ({
      DEFAULT: theme('colors.gray.200', 'currentColor'),
      ...(_nullishCoalesce$3(theme('colors'), () => ( {}))),
    }),
    borderOpacity: (theme) => theme('opacity'),
    borderRadius: {
      DEFAULT: '0.25rem',
      none: '0px',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      '1': '100%',
      full: '9999px',
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0px',
      2: '2px',
      4: '4px',
      8: '8px',
      // int >=0 -> int px
    },
    boxShadow: {
      DEFAULT: '0 1px 3px 0 rgb(0 0 0/0.1),0 1px 2px -1px rgb(0 0 0/0.1)',
      sm: '0 1px 2px 0 rgb(0 0 0/0.05)',
      md: '0 4px 6px -1px rgb(0 0 0/0.1),0 2px 4px -2px rgb(0 0 0/0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0/0.1),0 4px 6px -4px rgb(0 0 0/0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0/0.1),0 8px 10px -6px rgb(0 0 0/0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0/0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0/0.05)',
      none: '0 0 #0000',
    },
    boxShadowColor: (theme) => theme('colors'),
    brightness: {
      0: '0',
      50: '.5',
      75: '.75',
      90: '.9',
      95: '.95',
      100: '1',
      105: '1.05',
      110: '1.1',
      125: '1.25',
      150: '1.5',
      200: '2',
    },
    caretColor: (theme) => ({
      auto: 'auto',
      ...(_nullishCoalesce$3(theme('colors'), () => ( {}))),
    }),
    caretOpacity: (theme) => theme('opacity'),
    columns: {
      ...tShirtScale,
      auto: 'auto',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      '3xs': '16rem',
      '2xs': '18rem',
    },
    container: {},
    content: {
      DEFAULT: '""',
      'open-quote': 'open-quote',
      'close-quote': 'close-quote',
      'open-square': '"["',
      'close-square': '"]"',
      'open-curly': '"{"',
      'close-curly': '"}"',
      'open-bracket': '"("',
      'close-bracket': '")"',
    },
    contrast: {
      0: '0',
      50: '.5',
      75: '.75',
      100: '1',
      125: '1.25',
      150: '1.5',
      200: '2',
    },
    cursor: {
      auto: 'auto',
      default: 'default',
      pointer: 'pointer',
      wait: 'wait',
      text: 'text',
      move: 'move',
      help: 'help',
      'not-allowed': 'not-allowed',
    },
    divideColor: (theme) => theme('borderColor'),
    divideOpacity: (theme) => theme('borderOpacity'),
    divideWidth: (theme) => theme('borderWidth'),
    dropShadow: {
      DEFAULT: ['0 1px 2px rgba(0, 0, 0, 0.1)', '0 1px 1px rgba(0, 0, 0, 0.06)'],
      sm: '0 1px 1px rgba(0,0,0,0.05)',
      md: ['0 4px 3px rgba(0, 0, 0, 0.07)', '0 2px 2px rgba(0, 0, 0, 0.06)'],
      lg: ['0 10px 8px rgba(0, 0, 0, 0.04)', '0 4px 3px rgba(0, 0, 0, 0.1)'],
      xl: ['0 20px 13px rgba(0, 0, 0, 0.03)', '0 8px 5px rgba(0, 0, 0, 0.08)'],
      '2xl': '0 25px 25px rgba(0, 0, 0, 0.15)',
      none: '0 0 #0000',
    },
    fill: (theme) => ({
      ...(_nullishCoalesce$3(theme('colors'), () => ( {}))),
      none: 'none',
    }),
    flex: {
      1: '1 1 0%',
      auto: '1 1 auto',
      initial: '0 1 auto',
      none: 'none',
    },
    flexGrow: {
      DEFAULT: '1',
      0: '0',
    },
    flexShrink: {
      DEFAULT: '1',
      0: '0',
    },
    fontFamily: {
      sans: [
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: [
        'ui-serif',
        'Georgia',
        'Cambria',
        '"Times New Roman"',
        'Times',
        'serif',
      ],
      mono: [
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
      // nxl -> [n rem, lineHeight: 1]
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
      // int[0, 900] -> int
    },
    gap: (theme) => theme('spacing'),
    gradientColorStops: (theme) => theme('colors'),
    grayscale: {
      DEFAULT: '100%',
      0: '0',
    },
    gridAutoColumns: {
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fr: 'minmax(0, 1fr)',
    },
    gridAutoRows: {
      auto: 'auto',
      min: 'min-content',
      max: 'max-content',
      fr: 'minmax(0, 1fr)',
    },
    gridColumn: {
      auto: 'auto',
      'span-1': 'span 1 / span 1',
      'span-2': 'span 2 / span 2',
      'span-3': 'span 3 / span 3',
      'span-4': 'span 4 / span 4',
      'span-5': 'span 5 / span 5',
      'span-6': 'span 6 / span 6',
      'span-7': 'span 7 / span 7',
      'span-8': 'span 8 / span 8',
      'span-9': 'span 9 / span 9',
      'span-10': 'span 10 / span 10',
      'span-11': 'span 11 / span 11',
      'span-12': 'span 12 / span 12',
      // span-int(>=1) -> span int / span int
      'span-full': '1 / -1',
    },
    gridColumnEnd: {
      auto: 'auto',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      13: '13',
      // int >=1 -> int
    },
    gridColumnStart: {
      auto: 'auto',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      13: '13',
      // int >=1 -> int
    },
    gridRow: {
      auto: 'auto',
      'span-1': 'span 1 / span 1',
      'span-2': 'span 2 / span 2',
      'span-3': 'span 3 / span 3',
      'span-4': 'span 4 / span 4',
      'span-5': 'span 5 / span 5',
      'span-6': 'span 6 / span 6',
      // span-int(>=1) -> span int / span int
      'span-full': '1 / -1',
    },
    gridRowStart: {
      auto: 'auto',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      // int >=1 -> int
    },
    gridRowEnd: {
      auto: 'auto',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      // int >=1 -> int
    },
    gridTemplateColumns: {
      none: 'none',
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      5: 'repeat(5, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      7: 'repeat(7, minmax(0, 1fr))',
      8: 'repeat(8, minmax(0, 1fr))',
      9: 'repeat(9, minmax(0, 1fr))',
      10: 'repeat(10, minmax(0, 1fr))',
      11: 'repeat(11, minmax(0, 1fr))',
      12: 'repeat(12, minmax(0, 1fr))',
      // int >=1 -> repeat(int, minmax(0, 1fr))
    },
    gridTemplateRows: {
      none: 'none',
      1: 'repeat(1, minmax(0, 1fr))',
      2: 'repeat(2, minmax(0, 1fr))',
      3: 'repeat(3, minmax(0, 1fr))',
      4: 'repeat(4, minmax(0, 1fr))',
      5: 'repeat(5, minmax(0, 1fr))',
      6: 'repeat(6, minmax(0, 1fr))',
      // int >=1 -> repeat(int, minmax(0, 1fr))
    },
    height: (theme, { breakpoints }) => ({
      ...(_nullishCoalesce$3(theme('spacing'), () => ( {}))),
      ...tShirtScale,
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      // fraction -> percent
      auto: 'auto',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      prose: '65ch',
      screen: '100vh',
      ...breakpoints(_nullishCoalesce$3(theme('screens'), () => ( {}))),
    }),
    hueRotate: {
      '-180': '-180deg',
      '-90': '-90deg',
      '-60': '-60deg',
      '-30': '-30deg',
      '-15': '-15deg',
      0: '0deg',
      15: '15deg',
      30: '30deg',
      60: '60deg',
      90: '90deg',
      180: '180deg',
    },
    inset: (theme, { negative }) => ({
      auto: 'auto',
      ...(_nullishCoalesce$3(theme('spacing'), () => ( {}))),
      ...negative(theme('spacing')),
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      full: '100%',
      '-1/2': '-50%',
      '-1/3': '-33.333333%',
      '-2/3': '-66.666667%',
      '-1/4': '-25%',
      '-2/4': '-50%',
      '-3/4': '-75%',
      '-full': '-100%',
      // fraction -> percent
      // ...negative
    }),
    invert: {
      DEFAULT: '100%',
      0: '0',
    },
    keyframes,
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
      3: '.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      // int>=0 -> int/4 rem
    },
    listStyleType: {
      none: 'none',
      circle: 'circle',
      square: 'square',
      disc: 'disc',
      decimal: 'decimal',
      'zero-decimal': 'decimal-leading-zero',
      greek: 'lower-greek',
      roman: 'lower-roman',
      alpha: 'lower-alpha',
      'upper-roman': 'upper-roman',
      'upper-alpha': 'upper-alpha',
    },
    margin: (theme, { negative }) => ({
      auto: 'auto',
      ...(_nullishCoalesce$3(theme('spacing'), () => ( {}))),
      ...negative(theme('spacing')),
      // ...negative
    }),
    maxHeight: (theme, { breakpoints }) => ({
      ...breakpoints(_nullishCoalesce$3(theme('screens'), () => ( {}))),
      ...(_nullishCoalesce$3(theme('spacing'), () => ( {}))),
      ...tShirtScale,
      none: 'none',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      prose: '65ch',
      screen: '100vh',
    }),
    maxWidth: (theme, { breakpoints }) => ({
      ...breakpoints(_nullishCoalesce$3(theme('screens'), () => ( {}))),
      ...(_nullishCoalesce$3(theme('spacing'), () => ( {}))),
      ...tShirtScale,
      none: 'none',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      prose: '65ch',
      screen: '100vw',
    }),
    minHeight: (theme) => theme('maxHeight'),
    minWidth: (theme) => theme('maxWidth'),
    objectPosition: {
      bottom: 'bottom',
      center: 'center',
      left: 'left',
      'left-bottom': 'left bottom',
      'left-top': 'left top',
      right: 'right',
      'right-bottom': 'right bottom',
      'right-top': 'right top',
      top: 'top',
    },
    opacity: {
      0: '0',
      5: '0.05',
      10: '0.1',
      20: '0.2',
      25: '0.25',
      30: '0.3',
      40: '0.4',
      50: '0.5',
      60: '0.6',
      70: '0.7',
      75: '0.75',
      80: '0.8',
      90: '0.9',
      95: '0.95',
      100: '1',
      // float -> float/100
    },
    order: {
      first: '-9999',
      last: '9999',
      none: '0',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      // int[1, 9999]
    },
    outlineColor: (theme) => theme('colors'),
    outlineWidth: {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    outlineOffset: {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    padding: (theme) => theme('spacing'),
    perspective: (theme) => ({
      ...(_nullishCoalesce$3(theme('spacing'), () => ( {}))),
      ...tShirtScale,
      none: 'none',
    }),
    perspectiveOrigin: {
      center: 'center',
      top: 'top',
      'top-right': 'top right',
      right: 'right',
      'bottom-right': 'bottom right',
      bottom: 'bottom',
      'bottom-left': 'bottom left',
      left: 'left',
      'top-left': 'top left',
    },
    placeholderColor: (theme) => theme('colors'),
    placeholderOpacity: (theme) => theme('opacity'),
    ringColor: (theme) => ({
      DEFAULT: theme('colors.blue.500', '#3b82f6'),
      ...(_nullishCoalesce$3(theme('colors'), () => ( {}))),
    }),
    ringOffsetColor: (theme) => theme('colors'),
    ringOffsetWidth: {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
      // float -> float px
    },
    ringOpacity: (theme) => ({
      DEFAULT: '0.5',
      ...(_nullishCoalesce$3(theme('opacity'), () => ( {}))),
    }),
    ringWidth: {
      DEFAULT: '3px',
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
      // float -> float px
    },
    rotate: {
      '-180': '-180deg',
      '-90': '-90deg',
      '-45': '-45deg',
      '-12': '-12deg',
      '-6': '-6deg',
      '-3': '-3deg',
      '-2': '-2deg',
      '-1': '-1deg',
      0: '0deg',
      1: '1deg',
      2: '2deg',
      3: '3deg',
      6: '6deg',
      12: '12deg',
      45: '45deg',
      90: '90deg',
      180: '180deg',
      // float[0, 360] -> float[0deg, 360deg]
      // ...negative
    },
    saturate: {
      DEFAULT: '0',
      0: '0',
      50: '.5',
      100: '1',
      150: '1.5',
      200: '2',
    },
    scale: {
      0: '0',
      50: '.5',
      75: '.75',
      90: '.9',
      95: '.95',
      100: '1',
      105: '1.05',
      110: '1.1',
      125: '1.25',
      150: '1.5',
      // int >=0 -> int/100
    },
    sepia: {
      DEFAULT: '100%',
      0: '0',
    },
    skew: {
      '-12': '-12deg',
      '-6': '-6deg',
      '-3': '-3deg',
      '-2': '-2deg',
      '-1': '-1deg',
      0: '0deg',
      1: '1deg',
      2: '2deg',
      3: '3deg',
      6: '6deg',
      12: '12deg',
      // float[0, 360] -> float[0deg, 360deg]
      // ...negative
    },
    space: (theme, { negative }) => ({
      ...theme('spacing'),
      ...negative(theme('spacing')),
    }),
    stroke: (theme) => ({
      ...(_nullishCoalesce$3(theme('colors'), () => ( {}))),
      none: 'none',
    }),
    strokeWidth: {
      0: '0',
      1: '1',
      2: '2',
    },
    strokeDashArray: {
      0: '0',
      1: '1',
      2: '2',
    },
    strokeDashOffset: {
      0: '0',
      1: '1',
      2: '2',
    },
    tabSize: {
      DEFAULT: '4',
      0: '0',
      2: '2',
      4: '4',
      8: '8',
      // int >=0 -> int px
    },
    textColor: (theme) => theme('colors'),
    textOpacity: (theme) => theme('opacity'),
    textShadow: {
      DEFAULT: '0px 0px 1px rgb(0 0 0 / 20%), 0px 0px 1px rgb(1 0 5 / 10%)',
      sm: '1px 1px 3px rgb(36 37 47 / 25%)',
      md: '0px 1px 2px rgb(30 29 39 / 19%), 1px 2px 4px rgb(54 64 147 / 18%)',
      lg: '3px 3px 6px rgb(0 0 0 / 26%), 0 0 5px rgb(15 3 86 / 22%)',
      xl: '1px 1px 3px rgb(0 0 0 / 29%), 2px 4px 7px rgb(73 64 125 / 35%)',
      none: 'none',
    },
    textDecorationColor: (theme) => theme('colors'),
    textDecorationOpacity: (theme) => theme('opacity'),
    textDecorationLength: {
      'auto': 'auto',
      0: '0px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    textDecorationOffset: {
      'auto': 'auto',
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    textDecorationThickness: {
      'auto': 'auto',
      'from-font': 'from-font',
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    textIndent: {
      DEFAULT: '1.5rem',
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
      '2xl': '3rem',
      '3xl': '4rem',
    },
    textStrokeColor: (theme) => ({
      DEFAULT: theme('colors.gray.200', 'currentColor'),
      ...(_nullishCoalesce$3(theme('colors'), () => ( {}))),
    }),
    textStrokeWidth: {
      DEFAULT: 'medium',
      'none': '0',
      'sm': 'thin',
      'md': 'medium',
      'lg': 'thick',
    },
    transformOrigin: {
      center: 'center',
      top: 'top',
      'top-right': 'top right',
      right: 'right',
      'bottom-right': 'bottom right',
      bottom: 'bottom',
      'bottom-left': 'bottom left',
      left: 'left',
      'top-left': 'top left',
    },
    transitionDuration: {
      DEFAULT: '150ms',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
      // int >=0 -> int ms
    },
    transitionDelay: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
      // int >=0 -> int ms
    },
    transitionProperty: {
      DEFAULT: 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
      none: 'none',
      all: 'all',
      colors: 'background-color, border-color, color, fill, stroke',
      opacity: 'opacity',
      shadow: 'box-shadow',
      transform: 'transform',
    },
    transitionTimingFunction: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    translate: (theme, { negative }) => ({
      ...(_nullishCoalesce$3(theme('spacing'), () => ( {}))),
      ...negative(theme('spacing')),
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      full: '100%',
      '-1/2': '-50%',
      '-1/3': '-33.333333%',
      '-2/3': '-66.666667%',
      '-1/4': '-25%',
      '-2/4': '-50%',
      '-3/4': '-75%',
      '-full': '-100%',
      // fraction -> percent
      // ...negative
    }),
    width: (theme, { breakpoints }) => ({
      ...(_nullishCoalesce$3(theme('spacing'), () => ( {}))),
      ...tShirtScale,
      // fraction -> percent
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      auto: 'auto',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      prose: '65ch',
      screen: '100vw',
      ...breakpoints(_nullishCoalesce$3(theme('screens'), () => ( {}))),
    }),
    zIndex: {
      auto: 'auto',
      0: '0',
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
      // int[0, 99999] ->  int[0, 99999]
      // ...negative
    },
  },
  variantOrder: variantOrder,
  plugins: [
    createPlugin$1(({ addUtilities }) => {
      addUtilities({
        '.before\\:contents': {
          '&::before': {
            content: '""',
            display: 'contents',
          },
        },
        '.after\\:contents': {
          '&::after': {
            content: '""',
            display: 'contents',
          },
        },
      });
    }),
  ],
  handlers: {
    static: true,
    time: true,
    color: true,
    opacity: true,
    number: true,
    string: true,
    bracket: true,
    hex: true,
    nxl: true,
    fraction: true,
    size: true,
    variable: true,
    negative: true,
  },
};

// https://drafts.csswg.org/cssom/#serialize-an-identifier

const _escapeCache = new Map();

function cssEscape(str) {
  if (_escapeCache.has(str)) return _escapeCache.get(str);
  const oStr = str;

  const length = str.length;
  let index = -1;
  let codeUnit;
  let result = '';
  const firstCodeUnit = str.charCodeAt(0);
  while (++index < length) {
    codeUnit = str.charCodeAt(index);
    // Note: there’s no need to special-case astral symbols, surrogate
    // pairs, or lone surrogates.

    // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
    // (U+FFFD).
    if (codeUnit === 0x0000) {
      result += '\uFFFD';
      continue;
    }

    // Comma
    if (codeUnit === 44){
      result += '\\2c ';
      continue;
    }

    if (
      // If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
      // U+007F, […]
      (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
      codeUnit === 0x007f ||
      // If the character is the first character and is in the range [0-9]
      // (U+0030 to U+0039), […]
      (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      // If the character is the second character and is in the range [0-9]
      // (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
      (index === 1 &&
        codeUnit >= 0x0030 &&
        codeUnit <= 0x0039 &&
        firstCodeUnit === 0x002d)
    ) {
      // https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
      result += '\\' + codeUnit.toString(16) + ' ';
      continue;
    }

    if (
      // If the character is the first character and is a `-` (U+002D), and
      // there is no second character, […]
      index === 0 &&
      length === 1 &&
      codeUnit === 0x002d
    ) {
      result += '\\' + str.charAt(index);
      continue;
    }

    // If the character is not handled by one of the above rules and is
    // greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
    // is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
    // U+005A), or [a-z] (U+0061 to U+007A), […]
    if (
      codeUnit >= 0x0080 ||
      codeUnit === 0x002d ||
      codeUnit === 0x005f ||
      (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
      (codeUnit >= 0x0061 && codeUnit <= 0x007a)
    ) {
      // the character itself
      result += str.charAt(index);
      continue;
    }

    // Otherwise, the escaped character.
    // https://drafts.csswg.org/cssom/#escape-a-character
    result += '\\' + str.charAt(index);
  }
  
  _escapeCache.set(oStr, result);
  return result;
}

function combineConfig(
  a,
  b,
  arrayMergeDepth = Infinity,
) {
  const output = { ...a };
  for (const [key_of_b, value_of_b] of Object.entries(b)) {
    if (key_of_b in a) {
      const value_of_a = a[key_of_b];
      if (value_of_a !== value_of_b) {
        if (value_of_b !== null && (value_of_b ).constructor !== Object) {
          if (arrayMergeDepth > 0 && Array.isArray(value_of_a) && Array.isArray(value_of_b)) {
            output[key_of_b] = [...value_of_a, ...value_of_b];
          } else {
            output[key_of_b] = value_of_b;
          }
        } else if (value_of_a !== null && (value_of_a ).constructor === Object) {
          output[key_of_b] = combineConfig(
            value_of_a ,
            value_of_b ,
            arrayMergeDepth - 1
          );
        } else if (Array.isArray(value_of_a)){
          output[key_of_b] = [
            ...value_of_a,
            ...Array.isArray(value_of_b) ? value_of_b : [value_of_b],
          ];
        } else {
          output[key_of_b] = {
            DEFAULT: value_of_a,
            ...value_of_b ,
          };
        }
      }
    } else {
      output[key_of_b] = value_of_b;
    }
  }
  return output;
}

function diffConfig(
  a,
  b,
) {
  if (typeof a !== typeof b) return b;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (JSON.stringify(a) !== JSON.stringify(b)) return b;
    return;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const output = {};
    for (const [key, value] of Object.entries(b)) {
      if (key in a) {
        const diff = diffConfig((a )[key], (b )[key]);
        if (diff) output[key] = diff;
      } else {
        output[key] = value;
      }
    }
    if (Object.keys(output).length === 0) return;
    return output;
  }
  if (a !== b) return b;
}

function createHandler(handlers = { static: true }) {
  return (utility, value, color) => {
    const handler = {
      utility,
      value,
      color,
      _amount: utility.amount,

      handleStatic: handlers.static ? (map, callback) => {
        if (handler.value) return handler;
        if (map && typeof map === 'object') {
          const knownMap = map ;
          if (knownMap.DEFAULT) knownMap[handler.utility.raw] = knownMap.DEFAULT;
          if (handler._amount in knownMap)
            handler.value = callback
              ? callback(handler._amount)
              : `${knownMap[handler._amount]}`;
        }
        return handler;
      } : () => handler,

      handleBody: handlers.static ? (map, callback) => {
        if (handler.value) return handler;
        if (map && typeof map === 'object') {
          const knownMap = map ;
          if (knownMap.DEFAULT) knownMap[''] = knownMap.DEFAULT;
          const body = handler.utility.body;
          if (body in knownMap)
            handler.value = callback ? callback(body) : `${knownMap[body]}`;
        }
        return handler;
      } : () => handler,

      handleNumber: handlers.number ? (start = -Infinity, end = Infinity, type = 'int', callback) => {
        if (handler.value) return handler;
        if (isNumber$1(handler._amount, start, end, type))
          handler.value = callback ? callback(+handler._amount) : handler._amount;
        return handler;
      } : () => handler,

      handleTime: handlers.time ? (start = -Infinity, end = Infinity, type = 'int', callback) => {
        if (handler.value) return handler;
        let unit = 'ms';
        let amount = handler._amount;
        if (amount.endsWith('ms')) {
          amount = amount.slice(0, -2);
        } else if (amount.endsWith('s')) {
          unit = 's';
          amount = amount.slice(0, -1);
        } else {
          return handler;
        }
        if (isNumber$1(amount, start, end, type))
          handler.value = callback ? callback(unit === 's' ? +amount * 1000 : +amount) : handler._amount;
        return handler;
      } : () => handler,

      handleString: handlers.string ? (callback) => {
        if (handler.value) return handler;
        handler.value = callback(handler.utility.body);
        return handler;
      } : () => handler,

      handleSquareBrackets: handlers.bracket ? (callback) => {
        if (handler.value) return handler;
        if (handler._amount[0] === '[' && handler._amount[handler._amount.length-1] === ']') {
          let value = handler._amount.slice(1, -1).replace(/_/g, ' '); // replace _ to space
          if (value.indexOf('calc(') > -1) {
            value = value.replace(/(-?\d*\.?\d(?!\b-.+[,)](?![^+\-/*])\D)(?:%|[a-z]+)?|\))([+\-/*])/g, '$1 $2 ');
          }
          handler.value = callback
            ? callback(value)
            : value;
        }
        return handler;
      } : () => handler,

      handleSpacing: handlers.number ? () => {
        // just a short-hand for handle spacing.
        return handler.handleNumber(0, undefined, 'float', (number) =>
          number === 0 ? '0px' : `${roundUp(number / 4, 6)}rem`
        );
      }: () => handler,

      handleNxl: handlers.nxl ? (callback) => {
        if (handler.value) return handler;
        if (/^\d*xl$/.test(handler._amount))
          handler.value = callback
            ? callback(handler._amount === 'xl' ? 1 : parseInt(handler._amount))
            : parseInt(handler._amount).toString();
        return handler;
      }: () => handler,

      handleFraction: handlers.fraction ? (callback) => {
        if (handler.value) return handler;
        if (isFraction(handler._amount))
          handler.value = callback
            ? callback(handler._amount)
            : fracToPercent(handler._amount);
        return handler;
      } : () => handler,

      handleSize: handlers.size ? (callback) => {
        if (handler.value) return handler;
        if (isSize(handler._amount))
          handler.value = callback ? callback(handler._amount) : handler._amount;
        return handler;
      } : () => handler,

      handleVariable: handlers.variable ? (callback) => {
        if (handler.value) return handler;
        const matchVariable = handler.utility.raw.match(/-\$[\w-]+/);
        if (matchVariable) {
          const variableName = matchVariable[0].substring(2);
          handler.value = callback ? callback(variableName) : `var(--${variableName})`;
        }
        return handler;
      } : () => handler,

      handleColor: handlers.color ? (map = defaultColors) => {
        if (handler.value) return handler;
        let color;
        if (map && typeof map === 'object') {
          const colors = flatColors(map );
          const body = handler.utility.raw.replace(/^ring-offset|outline-solid|outline-dotted/, 'head').replace(/^\w+-/, '');
          const [ key, opacity ] = splitColorGroup(body);
          handler.opacity = opacity;
          if (key in colors) {
            color = colors[key];
          } else if (handlers.hex && key.startsWith('hex-')) {
            const hex = key.slice(4);
            if(hex2RGB(hex)) color = '#' + hex;
          }
          if (typeof color === 'string') {
            handler.value = color;
          } else if (typeof color === 'function') {
            handler.color = color;
          }
        }
        return handler;
      }: () => handler,

      handleOpacity: handlers.opacity ? (map) => {
        if (handler.opacity && typeof map === 'object') {
          const _map = map ;
          if (handlers.static && handler.opacity in _map) {
            handler.opacity = _map[handler.opacity];
          } else if (handlers.number && isNumber$1(handler.opacity, 0, 100, 'int')) {
            handler.opacity = (+handler.opacity / 100).toString();
          } else if (handlers.variable && handler.opacity.charAt(0) === '$') {
            handler.opacity = `var(--${handler.opacity.slice(1)})`;
          } else if (handlers.bracket && handler.opacity.charAt(0) === '[' && handler.opacity.charAt(handler.opacity.length - 1) === ']') {
            handler.opacity = handler.opacity.slice(1, -1).replace(/_/g, ' ');
          } else {
            handler.opacity = undefined;
          }
        }
        return handler;
      }: () => handler,

      handleNegative: handlers.negative ? (callback = negateValue) => {
        if (!handler.value) return handler;
        handler.value = handler.utility.isNegative ? callback(handler.value) : handler.value;
        return handler;
      }: () => handler,

      createProperty: (name, callback) => {
        if (!handler.value) return;
        const value = callback ? callback(handler.value) : handler.value;
        return new Property(name, value);
      },

      createStyle: (selector, callback) => {
        if (!handler.value) return;
        const value = callback ? callback(handler.value) : undefined;
        return new Style(selector, value);
      },

      createColorValue: (opacityValue) => {
        if (handler.color) return handler.color({ opacityValue });
        if (handler.value) {
          if (['transparent', 'currentColor', 'inherit', 'auto', 'none'].includes(handler.value)) return handler.value;
          if (handler.value.includes('var') && opacityValue) return `rgba(${handler.value}, ${handler.opacity || opacityValue})`;
          return opacityValue ? `rgba(${toColor(handler.value).color}, ${handler.opacity || opacityValue})` : `rgb(${toColor(handler.value).color})`;
        }
      },

      createColorStyle: (selector, property, opacityVariable, wrapRGB = true) => {
        if (handler.color) {
          const value = handler.color({ opacityVariable, opacityValue: opacityVariable ? `var(${opacityVariable})`: undefined });
          if (opacityVariable) {
            return new Style(selector, [
              new Property(opacityVariable, handler.opacity || '1'),
              new Property(property, value),
            ]);
          }
          return new Style(selector, new Property(property, value));
        }
        const color = handler.value;
        if (!color) return;
        if (['transparent', 'currentColor', 'inherit', 'auto', 'none'].includes(color) || color.includes('var')) return new Style(selector, new Property(property, color));
        const rgb = toColor(color);
        if (opacityVariable) {
          return new Style(selector, [
            new Property(opacityVariable, handler.opacity || rgb.opacity),
            new Property(property, `rgba(${rgb.color}, var(${opacityVariable}))`),
          ]);
        }
        return new Style(selector, new Property(property, wrapRGB ? `rgb(${rgb.color})` : rgb.color));
      },

      callback: (func) => {
        if (!handler.value) return;
        return func(handler.value);
      },
    };
    return handler;
  };
}

class Utility {
  
  
  constructor(raw, _h) {
    this.raw = raw; // -placeholder-real-gray-300
    this._h = _h;
  }
  match(expression) {
    const match = this.absolute.match(expression);
    return match ? match[0] : '';
  }
  clone(raw) {
    return new Utility(raw || this.raw, this._h);
  }
  get class() {
    return '.' + cssEscape(this.raw); // .-placeholder-real-gray-300
  }
  get isNegative() {
    return this.raw[0] === '-'; // true
  }
  get absolute() {
    return this.isNegative ? this.raw.substring(1) : this.raw;
  }
  get identifier() {
    return this.match(/[^-]+/); // placeholder
  }
  get key() {
    return this.match(/^\w[-\w]+(?=-)/); // placeholder-real-gray
  }
  get center() {
    return this.match(/-.+(?=-)/).substring(1); // real-gray
  }
  get amount() {
    return this.match(/(?:[^-]+|\[[\s\S]*?\])$/); // 300
  }
  get body() {
    return this.match(/-.+/).substring(1); // real-gray-300
  }
  get handler() {
    return this._h(this);
  }
}

function generateStaticStyle(processor, className, addComment = false) {
  // eslint-disable-next-line no-prototype-builtins
  if (!staticUtilities.hasOwnProperty(className))
    return;

  const style = new Style('.' + className);
  const comment = addComment ? className : undefined;
  const { utility, meta } = staticUtilities[className];
  for (const [key, value] of Object.entries(utility)) {
    style.add(
      Array.isArray(value)
        ? value.map((i) => new Property(key, i, comment))
        : new Property(key, value, comment)
    );
  }
  if (processor._plugin.core && !processor._plugin.core[meta.group]) return;
  return style.updateMeta('utilities', meta.group, pluginOrder[meta.group ], meta.order, true);
}

function extract(
  processor,
  className,
  addComment = false,
  prefix,
) {
  if (prefix && !className.startsWith(prefix)) return;

  // handle static base utilities
  if (!prefix && className in staticUtilities) return generateStaticStyle(processor, className, addComment);
  if (prefix && className.startsWith(prefix)) {
    className = className.replace(new RegExp(`^${prefix}`), '');
    if (className in staticUtilities) return generateStaticStyle(processor, className, addComment);
  }
  // handle static plugin utilities & components
  const staticPlugins = { ...processor._plugin.utilities, ...processor._plugin.components, ...processor._plugin.shortcuts };
  if (className in staticPlugins) return deepCopy(staticPlugins[className]);

  const utility = new Utility(className, processor._handler);


  // handle dynamic plugin utilities
  for (const [key, generator] of Object.entries(processor._plugin.dynamic)) {
    if (className.match(new RegExp(`^-?${key}`))) {
      let style = generator(utility);
      if (style instanceof Property) style = style.toStyle(utility.class);
      if (style && addComment)
        Array.isArray(style)
          ? style.map((i) => i.property.forEach((p) => (p.comment = className)))
          : style.property.forEach((p) => (p.comment = className));
      if (style) return style;
    }
  }

  // handle dynamic base utilities
  const matches = className.match(/\w+/);
  const key = matches ? matches[0] : undefined;
  // eslint-disable-next-line no-prototype-builtins
  if (key && dynamicUtilities.hasOwnProperty(key)) {
    let style = dynamicUtilities[key](utility, processor.pluginUtils);
    if (!style) return;
    if (processor._plugin.core && !processor._plugin.core[Array.isArray(style) ? style[0].meta.group : style.meta.group]) return;
    if (style instanceof Property) style = style.toStyle(utility.class);
    if (addComment) Array.isArray(style)? style.map((i) => i.property.forEach((p) => (p.comment = className))): style.property.forEach((p) => (p.comment = className));
    return style;
  }
}

function testStatic(processor, className) {
  // eslint-disable-next-line no-prototype-builtins
  if (!staticUtilities.hasOwnProperty(className)) return false;
  const { meta } = staticUtilities[className];
  if (processor._plugin.core && !processor._plugin.core[meta.group]) return false;
  return true;
}

function test(
  processor,
  className,
  prefix,
) {

  // handle static base utilities
  if (!prefix && className in staticUtilities) return testStatic(processor, className);
  if (prefix && className.startsWith(prefix)) {
    className = className.replace(new RegExp(`^${prefix}`), '');
    if (className in staticUtilities) return testStatic(processor, className);
  }
  // handle static plugin utilities & components
  const staticPlugins = { ...processor._plugin.utilities, ...processor._plugin.components, ...processor._plugin.shortcuts };
  if (className in staticPlugins) return true;

  const utility = new Utility(className, processor._handler);


  // handle dynamic plugin utilities
  for (const [key, generator] of Object.entries(processor._plugin.dynamic)) {
    if (className.match(new RegExp(`^-?${key}`))) {
      if (generator(utility)) return true;
    }
  }

  // handle dynamic base utilities
  const matches = className.match(/\w+/);
  const key = matches ? matches[0] : undefined;
  // eslint-disable-next-line no-prototype-builtins
  if (key && dynamicUtilities.hasOwnProperty(key)) {
    const style = dynamicUtilities[key](utility, processor.pluginUtils);
    if (!style) return false;
    if (processor._plugin.core && !processor._plugin.core[Array.isArray(style) ? style[0].meta.group : style.meta.group]) return false;
    return true;
  }
  return false;
}

function preflight(
  processor,
  html,
  includeBase = true,
  includeGlobal = true,
  includePlugins = true,
) {
  // Generate preflight style based on html tags.
  const globalSheet = new StyleSheet();
  const styleSheet = new StyleSheet();
  const pluginSheet = new StyleSheet();

  const createStyle = (
    selector,
    properties

,
    isGlobal = false
  ) => {
    const style = new Style(selector, undefined, false);
    for (const [key, value] of Object.entries(properties)) {
      style.add(
        Array.isArray(value)
          ? value.map((v) => new Property(key, v))
          : new Property(key, typeof value === 'function' ? value((path, defaultValue) => processor.theme(path, defaultValue)) : value)
      );
    }
    style.updateMeta('base', 'preflight', 0, isGlobal? 1 : 2, true);
    return style;
  };

  const safelist = processor.config('preflight.safelist', []) ;
  const tags = html ? safelist.concat(Array.from(new Set(html.match(/<\w+/g))).map((i) => i.substring(1))) : undefined;

  // handle base style
  includeBase && (processor.config('prefixer') ? preflights : preflights.filter(i => !i.selector || !/::?(webkit-input|-moz|-ms-input)-placeholder$/.test(i.selector))).forEach(p => {
    if (includeGlobal && p.global) {
      // global style, such as * or html, body
      globalSheet.add(createStyle(p.selector, p.properties, true));
    } else if (tags !== undefined) {
      // only generate matched styles
      const includeTags = tags.filter((i) => p.keys.includes(i));
      if (includeTags.length > 0) styleSheet.add(createStyle(p.selector ? p.selector : includeTags.join(', '), p.properties));
    } else {
      // if no tags input, generate all styles
      styleSheet.add(createStyle(p.selector ? p.selector : p.keys.join(', '), p.properties));
    }
  });

  // handle plugin style
  if (includePlugins) {
    // base Styles
    let preflightList = [];
    Object.values(processor._plugin.preflights).forEach((styles) => {
      preflightList = preflightList.concat(styles);
    });
    pluginSheet.add(preflightList);

    // always generated styles
    let staticList = [];
    Object.values(processor._plugin.static).forEach((styles) => {
      staticList = staticList.concat(styles);
    });
    pluginSheet.add(staticList);
  }

  const result = styleSheet.combine().sort().extend(pluginSheet.combine().sort());
  return includeGlobal ? result.extend(globalSheet.combine().sort(), false) : result;
}

const createPlugin = (
  plugin,
  config
) => {
  return {
    handler: plugin,
    config,
  };
};

createPlugin.withOptions = function(
  pluginFunction,
  configFunction = () => ({}),
) {
  const optionsFunction = function (options= {} ) {
    return {
      __options: options,
      handler: pluginFunction(options),
      config: configFunction(options),
    };
  };

  optionsFunction.__isOptionsFunction = true ;

  // Expose plugin dependencies so that `object-hash` returns a different
  // value if anything here changes, to ensure a rebuild is triggered.
  optionsFunction.__pluginFunction = pluginFunction;
  optionsFunction.__configFunction = configFunction;

  return optionsFunction;
};

class ClassParser {
  
  
  
  

  constructor(classNames, separator = ':', variants) {
    this.classNames = classNames;
    this.separator = separator;
    this.variants = variants || [];
    this.index = 0;
  }

   _handle_group(removeDuplicated = true) {
    if (!this.classNames) return [];
    let preChar;
    let char;
    let group;
    let func;
    let variant;
    let variants = [];
    let variantStart = this.index + 1;
    let classStart = this.index + 1;
    let groupStart = this.index + 1;
    let important = false;
    let ignoreSpace = false;
    let ignoreBracket = false;
    let insideSquareBracket = false;
    let brackets = 0;
    const sepLength = this.separator.length;
    const parts = [];
    const length = this.classNames.length;

    while (this.index < length) {
      this.index++;
      char = this.classNames.charAt(this.index);
      // ignore parsing and leave content inside square brackets as-is
      if (insideSquareBracket) {
        if(' \n\t\r'.includes(char)) {
          insideSquareBracket = false;
        } else {
          if (char === ']')
            insideSquareBracket = false;
          continue;
        }
      }
      // handle chars
      switch (char) {
      case '!':
        important = true;
        break;
      case this.separator[0]:
        if (this.classNames.slice(this.index, this.index + sepLength) === this.separator) {
          variant = this.classNames.slice(variantStart, this.index);
          if (variant.charAt(0) === '!') variant = variant.slice(1,);
          if (this.variants.includes(variant)) {
            variants.push(variant);
            this.index += sepLength - 1;
            variantStart = this.index + 1;
            ignoreSpace = true;
          }
        }
        break;
      case '[':
        insideSquareBracket = true;
        break;
      case '(':
        preChar = this.classNames.charAt(this.index - 1);
        if (preChar === '-' || (!ignoreSpace && preChar === ' ')) {
          ignoreBracket = true;
        } else if (ignoreSpace) {
          group = this._handle_group();
        } else {
          brackets += 1;
          func = this.classNames.slice(groupStart, this.index);
          while (!isSpace(this.classNames.charAt(this.index))) {
            this.index++;
          }
          this.index--;
        }
        ignoreSpace = false;
        break;
      case '"':
      case '`':
      case '\'':
      case ')':
      case ' ':
      case '\n':
      case '\t':
      case '\r':
        if (!ignoreSpace) {
          if (groupStart !== this.index) {
            const raw = this.classNames.slice(classStart, this.index);
            const start = classStart - 1;
            const end = this.index - 1;
            if (Array.isArray(group)) {
              parts.push({ raw, start, end, variants, content: group, type: 'group', important });
              group = undefined;
            } else if (func) {
              const utility = this.classNames.slice(variantStart, this.index);
              parts.push({ raw: raw, start, end, variants, content: utility, type: 'utility', important });
              func = undefined;
            } else if (ignoreBracket && char === ')') {
              // utility with bracket
              const utility = this.classNames.slice(variantStart, this.index + 1);
              parts.push({ raw: raw + ')', start, end: this.index, variants, content: important ? utility.slice(1,): utility, type: 'utility', important });
            } else {
              const utility = this.classNames.slice(variantStart, this.index);
              if (utility.charAt(0) === '*') {
                parts.push({ raw, start, end, variants, content: utility.slice(1,), type: 'alias', important });
              } else {
                parts.push({ raw, start, end, variants, content: utility.charAt(0) === '!' ? utility.slice(1,): utility, type: 'utility', important });
              }
            }
            variants = [];
            important = false;
          }
          groupStart = this.index + 1;
          classStart = this.index + 1;
        }
        variantStart = this.index + 1;
        break;
      default:
        ignoreSpace = false;
      }
      if (char === ')') {
        brackets -= 1;
        if (!ignoreBracket && brackets < 0) break; // end group
        ignoreBracket = false;
      }
    }

    if (removeDuplicated) {
      const newParts = [];
      const cache = [];
      parts.forEach((item) => {
        if (!cache.includes(item.raw)) {
          cache.push(item.raw);
          newParts.push(item);
        }
      });
      return newParts;
    }
    return parts;
  }

  parse(removeDuplicated = true) {
    if (!this.classNames) return [];
    
    this.classNames = '(' + this.classNames + ')';
    const elements = this._handle_group(removeDuplicated);
    this.index = 0;
    this.classNames = this.classNames.slice(1, -1);
    return elements;
  }
}

/* toSource by Marcello Bastea-Forte - zlib license */
function toSource(object, replacer, indent = '  ', startingIndent = '') {
    const seen = [];
    return walk(object, replacer, indent === false ? '' : indent, startingIndent, seen);
    function walk(object, replacer, indent, currentIndent, seen) {
        const nextIndent = currentIndent + indent;
        object = object;
        switch (typeof object) {
            case 'string':
                return JSON.stringify(object);
            case 'number':
                if (Object.is(object, -0)) {
                    return '-0';
                }
                return String(object);
            case 'boolean':
            case 'undefined':
                return String(object);
            case 'function':
                return object.toString();
        }
        if (object === null) {
            return 'null';
        }
        if (object instanceof RegExp) {
            return object.toString();
        }
        if (object instanceof Date) {
            return `new Date(${object.getTime()})`;
        }
        if (object instanceof Set) {
            return `new Set(${walk(Array.from(object.values()), replacer, indent, nextIndent, seen)})`;
        }
        if (object instanceof Map) {
            return `new Map(${walk(Array.from(object.entries()), replacer, indent, nextIndent, seen)})`;
        }
        if (seen.indexOf(object) >= 0) {
            return '{$circularReference:1}';
        }
        seen.push(object);
        function join(elements) {
            return (indent.slice(1) +
                elements.join(',' + (indent && '\n') + nextIndent) +
                (indent ? ' ' : ''));
        }
        if (Array.isArray(object)) {
            return `[${join(object.map((element) => walk(element, replacer, indent, nextIndent, seen.slice())))}]`;
        }
        const keys = Object.keys(object);
        if (keys.length) {
            return `{${join(keys.map((key) => (legalKey(key) ? key : JSON.stringify(key)) +
                ':' +
                walk(object[key], replacer, indent, nextIndent, seen.slice())))}}`;
        }
        return '{}';
    }
}
const KEYWORD_REGEXP = /^(abstract|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|enum|export|extends|false|final|finally|float|for|function|goto|if|implements|import|in|instanceof|int|interface|long|native|new|null|package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|undefined|var|void|volatile|while|with)$/;
function legalKey(key) {
    return (/^([a-z_$][0-9a-z_$]*|[0-9]+)$/gi.test(key) && !KEYWORD_REGEXP.test(key));
}

function _nullishCoalesce$2(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain$2(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }































class Processor {
  
  
   __init() {this._variants = {};}
   __init2() {this._cache = {
    count: 0,
    html: [],
    attrs: [],
    classes: [],
    utilities: [],
    variants: [],
  };}
  
   __init3() {this._plugin = {
    static: {},
    dynamic: {},
    utilities: {},
    components: {},
    preflights: {},
    shortcuts: {},
    alias: {},
    completions: {},
  };}

   __init4() {this.pluginUtils = {
    addDynamic: (...args) => this.addDynamic(...args),
    addUtilities: (...args) => this.addUtilities(...args),
    addComponents: (...args) => this.addComponents(...args),
    addBase: (...args) => this.addBase(...args),
    addVariant: (...args) => this.addVariant(...args),
    e: (...args) => this.e(...args),
    prefix: (...args) => this.prefix(...args),
    config: (...args) => this.config(...args),
    theme: (...args) => this.theme(...args),
    variants: (...args) => this.variants(...args),
  };}

   __init5() {this.variantUtils = {
    modifySelectors: (modifier) =>
      new Style().wrapSelector((selector) =>
        modifier({
          className: /^[.#]/.test(selector) ? selector.substring(1) : selector,
        })),
    atRule: (name) => new Style().atRule(name),
    pseudoClass: (name) => new Style().pseudoClass(name),
    pseudoElement: (name) => new Style().pseudoElement(name),
    parent: (name) => new Style().parent(name),
    child: (name) => new Style().child(name),
  };}

  constructor(config) {Processor.prototype.__init.call(this);Processor.prototype.__init2.call(this);Processor.prototype.__init3.call(this);Processor.prototype.__init4.call(this);Processor.prototype.__init5.call(this);
    this._config = this.resolveConfig(config, baseConfig);
    this._theme = this._config.theme;
    this._handler = createHandler(this._config.handlers);
    this._config.shortcuts && this.loadShortcuts(this._config.shortcuts);
    this._config.alias && this.loadAlias(this._config.alias);

    if (this._config.preflight && this._config.preflight.safelist) {
      if (typeof this._config.preflight.safelist === 'string') {
        this._config.preflight.safelist = this._config.preflight.safelist.split(/\s+/);
      }
    }
  }

   _resolveConfig(userConfig, presets = {}) {
    if (userConfig.presets) {
      const resolved = this._resolvePresets(userConfig.presets);
      presets = this._resolveConfig(resolved, presets);
      delete userConfig.presets;
    }
    const userTheme = userConfig.theme;
    if (userTheme) delete userConfig.theme;
    const extendTheme = userTheme && 'extend' in userTheme ? _nullishCoalesce$2(userTheme.extend, () => ( {})) : {};
    const theme = (presets.theme || {}) ;
    if (userTheme) {
      if ('extend' in userTheme) delete userTheme.extend;
      for (const [key, value] of Object.entries(userTheme)) {
        theme[key] = typeof value === 'function' ? value : { ...value };
      }
    }
    if (extendTheme && typeof extendTheme === 'object') this._reduceFunction(theme, extendTheme);
    return { ...presets, ...userConfig, theme };
  }

   _reduceFunction(theme, extendTheme) {
    for (const [key, value] of Object.entries(extendTheme)) {
      const themeValue = theme[key];
      switch (typeof themeValue) {
      case 'function':
        theme[key] = (theme, { negative, breakpoints }) => combineConfig(
          (themeValue )(theme, { negative, breakpoints }),
          (typeof value === 'function' ? value(theme, { negative, breakpoints }) : _nullishCoalesce$2(value, () => ( {}))),
        );
        break;
      case 'object':
        theme[key] = (theme, { negative, breakpoints }) => combineConfig(themeValue, (typeof value === 'function' ? value(theme, { negative, breakpoints }) : _nullishCoalesce$2(value, () => ( {}))), 0 /* prevent fontfamily merge */);
        break;
      default:
        theme[key] = value;
      }
    }
  }

   _resolvePresets(presets) {
    let config = {};
    const extend = {};
    presets.forEach(p => {
      if (p.theme && 'extend' in p.theme && p.theme.extend) {
        this._reduceFunction(extend, p.theme.extend);
        delete p.theme.extend;
      }
      config = this._resolveConfig(p, config);
    });
    if (config.theme) {
      (config.theme ).extend = extend;
    } else {
      config.theme = { extend };
    }
    return config;
  }

   _resolveFunction(config) {
    if (!config.theme) return config;
    const theme = (path, defaultValue) => this.theme(path, defaultValue);
    for (const dict of [config.theme, 'extend' in config.theme ? _nullishCoalesce$2(config.theme.extend, () => ( {})) : {}]) {
      for (const [key, value] of Object.entries(dict)) {
        if (typeof value === 'function') {
          (dict )[key] = value(theme, {
            negative,
            breakpoints,
          }) ;
        }
      }
    }
    return config;
  }

   _replaceStyleVariants(styles) {
    // @screen sm -> @screen (min-width: 640px)
    styles.forEach(style => {
      style.atRules = _optionalChain$2([style, 'access', _ => _.atRules, 'optionalAccess', _2 => _2.map, 'call', _3 => _3(i => {
        if (i.match(/@screen/)) {
          const variant = i.replace(/\s*@screen\s*/, '');
          const atRule = _optionalChain$2([this, 'access', _4 => _4._variants, 'access', _5 => _5[variant], 'call', _6 => _6(), 'access', _7 => _7.atRules, 'optionalAccess', _8 => _8[0]]);
          return _nullishCoalesce$2(atRule, () => ( i));
        }
        return i;
      })]);
    });
  }

   _addPluginProcessorCache(type, key, styles) {
    styles = toArray(styles);
    this._plugin[type][key] = key in this._plugin[type]
      ? [...this._plugin[type][key], ...styles]
      : styles;
  }

   _loadVariables() {
    const config = this.theme('vars') ;
    if (!config) return;
    this.addBase({ ':root': Object.assign({}, ...Object.keys(config).map(i => ({ [`--${i}`]: config[i] })))  });
  }

  loadConfig(config) {
    this._config = this.resolveConfig(config, baseConfig);
    this._theme = this._config.theme;
    this._handler = createHandler(this._config.handlers);
    this._config.shortcuts && this.loadShortcuts(this._config.shortcuts);
    this._config.alias && this.loadAlias(this._config.alias);
    return this._config;
  }

  resolveConfig(config, presets) {
    this._config = this._resolveConfig({ ...deepCopy(config ? config : {}), exclude: _optionalChain$2([config, 'optionalAccess', _9 => _9.exclude]) }, deepCopy(presets)); // deep copy
    this._theme = this._config.theme; // update theme to make sure theme() function works.
    _optionalChain$2([this, 'access', _10 => _10._config, 'access', _11 => _11.plugins, 'optionalAccess', _12 => _12.map, 'call', _13 => _13(i => typeof i === 'function' ? ('__isOptionsFunction' in i ? this.loadPluginWithOptions(i): this.loadPlugin(createPlugin(i))) : this.loadPlugin(i))]);
    this._config = this._resolveFunction(this._config);
    this._variants = { ...this._variants, ... this.resolveVariants() };
    this._cache.variants = Object.keys(this._variants);
    this._loadVariables();
    if (this._config.corePlugins) this._plugin.core = Array.isArray(this._config.corePlugins) ? Object.assign({}, ...(this._config.corePlugins ).map(i => ({ [i]: true }))) : { ...Object.assign({}, ...Object.keys(pluginOrder).slice(Object.keys(pluginOrder).length/2).map(i => ({ [i]: true }))), ...this._config.corePlugins };
    return this._config;
  }

  resolveVariants(
    type
  ) {
    const variants = resolveVariants(this._config);
    if (type) {
      return variants[type];
    }
    return { ...variants.screen, ...variants.theme, ...variants.state, ...variants.orientation };
  }

  resolveStaticUtilities(includePlugins = false) {
    const staticStyles = {};
    for (const key in staticUtilities) {
      const style = generateStaticStyle(this, key, true);
      if (style) staticStyles[key] = [ style ];
    }
    if (!includePlugins) return staticStyles;
    return { ...staticStyles, ...this._plugin.utilities, ...this._plugin.components };
  }

  resolveDynamicUtilities(includePlugins = false) {
    if (!includePlugins) return dynamicUtilities;
    return { ...dynamicUtilities, ...this._plugin.dynamic };
  }

  get allConfig() {
    return this._config ;
  }

  get allTheme() {
    return (_nullishCoalesce$2(this._theme, () => ( {}))) ;
  }

  get allVariant() {
    return this._cache.variants;
  }

  wrapWithVariants(variants, styles) {
    // apply variant to style
    if (!Array.isArray(styles)) styles = [styles];
    if (variants.length === 0) return styles;

    return styles.map(style => {
      if (style instanceof Keyframes) return style;
      const atrules = [];
      let wrapped = variants
        .filter(i => _optionalChain$2([this, 'access', _14 => _14._variants, 'optionalAccess', _15 => _15[i]]))
        .map(i => this._variants[i]())
        .reduce((previousValue, currentValue) => {
          const output = previousValue.extend(currentValue);
          if (previousValue.isAtrule) atrules.push((previousValue.atRules )[0]);
          return output;
        }, new Style())
        .extend(style);
      if (style instanceof Container) wrapped = new Container().extend(wrapped);
      if (atrules.length > 0) wrapped.meta.variants = atrules;
      return wrapped;
    });
  }

  removePrefix(className) {
    const prefix = this.config('prefix') ;
    return prefix ? className.replace(new RegExp(`^${prefix}`), '') : className;
  }

  markAsImportant(style, force = false) {
    const _important = force ? force : this.config('important', false);
    const important = typeof _important === 'string' ? (_important ) : (_important );
    if (important) {
      if (typeof important === 'string') {
        style.parent(important);
      } else {
        style.important = true;
        style.property.forEach(i => i.important = true);
      }
    }
    return style;
  }

  extract(className, addComment = false, prefix) {
    return extract(this, className, addComment, prefix);
  }

  test(className, prefix) {
    return test(this, className, prefix);
  }

  preflight(
    html,
    includeBase = true,
    includeGlobal = true,
    includePlugins = true,
    ignoreProcessed = false
  ) {
    let id;
    if (html) {
      id = hash(html);
      if (ignoreProcessed && this._cache.html.includes(id)) return new StyleSheet();
    }
    id && ignoreProcessed && this._cache.html.push(id);
    return preflight(this, html, includeBase, includeGlobal, includePlugins);
  }

  interpret(
    classNames,
    ignoreProcessed = false,
    handleIgnored
  ) {
    const ast = new ClassParser(classNames, this.config('separator', ':') , this._cache.variants).parse();
    const success = [];
    const ignored = [];
    const styleSheet = new StyleSheet();

    const _hIgnored = (className) => {
      if (handleIgnored) {
        const style = handleIgnored(className);
        if (style) {
          styleSheet.add(style);
          success.push(className);
        } else {
          ignored.push(className);
        }
      }
      ignored.push(className);
    };

    const _gStyle = (
      baseClass,
      variants,
      selector,
      important = false,
      prefix,
    ) => {
      if (this._config.exclude && testRegexr(selector, this._config.exclude)) {
        // filter exclude className
        ignored.push(selector);
        return;
      }
      if (variants[0] && selector in { ...this._plugin.utilities, ...this._plugin.components }) {
        // handle special selector that conflict with class parser, such as 'hover:abc'
        success.push(selector);
        styleSheet.add(deepCopy(this._plugin.utilities[selector]));
        return;
      }
      let result = this.extract(baseClass, false, prefix);
      if (result) {
        const escapedSelector = '.' + cssEscape(selector);
        if (result instanceof Style) {
          if(!result.meta.respectSelector) result.selector = escapedSelector;
          this.markAsImportant(result, important);
        } else if (Array.isArray(result)) {
          result = result.map(i => {
            if (i instanceof Keyframes) return i;
            if(!i.meta.respectSelector) i.selector = escapedSelector;
            this.markAsImportant(i, important);
            return i;
          });
        }
        const wrapped = this.wrapWithVariants(variants, result);
        if (wrapped) {
          success.push(selector);
          styleSheet.add(wrapped);
        } else {
          _hIgnored(selector);
        }
      } else {
        _hIgnored(selector);
      }
    };

    const _hGroup = (obj, parentVariants = []) => {
      const _eval = (u) => {
        if (u.type === 'group') {
          _hGroup(u, obj.variants);
        } else if (u.type === 'alias' && (u.content ) in this._plugin.alias) {
          this._plugin.alias[u.content ].forEach(i => _eval(i));
        } else {
          // utility
          const variants = [
            ...parentVariants,
            ...obj.variants,
            ...u.variants,
          ];
          const important = obj.important || u.important;
          const selector = (important ? '!' : '') + [...variants, u.content].join(':');
          typeof u.content === 'string' &&
            _gStyle(u.content, variants, selector, important, this.config('prefix') );
        }
      };
      Array.isArray(obj.content) && obj.content.forEach(u => _eval(u));
    };

    const _gAst = (ast) => {
      ast.forEach(obj => {
        if (!(ignoreProcessed && this._cache.utilities.includes(obj.raw))) {
          if (ignoreProcessed) this._cache.utilities.push(obj.raw);
          if (obj.type === 'utility') {
            if (Array.isArray(obj.content)) ; else if (obj.content) {
              _gStyle(obj.content, obj.variants, obj.raw, obj.important, this.config('prefix') );
            }
          } else if (obj.type === 'group') {
            _hGroup(obj);
          } else if (obj.type === 'alias' && (obj.content ) in this._plugin.alias) {
            _gAst(this._plugin.alias[obj.content ]);
          } else {
            _hIgnored(obj.raw);
          }
        }
      });
    };

    _gAst(ast);

    if (!this.config('prefixer')) styleSheet.prefixer = false;

    return {
      success,
      ignored,
      styleSheet: styleSheet.sort(),
    };
  }

  validate(classNames) {
    const ast = new ClassParser(classNames, this.config('separator', ':') , this._cache.variants).parse();
    const success = [];
    const ignored = [];

    const _hSuccess = (className, self, parent) => {
      success.push({
        className,
        ...self,
        parent,
      });
    };

    const _hIgnored = (className, self, parent) => {
      ignored.push({
        className,
        ...self,
        parent,
      });
    };

    const _gStyle = (
      baseClass,
      variants,
      selector,
      self,
      parent,
      prefix,
    ) => {
      if (this._config.exclude && testRegexr(selector, this._config.exclude)) {
        // filter exclude className
        _hIgnored(selector, self, parent);
        return;
      }
      if (variants[0] && selector in { ...this._plugin.utilities, ...this._plugin.components }) {
        // handle special selector that conflict with class parser, such as 'hover:abc'
        _hSuccess(selector, self, parent);
        return;
      }
      if (this.test(baseClass, prefix) && variants.filter(i => !(i in this._variants)).length === 0) {
        _hSuccess(selector, self, parent);
      } else {
        _hIgnored(selector, self, parent);
      }
    };

    const _hGroup = (obj, parentVariants = []) => {
      const _eval = (u, parent) => {
        if (u.type === 'group') {
          _hGroup(u, obj.variants);
        } else if (u.type === 'alias' && (u.content ) in this._plugin.alias) {
          this._plugin.alias[u.content ].forEach(i => _eval(i, u));
        } else {
          // utility
          const variants = [
            ...parentVariants,
            ...obj.variants,
            ...u.variants,
          ];
          const important = obj.important || u.important;
          const selector = (important ? '!' : '') + [...variants, u.content].join(':');
          typeof u.content === 'string' &&
            _gStyle(u.content, variants, selector, u, parent, this.config('prefix') );
        }
      };
      Array.isArray(obj.content) && obj.content.forEach(u => _eval(u, obj));
    };

    const _gAst = (ast) => {
      ast.forEach(obj => {
        if (obj.type === 'utility') {
          if (Array.isArray(obj.content)) ; else if (obj.content) {
            _gStyle(obj.content, obj.variants, obj.raw, obj, undefined, this.config('prefix') );
          }
        } else if (obj.type === 'group') {
          _hGroup(obj);
        } else if (obj.type === 'alias' && (obj.content ) in this._plugin.alias) {
          _gAst(this._plugin.alias[obj.content ]);
        } else {
          _hIgnored(obj.raw, obj);
        }
      });
    };

    _gAst(ast);

    return {
      success,
      ignored,
    };
  }

  compile(
    classNames,
    prefix = 'cloud-',
    showComment = false,
    ignoreGenerated = false,
    handleIgnored,
    outputClassName
  )




 {
    const ast = new ClassParser(classNames, this.config('separator', ':') , this._cache.variants).parse();
    const success = [];
    const ignored = [];
    const styleSheet = new StyleSheet();
    let className = _nullishCoalesce$2(outputClassName, () => ( prefix + hash(classNames.trim().split(/\s+/g).join(' '))));
    if (ignoreGenerated && this._cache.classes.includes(className)) return { success, ignored, styleSheet, className };
    const buildSelector = '.' + className;

    const _hIgnored = (className) => {
      if (handleIgnored) {
        const style = handleIgnored(className);
        if (style) {
          styleSheet.add(style);
          success.push(className);
        } else {
          ignored.push(className);
        }
      }
      ignored.push(className);
    };

    const _gStyle = (
      baseClass,
      variants,
      selector,
      important = false
    ) => {
      if (this._config.exclude && testRegexr(selector, this._config.exclude)) {
        // filter exclude className
        ignored.push(selector);
        return;
      }
      if (variants[0] && selector in { ...this._plugin.utilities, ...this._plugin.components }) {
        // handle special selector that conflict with class parser, such as 'hover:abc'
        success.push(selector);
        styleSheet.add(deepCopy(this._plugin.utilities[selector]));
        return;
      }
      const result = this.extract(baseClass, showComment);
      if (result) {
        if (Array.isArray(result)) {
          result.forEach(i => {
            if (i instanceof Keyframes) {
              i.meta.order = 20;
              return i;
            }
            i.selector = buildSelector;
            this.markAsImportant(i, important);
          });
        } else {
          result.selector = buildSelector;
          this.markAsImportant(result, important);
        }
        const wrapped = this.wrapWithVariants(variants, result);
        if (wrapped) {
          success.push(selector);
          styleSheet.add(wrapped);
        } else {
          _hIgnored(selector);
        }
      } else {
        _hIgnored(selector);
      }
    };

    const _hGroup = (obj, parentVariants = []) => {
      Array.isArray(obj.content) &&
        obj.content.forEach((u) => {
          if (u.type === 'group') {
            _hGroup(u, obj.variants);
          } else {
            // utility
            const variants = [
              ...parentVariants,
              ...obj.variants,
              ...u.variants,
            ];
            const selector = [...variants, u.content].join(':');
            typeof u.content === 'string' &&
              _gStyle(this.removePrefix(u.content), variants, selector, obj.important || u.important);
          }
        });
    };

    ast.forEach((obj) => {
      if (obj.type === 'utility') {
        if (Array.isArray(obj.content)) ; else if (obj.content) {
          _gStyle(this.removePrefix(obj.content), obj.variants, obj.raw, obj.important);
        }
      } else if (obj.type === 'group') {
        _hGroup(obj);
      } else {
        _hIgnored(obj.raw);
      }
    });

    className = success.length > 0 ? className : undefined;
    if (ignoreGenerated && className) this._cache.classes.push(className);
    if (!this.config('prefixer')) styleSheet.prefixer = false;
    return {
      success,
      ignored,
      className,
      styleSheet: styleSheet.sortby(sortGroup).combine(),
    };
  }

  attributify(attrs, ignoreProcessed = false) {
    const success = [];
    const ignored = [];
    const styleSheet = new StyleSheet();
    const { prefix, separator, disable } = (this._config.attributify && typeof this._config.attributify === 'boolean') ? {} : this._config.attributify || {};

    const _gStyle = (
      key,
      value,
      equal = false,
      notAllow = false,
      ignoreProcessed = false,
    ) => {
      const buildSelector = `[${this.e((prefix || '') + key)}${equal?'=':'~='}"${value}"]`;
      if (notAllow || (ignoreProcessed && this._cache.attrs.includes(buildSelector))) {
        ignored.push(buildSelector);
        return;
      }
      const importantValue = value.startsWith('!');
      if (importantValue) value = value.slice(1);
      const importantKey = key.startsWith('!');
      if (importantKey) key = key.slice(1);
      const id = _nullishCoalesce$2(_optionalChain$2([key, 'access', _16 => _16.match, 'call', _17 => _17(/\w+$/), 'optionalAccess', _18 => _18[0]]), () => ( ''));
      const splits = value.split(separator || ':');
      let variants = splits.slice(0, -1);
      let utility = splits.slice(-1)[0];
      let keys = key.split(separator || ':');
      const lastKey = keys.slice(-1)[0];

      if (lastKey in this._variants && lastKey !== 'svg') {
        variants = [...keys, ...variants];
      } else if (id in this._variants && id !== 'svg') {
        // sm = ... || sm:hover = ... || sm-hover = ...
        const matches = key.match(/[@<\w]+/g);
        if (!matches) {
          ignored.push(buildSelector);
          return;
        }
        variants = [...matches, ...variants];
      } else {
        // text = ... || sm:text = ... || sm-text = ... || sm-hover-text = ...
        if (!keys) {
          ignored.push(buildSelector);
          return;
        }
        if (keys.length === 1) keys = key.split('-');
        let last;
        // handle min-h || max-w ...
        if (['min', 'max'].includes(keys.slice(-2, -1)[0])) {
          variants = [...keys.slice(0, -2), ...variants];
          last = keys.slice(-2,).join('-');
        } else {
          variants = [...keys.slice(0, -1), ...variants];
          last = keys[keys.length - 1];
        }
        // handle negative, such as m = -x-2
        const negative = utility.charAt(0) === '-';
        if (negative) utility = utility.slice(1,);
        utility = ['m', 'p'].includes(last) && ['t', 'l', 'b', 'r', 'x', 'y'].includes(utility.charAt(0)) ? last + utility : last + '-' + utility;
        if (negative) utility = '-' + utility;
        utility !== 'cursor-default' && (utility = utility.replace(/-(~|default)$/, ''));
        // handle special cases
        switch(last) {
        case 'w':
          if (['w-min', 'w-max', 'w-min-content', 'w-max-content'].includes(utility)) {
            utility = utility.slice(0, 5);
          } else if (utility.startsWith('w-min')) {
            utility = 'min-w' + utility.slice(5);
          } else if (utility.startsWith('w-max')) {
            utility = 'max-w' + utility.slice(5);
          }
          break;
        case 'h':
          if (['h-min', 'h-max', 'h-min-content', 'h-max-content'].includes(utility)) {
            utility = utility.slice(0, 5);
          } else if (utility.startsWith('h-min')) {
            utility = 'min-h' + utility.slice(5);
          } else if (utility.startsWith('h-max')) {
            utility = 'max-h' + utility.slice(5);
          }
          break;
        case 'flex':
          switch (utility) {
          case 'flex-default':
            utility = 'flex';
            break;
          case 'flex-inline':
            utility = 'inline-flex';
            break;
          default:
            if (/^flex-gap-/.test(utility)) utility = utility.slice(5);
          }
          break;
        case 'grid':
          switch(utility) {
          case 'grid-default':
            utility = 'grid';
            break;
          case 'grid-inline':
            utility = 'inline-grid';
            break;
          default:
            if (/^grid-(auto|gap|col|row)-/.test(utility)) utility = utility.slice(5);
          }
          break;
        case 'justify':
          if (utility.startsWith('justify-content-')) {
            utility = 'justify-' + utility.slice(16);
          }
          break;
        case 'align':
          if (/^align-(items|self|content)-/.test(utility)) {
            utility = utility.slice(6);
          } else {
            utility = 'content-' + utility.slice(6);
          }
          break;
        case 'place':
          if (!/^place-(items|self|content)-/.test(utility)) {
            utility = 'place-content-' + utility.slice(6);
          }
          break;
        case 'font':
          if (/^font-(tracking|leading)-/.test(utility) || ['font-italic', 'font-not-italic', 'font-antialiased', 'font-subpixel-antialiased', 'font-normal-nums', 'font-ordinal', 'font-slashed-zero', 'font-lining-nums', 'font-oldstyle-nums', 'font-proportional-nums', 'font-tabular-nums', 'font-diagonal-fractions', 'font-stacked-fractions'].includes(utility))
            utility = utility.slice(5);
          break;
        case 'text':
          if (['text-baseline', 'text-top', 'text-middle', 'text-bottom', 'text-text-top', 'text-text-bottom', 'text-sub', 'text-super'].includes(utility)) {
            utility = 'align-' + utility.slice(5);
          } else if (utility.startsWith('text-placeholder') || utility.startsWith('text-underline') || utility.startsWith('text-tab') || utility.startsWith('text-indent') || utility.startsWith('text-hyphens') || utility.startsWith('text-write')) {
            utility = utility.slice(5);
          } else if (['text-underline', 'text-overline', 'text-line-through', 'text-no-underline', 'text-uppercase', 'text-lowercase', 'text-capitalize', 'text-normal-case', 'text-truncate', 'text-overflow-ellipsis', 'text-text-ellipsis', 'text-text-clip', 'text-break-normal', 'text-break-words', 'text-break-all'].includes(utility)) {
            utility = utility.slice(5);
          } else if (utility.startsWith('text-space')) {
            utility = 'white' + utility.slice(5);
          }
          break;
        case 'underline':
          if (utility === 'underline-none') {
            utility = 'no-underline';
          } else if (utility === 'underline-line-through') {
            utility = 'line-through';
          }
          break;
        case 'svg':
          if (utility.startsWith('svg-fill') || utility.startsWith('svg-stroke')) utility = utility.slice(4);
          break;
        case 'border':
          if (utility.startsWith('border-rounded')) {
            utility = utility.slice(7);
          }
          break;
        case 'gradient':
          if (utility === 'gradient-none') {
            utility = 'bg-none';
          } else if (/^gradient-to-[trbl]{1,2}$/.test(utility)) {
            utility = 'bg-' + utility;
          } else if (/^gradient-(from|via|to)-/.test(utility)) {
            utility = utility.slice(9);
          }
          break;
        case 'display':
          utility = utility.slice(8);
          break;
        case 'pos':
          utility = utility.slice(4);
          break;
        case 'position':
          utility = utility.slice(9);
          break;
        case 'box':
          if (/^box-(decoration|shadow)/.test(utility)) {
            utility = utility.slice(4,);
          }
          break;
        case 'filter':
          if (utility !== 'filter-none' && utility !== 'filter') {
            utility = utility.slice(7);
          }
          break;
        case 'backdrop':
          if (utility === 'backdrop') {
            utility = 'backdrop-filter';
          } else if (utility === 'backdrop-none') {
            utility = 'backdrop-filter-none';
          }
          break;
        case 'transition':
          if (/transition-(duration|ease|delay)-/.test(utility)) {
            utility = utility.slice(11);
          }
          break;
        case 'transform':
          if (!['transform-gpu', 'transform-none', 'transform'].includes(utility)) {
            utility = utility.slice(10);
          }
          break;
        case 'isolation':
          if (utility === 'isolation-isolate') utility = 'isolate';
          break;
        case 'table':
          if (utility === 'table-inline') {
            utility = 'inline-table';
          } else if (utility.startsWith('table-caption-') || utility.startsWith('table-empty-cells')) {
            utility = utility.slice(6);
          }
          break;
        case 'pointer':
          utility = 'pointer-events' + utility.slice(7);
          break;
        case 'resize':
          if (utility === 'resize-both') utility = 'resize';
          break;
        case 'ring':
          break;
        case 'blend':
          utility = 'mix-' + utility;
          break;
        case 'sr':
          if (utility === 'sr-not-only') utility = 'not-sr-only';
          break;
        }
      }
      const style = this.extract(utility, false);
      if (style) {
        const important = importantKey || importantValue;
        if (Array.isArray(style)) {
          style.forEach(i => {
            if (i instanceof Keyframes) return i;
            i.selector = buildSelector;
            this.markAsImportant(i, important);
          });
        } else {
          style.selector = buildSelector;
          this.markAsImportant(style, important);
        }
        if (variants.find(i => !(i in this._variants))) {
          ignored.push(buildSelector);
        } else {
          const wrapped = this.wrapWithVariants(variants, style);
          if (wrapped) {
            ignoreProcessed && this._cache.attrs.push(buildSelector);
            success.push(buildSelector);
            styleSheet.add(wrapped);
          } else {
            ignored.push(buildSelector);
          }
        }
      } else {
        ignored.push(buildSelector);
      }
    };

    // eslint-disable-next-line prefer-const
    for (let [key, value] of Object.entries(attrs)) {
      let notAllow = false;
      if (prefix) {
        if (key.startsWith(prefix)) {
          key = key.slice(prefix.length);
        } else {
          notAllow = true;
        }
      }
      if (_optionalChain$2([disable, 'optionalAccess', _19 => _19.includes, 'call', _20 => _20(key)])) notAllow = true;
      if (Array.isArray(value)) {
        value.forEach(i => _gStyle(key, i, false, notAllow, ignoreProcessed));
      } else {
        _gStyle(key, value, true, notAllow, ignoreProcessed);
      }
    }

    return {
      success,
      ignored,
      styleSheet: styleSheet.sort().combine(),
    };
  }

  loadPlugin({
    handler,
    config,
  }) {
    if (config) {
      config = this._resolveFunction(config);
      config = combineConfig(
        config ,
        this._config 
      );
      const pluginTheme = config.theme ;
      const extendTheme = _optionalChain$2([pluginTheme, 'optionalAccess', _21 => _21.extend]) ;
      if (pluginTheme && extendTheme && typeof extendTheme === 'object') {
        for (const [key, value] of Object.entries(extendTheme)) {
          const themeValue = pluginTheme[key];
          if (themeValue && typeof themeValue === 'object') {
            pluginTheme[key] = { ...(_nullishCoalesce$2(themeValue, () => ( {}))), ...value  };
          } else if (value && typeof value === 'object' ){
            pluginTheme[key] = value ;
          }
        }
      }
      this._config = { ...config, theme: pluginTheme };
      this._theme = pluginTheme;
    }
    this._config = this._resolveFunction(this._config);
    this._theme = this._config.theme;
    this._variants = { ...this._variants, ...this.resolveVariants() };
    handler(this.pluginUtils);
  }

  loadPluginWithOptions(optionsFunction, userOptions) {
    const plugin = optionsFunction(_nullishCoalesce$2(userOptions, () => ( {})));
    this.loadPlugin(plugin);
  }

  loadShortcuts(shortcuts) {
    for (const [key, value] of Object.entries(shortcuts)) {
      const prefix = this.config('prefix', '');
      if (typeof value === 'string') {
        this._plugin.shortcuts[key] = this.compile(value, undefined, undefined, false, undefined, cssEscape(prefix + key)).styleSheet.children.map(i => i.updateMeta('components', 'shortcuts', layerOrder['shortcuts'], ++this._cache.count));
      } else {
        let styles = [];
        Style.generate('.' + cssEscape(key), value).forEach(style => {
          for (const prop of style.property) {
            if (!prop.value) continue;
            if (prop.name === '@apply') {
              styles = styles.concat(this.compile(Array.isArray(prop.value)? prop.value.join(' ') : prop.value).styleSheet.children.map(i => {
                const newStyle = deepCopy(style);
                newStyle.property = [];
                return newStyle.extend(i);
              }));
            } else {
              const newStyle = deepCopy(style);
              newStyle.property = [ prop ];
              styles.push(newStyle);
            }
          }
        });
        this._plugin.shortcuts[key] = styles.map(i => i.updateMeta('components', 'shortcuts', layerOrder['shortcuts'], ++this._cache.count));
      }
    }
  }

  loadAlias(alias) {
    for (const [key, value] of Object.entries(alias)) {
      this._plugin.alias[key] = new ClassParser(value, undefined, this._cache.variants).parse();
    }
  }

  config(path, defaultValue) {
    if (path === 'corePlugins') return this._plugin.core ? Object.keys(this._plugin.core).filter(i => _optionalChain$2([this, 'access', _22 => _22._plugin, 'access', _23 => _23.core, 'optionalAccess', _24 => _24[i]])) : Object.keys(pluginOrder).slice(Object.keys(pluginOrder).length/2);
    return _nullishCoalesce$2(getNestedValue(this._config, path), () => ( defaultValue));
  }

  theme(path, defaultValue) {
    return this._theme ? _nullishCoalesce$2(getNestedValue(this._theme, path), () => ( defaultValue)) : undefined;
  }

  corePlugins(path) {
    if (Array.isArray(this._config.corePlugins)) {
      return (this._config.corePlugins ).includes(path);
    }
    return _nullishCoalesce$2((this.config(`corePlugins.${path}`, true) ), () => ( false));
  }

  variants(path, defaultValue = []) {
    if (Array.isArray(this._config.variants)) {
      return this._config.variants;
    }
    return this.config(`variants.${path}`, defaultValue) ;
  }

  e(selector) {
    return cssEscape(selector);
  }

  prefix(selector) {
    return selector.replace(/(?=[\w])/, _nullishCoalesce$2(this._config.prefix, () => ( '')));
  }

  addUtilities(
    utilities,
    options = {
      layer: 'utilities',
      variants: [],
      respectPrefix: true,
      respectImportant: true,
    }
  ) {
    if (Array.isArray(options)) options = { variants: options };
    if (Array.isArray(utilities)) utilities = utilities.reduce((previous, current) => combineConfig(previous, current), {}) ;
    let output = [];
    const layer = _nullishCoalesce$2(options.layer, () => ( 'utilities'));
    const order = layerOrder[layer] + 1;
    for (const [key, value] of Object.entries(utilities)) {
      let propertyValue = value;
      if (Array.isArray(value)) {
        propertyValue = Object.assign({}, ...value);
      }
      const styles = Style.generate(key.startsWith('.') && options.respectPrefix ? this.prefix(key) : key, propertyValue);
      if (options.layer) styles.forEach(style => style.updateMeta(layer, 'plugin', order, ++this._cache.count));
      if (options.respectImportant && this._config.important) styles.forEach(style => style.important = true);
      let className = guessClassName(key);
      if (key.charAt(0) === '@') {
        styles.forEach(style => {
          if (style.selector) className = guessClassName(style.selector);
          if (Array.isArray(className)) {
            className.filter(i => i.isClass).forEach(({ selector, pseudo }) => this._addPluginProcessorCache('utilities', selector, pseudo? style.clone('.' + cssEscape(selector)).wrapSelector(selector => selector + pseudo) : style.clone()));
            const base = className.filter(i => !i.isClass).map(i => i.selector).join(', ');
            if (base) this._addPluginProcessorCache('static', base, style.clone(base));
          } else {
            this._addPluginProcessorCache(className.isClass? 'utilities' : 'static', className.selector, className.pseudo? style.clone('.' + cssEscape(className.selector)).wrapSelector(selector => selector + (className ).pseudo) : style.clone());
          }
        });
      } else if (Array.isArray(className)) {
        className.filter(i => i.isClass).forEach(({ selector, pseudo }) => this._addPluginProcessorCache('utilities', selector, pseudo ? styles.map(i => i.clone('.' + cssEscape(selector)).wrapSelector(selector => selector + pseudo)): deepCopy(styles)));
        const base = className.filter(i => !i.isClass).map(i => i.selector).join(', ');
        if (base) this._addPluginProcessorCache('static', base, styles.map(i => i.clone(base)));
      } else {
        this._addPluginProcessorCache(className.isClass? 'utilities': 'static', className.selector, className.pseudo ? styles.map(style => style.clone('.' + cssEscape((className ).selector)).wrapSelector(selector => selector + (className ).pseudo)) : styles);
      }
      output = [...output, ...styles];
    }
    return output;
  }

  addDynamic(
    key,
    generator,
    options = {
      layer: 'utilities',
      group: 'plugin',
      variants: [],
      completions: [],
      respectPrefix: true,
      respectImportant: true,
      respectSelector: false,
    }
  ) {
    const uOptions = Array.isArray(options)? { } : options;
    const layer = uOptions.layer || 'utilities';
    const group = uOptions.group || 'plugin';
    const order = uOptions.order || layerOrder[layer] + 1;
    if (uOptions.completions) this._plugin.completions[group] = group in this._plugin.completions ? [...this._plugin.completions[group], ...uOptions.completions] : uOptions.completions;
    const style = (selector, property, important = uOptions.respectImportant && this._config.important ? true : false) => new Style(selector, property, important);
    const prop = (name, value, comment, important = uOptions.respectImportant && this._config.important ? true : false) => new Property(name, value, comment, important);
    const keyframes = (selector, property, important = uOptions.respectImportant && this._config.important ? true : false) => new Keyframes(selector, property, important);
    keyframes.generate = Keyframes.generate;
    style.generate = Style.generate;
    prop.parse = Property.parse;
    this._plugin.dynamic[key] = (key in this._plugin.dynamic)
      ? (Utility) => deepCopy(this._plugin.dynamic[key])(Utility) || generator({ Utility, Style: style, Property: prop, Keyframes: keyframes })
      : (Utility) => {
        const output = generator({ Utility, Style: style, Property: prop, Keyframes: keyframes });
        if (!output) return;
        if (Array.isArray(output)) return output.map(i => i.updateMeta(layer, group, order, ++this._cache.count, false, i.meta.respectSelector || uOptions.respectSelector));
        return output.updateMeta(layer, group, order, ++this._cache.count, false, output.meta.respectSelector || uOptions.respectSelector);
      };
    return generator;
  }

  addComponents(
    components,
    options = { layer: 'components', variants: [], respectPrefix: false }
  ) {
    if (Array.isArray(options)) options = { variants: options };
    if (Array.isArray(components)) components = components.reduce((previous, current) => combineConfig(previous, current), {}) ;
    let output = [];
    const layer = _nullishCoalesce$2(options.layer, () => ( 'components'));
    const order = layerOrder[layer] + 1;
    for (const [key, value] of Object.entries(components)) {
      let propertyValue = value;
      if (Array.isArray(value)) {
        propertyValue = Object.assign({}, ...value);
      }
      const styles = Style.generate(key.startsWith('.') && options.respectPrefix ? this.prefix(key) : key, propertyValue);
      styles.forEach(style => style.updateMeta(layer, 'plugin', order, ++this._cache.count));
      if (options.respectImportant && this._config.important) styles.forEach(style => style.important = true);
      let className = guessClassName(key);
      if (key.charAt(0) === '@') {
        styles.forEach(style => {
          if (style.selector) className = guessClassName(style.selector);
          if (Array.isArray(className)) {
            className.filter(i => i.isClass).forEach(({ selector, pseudo }) => this._addPluginProcessorCache('components', selector, pseudo? style.clone('.' + cssEscape(selector)).wrapSelector(selector => selector + pseudo) : style.clone()));
            const base = className.filter(i => !i.isClass).map(i => i.selector).join(', ');
            if (base) this._addPluginProcessorCache('static', base, style.clone(base));
          } else {
            this._addPluginProcessorCache(className.isClass? 'components' : 'static', className.selector, className.pseudo? style.clone('.' + cssEscape(className.selector)).wrapSelector(selector => selector + (className ).pseudo) : style.clone());
          }
        });
      } else if (Array.isArray(className)) {
        // one of the selector are not class, treat the entire as static to avoid duplication
        if (className.some(i => !i.isClass)) {
          const base = className.map(i => i.selector).join(', ');
          if (base) this._addPluginProcessorCache('static', base, styles.map(i => i.clone(base)));
        }
        // class
        else {
          className.forEach(({ selector, pseudo }) => this._addPluginProcessorCache('components', selector, pseudo ? styles.map(i => i.clone('.' + cssEscape(selector)).wrapSelector(selector => selector + pseudo)): deepCopy(styles)));
        }
      } else {
        this._addPluginProcessorCache(className.isClass? 'components': 'static', className.selector, className.pseudo ? styles.map(style => style.clone('.' + cssEscape((className ).selector)).wrapSelector(selector => selector + (className ).pseudo)) : styles);
      }
      output = [...output, ...styles];
    }
    return output;
  }

  addBase(baseStyles) {
    let output = [];
    for (const [key, value] of Object.entries(baseStyles)) {
      let propertyValue = value;
      if (Array.isArray(value)) {
        propertyValue = Object.assign({}, ...value);
      }
      const styles = Style.generate(key, propertyValue).map(i => i.updateMeta('base', 'plugin', 10, ++this._cache.count));
      this._replaceStyleVariants(styles);
      this._addPluginProcessorCache('preflights', key, styles);
      output = [...output, ...styles];
    }
    return output;
  }

  addVariant(
    name,
    generator,
  ) {
    // name && generator && options;
    const style = generator({
      ...this.variantUtils,
      separator: this.config('separator', ':') ,
      style: new Style(),
    });
    this._variants[name] = () => style;
    this._cache.variants.push(name);
    return style;
  }

  dumpConfig() {
    const processor = new Processor();
    const diff = diffConfig(processor._config, this._config) ;
    let output = { theme: { extend: {} }, plugins: [] } ;
    if (diff.theme) {
      for (const [key, value] of Object.entries(diff.theme)) {
        if (key !== 'extend') {
          (output.theme.extend )[key] = value;
        }
      }
      delete diff.theme;
    }
    if (diff.plugins) {
      for (const plugin of diff.plugins) {
        if ('config' in plugin) {
          delete plugin.config;
        }
        output.plugins.push(plugin);
      }
      delete diff.plugins;
    }
    output = { ...diff, ...output };

    return `module.exports = ${toSource(output)}`;
  }
}

function _nullishCoalesce$1(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain$1(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; } 




class HTMLParser {
  
  constructor(html) {
    this.html = html;
  }

  parseAttrs() {
    if (!this.html) return [];
    


    const output = [];
    const regex = /\S+\s*=\s*(?:"[^"]+"|'[^']+'|[^>\s]+)/igm;
    let match;
    while ((match = regex.exec(this.html ))) {
      if (match) {
        const raw = match[0];
        const sep = raw.indexOf('=');
        const key = raw.slice(0, sep).trim();
        let value = raw.slice(sep + 1).trim();
        if (['"', '\''].includes(value.charAt(0))) value = value.slice(1, -1);
        value = value.split(/\s/).filter(i => i);
        value = value[0] === undefined ? '' : value[1] === undefined ? value[0] : value;
        output.push({
          raw,
          key,
          value,
          start: match.index,
          end: regex.lastIndex,
        });
      }
    }
    return output;
  }

  parseClasses() {
    if (!this.html) return [];



    const output = [];
    const regex = /class(?:Name)?\s*=\s*(?:{`[^`]+`}|"[^"]+"|'[^']+'|[^>\s]+)/igm;
    let match;
    while ((match = regex.exec(this.html ))) {
      if (match) {
        const raw = match[0];
        const sep = raw.indexOf('=');
        let value = raw.slice(sep + 1).trim();
        let start = match.index + sep + 1 + (_nullishCoalesce$1(_optionalChain$1([this, 'access', _ => _.html, 'access', _2 => _2.slice, 'call', _3 => _3(sep + 1), 'access', _4 => _4.match, 'call', _5 => _5(/[^'"]/), 'optionalAccess', _6 => _6.index]), () => ( 0)));
        let end = regex.lastIndex;
        let first = value.charAt(0);
        while (['"', '\'', '`', '{'].includes(first)) {
          value = value.slice(1, -1);
          first = value.charAt(0);
          end--;
          start++;
        }
        output.push({
          result: value,
          start,
          end,
        });
      }
    }
    return output;
  }

  parseTags() {
    if (!this.html) return [];



    return Array.from(new Set(this.html.match(/<\w+/g))).map((i) =>
      i.substring(1)
    );
  }
}

var tasks = {};

var utils$3 = {};

var array = {};

var hasRequiredArray;

function requireArray () {
	if (hasRequiredArray) return array;
	hasRequiredArray = 1;
	Object.defineProperty(array, "__esModule", { value: true });
	array.splitWhen = array.flatten = void 0;
	function flatten(items) {
	    return items.reduce((collection, item) => [].concat(collection, item), []);
	}
	array.flatten = flatten;
	function splitWhen(items, predicate) {
	    const result = [[]];
	    let groupIndex = 0;
	    for (const item of items) {
	        if (predicate(item)) {
	            groupIndex++;
	            result[groupIndex] = [];
	        }
	        else {
	            result[groupIndex].push(item);
	        }
	    }
	    return result;
	}
	array.splitWhen = splitWhen;
	return array;
}

var errno = {};

var hasRequiredErrno;

function requireErrno () {
	if (hasRequiredErrno) return errno;
	hasRequiredErrno = 1;
	Object.defineProperty(errno, "__esModule", { value: true });
	errno.isEnoentCodeError = void 0;
	function isEnoentCodeError(error) {
	    return error.code === 'ENOENT';
	}
	errno.isEnoentCodeError = isEnoentCodeError;
	return errno;
}

var fs$3 = {};

var hasRequiredFs$3;

function requireFs$3 () {
	if (hasRequiredFs$3) return fs$3;
	hasRequiredFs$3 = 1;
	Object.defineProperty(fs$3, "__esModule", { value: true });
	fs$3.createDirentFromStats = void 0;
	class DirentFromStats {
	    constructor(name, stats) {
	        this.name = name;
	        this.isBlockDevice = stats.isBlockDevice.bind(stats);
	        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
	        this.isDirectory = stats.isDirectory.bind(stats);
	        this.isFIFO = stats.isFIFO.bind(stats);
	        this.isFile = stats.isFile.bind(stats);
	        this.isSocket = stats.isSocket.bind(stats);
	        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
	    }
	}
	function createDirentFromStats(name, stats) {
	    return new DirentFromStats(name, stats);
	}
	fs$3.createDirentFromStats = createDirentFromStats;
	return fs$3;
}

var path$1 = {};

var hasRequiredPath;

function requirePath () {
	if (hasRequiredPath) return path$1;
	hasRequiredPath = 1;
	Object.defineProperty(path$1, "__esModule", { value: true });
	path$1.convertPosixPathToPattern = path$1.convertWindowsPathToPattern = path$1.convertPathToPattern = path$1.escapePosixPath = path$1.escapeWindowsPath = path$1.escape = path$1.removeLeadingDotSegment = path$1.makeAbsolute = path$1.unixify = void 0;
	const os = require$$0;
	const path = path$2;
	const IS_WINDOWS_PLATFORM = os.platform() === 'win32';
	const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2; // ./ or .\\
	/**
	 * All non-escaped special characters.
	 * Posix: ()*?[]{|}, !+@ before (, ! at the beginning, \\ before non-special characters.
	 * Windows: (){}[], !+@ before (, ! at the beginning.
	 */
	const POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
	const WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
	/**
	 * The device path (\\.\ or \\?\).
	 * https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats#dos-device-paths
	 */
	const DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
	/**
	 * All backslashes except those escaping special characters.
	 * Windows: !()+@{}
	 * https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
	 */
	const WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
	/**
	 * Designed to work only with simple paths: `dir\\file`.
	 */
	function unixify(filepath) {
	    return filepath.replace(/\\/g, '/');
	}
	path$1.unixify = unixify;
	function makeAbsolute(cwd, filepath) {
	    return path.resolve(cwd, filepath);
	}
	path$1.makeAbsolute = makeAbsolute;
	function removeLeadingDotSegment(entry) {
	    // We do not use `startsWith` because this is 10x slower than current implementation for some cases.
	    // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
	    if (entry.charAt(0) === '.') {
	        const secondCharactery = entry.charAt(1);
	        if (secondCharactery === '/' || secondCharactery === '\\') {
	            return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
	        }
	    }
	    return entry;
	}
	path$1.removeLeadingDotSegment = removeLeadingDotSegment;
	path$1.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
	function escapeWindowsPath(pattern) {
	    return pattern.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');
	}
	path$1.escapeWindowsPath = escapeWindowsPath;
	function escapePosixPath(pattern) {
	    return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, '\\$2');
	}
	path$1.escapePosixPath = escapePosixPath;
	path$1.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
	function convertWindowsPathToPattern(filepath) {
	    return escapeWindowsPath(filepath)
	        .replace(DOS_DEVICE_PATH_RE, '//$1')
	        .replace(WINDOWS_BACKSLASHES_RE, '/');
	}
	path$1.convertWindowsPathToPattern = convertWindowsPathToPattern;
	function convertPosixPathToPattern(filepath) {
	    return escapePosixPath(filepath);
	}
	path$1.convertPosixPathToPattern = convertPosixPathToPattern;
	return path$1;
}

var pattern = {};

/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var isExtglob;
var hasRequiredIsExtglob;

function requireIsExtglob () {
	if (hasRequiredIsExtglob) return isExtglob;
	hasRequiredIsExtglob = 1;
	isExtglob = function isExtglob(str) {
	  if (typeof str !== 'string' || str === '') {
	    return false;
	  }

	  var match;
	  while ((match = /(\\).|([@?!+*]\(.*\))/g.exec(str))) {
	    if (match[2]) return true;
	    str = str.slice(match.index + match[0].length);
	  }

	  return false;
	};
	return isExtglob;
}

/*!
 * is-glob <https://github.com/jonschlinkert/is-glob>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isGlob;
var hasRequiredIsGlob;

function requireIsGlob () {
	if (hasRequiredIsGlob) return isGlob;
	hasRequiredIsGlob = 1;
	var isExtglob = requireIsExtglob();
	var chars = { '{': '}', '(': ')', '[': ']'};
	var strictCheck = function(str) {
	  if (str[0] === '!') {
	    return true;
	  }
	  var index = 0;
	  var pipeIndex = -2;
	  var closeSquareIndex = -2;
	  var closeCurlyIndex = -2;
	  var closeParenIndex = -2;
	  var backSlashIndex = -2;
	  while (index < str.length) {
	    if (str[index] === '*') {
	      return true;
	    }

	    if (str[index + 1] === '?' && /[\].+)]/.test(str[index])) {
	      return true;
	    }

	    if (closeSquareIndex !== -1 && str[index] === '[' && str[index + 1] !== ']') {
	      if (closeSquareIndex < index) {
	        closeSquareIndex = str.indexOf(']', index);
	      }
	      if (closeSquareIndex > index) {
	        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
	          return true;
	        }
	        backSlashIndex = str.indexOf('\\', index);
	        if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) {
	          return true;
	        }
	      }
	    }

	    if (closeCurlyIndex !== -1 && str[index] === '{' && str[index + 1] !== '}') {
	      closeCurlyIndex = str.indexOf('}', index);
	      if (closeCurlyIndex > index) {
	        backSlashIndex = str.indexOf('\\', index);
	        if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) {
	          return true;
	        }
	      }
	    }

	    if (closeParenIndex !== -1 && str[index] === '(' && str[index + 1] === '?' && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ')') {
	      closeParenIndex = str.indexOf(')', index);
	      if (closeParenIndex > index) {
	        backSlashIndex = str.indexOf('\\', index);
	        if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
	          return true;
	        }
	      }
	    }

	    if (pipeIndex !== -1 && str[index] === '(' && str[index + 1] !== '|') {
	      if (pipeIndex < index) {
	        pipeIndex = str.indexOf('|', index);
	      }
	      if (pipeIndex !== -1 && str[pipeIndex + 1] !== ')') {
	        closeParenIndex = str.indexOf(')', pipeIndex);
	        if (closeParenIndex > pipeIndex) {
	          backSlashIndex = str.indexOf('\\', pipeIndex);
	          if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) {
	            return true;
	          }
	        }
	      }
	    }

	    if (str[index] === '\\') {
	      var open = str[index + 1];
	      index += 2;
	      var close = chars[open];

	      if (close) {
	        var n = str.indexOf(close, index);
	        if (n !== -1) {
	          index = n + 1;
	        }
	      }

	      if (str[index] === '!') {
	        return true;
	      }
	    } else {
	      index++;
	    }
	  }
	  return false;
	};

	var relaxedCheck = function(str) {
	  if (str[0] === '!') {
	    return true;
	  }
	  var index = 0;
	  while (index < str.length) {
	    if (/[*?{}()[\]]/.test(str[index])) {
	      return true;
	    }

	    if (str[index] === '\\') {
	      var open = str[index + 1];
	      index += 2;
	      var close = chars[open];

	      if (close) {
	        var n = str.indexOf(close, index);
	        if (n !== -1) {
	          index = n + 1;
	        }
	      }

	      if (str[index] === '!') {
	        return true;
	      }
	    } else {
	      index++;
	    }
	  }
	  return false;
	};

	isGlob = function isGlob(str, options) {
	  if (typeof str !== 'string' || str === '') {
	    return false;
	  }

	  if (isExtglob(str)) {
	    return true;
	  }

	  var check = strictCheck;

	  // optionally relax check
	  if (options && options.strict === false) {
	    check = relaxedCheck;
	  }

	  return check(str);
	};
	return isGlob;
}

var globParent;
var hasRequiredGlobParent;

function requireGlobParent () {
	if (hasRequiredGlobParent) return globParent;
	hasRequiredGlobParent = 1;

	var isGlob = requireIsGlob();
	var pathPosixDirname = path$2.posix.dirname;
	var isWin32 = require$$0.platform() === 'win32';

	var slash = '/';
	var backslash = /\\/g;
	var enclosure = /[\{\[].*[\}\]]$/;
	var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
	var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;

	/**
	 * @param {string} str
	 * @param {Object} opts
	 * @param {boolean} [opts.flipBackslashes=true]
	 * @returns {string}
	 */
	globParent = function globParent(str, opts) {
	  var options = Object.assign({ flipBackslashes: true }, opts);

	  // flip windows path separators
	  if (options.flipBackslashes && isWin32 && str.indexOf(slash) < 0) {
	    str = str.replace(backslash, slash);
	  }

	  // special case for strings ending in enclosure containing path separator
	  if (enclosure.test(str)) {
	    str += slash;
	  }

	  // preserves full path in case of trailing path separator
	  str += 'a';

	  // remove path parts that are globby
	  do {
	    str = pathPosixDirname(str);
	  } while (isGlob(str) || globby.test(str));

	  // remove escape chars and return result
	  return str.replace(escaped, '$1');
	};
	return globParent;
}

var utils$2 = {};

var hasRequiredUtils$3;

function requireUtils$3 () {
	if (hasRequiredUtils$3) return utils$2;
	hasRequiredUtils$3 = 1;
	(function (exports$1) {

		exports$1.isInteger = num => {
		  if (typeof num === 'number') {
		    return Number.isInteger(num);
		  }
		  if (typeof num === 'string' && num.trim() !== '') {
		    return Number.isInteger(Number(num));
		  }
		  return false;
		};

		/**
		 * Find a node of the given type
		 */

		exports$1.find = (node, type) => node.nodes.find(node => node.type === type);

		/**
		 * Find a node of the given type
		 */

		exports$1.exceedsLimit = (min, max, step = 1, limit) => {
		  if (limit === false) return false;
		  if (!exports$1.isInteger(min) || !exports$1.isInteger(max)) return false;
		  return ((Number(max) - Number(min)) / Number(step)) >= limit;
		};

		/**
		 * Escape the given node with '\\' before node.value
		 */

		exports$1.escapeNode = (block, n = 0, type) => {
		  const node = block.nodes[n];
		  if (!node) return;

		  if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
		    if (node.escaped !== true) {
		      node.value = '\\' + node.value;
		      node.escaped = true;
		    }
		  }
		};

		/**
		 * Returns true if the given brace node should be enclosed in literal braces
		 */

		exports$1.encloseBrace = node => {
		  if (node.type !== 'brace') return false;
		  if ((node.commas >> 0 + node.ranges >> 0) === 0) {
		    node.invalid = true;
		    return true;
		  }
		  return false;
		};

		/**
		 * Returns true if a brace node is invalid.
		 */

		exports$1.isInvalidBrace = block => {
		  if (block.type !== 'brace') return false;
		  if (block.invalid === true || block.dollar) return true;
		  if ((block.commas >> 0 + block.ranges >> 0) === 0) {
		    block.invalid = true;
		    return true;
		  }
		  if (block.open !== true || block.close !== true) {
		    block.invalid = true;
		    return true;
		  }
		  return false;
		};

		/**
		 * Returns true if a node is an open or close node
		 */

		exports$1.isOpenOrClose = node => {
		  if (node.type === 'open' || node.type === 'close') {
		    return true;
		  }
		  return node.open === true || node.close === true;
		};

		/**
		 * Reduce an array of text nodes.
		 */

		exports$1.reduce = nodes => nodes.reduce((acc, node) => {
		  if (node.type === 'text') acc.push(node.value);
		  if (node.type === 'range') node.type = 'text';
		  return acc;
		}, []);

		/**
		 * Flatten an array
		 */

		exports$1.flatten = (...args) => {
		  const result = [];

		  const flat = arr => {
		    for (let i = 0; i < arr.length; i++) {
		      const ele = arr[i];

		      if (Array.isArray(ele)) {
		        flat(ele);
		        continue;
		      }

		      if (ele !== undefined) {
		        result.push(ele);
		      }
		    }
		    return result;
		  };

		  flat(args);
		  return result;
		}; 
	} (utils$2));
	return utils$2;
}

var stringify;
var hasRequiredStringify;

function requireStringify () {
	if (hasRequiredStringify) return stringify;
	hasRequiredStringify = 1;

	const utils = requireUtils$3();

	stringify = (ast, options = {}) => {
	  const stringify = (node, parent = {}) => {
	    const invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
	    const invalidNode = node.invalid === true && options.escapeInvalid === true;
	    let output = '';

	    if (node.value) {
	      if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) {
	        return '\\' + node.value;
	      }
	      return node.value;
	    }

	    if (node.value) {
	      return node.value;
	    }

	    if (node.nodes) {
	      for (const child of node.nodes) {
	        output += stringify(child);
	      }
	    }
	    return output;
	  };

	  return stringify(ast);
	};
	return stringify;
}

/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */

var isNumber;
var hasRequiredIsNumber;

function requireIsNumber () {
	if (hasRequiredIsNumber) return isNumber;
	hasRequiredIsNumber = 1;

	isNumber = function(num) {
	  if (typeof num === 'number') {
	    return num - num === 0;
	  }
	  if (typeof num === 'string' && num.trim() !== '') {
	    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
	  }
	  return false;
	};
	return isNumber;
}

/*!
 * to-regex-range <https://github.com/micromatch/to-regex-range>
 *
 * Copyright (c) 2015-present, Jon Schlinkert.
 * Released under the MIT License.
 */

var toRegexRange_1;
var hasRequiredToRegexRange;

function requireToRegexRange () {
	if (hasRequiredToRegexRange) return toRegexRange_1;
	hasRequiredToRegexRange = 1;

	const isNumber = requireIsNumber();

	const toRegexRange = (min, max, options) => {
	  if (isNumber(min) === false) {
	    throw new TypeError('toRegexRange: expected the first argument to be a number');
	  }

	  if (max === void 0 || min === max) {
	    return String(min);
	  }

	  if (isNumber(max) === false) {
	    throw new TypeError('toRegexRange: expected the second argument to be a number.');
	  }

	  let opts = { relaxZeros: true, ...options };
	  if (typeof opts.strictZeros === 'boolean') {
	    opts.relaxZeros = opts.strictZeros === false;
	  }

	  let relax = String(opts.relaxZeros);
	  let shorthand = String(opts.shorthand);
	  let capture = String(opts.capture);
	  let wrap = String(opts.wrap);
	  let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;

	  if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
	    return toRegexRange.cache[cacheKey].result;
	  }

	  let a = Math.min(min, max);
	  let b = Math.max(min, max);

	  if (Math.abs(a - b) === 1) {
	    let result = min + '|' + max;
	    if (opts.capture) {
	      return `(${result})`;
	    }
	    if (opts.wrap === false) {
	      return result;
	    }
	    return `(?:${result})`;
	  }

	  let isPadded = hasPadding(min) || hasPadding(max);
	  let state = { min, max, a, b };
	  let positives = [];
	  let negatives = [];

	  if (isPadded) {
	    state.isPadded = isPadded;
	    state.maxLen = String(state.max).length;
	  }

	  if (a < 0) {
	    let newMin = b < 0 ? Math.abs(b) : 1;
	    negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
	    a = state.a = 0;
	  }

	  if (b >= 0) {
	    positives = splitToPatterns(a, b, state, opts);
	  }

	  state.negatives = negatives;
	  state.positives = positives;
	  state.result = collatePatterns(negatives, positives);

	  if (opts.capture === true) {
	    state.result = `(${state.result})`;
	  } else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
	    state.result = `(?:${state.result})`;
	  }

	  toRegexRange.cache[cacheKey] = state;
	  return state.result;
	};

	function collatePatterns(neg, pos, options) {
	  let onlyNegative = filterPatterns(neg, pos, '-', false) || [];
	  let onlyPositive = filterPatterns(pos, neg, '', false) || [];
	  let intersected = filterPatterns(neg, pos, '-?', true) || [];
	  let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
	  return subpatterns.join('|');
	}

	function splitToRanges(min, max) {
	  let nines = 1;
	  let zeros = 1;

	  let stop = countNines(min, nines);
	  let stops = new Set([max]);

	  while (min <= stop && stop <= max) {
	    stops.add(stop);
	    nines += 1;
	    stop = countNines(min, nines);
	  }

	  stop = countZeros(max + 1, zeros) - 1;

	  while (min < stop && stop <= max) {
	    stops.add(stop);
	    zeros += 1;
	    stop = countZeros(max + 1, zeros) - 1;
	  }

	  stops = [...stops];
	  stops.sort(compare);
	  return stops;
	}

	/**
	 * Convert a range to a regex pattern
	 * @param {Number} `start`
	 * @param {Number} `stop`
	 * @return {String}
	 */

	function rangeToPattern(start, stop, options) {
	  if (start === stop) {
	    return { pattern: start, count: [], digits: 0 };
	  }

	  let zipped = zip(start, stop);
	  let digits = zipped.length;
	  let pattern = '';
	  let count = 0;

	  for (let i = 0; i < digits; i++) {
	    let [startDigit, stopDigit] = zipped[i];

	    if (startDigit === stopDigit) {
	      pattern += startDigit;

	    } else if (startDigit !== '0' || stopDigit !== '9') {
	      pattern += toCharacterClass(startDigit, stopDigit);

	    } else {
	      count++;
	    }
	  }

	  if (count) {
	    pattern += options.shorthand === true ? '\\d' : '[0-9]';
	  }

	  return { pattern, count: [count], digits };
	}

	function splitToPatterns(min, max, tok, options) {
	  let ranges = splitToRanges(min, max);
	  let tokens = [];
	  let start = min;
	  let prev;

	  for (let i = 0; i < ranges.length; i++) {
	    let max = ranges[i];
	    let obj = rangeToPattern(String(start), String(max), options);
	    let zeros = '';

	    if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
	      if (prev.count.length > 1) {
	        prev.count.pop();
	      }

	      prev.count.push(obj.count[0]);
	      prev.string = prev.pattern + toQuantifier(prev.count);
	      start = max + 1;
	      continue;
	    }

	    if (tok.isPadded) {
	      zeros = padZeros(max, tok, options);
	    }

	    obj.string = zeros + obj.pattern + toQuantifier(obj.count);
	    tokens.push(obj);
	    start = max + 1;
	    prev = obj;
	  }

	  return tokens;
	}

	function filterPatterns(arr, comparison, prefix, intersection, options) {
	  let result = [];

	  for (let ele of arr) {
	    let { string } = ele;

	    // only push if _both_ are negative...
	    if (!intersection && !contains(comparison, 'string', string)) {
	      result.push(prefix + string);
	    }

	    // or _both_ are positive
	    if (intersection && contains(comparison, 'string', string)) {
	      result.push(prefix + string);
	    }
	  }
	  return result;
	}

	/**
	 * Zip strings
	 */

	function zip(a, b) {
	  let arr = [];
	  for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
	  return arr;
	}

	function compare(a, b) {
	  return a > b ? 1 : b > a ? -1 : 0;
	}

	function contains(arr, key, val) {
	  return arr.some(ele => ele[key] === val);
	}

	function countNines(min, len) {
	  return Number(String(min).slice(0, -len) + '9'.repeat(len));
	}

	function countZeros(integer, zeros) {
	  return integer - (integer % Math.pow(10, zeros));
	}

	function toQuantifier(digits) {
	  let [start = 0, stop = ''] = digits;
	  if (stop || start > 1) {
	    return `{${start + (stop ? ',' + stop : '')}}`;
	  }
	  return '';
	}

	function toCharacterClass(a, b, options) {
	  return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
	}

	function hasPadding(str) {
	  return /^-?(0+)\d/.test(str);
	}

	function padZeros(value, tok, options) {
	  if (!tok.isPadded) {
	    return value;
	  }

	  let diff = Math.abs(tok.maxLen - String(value).length);
	  let relax = options.relaxZeros !== false;

	  switch (diff) {
	    case 0:
	      return '';
	    case 1:
	      return relax ? '0?' : '0';
	    case 2:
	      return relax ? '0{0,2}' : '00';
	    default: {
	      return relax ? `0{0,${diff}}` : `0{${diff}}`;
	    }
	  }
	}

	/**
	 * Cache
	 */

	toRegexRange.cache = {};
	toRegexRange.clearCache = () => (toRegexRange.cache = {});

	/**
	 * Expose `toRegexRange`
	 */

	toRegexRange_1 = toRegexRange;
	return toRegexRange_1;
}

/*!
 * fill-range <https://github.com/jonschlinkert/fill-range>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var fillRange;
var hasRequiredFillRange;

function requireFillRange () {
	if (hasRequiredFillRange) return fillRange;
	hasRequiredFillRange = 1;

	const util = require$$0$1;
	const toRegexRange = requireToRegexRange();

	const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

	const transform = toNumber => {
	  return value => toNumber === true ? Number(value) : String(value);
	};

	const isValidValue = value => {
	  return typeof value === 'number' || (typeof value === 'string' && value !== '');
	};

	const isNumber = num => Number.isInteger(+num);

	const zeros = input => {
	  let value = `${input}`;
	  let index = -1;
	  if (value[0] === '-') value = value.slice(1);
	  if (value === '0') return false;
	  while (value[++index] === '0');
	  return index > 0;
	};

	const stringify = (start, end, options) => {
	  if (typeof start === 'string' || typeof end === 'string') {
	    return true;
	  }
	  return options.stringify === true;
	};

	const pad = (input, maxLength, toNumber) => {
	  if (maxLength > 0) {
	    let dash = input[0] === '-' ? '-' : '';
	    if (dash) input = input.slice(1);
	    input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
	  }
	  if (toNumber === false) {
	    return String(input);
	  }
	  return input;
	};

	const toMaxLen = (input, maxLength) => {
	  let negative = input[0] === '-' ? '-' : '';
	  if (negative) {
	    input = input.slice(1);
	    maxLength--;
	  }
	  while (input.length < maxLength) input = '0' + input;
	  return negative ? ('-' + input) : input;
	};

	const toSequence = (parts, options, maxLen) => {
	  parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
	  parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);

	  let prefix = options.capture ? '' : '?:';
	  let positives = '';
	  let negatives = '';
	  let result;

	  if (parts.positives.length) {
	    positives = parts.positives.map(v => toMaxLen(String(v), maxLen)).join('|');
	  }

	  if (parts.negatives.length) {
	    negatives = `-(${prefix}${parts.negatives.map(v => toMaxLen(String(v), maxLen)).join('|')})`;
	  }

	  if (positives && negatives) {
	    result = `${positives}|${negatives}`;
	  } else {
	    result = positives || negatives;
	  }

	  if (options.wrap) {
	    return `(${prefix}${result})`;
	  }

	  return result;
	};

	const toRange = (a, b, isNumbers, options) => {
	  if (isNumbers) {
	    return toRegexRange(a, b, { wrap: false, ...options });
	  }

	  let start = String.fromCharCode(a);
	  if (a === b) return start;

	  let stop = String.fromCharCode(b);
	  return `[${start}-${stop}]`;
	};

	const toRegex = (start, end, options) => {
	  if (Array.isArray(start)) {
	    let wrap = options.wrap === true;
	    let prefix = options.capture ? '' : '?:';
	    return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
	  }
	  return toRegexRange(start, end, options);
	};

	const rangeError = (...args) => {
	  return new RangeError('Invalid range arguments: ' + util.inspect(...args));
	};

	const invalidRange = (start, end, options) => {
	  if (options.strictRanges === true) throw rangeError([start, end]);
	  return [];
	};

	const invalidStep = (step, options) => {
	  if (options.strictRanges === true) {
	    throw new TypeError(`Expected step "${step}" to be a number`);
	  }
	  return [];
	};

	const fillNumbers = (start, end, step = 1, options = {}) => {
	  let a = Number(start);
	  let b = Number(end);

	  if (!Number.isInteger(a) || !Number.isInteger(b)) {
	    if (options.strictRanges === true) throw rangeError([start, end]);
	    return [];
	  }

	  // fix negative zero
	  if (a === 0) a = 0;
	  if (b === 0) b = 0;

	  let descending = a > b;
	  let startString = String(start);
	  let endString = String(end);
	  let stepString = String(step);
	  step = Math.max(Math.abs(step), 1);

	  let padded = zeros(startString) || zeros(endString) || zeros(stepString);
	  let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
	  let toNumber = padded === false && stringify(start, end, options) === false;
	  let format = options.transform || transform(toNumber);

	  if (options.toRegex && step === 1) {
	    return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
	  }

	  let parts = { negatives: [], positives: [] };
	  let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
	  let range = [];
	  let index = 0;

	  while (descending ? a >= b : a <= b) {
	    if (options.toRegex === true && step > 1) {
	      push(a);
	    } else {
	      range.push(pad(format(a, index), maxLen, toNumber));
	    }
	    a = descending ? a - step : a + step;
	    index++;
	  }

	  if (options.toRegex === true) {
	    return step > 1
	      ? toSequence(parts, options, maxLen)
	      : toRegex(range, null, { wrap: false, ...options });
	  }

	  return range;
	};

	const fillLetters = (start, end, step = 1, options = {}) => {
	  if ((!isNumber(start) && start.length > 1) || (!isNumber(end) && end.length > 1)) {
	    return invalidRange(start, end, options);
	  }

	  let format = options.transform || (val => String.fromCharCode(val));
	  let a = `${start}`.charCodeAt(0);
	  let b = `${end}`.charCodeAt(0);

	  let descending = a > b;
	  let min = Math.min(a, b);
	  let max = Math.max(a, b);

	  if (options.toRegex && step === 1) {
	    return toRange(min, max, false, options);
	  }

	  let range = [];
	  let index = 0;

	  while (descending ? a >= b : a <= b) {
	    range.push(format(a, index));
	    a = descending ? a - step : a + step;
	    index++;
	  }

	  if (options.toRegex === true) {
	    return toRegex(range, null, { wrap: false, options });
	  }

	  return range;
	};

	const fill = (start, end, step, options = {}) => {
	  if (end == null && isValidValue(start)) {
	    return [start];
	  }

	  if (!isValidValue(start) || !isValidValue(end)) {
	    return invalidRange(start, end, options);
	  }

	  if (typeof step === 'function') {
	    return fill(start, end, 1, { transform: step });
	  }

	  if (isObject(step)) {
	    return fill(start, end, 0, step);
	  }

	  let opts = { ...options };
	  if (opts.capture === true) opts.wrap = true;
	  step = step || opts.step || 1;

	  if (!isNumber(step)) {
	    if (step != null && !isObject(step)) return invalidStep(step, opts);
	    return fill(start, end, 1, step);
	  }

	  if (isNumber(start) && isNumber(end)) {
	    return fillNumbers(start, end, step, opts);
	  }

	  return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
	};

	fillRange = fill;
	return fillRange;
}

var compile_1;
var hasRequiredCompile;

function requireCompile () {
	if (hasRequiredCompile) return compile_1;
	hasRequiredCompile = 1;

	const fill = requireFillRange();
	const utils = requireUtils$3();

	const compile = (ast, options = {}) => {
	  const walk = (node, parent = {}) => {
	    const invalidBlock = utils.isInvalidBrace(parent);
	    const invalidNode = node.invalid === true && options.escapeInvalid === true;
	    const invalid = invalidBlock === true || invalidNode === true;
	    const prefix = options.escapeInvalid === true ? '\\' : '';
	    let output = '';

	    if (node.isOpen === true) {
	      return prefix + node.value;
	    }

	    if (node.isClose === true) {
	      console.log('node.isClose', prefix, node.value);
	      return prefix + node.value;
	    }

	    if (node.type === 'open') {
	      return invalid ? prefix + node.value : '(';
	    }

	    if (node.type === 'close') {
	      return invalid ? prefix + node.value : ')';
	    }

	    if (node.type === 'comma') {
	      return node.prev.type === 'comma' ? '' : invalid ? node.value : '|';
	    }

	    if (node.value) {
	      return node.value;
	    }

	    if (node.nodes && node.ranges > 0) {
	      const args = utils.reduce(node.nodes);
	      const range = fill(...args, { ...options, wrap: false, toRegex: true, strictZeros: true });

	      if (range.length !== 0) {
	        return args.length > 1 && range.length > 1 ? `(${range})` : range;
	      }
	    }

	    if (node.nodes) {
	      for (const child of node.nodes) {
	        output += walk(child, node);
	      }
	    }

	    return output;
	  };

	  return walk(ast);
	};

	compile_1 = compile;
	return compile_1;
}

var expand_1;
var hasRequiredExpand;

function requireExpand () {
	if (hasRequiredExpand) return expand_1;
	hasRequiredExpand = 1;

	const fill = requireFillRange();
	const stringify = requireStringify();
	const utils = requireUtils$3();

	const append = (queue = '', stash = '', enclose = false) => {
	  const result = [];

	  queue = [].concat(queue);
	  stash = [].concat(stash);

	  if (!stash.length) return queue;
	  if (!queue.length) {
	    return enclose ? utils.flatten(stash).map(ele => `{${ele}}`) : stash;
	  }

	  for (const item of queue) {
	    if (Array.isArray(item)) {
	      for (const value of item) {
	        result.push(append(value, stash, enclose));
	      }
	    } else {
	      for (let ele of stash) {
	        if (enclose === true && typeof ele === 'string') ele = `{${ele}}`;
	        result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
	      }
	    }
	  }
	  return utils.flatten(result);
	};

	const expand = (ast, options = {}) => {
	  const rangeLimit = options.rangeLimit === undefined ? 1000 : options.rangeLimit;

	  const walk = (node, parent = {}) => {
	    node.queue = [];

	    let p = parent;
	    let q = parent.queue;

	    while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
	      p = p.parent;
	      q = p.queue;
	    }

	    if (node.invalid || node.dollar) {
	      q.push(append(q.pop(), stringify(node, options)));
	      return;
	    }

	    if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
	      q.push(append(q.pop(), ['{}']));
	      return;
	    }

	    if (node.nodes && node.ranges > 0) {
	      const args = utils.reduce(node.nodes);

	      if (utils.exceedsLimit(...args, options.step, rangeLimit)) {
	        throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
	      }

	      let range = fill(...args, options);
	      if (range.length === 0) {
	        range = stringify(node, options);
	      }

	      q.push(append(q.pop(), range));
	      node.nodes = [];
	      return;
	    }

	    const enclose = utils.encloseBrace(node);
	    let queue = node.queue;
	    let block = node;

	    while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
	      block = block.parent;
	      queue = block.queue;
	    }

	    for (let i = 0; i < node.nodes.length; i++) {
	      const child = node.nodes[i];

	      if (child.type === 'comma' && node.type === 'brace') {
	        if (i === 1) queue.push('');
	        queue.push('');
	        continue;
	      }

	      if (child.type === 'close') {
	        q.push(append(q.pop(), queue, enclose));
	        continue;
	      }

	      if (child.value && child.type !== 'open') {
	        queue.push(append(queue.pop(), child.value));
	        continue;
	      }

	      if (child.nodes) {
	        walk(child, node);
	      }
	    }

	    return queue;
	  };

	  return utils.flatten(walk(ast));
	};

	expand_1 = expand;
	return expand_1;
}

var constants$2;
var hasRequiredConstants$2;

function requireConstants$2 () {
	if (hasRequiredConstants$2) return constants$2;
	hasRequiredConstants$2 = 1;

	constants$2 = {
	  MAX_LENGTH: 10000,

	  // Digits
	  CHAR_0: '0', /* 0 */
	  CHAR_9: '9', /* 9 */

	  // Alphabet chars.
	  CHAR_UPPERCASE_A: 'A', /* A */
	  CHAR_LOWERCASE_A: 'a', /* a */
	  CHAR_UPPERCASE_Z: 'Z', /* Z */
	  CHAR_LOWERCASE_Z: 'z', /* z */

	  CHAR_LEFT_PARENTHESES: '(', /* ( */
	  CHAR_RIGHT_PARENTHESES: ')', /* ) */

	  CHAR_ASTERISK: '*', /* * */

	  // Non-alphabetic chars.
	  CHAR_AMPERSAND: '&', /* & */
	  CHAR_AT: '@', /* @ */
	  CHAR_BACKSLASH: '\\', /* \ */
	  CHAR_BACKTICK: '`', /* ` */
	  CHAR_CARRIAGE_RETURN: '\r', /* \r */
	  CHAR_CIRCUMFLEX_ACCENT: '^', /* ^ */
	  CHAR_COLON: ':', /* : */
	  CHAR_COMMA: ',', /* , */
	  CHAR_DOLLAR: '$', /* . */
	  CHAR_DOT: '.', /* . */
	  CHAR_DOUBLE_QUOTE: '"', /* " */
	  CHAR_EQUAL: '=', /* = */
	  CHAR_EXCLAMATION_MARK: '!', /* ! */
	  CHAR_FORM_FEED: '\f', /* \f */
	  CHAR_FORWARD_SLASH: '/', /* / */
	  CHAR_HASH: '#', /* # */
	  CHAR_HYPHEN_MINUS: '-', /* - */
	  CHAR_LEFT_ANGLE_BRACKET: '<', /* < */
	  CHAR_LEFT_CURLY_BRACE: '{', /* { */
	  CHAR_LEFT_SQUARE_BRACKET: '[', /* [ */
	  CHAR_LINE_FEED: '\n', /* \n */
	  CHAR_NO_BREAK_SPACE: '\u00A0', /* \u00A0 */
	  CHAR_PERCENT: '%', /* % */
	  CHAR_PLUS: '+', /* + */
	  CHAR_QUESTION_MARK: '?', /* ? */
	  CHAR_RIGHT_ANGLE_BRACKET: '>', /* > */
	  CHAR_RIGHT_CURLY_BRACE: '}', /* } */
	  CHAR_RIGHT_SQUARE_BRACKET: ']', /* ] */
	  CHAR_SEMICOLON: ';', /* ; */
	  CHAR_SINGLE_QUOTE: '\'', /* ' */
	  CHAR_SPACE: ' ', /*   */
	  CHAR_TAB: '\t', /* \t */
	  CHAR_UNDERSCORE: '_', /* _ */
	  CHAR_VERTICAL_LINE: '|', /* | */
	  CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
	};
	return constants$2;
}

var parse_1$1;
var hasRequiredParse$1;

function requireParse$1 () {
	if (hasRequiredParse$1) return parse_1$1;
	hasRequiredParse$1 = 1;

	const stringify = requireStringify();

	/**
	 * Constants
	 */

	const {
	  MAX_LENGTH,
	  CHAR_BACKSLASH, /* \ */
	  CHAR_BACKTICK, /* ` */
	  CHAR_COMMA, /* , */
	  CHAR_DOT, /* . */
	  CHAR_LEFT_PARENTHESES, /* ( */
	  CHAR_RIGHT_PARENTHESES, /* ) */
	  CHAR_LEFT_CURLY_BRACE, /* { */
	  CHAR_RIGHT_CURLY_BRACE, /* } */
	  CHAR_LEFT_SQUARE_BRACKET, /* [ */
	  CHAR_RIGHT_SQUARE_BRACKET, /* ] */
	  CHAR_DOUBLE_QUOTE, /* " */
	  CHAR_SINGLE_QUOTE, /* ' */
	  CHAR_NO_BREAK_SPACE,
	  CHAR_ZERO_WIDTH_NOBREAK_SPACE
	} = requireConstants$2();

	/**
	 * parse
	 */

	const parse = (input, options = {}) => {
	  if (typeof input !== 'string') {
	    throw new TypeError('Expected a string');
	  }

	  const opts = options || {};
	  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
	  if (input.length > max) {
	    throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
	  }

	  const ast = { type: 'root', input, nodes: [] };
	  const stack = [ast];
	  let block = ast;
	  let prev = ast;
	  let brackets = 0;
	  const length = input.length;
	  let index = 0;
	  let depth = 0;
	  let value;

	  /**
	   * Helpers
	   */

	  const advance = () => input[index++];
	  const push = node => {
	    if (node.type === 'text' && prev.type === 'dot') {
	      prev.type = 'text';
	    }

	    if (prev && prev.type === 'text' && node.type === 'text') {
	      prev.value += node.value;
	      return;
	    }

	    block.nodes.push(node);
	    node.parent = block;
	    node.prev = prev;
	    prev = node;
	    return node;
	  };

	  push({ type: 'bos' });

	  while (index < length) {
	    block = stack[stack.length - 1];
	    value = advance();

	    /**
	     * Invalid chars
	     */

	    if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
	      continue;
	    }

	    /**
	     * Escaped chars
	     */

	    if (value === CHAR_BACKSLASH) {
	      push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
	      continue;
	    }

	    /**
	     * Right square bracket (literal): ']'
	     */

	    if (value === CHAR_RIGHT_SQUARE_BRACKET) {
	      push({ type: 'text', value: '\\' + value });
	      continue;
	    }

	    /**
	     * Left square bracket: '['
	     */

	    if (value === CHAR_LEFT_SQUARE_BRACKET) {
	      brackets++;

	      let next;

	      while (index < length && (next = advance())) {
	        value += next;

	        if (next === CHAR_LEFT_SQUARE_BRACKET) {
	          brackets++;
	          continue;
	        }

	        if (next === CHAR_BACKSLASH) {
	          value += advance();
	          continue;
	        }

	        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
	          brackets--;

	          if (brackets === 0) {
	            break;
	          }
	        }
	      }

	      push({ type: 'text', value });
	      continue;
	    }

	    /**
	     * Parentheses
	     */

	    if (value === CHAR_LEFT_PARENTHESES) {
	      block = push({ type: 'paren', nodes: [] });
	      stack.push(block);
	      push({ type: 'text', value });
	      continue;
	    }

	    if (value === CHAR_RIGHT_PARENTHESES) {
	      if (block.type !== 'paren') {
	        push({ type: 'text', value });
	        continue;
	      }
	      block = stack.pop();
	      push({ type: 'text', value });
	      block = stack[stack.length - 1];
	      continue;
	    }

	    /**
	     * Quotes: '|"|`
	     */

	    if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
	      const open = value;
	      let next;

	      if (options.keepQuotes !== true) {
	        value = '';
	      }

	      while (index < length && (next = advance())) {
	        if (next === CHAR_BACKSLASH) {
	          value += next + advance();
	          continue;
	        }

	        if (next === open) {
	          if (options.keepQuotes === true) value += next;
	          break;
	        }

	        value += next;
	      }

	      push({ type: 'text', value });
	      continue;
	    }

	    /**
	     * Left curly brace: '{'
	     */

	    if (value === CHAR_LEFT_CURLY_BRACE) {
	      depth++;

	      const dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
	      const brace = {
	        type: 'brace',
	        open: true,
	        close: false,
	        dollar,
	        depth,
	        commas: 0,
	        ranges: 0,
	        nodes: []
	      };

	      block = push(brace);
	      stack.push(block);
	      push({ type: 'open', value });
	      continue;
	    }

	    /**
	     * Right curly brace: '}'
	     */

	    if (value === CHAR_RIGHT_CURLY_BRACE) {
	      if (block.type !== 'brace') {
	        push({ type: 'text', value });
	        continue;
	      }

	      const type = 'close';
	      block = stack.pop();
	      block.close = true;

	      push({ type, value });
	      depth--;

	      block = stack[stack.length - 1];
	      continue;
	    }

	    /**
	     * Comma: ','
	     */

	    if (value === CHAR_COMMA && depth > 0) {
	      if (block.ranges > 0) {
	        block.ranges = 0;
	        const open = block.nodes.shift();
	        block.nodes = [open, { type: 'text', value: stringify(block) }];
	      }

	      push({ type: 'comma', value });
	      block.commas++;
	      continue;
	    }

	    /**
	     * Dot: '.'
	     */

	    if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
	      const siblings = block.nodes;

	      if (depth === 0 || siblings.length === 0) {
	        push({ type: 'text', value });
	        continue;
	      }

	      if (prev.type === 'dot') {
	        block.range = [];
	        prev.value += value;
	        prev.type = 'range';

	        if (block.nodes.length !== 3 && block.nodes.length !== 5) {
	          block.invalid = true;
	          block.ranges = 0;
	          prev.type = 'text';
	          continue;
	        }

	        block.ranges++;
	        block.args = [];
	        continue;
	      }

	      if (prev.type === 'range') {
	        siblings.pop();

	        const before = siblings[siblings.length - 1];
	        before.value += prev.value + value;
	        prev = before;
	        block.ranges--;
	        continue;
	      }

	      push({ type: 'dot', value });
	      continue;
	    }

	    /**
	     * Text
	     */

	    push({ type: 'text', value });
	  }

	  // Mark imbalanced braces and brackets as invalid
	  do {
	    block = stack.pop();

	    if (block.type !== 'root') {
	      block.nodes.forEach(node => {
	        if (!node.nodes) {
	          if (node.type === 'open') node.isOpen = true;
	          if (node.type === 'close') node.isClose = true;
	          if (!node.nodes) node.type = 'text';
	          node.invalid = true;
	        }
	      });

	      // get the location of the block on parent.nodes (block's siblings)
	      const parent = stack[stack.length - 1];
	      const index = parent.nodes.indexOf(block);
	      // replace the (invalid) block with it's nodes
	      parent.nodes.splice(index, 1, ...block.nodes);
	    }
	  } while (stack.length > 0);

	  push({ type: 'eos' });
	  return ast;
	};

	parse_1$1 = parse;
	return parse_1$1;
}

var braces_1;
var hasRequiredBraces;

function requireBraces () {
	if (hasRequiredBraces) return braces_1;
	hasRequiredBraces = 1;

	const stringify = requireStringify();
	const compile = requireCompile();
	const expand = requireExpand();
	const parse = requireParse$1();

	/**
	 * Expand the given pattern or create a regex-compatible string.
	 *
	 * ```js
	 * const braces = require('braces');
	 * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
	 * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
	 * ```
	 * @param {String} `str`
	 * @param {Object} `options`
	 * @return {String}
	 * @api public
	 */

	const braces = (input, options = {}) => {
	  let output = [];

	  if (Array.isArray(input)) {
	    for (const pattern of input) {
	      const result = braces.create(pattern, options);
	      if (Array.isArray(result)) {
	        output.push(...result);
	      } else {
	        output.push(result);
	      }
	    }
	  } else {
	    output = [].concat(braces.create(input, options));
	  }

	  if (options && options.expand === true && options.nodupes === true) {
	    output = [...new Set(output)];
	  }
	  return output;
	};

	/**
	 * Parse the given `str` with the given `options`.
	 *
	 * ```js
	 * // braces.parse(pattern, [, options]);
	 * const ast = braces.parse('a/{b,c}/d');
	 * console.log(ast);
	 * ```
	 * @param {String} pattern Brace pattern to parse
	 * @param {Object} options
	 * @return {Object} Returns an AST
	 * @api public
	 */

	braces.parse = (input, options = {}) => parse(input, options);

	/**
	 * Creates a braces string from an AST, or an AST node.
	 *
	 * ```js
	 * const braces = require('braces');
	 * let ast = braces.parse('foo/{a,b}/bar');
	 * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
	 * ```
	 * @param {String} `input` Brace pattern or AST.
	 * @param {Object} `options`
	 * @return {Array} Returns an array of expanded values.
	 * @api public
	 */

	braces.stringify = (input, options = {}) => {
	  if (typeof input === 'string') {
	    return stringify(braces.parse(input, options), options);
	  }
	  return stringify(input, options);
	};

	/**
	 * Compiles a brace pattern into a regex-compatible, optimized string.
	 * This method is called by the main [braces](#braces) function by default.
	 *
	 * ```js
	 * const braces = require('braces');
	 * console.log(braces.compile('a/{b,c}/d'));
	 * //=> ['a/(b|c)/d']
	 * ```
	 * @param {String} `input` Brace pattern or AST.
	 * @param {Object} `options`
	 * @return {Array} Returns an array of expanded values.
	 * @api public
	 */

	braces.compile = (input, options = {}) => {
	  if (typeof input === 'string') {
	    input = braces.parse(input, options);
	  }
	  return compile(input, options);
	};

	/**
	 * Expands a brace pattern into an array. This method is called by the
	 * main [braces](#braces) function when `options.expand` is true. Before
	 * using this method it's recommended that you read the [performance notes](#performance))
	 * and advantages of using [.compile](#compile) instead.
	 *
	 * ```js
	 * const braces = require('braces');
	 * console.log(braces.expand('a/{b,c}/d'));
	 * //=> ['a/b/d', 'a/c/d'];
	 * ```
	 * @param {String} `pattern` Brace pattern
	 * @param {Object} `options`
	 * @return {Array} Returns an array of expanded values.
	 * @api public
	 */

	braces.expand = (input, options = {}) => {
	  if (typeof input === 'string') {
	    input = braces.parse(input, options);
	  }

	  let result = expand(input, options);

	  // filter out empty strings if specified
	  if (options.noempty === true) {
	    result = result.filter(Boolean);
	  }

	  // filter out duplicates if specified
	  if (options.nodupes === true) {
	    result = [...new Set(result)];
	  }

	  return result;
	};

	/**
	 * Processes a brace pattern and returns either an expanded array
	 * (if `options.expand` is true), a highly optimized regex-compatible string.
	 * This method is called by the main [braces](#braces) function.
	 *
	 * ```js
	 * const braces = require('braces');
	 * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
	 * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
	 * ```
	 * @param {String} `pattern` Brace pattern
	 * @param {Object} `options`
	 * @return {Array} Returns an array of expanded values.
	 * @api public
	 */

	braces.create = (input, options = {}) => {
	  if (input === '' || input.length < 3) {
	    return [input];
	  }

	  return options.expand !== true
	    ? braces.compile(input, options)
	    : braces.expand(input, options);
	};

	/**
	 * Expose "braces"
	 */

	braces_1 = braces;
	return braces_1;
}

var utils$1 = {};

var constants$1;
var hasRequiredConstants$1;

function requireConstants$1 () {
	if (hasRequiredConstants$1) return constants$1;
	hasRequiredConstants$1 = 1;

	const path = path$2;
	const WIN_SLASH = '\\\\/';
	const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

	/**
	 * Posix glob regex
	 */

	const DOT_LITERAL = '\\.';
	const PLUS_LITERAL = '\\+';
	const QMARK_LITERAL = '\\?';
	const SLASH_LITERAL = '\\/';
	const ONE_CHAR = '(?=.)';
	const QMARK = '[^/]';
	const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
	const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
	const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
	const NO_DOT = `(?!${DOT_LITERAL})`;
	const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
	const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
	const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
	const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
	const STAR = `${QMARK}*?`;

	const POSIX_CHARS = {
	  DOT_LITERAL,
	  PLUS_LITERAL,
	  QMARK_LITERAL,
	  SLASH_LITERAL,
	  ONE_CHAR,
	  QMARK,
	  END_ANCHOR,
	  DOTS_SLASH,
	  NO_DOT,
	  NO_DOTS,
	  NO_DOT_SLASH,
	  NO_DOTS_SLASH,
	  QMARK_NO_DOT,
	  STAR,
	  START_ANCHOR
	};

	/**
	 * Windows glob regex
	 */

	const WINDOWS_CHARS = {
	  ...POSIX_CHARS,

	  SLASH_LITERAL: `[${WIN_SLASH}]`,
	  QMARK: WIN_NO_SLASH,
	  STAR: `${WIN_NO_SLASH}*?`,
	  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
	  NO_DOT: `(?!${DOT_LITERAL})`,
	  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
	  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
	  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
	  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
	  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
	  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
	};

	/**
	 * POSIX Bracket Regex
	 */

	const POSIX_REGEX_SOURCE = {
	  alnum: 'a-zA-Z0-9',
	  alpha: 'a-zA-Z',
	  ascii: '\\x00-\\x7F',
	  blank: ' \\t',
	  cntrl: '\\x00-\\x1F\\x7F',
	  digit: '0-9',
	  graph: '\\x21-\\x7E',
	  lower: 'a-z',
	  print: '\\x20-\\x7E ',
	  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
	  space: ' \\t\\r\\n\\v\\f',
	  upper: 'A-Z',
	  word: 'A-Za-z0-9_',
	  xdigit: 'A-Fa-f0-9'
	};

	constants$1 = {
	  MAX_LENGTH: 1024 * 64,
	  POSIX_REGEX_SOURCE,

	  // regular expressions
	  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
	  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
	  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
	  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
	  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
	  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

	  // Replace globs with equivalent patterns to reduce parsing time.
	  REPLACEMENTS: {
	    '***': '*',
	    '**/**': '**',
	    '**/**/**': '**'
	  },

	  // Digits
	  CHAR_0: 48, /* 0 */
	  CHAR_9: 57, /* 9 */

	  // Alphabet chars.
	  CHAR_UPPERCASE_A: 65, /* A */
	  CHAR_LOWERCASE_A: 97, /* a */
	  CHAR_UPPERCASE_Z: 90, /* Z */
	  CHAR_LOWERCASE_Z: 122, /* z */

	  CHAR_LEFT_PARENTHESES: 40, /* ( */
	  CHAR_RIGHT_PARENTHESES: 41, /* ) */

	  CHAR_ASTERISK: 42, /* * */

	  // Non-alphabetic chars.
	  CHAR_AMPERSAND: 38, /* & */
	  CHAR_AT: 64, /* @ */
	  CHAR_BACKWARD_SLASH: 92, /* \ */
	  CHAR_CARRIAGE_RETURN: 13, /* \r */
	  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
	  CHAR_COLON: 58, /* : */
	  CHAR_COMMA: 44, /* , */
	  CHAR_DOT: 46, /* . */
	  CHAR_DOUBLE_QUOTE: 34, /* " */
	  CHAR_EQUAL: 61, /* = */
	  CHAR_EXCLAMATION_MARK: 33, /* ! */
	  CHAR_FORM_FEED: 12, /* \f */
	  CHAR_FORWARD_SLASH: 47, /* / */
	  CHAR_GRAVE_ACCENT: 96, /* ` */
	  CHAR_HASH: 35, /* # */
	  CHAR_HYPHEN_MINUS: 45, /* - */
	  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
	  CHAR_LEFT_CURLY_BRACE: 123, /* { */
	  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
	  CHAR_LINE_FEED: 10, /* \n */
	  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
	  CHAR_PERCENT: 37, /* % */
	  CHAR_PLUS: 43, /* + */
	  CHAR_QUESTION_MARK: 63, /* ? */
	  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
	  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
	  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
	  CHAR_SEMICOLON: 59, /* ; */
	  CHAR_SINGLE_QUOTE: 39, /* ' */
	  CHAR_SPACE: 32, /*   */
	  CHAR_TAB: 9, /* \t */
	  CHAR_UNDERSCORE: 95, /* _ */
	  CHAR_VERTICAL_LINE: 124, /* | */
	  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

	  SEP: path.sep,

	  /**
	   * Create EXTGLOB_CHARS
	   */

	  extglobChars(chars) {
	    return {
	      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
	      '?': { type: 'qmark', open: '(?:', close: ')?' },
	      '+': { type: 'plus', open: '(?:', close: ')+' },
	      '*': { type: 'star', open: '(?:', close: ')*' },
	      '@': { type: 'at', open: '(?:', close: ')' }
	    };
	  },

	  /**
	   * Create GLOB_CHARS
	   */

	  globChars(win32) {
	    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
	  }
	};
	return constants$1;
}

var hasRequiredUtils$2;

function requireUtils$2 () {
	if (hasRequiredUtils$2) return utils$1;
	hasRequiredUtils$2 = 1;
	(function (exports$1) {

		const path = path$2;
		const win32 = process.platform === 'win32';
		const {
		  REGEX_BACKSLASH,
		  REGEX_REMOVE_BACKSLASH,
		  REGEX_SPECIAL_CHARS,
		  REGEX_SPECIAL_CHARS_GLOBAL
		} = requireConstants$1();

		exports$1.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
		exports$1.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
		exports$1.isRegexChar = str => str.length === 1 && exports$1.hasRegexChars(str);
		exports$1.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
		exports$1.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

		exports$1.removeBackslashes = str => {
		  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
		    return match === '\\' ? '' : match;
		  });
		};

		exports$1.supportsLookbehinds = () => {
		  const segs = process.version.slice(1).split('.').map(Number);
		  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
		    return true;
		  }
		  return false;
		};

		exports$1.isWindows = options => {
		  if (options && typeof options.windows === 'boolean') {
		    return options.windows;
		  }
		  return win32 === true || path.sep === '\\';
		};

		exports$1.escapeLast = (input, char, lastIdx) => {
		  const idx = input.lastIndexOf(char, lastIdx);
		  if (idx === -1) return input;
		  if (input[idx - 1] === '\\') return exports$1.escapeLast(input, char, idx - 1);
		  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
		};

		exports$1.removePrefix = (input, state = {}) => {
		  let output = input;
		  if (output.startsWith('./')) {
		    output = output.slice(2);
		    state.prefix = './';
		  }
		  return output;
		};

		exports$1.wrapOutput = (input, state = {}, options = {}) => {
		  const prepend = options.contains ? '' : '^';
		  const append = options.contains ? '' : '$';

		  let output = `${prepend}(?:${input})${append}`;
		  if (state.negated === true) {
		    output = `(?:^(?!${output}).*$)`;
		  }
		  return output;
		}; 
	} (utils$1));
	return utils$1;
}

var scan_1;
var hasRequiredScan;

function requireScan () {
	if (hasRequiredScan) return scan_1;
	hasRequiredScan = 1;

	const utils = requireUtils$2();
	const {
	  CHAR_ASTERISK,             /* * */
	  CHAR_AT,                   /* @ */
	  CHAR_BACKWARD_SLASH,       /* \ */
	  CHAR_COMMA,                /* , */
	  CHAR_DOT,                  /* . */
	  CHAR_EXCLAMATION_MARK,     /* ! */
	  CHAR_FORWARD_SLASH,        /* / */
	  CHAR_LEFT_CURLY_BRACE,     /* { */
	  CHAR_LEFT_PARENTHESES,     /* ( */
	  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
	  CHAR_PLUS,                 /* + */
	  CHAR_QUESTION_MARK,        /* ? */
	  CHAR_RIGHT_CURLY_BRACE,    /* } */
	  CHAR_RIGHT_PARENTHESES,    /* ) */
	  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
	} = requireConstants$1();

	const isPathSeparator = code => {
	  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
	};

	const depth = token => {
	  if (token.isPrefix !== true) {
	    token.depth = token.isGlobstar ? Infinity : 1;
	  }
	};

	/**
	 * Quickly scans a glob pattern and returns an object with a handful of
	 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
	 * `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
	 * with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
	 *
	 * ```js
	 * const pm = require('picomatch');
	 * console.log(pm.scan('foo/bar/*.js'));
	 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
	 * ```
	 * @param {String} `str`
	 * @param {Object} `options`
	 * @return {Object} Returns an object with tokens and regex source string.
	 * @api public
	 */

	const scan = (input, options) => {
	  const opts = options || {};

	  const length = input.length - 1;
	  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
	  const slashes = [];
	  const tokens = [];
	  const parts = [];

	  let str = input;
	  let index = -1;
	  let start = 0;
	  let lastIndex = 0;
	  let isBrace = false;
	  let isBracket = false;
	  let isGlob = false;
	  let isExtglob = false;
	  let isGlobstar = false;
	  let braceEscaped = false;
	  let backslashes = false;
	  let negated = false;
	  let negatedExtglob = false;
	  let finished = false;
	  let braces = 0;
	  let prev;
	  let code;
	  let token = { value: '', depth: 0, isGlob: false };

	  const eos = () => index >= length;
	  const peek = () => str.charCodeAt(index + 1);
	  const advance = () => {
	    prev = code;
	    return str.charCodeAt(++index);
	  };

	  while (index < length) {
	    code = advance();
	    let next;

	    if (code === CHAR_BACKWARD_SLASH) {
	      backslashes = token.backslashes = true;
	      code = advance();

	      if (code === CHAR_LEFT_CURLY_BRACE) {
	        braceEscaped = true;
	      }
	      continue;
	    }

	    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
	      braces++;

	      while (eos() !== true && (code = advance())) {
	        if (code === CHAR_BACKWARD_SLASH) {
	          backslashes = token.backslashes = true;
	          advance();
	          continue;
	        }

	        if (code === CHAR_LEFT_CURLY_BRACE) {
	          braces++;
	          continue;
	        }

	        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
	          isBrace = token.isBrace = true;
	          isGlob = token.isGlob = true;
	          finished = true;

	          if (scanToEnd === true) {
	            continue;
	          }

	          break;
	        }

	        if (braceEscaped !== true && code === CHAR_COMMA) {
	          isBrace = token.isBrace = true;
	          isGlob = token.isGlob = true;
	          finished = true;

	          if (scanToEnd === true) {
	            continue;
	          }

	          break;
	        }

	        if (code === CHAR_RIGHT_CURLY_BRACE) {
	          braces--;

	          if (braces === 0) {
	            braceEscaped = false;
	            isBrace = token.isBrace = true;
	            finished = true;
	            break;
	          }
	        }
	      }

	      if (scanToEnd === true) {
	        continue;
	      }

	      break;
	    }

	    if (code === CHAR_FORWARD_SLASH) {
	      slashes.push(index);
	      tokens.push(token);
	      token = { value: '', depth: 0, isGlob: false };

	      if (finished === true) continue;
	      if (prev === CHAR_DOT && index === (start + 1)) {
	        start += 2;
	        continue;
	      }

	      lastIndex = index + 1;
	      continue;
	    }

	    if (opts.noext !== true) {
	      const isExtglobChar = code === CHAR_PLUS
	        || code === CHAR_AT
	        || code === CHAR_ASTERISK
	        || code === CHAR_QUESTION_MARK
	        || code === CHAR_EXCLAMATION_MARK;

	      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
	        isGlob = token.isGlob = true;
	        isExtglob = token.isExtglob = true;
	        finished = true;
	        if (code === CHAR_EXCLAMATION_MARK && index === start) {
	          negatedExtglob = true;
	        }

	        if (scanToEnd === true) {
	          while (eos() !== true && (code = advance())) {
	            if (code === CHAR_BACKWARD_SLASH) {
	              backslashes = token.backslashes = true;
	              code = advance();
	              continue;
	            }

	            if (code === CHAR_RIGHT_PARENTHESES) {
	              isGlob = token.isGlob = true;
	              finished = true;
	              break;
	            }
	          }
	          continue;
	        }
	        break;
	      }
	    }

	    if (code === CHAR_ASTERISK) {
	      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
	      isGlob = token.isGlob = true;
	      finished = true;

	      if (scanToEnd === true) {
	        continue;
	      }
	      break;
	    }

	    if (code === CHAR_QUESTION_MARK) {
	      isGlob = token.isGlob = true;
	      finished = true;

	      if (scanToEnd === true) {
	        continue;
	      }
	      break;
	    }

	    if (code === CHAR_LEFT_SQUARE_BRACKET) {
	      while (eos() !== true && (next = advance())) {
	        if (next === CHAR_BACKWARD_SLASH) {
	          backslashes = token.backslashes = true;
	          advance();
	          continue;
	        }

	        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
	          isBracket = token.isBracket = true;
	          isGlob = token.isGlob = true;
	          finished = true;
	          break;
	        }
	      }

	      if (scanToEnd === true) {
	        continue;
	      }

	      break;
	    }

	    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
	      negated = token.negated = true;
	      start++;
	      continue;
	    }

	    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
	      isGlob = token.isGlob = true;

	      if (scanToEnd === true) {
	        while (eos() !== true && (code = advance())) {
	          if (code === CHAR_LEFT_PARENTHESES) {
	            backslashes = token.backslashes = true;
	            code = advance();
	            continue;
	          }

	          if (code === CHAR_RIGHT_PARENTHESES) {
	            finished = true;
	            break;
	          }
	        }
	        continue;
	      }
	      break;
	    }

	    if (isGlob === true) {
	      finished = true;

	      if (scanToEnd === true) {
	        continue;
	      }

	      break;
	    }
	  }

	  if (opts.noext === true) {
	    isExtglob = false;
	    isGlob = false;
	  }

	  let base = str;
	  let prefix = '';
	  let glob = '';

	  if (start > 0) {
	    prefix = str.slice(0, start);
	    str = str.slice(start);
	    lastIndex -= start;
	  }

	  if (base && isGlob === true && lastIndex > 0) {
	    base = str.slice(0, lastIndex);
	    glob = str.slice(lastIndex);
	  } else if (isGlob === true) {
	    base = '';
	    glob = str;
	  } else {
	    base = str;
	  }

	  if (base && base !== '' && base !== '/' && base !== str) {
	    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
	      base = base.slice(0, -1);
	    }
	  }

	  if (opts.unescape === true) {
	    if (glob) glob = utils.removeBackslashes(glob);

	    if (base && backslashes === true) {
	      base = utils.removeBackslashes(base);
	    }
	  }

	  const state = {
	    prefix,
	    input,
	    start,
	    base,
	    glob,
	    isBrace,
	    isBracket,
	    isGlob,
	    isExtglob,
	    isGlobstar,
	    negated,
	    negatedExtglob
	  };

	  if (opts.tokens === true) {
	    state.maxDepth = 0;
	    if (!isPathSeparator(code)) {
	      tokens.push(token);
	    }
	    state.tokens = tokens;
	  }

	  if (opts.parts === true || opts.tokens === true) {
	    let prevIndex;

	    for (let idx = 0; idx < slashes.length; idx++) {
	      const n = prevIndex ? prevIndex + 1 : start;
	      const i = slashes[idx];
	      const value = input.slice(n, i);
	      if (opts.tokens) {
	        if (idx === 0 && start !== 0) {
	          tokens[idx].isPrefix = true;
	          tokens[idx].value = prefix;
	        } else {
	          tokens[idx].value = value;
	        }
	        depth(tokens[idx]);
	        state.maxDepth += tokens[idx].depth;
	      }
	      if (idx !== 0 || value !== '') {
	        parts.push(value);
	      }
	      prevIndex = i;
	    }

	    if (prevIndex && prevIndex + 1 < input.length) {
	      const value = input.slice(prevIndex + 1);
	      parts.push(value);

	      if (opts.tokens) {
	        tokens[tokens.length - 1].value = value;
	        depth(tokens[tokens.length - 1]);
	        state.maxDepth += tokens[tokens.length - 1].depth;
	      }
	    }

	    state.slashes = slashes;
	    state.parts = parts;
	  }

	  return state;
	};

	scan_1 = scan;
	return scan_1;
}

var parse_1;
var hasRequiredParse;

function requireParse () {
	if (hasRequiredParse) return parse_1;
	hasRequiredParse = 1;

	const constants = requireConstants$1();
	const utils = requireUtils$2();

	/**
	 * Constants
	 */

	const {
	  MAX_LENGTH,
	  POSIX_REGEX_SOURCE,
	  REGEX_NON_SPECIAL_CHARS,
	  REGEX_SPECIAL_CHARS_BACKREF,
	  REPLACEMENTS
	} = constants;

	/**
	 * Helpers
	 */

	const expandRange = (args, options) => {
	  if (typeof options.expandRange === 'function') {
	    return options.expandRange(...args, options);
	  }

	  args.sort();
	  const value = `[${args.join('-')}]`;

	  try {
	    /* eslint-disable-next-line no-new */
	    new RegExp(value);
	  } catch (ex) {
	    return args.map(v => utils.escapeRegex(v)).join('..');
	  }

	  return value;
	};

	/**
	 * Create the message for a syntax error
	 */

	const syntaxError = (type, char) => {
	  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
	};

	/**
	 * Parse the given input string.
	 * @param {String} input
	 * @param {Object} options
	 * @return {Object}
	 */

	const parse = (input, options) => {
	  if (typeof input !== 'string') {
	    throw new TypeError('Expected a string');
	  }

	  input = REPLACEMENTS[input] || input;

	  const opts = { ...options };
	  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

	  let len = input.length;
	  if (len > max) {
	    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
	  }

	  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
	  const tokens = [bos];

	  const capture = opts.capture ? '' : '?:';
	  const win32 = utils.isWindows(options);

	  // create constants based on platform, for windows or posix
	  const PLATFORM_CHARS = constants.globChars(win32);
	  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

	  const {
	    DOT_LITERAL,
	    PLUS_LITERAL,
	    SLASH_LITERAL,
	    ONE_CHAR,
	    DOTS_SLASH,
	    NO_DOT,
	    NO_DOT_SLASH,
	    NO_DOTS_SLASH,
	    QMARK,
	    QMARK_NO_DOT,
	    STAR,
	    START_ANCHOR
	  } = PLATFORM_CHARS;

	  const globstar = opts => {
	    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
	  };

	  const nodot = opts.dot ? '' : NO_DOT;
	  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
	  let star = opts.bash === true ? globstar(opts) : STAR;

	  if (opts.capture) {
	    star = `(${star})`;
	  }

	  // minimatch options support
	  if (typeof opts.noext === 'boolean') {
	    opts.noextglob = opts.noext;
	  }

	  const state = {
	    input,
	    index: -1,
	    start: 0,
	    dot: opts.dot === true,
	    consumed: '',
	    output: '',
	    prefix: '',
	    backtrack: false,
	    negated: false,
	    brackets: 0,
	    braces: 0,
	    parens: 0,
	    quotes: 0,
	    globstar: false,
	    tokens
	  };

	  input = utils.removePrefix(input, state);
	  len = input.length;

	  const extglobs = [];
	  const braces = [];
	  const stack = [];
	  let prev = bos;
	  let value;

	  /**
	   * Tokenizing helpers
	   */

	  const eos = () => state.index === len - 1;
	  const peek = state.peek = (n = 1) => input[state.index + n];
	  const advance = state.advance = () => input[++state.index] || '';
	  const remaining = () => input.slice(state.index + 1);
	  const consume = (value = '', num = 0) => {
	    state.consumed += value;
	    state.index += num;
	  };

	  const append = token => {
	    state.output += token.output != null ? token.output : token.value;
	    consume(token.value);
	  };

	  const negate = () => {
	    let count = 1;

	    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
	      advance();
	      state.start++;
	      count++;
	    }

	    if (count % 2 === 0) {
	      return false;
	    }

	    state.negated = true;
	    state.start++;
	    return true;
	  };

	  const increment = type => {
	    state[type]++;
	    stack.push(type);
	  };

	  const decrement = type => {
	    state[type]--;
	    stack.pop();
	  };

	  /**
	   * Push tokens onto the tokens array. This helper speeds up
	   * tokenizing by 1) helping us avoid backtracking as much as possible,
	   * and 2) helping us avoid creating extra tokens when consecutive
	   * characters are plain text. This improves performance and simplifies
	   * lookbehinds.
	   */

	  const push = tok => {
	    if (prev.type === 'globstar') {
	      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
	      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

	      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
	        state.output = state.output.slice(0, -prev.output.length);
	        prev.type = 'star';
	        prev.value = '*';
	        prev.output = star;
	        state.output += prev.output;
	      }
	    }

	    if (extglobs.length && tok.type !== 'paren') {
	      extglobs[extglobs.length - 1].inner += tok.value;
	    }

	    if (tok.value || tok.output) append(tok);
	    if (prev && prev.type === 'text' && tok.type === 'text') {
	      prev.value += tok.value;
	      prev.output = (prev.output || '') + tok.value;
	      return;
	    }

	    tok.prev = prev;
	    tokens.push(tok);
	    prev = tok;
	  };

	  const extglobOpen = (type, value) => {
	    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

	    token.prev = prev;
	    token.parens = state.parens;
	    token.output = state.output;
	    const output = (opts.capture ? '(' : '') + token.open;

	    increment('parens');
	    push({ type, value, output: state.output ? '' : ONE_CHAR });
	    push({ type: 'paren', extglob: true, value: advance(), output });
	    extglobs.push(token);
	  };

	  const extglobClose = token => {
	    let output = token.close + (opts.capture ? ')' : '');
	    let rest;

	    if (token.type === 'negate') {
	      let extglobStar = star;

	      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
	        extglobStar = globstar(opts);
	      }

	      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
	        output = token.close = `)$))${extglobStar}`;
	      }

	      if (token.inner.includes('*') && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
	        // Any non-magical string (`.ts`) or even nested expression (`.{ts,tsx}`) can follow after the closing parenthesis.
	        // In this case, we need to parse the string and use it in the output of the original pattern.
	        // Suitable patterns: `/!(*.d).ts`, `/!(*.d).{ts,tsx}`, `**/!(*-dbg).@(js)`.
	        //
	        // Disabling the `fastpaths` option due to a problem with parsing strings as `.ts` in the pattern like `**/!(*.d).ts`.
	        const expression = parse(rest, { ...options, fastpaths: false }).output;

	        output = token.close = `)${expression})${extglobStar})`;
	      }

	      if (token.prev.type === 'bos') {
	        state.negatedExtglob = true;
	      }
	    }

	    push({ type: 'paren', extglob: true, value, output });
	    decrement('parens');
	  };

	  /**
	   * Fast paths
	   */

	  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
	    let backslashes = false;

	    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
	      if (first === '\\') {
	        backslashes = true;
	        return m;
	      }

	      if (first === '?') {
	        if (esc) {
	          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
	        }
	        if (index === 0) {
	          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
	        }
	        return QMARK.repeat(chars.length);
	      }

	      if (first === '.') {
	        return DOT_LITERAL.repeat(chars.length);
	      }

	      if (first === '*') {
	        if (esc) {
	          return esc + first + (rest ? star : '');
	        }
	        return star;
	      }
	      return esc ? m : `\\${m}`;
	    });

	    if (backslashes === true) {
	      if (opts.unescape === true) {
	        output = output.replace(/\\/g, '');
	      } else {
	        output = output.replace(/\\+/g, m => {
	          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
	        });
	      }
	    }

	    if (output === input && opts.contains === true) {
	      state.output = input;
	      return state;
	    }

	    state.output = utils.wrapOutput(output, state, options);
	    return state;
	  }

	  /**
	   * Tokenize input until we reach end-of-string
	   */

	  while (!eos()) {
	    value = advance();

	    if (value === '\u0000') {
	      continue;
	    }

	    /**
	     * Escaped characters
	     */

	    if (value === '\\') {
	      const next = peek();

	      if (next === '/' && opts.bash !== true) {
	        continue;
	      }

	      if (next === '.' || next === ';') {
	        continue;
	      }

	      if (!next) {
	        value += '\\';
	        push({ type: 'text', value });
	        continue;
	      }

	      // collapse slashes to reduce potential for exploits
	      const match = /^\\+/.exec(remaining());
	      let slashes = 0;

	      if (match && match[0].length > 2) {
	        slashes = match[0].length;
	        state.index += slashes;
	        if (slashes % 2 !== 0) {
	          value += '\\';
	        }
	      }

	      if (opts.unescape === true) {
	        value = advance();
	      } else {
	        value += advance();
	      }

	      if (state.brackets === 0) {
	        push({ type: 'text', value });
	        continue;
	      }
	    }

	    /**
	     * If we're inside a regex character class, continue
	     * until we reach the closing bracket.
	     */

	    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
	      if (opts.posix !== false && value === ':') {
	        const inner = prev.value.slice(1);
	        if (inner.includes('[')) {
	          prev.posix = true;

	          if (inner.includes(':')) {
	            const idx = prev.value.lastIndexOf('[');
	            const pre = prev.value.slice(0, idx);
	            const rest = prev.value.slice(idx + 2);
	            const posix = POSIX_REGEX_SOURCE[rest];
	            if (posix) {
	              prev.value = pre + posix;
	              state.backtrack = true;
	              advance();

	              if (!bos.output && tokens.indexOf(prev) === 1) {
	                bos.output = ONE_CHAR;
	              }
	              continue;
	            }
	          }
	        }
	      }

	      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
	        value = `\\${value}`;
	      }

	      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
	        value = `\\${value}`;
	      }

	      if (opts.posix === true && value === '!' && prev.value === '[') {
	        value = '^';
	      }

	      prev.value += value;
	      append({ value });
	      continue;
	    }

	    /**
	     * If we're inside a quoted string, continue
	     * until we reach the closing double quote.
	     */

	    if (state.quotes === 1 && value !== '"') {
	      value = utils.escapeRegex(value);
	      prev.value += value;
	      append({ value });
	      continue;
	    }

	    /**
	     * Double quotes
	     */

	    if (value === '"') {
	      state.quotes = state.quotes === 1 ? 0 : 1;
	      if (opts.keepQuotes === true) {
	        push({ type: 'text', value });
	      }
	      continue;
	    }

	    /**
	     * Parentheses
	     */

	    if (value === '(') {
	      increment('parens');
	      push({ type: 'paren', value });
	      continue;
	    }

	    if (value === ')') {
	      if (state.parens === 0 && opts.strictBrackets === true) {
	        throw new SyntaxError(syntaxError('opening', '('));
	      }

	      const extglob = extglobs[extglobs.length - 1];
	      if (extglob && state.parens === extglob.parens + 1) {
	        extglobClose(extglobs.pop());
	        continue;
	      }

	      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
	      decrement('parens');
	      continue;
	    }

	    /**
	     * Square brackets
	     */

	    if (value === '[') {
	      if (opts.nobracket === true || !remaining().includes(']')) {
	        if (opts.nobracket !== true && opts.strictBrackets === true) {
	          throw new SyntaxError(syntaxError('closing', ']'));
	        }

	        value = `\\${value}`;
	      } else {
	        increment('brackets');
	      }

	      push({ type: 'bracket', value });
	      continue;
	    }

	    if (value === ']') {
	      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
	        push({ type: 'text', value, output: `\\${value}` });
	        continue;
	      }

	      if (state.brackets === 0) {
	        if (opts.strictBrackets === true) {
	          throw new SyntaxError(syntaxError('opening', '['));
	        }

	        push({ type: 'text', value, output: `\\${value}` });
	        continue;
	      }

	      decrement('brackets');

	      const prevValue = prev.value.slice(1);
	      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
	        value = `/${value}`;
	      }

	      prev.value += value;
	      append({ value });

	      // when literal brackets are explicitly disabled
	      // assume we should match with a regex character class
	      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
	        continue;
	      }

	      const escaped = utils.escapeRegex(prev.value);
	      state.output = state.output.slice(0, -prev.value.length);

	      // when literal brackets are explicitly enabled
	      // assume we should escape the brackets to match literal characters
	      if (opts.literalBrackets === true) {
	        state.output += escaped;
	        prev.value = escaped;
	        continue;
	      }

	      // when the user specifies nothing, try to match both
	      prev.value = `(${capture}${escaped}|${prev.value})`;
	      state.output += prev.value;
	      continue;
	    }

	    /**
	     * Braces
	     */

	    if (value === '{' && opts.nobrace !== true) {
	      increment('braces');

	      const open = {
	        type: 'brace',
	        value,
	        output: '(',
	        outputIndex: state.output.length,
	        tokensIndex: state.tokens.length
	      };

	      braces.push(open);
	      push(open);
	      continue;
	    }

	    if (value === '}') {
	      const brace = braces[braces.length - 1];

	      if (opts.nobrace === true || !brace) {
	        push({ type: 'text', value, output: value });
	        continue;
	      }

	      let output = ')';

	      if (brace.dots === true) {
	        const arr = tokens.slice();
	        const range = [];

	        for (let i = arr.length - 1; i >= 0; i--) {
	          tokens.pop();
	          if (arr[i].type === 'brace') {
	            break;
	          }
	          if (arr[i].type !== 'dots') {
	            range.unshift(arr[i].value);
	          }
	        }

	        output = expandRange(range, opts);
	        state.backtrack = true;
	      }

	      if (brace.comma !== true && brace.dots !== true) {
	        const out = state.output.slice(0, brace.outputIndex);
	        const toks = state.tokens.slice(brace.tokensIndex);
	        brace.value = brace.output = '\\{';
	        value = output = '\\}';
	        state.output = out;
	        for (const t of toks) {
	          state.output += (t.output || t.value);
	        }
	      }

	      push({ type: 'brace', value, output });
	      decrement('braces');
	      braces.pop();
	      continue;
	    }

	    /**
	     * Pipes
	     */

	    if (value === '|') {
	      if (extglobs.length > 0) {
	        extglobs[extglobs.length - 1].conditions++;
	      }
	      push({ type: 'text', value });
	      continue;
	    }

	    /**
	     * Commas
	     */

	    if (value === ',') {
	      let output = value;

	      const brace = braces[braces.length - 1];
	      if (brace && stack[stack.length - 1] === 'braces') {
	        brace.comma = true;
	        output = '|';
	      }

	      push({ type: 'comma', value, output });
	      continue;
	    }

	    /**
	     * Slashes
	     */

	    if (value === '/') {
	      // if the beginning of the glob is "./", advance the start
	      // to the current index, and don't add the "./" characters
	      // to the state. This greatly simplifies lookbehinds when
	      // checking for BOS characters like "!" and "." (not "./")
	      if (prev.type === 'dot' && state.index === state.start + 1) {
	        state.start = state.index + 1;
	        state.consumed = '';
	        state.output = '';
	        tokens.pop();
	        prev = bos; // reset "prev" to the first token
	        continue;
	      }

	      push({ type: 'slash', value, output: SLASH_LITERAL });
	      continue;
	    }

	    /**
	     * Dots
	     */

	    if (value === '.') {
	      if (state.braces > 0 && prev.type === 'dot') {
	        if (prev.value === '.') prev.output = DOT_LITERAL;
	        const brace = braces[braces.length - 1];
	        prev.type = 'dots';
	        prev.output += value;
	        prev.value += value;
	        brace.dots = true;
	        continue;
	      }

	      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
	        push({ type: 'text', value, output: DOT_LITERAL });
	        continue;
	      }

	      push({ type: 'dot', value, output: DOT_LITERAL });
	      continue;
	    }

	    /**
	     * Question marks
	     */

	    if (value === '?') {
	      const isGroup = prev && prev.value === '(';
	      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
	        extglobOpen('qmark', value);
	        continue;
	      }

	      if (prev && prev.type === 'paren') {
	        const next = peek();
	        let output = value;

	        if (next === '<' && !utils.supportsLookbehinds()) {
	          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
	        }

	        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
	          output = `\\${value}`;
	        }

	        push({ type: 'text', value, output });
	        continue;
	      }

	      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
	        push({ type: 'qmark', value, output: QMARK_NO_DOT });
	        continue;
	      }

	      push({ type: 'qmark', value, output: QMARK });
	      continue;
	    }

	    /**
	     * Exclamation
	     */

	    if (value === '!') {
	      if (opts.noextglob !== true && peek() === '(') {
	        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
	          extglobOpen('negate', value);
	          continue;
	        }
	      }

	      if (opts.nonegate !== true && state.index === 0) {
	        negate();
	        continue;
	      }
	    }

	    /**
	     * Plus
	     */

	    if (value === '+') {
	      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
	        extglobOpen('plus', value);
	        continue;
	      }

	      if ((prev && prev.value === '(') || opts.regex === false) {
	        push({ type: 'plus', value, output: PLUS_LITERAL });
	        continue;
	      }

	      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
	        push({ type: 'plus', value });
	        continue;
	      }

	      push({ type: 'plus', value: PLUS_LITERAL });
	      continue;
	    }

	    /**
	     * Plain text
	     */

	    if (value === '@') {
	      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
	        push({ type: 'at', extglob: true, value, output: '' });
	        continue;
	      }

	      push({ type: 'text', value });
	      continue;
	    }

	    /**
	     * Plain text
	     */

	    if (value !== '*') {
	      if (value === '$' || value === '^') {
	        value = `\\${value}`;
	      }

	      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
	      if (match) {
	        value += match[0];
	        state.index += match[0].length;
	      }

	      push({ type: 'text', value });
	      continue;
	    }

	    /**
	     * Stars
	     */

	    if (prev && (prev.type === 'globstar' || prev.star === true)) {
	      prev.type = 'star';
	      prev.star = true;
	      prev.value += value;
	      prev.output = star;
	      state.backtrack = true;
	      state.globstar = true;
	      consume(value);
	      continue;
	    }

	    let rest = remaining();
	    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
	      extglobOpen('star', value);
	      continue;
	    }

	    if (prev.type === 'star') {
	      if (opts.noglobstar === true) {
	        consume(value);
	        continue;
	      }

	      const prior = prev.prev;
	      const before = prior.prev;
	      const isStart = prior.type === 'slash' || prior.type === 'bos';
	      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

	      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
	        push({ type: 'star', value, output: '' });
	        continue;
	      }

	      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
	      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
	      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
	        push({ type: 'star', value, output: '' });
	        continue;
	      }

	      // strip consecutive `/**/`
	      while (rest.slice(0, 3) === '/**') {
	        const after = input[state.index + 4];
	        if (after && after !== '/') {
	          break;
	        }
	        rest = rest.slice(3);
	        consume('/**', 3);
	      }

	      if (prior.type === 'bos' && eos()) {
	        prev.type = 'globstar';
	        prev.value += value;
	        prev.output = globstar(opts);
	        state.output = prev.output;
	        state.globstar = true;
	        consume(value);
	        continue;
	      }

	      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
	        state.output = state.output.slice(0, -(prior.output + prev.output).length);
	        prior.output = `(?:${prior.output}`;

	        prev.type = 'globstar';
	        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
	        prev.value += value;
	        state.globstar = true;
	        state.output += prior.output + prev.output;
	        consume(value);
	        continue;
	      }

	      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
	        const end = rest[1] !== void 0 ? '|$' : '';

	        state.output = state.output.slice(0, -(prior.output + prev.output).length);
	        prior.output = `(?:${prior.output}`;

	        prev.type = 'globstar';
	        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
	        prev.value += value;

	        state.output += prior.output + prev.output;
	        state.globstar = true;

	        consume(value + advance());

	        push({ type: 'slash', value: '/', output: '' });
	        continue;
	      }

	      if (prior.type === 'bos' && rest[0] === '/') {
	        prev.type = 'globstar';
	        prev.value += value;
	        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
	        state.output = prev.output;
	        state.globstar = true;
	        consume(value + advance());
	        push({ type: 'slash', value: '/', output: '' });
	        continue;
	      }

	      // remove single star from output
	      state.output = state.output.slice(0, -prev.output.length);

	      // reset previous token to globstar
	      prev.type = 'globstar';
	      prev.output = globstar(opts);
	      prev.value += value;

	      // reset output with globstar
	      state.output += prev.output;
	      state.globstar = true;
	      consume(value);
	      continue;
	    }

	    const token = { type: 'star', value, output: star };

	    if (opts.bash === true) {
	      token.output = '.*?';
	      if (prev.type === 'bos' || prev.type === 'slash') {
	        token.output = nodot + token.output;
	      }
	      push(token);
	      continue;
	    }

	    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
	      token.output = value;
	      push(token);
	      continue;
	    }

	    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
	      if (prev.type === 'dot') {
	        state.output += NO_DOT_SLASH;
	        prev.output += NO_DOT_SLASH;

	      } else if (opts.dot === true) {
	        state.output += NO_DOTS_SLASH;
	        prev.output += NO_DOTS_SLASH;

	      } else {
	        state.output += nodot;
	        prev.output += nodot;
	      }

	      if (peek() !== '*') {
	        state.output += ONE_CHAR;
	        prev.output += ONE_CHAR;
	      }
	    }

	    push(token);
	  }

	  while (state.brackets > 0) {
	    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
	    state.output = utils.escapeLast(state.output, '[');
	    decrement('brackets');
	  }

	  while (state.parens > 0) {
	    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
	    state.output = utils.escapeLast(state.output, '(');
	    decrement('parens');
	  }

	  while (state.braces > 0) {
	    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
	    state.output = utils.escapeLast(state.output, '{');
	    decrement('braces');
	  }

	  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
	    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
	  }

	  // rebuild the output if we had to backtrack at any point
	  if (state.backtrack === true) {
	    state.output = '';

	    for (const token of state.tokens) {
	      state.output += token.output != null ? token.output : token.value;

	      if (token.suffix) {
	        state.output += token.suffix;
	      }
	    }
	  }

	  return state;
	};

	/**
	 * Fast paths for creating regular expressions for common glob patterns.
	 * This can significantly speed up processing and has very little downside
	 * impact when none of the fast paths match.
	 */

	parse.fastpaths = (input, options) => {
	  const opts = { ...options };
	  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
	  const len = input.length;
	  if (len > max) {
	    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
	  }

	  input = REPLACEMENTS[input] || input;
	  const win32 = utils.isWindows(options);

	  // create constants based on platform, for windows or posix
	  const {
	    DOT_LITERAL,
	    SLASH_LITERAL,
	    ONE_CHAR,
	    DOTS_SLASH,
	    NO_DOT,
	    NO_DOTS,
	    NO_DOTS_SLASH,
	    STAR,
	    START_ANCHOR
	  } = constants.globChars(win32);

	  const nodot = opts.dot ? NO_DOTS : NO_DOT;
	  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
	  const capture = opts.capture ? '' : '?:';
	  const state = { negated: false, prefix: '' };
	  let star = opts.bash === true ? '.*?' : STAR;

	  if (opts.capture) {
	    star = `(${star})`;
	  }

	  const globstar = opts => {
	    if (opts.noglobstar === true) return star;
	    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
	  };

	  const create = str => {
	    switch (str) {
	      case '*':
	        return `${nodot}${ONE_CHAR}${star}`;

	      case '.*':
	        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

	      case '*.*':
	        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

	      case '*/*':
	        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

	      case '**':
	        return nodot + globstar(opts);

	      case '**/*':
	        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

	      case '**/*.*':
	        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

	      case '**/.*':
	        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

	      default: {
	        const match = /^(.*?)\.(\w+)$/.exec(str);
	        if (!match) return;

	        const source = create(match[1]);
	        if (!source) return;

	        return source + DOT_LITERAL + match[2];
	      }
	    }
	  };

	  const output = utils.removePrefix(input, state);
	  let source = create(output);

	  if (source && opts.strictSlashes !== true) {
	    source += `${SLASH_LITERAL}?`;
	  }

	  return source;
	};

	parse_1 = parse;
	return parse_1;
}

var picomatch_1;
var hasRequiredPicomatch$1;

function requirePicomatch$1 () {
	if (hasRequiredPicomatch$1) return picomatch_1;
	hasRequiredPicomatch$1 = 1;

	const path = path$2;
	const scan = requireScan();
	const parse = requireParse();
	const utils = requireUtils$2();
	const constants = requireConstants$1();
	const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

	/**
	 * Creates a matcher function from one or more glob patterns. The
	 * returned function takes a string to match as its first argument,
	 * and returns true if the string is a match. The returned matcher
	 * function also takes a boolean as the second argument that, when true,
	 * returns an object with additional information.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch(glob[, options]);
	 *
	 * const isMatch = picomatch('*.!(*a)');
	 * console.log(isMatch('a.a')); //=> false
	 * console.log(isMatch('a.b')); //=> true
	 * ```
	 * @name picomatch
	 * @param {String|Array} `globs` One or more glob patterns.
	 * @param {Object=} `options`
	 * @return {Function=} Returns a matcher function.
	 * @api public
	 */

	const picomatch = (glob, options, returnState = false) => {
	  if (Array.isArray(glob)) {
	    const fns = glob.map(input => picomatch(input, options, returnState));
	    const arrayMatcher = str => {
	      for (const isMatch of fns) {
	        const state = isMatch(str);
	        if (state) return state;
	      }
	      return false;
	    };
	    return arrayMatcher;
	  }

	  const isState = isObject(glob) && glob.tokens && glob.input;

	  if (glob === '' || (typeof glob !== 'string' && !isState)) {
	    throw new TypeError('Expected pattern to be a non-empty string');
	  }

	  const opts = options || {};
	  const posix = utils.isWindows(options);
	  const regex = isState
	    ? picomatch.compileRe(glob, options)
	    : picomatch.makeRe(glob, options, false, true);

	  const state = regex.state;
	  delete regex.state;

	  let isIgnored = () => false;
	  if (opts.ignore) {
	    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
	    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
	  }

	  const matcher = (input, returnObject = false) => {
	    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
	    const result = { glob, state, regex, posix, input, output, match, isMatch };

	    if (typeof opts.onResult === 'function') {
	      opts.onResult(result);
	    }

	    if (isMatch === false) {
	      result.isMatch = false;
	      return returnObject ? result : false;
	    }

	    if (isIgnored(input)) {
	      if (typeof opts.onIgnore === 'function') {
	        opts.onIgnore(result);
	      }
	      result.isMatch = false;
	      return returnObject ? result : false;
	    }

	    if (typeof opts.onMatch === 'function') {
	      opts.onMatch(result);
	    }
	    return returnObject ? result : true;
	  };

	  if (returnState) {
	    matcher.state = state;
	  }

	  return matcher;
	};

	/**
	 * Test `input` with the given `regex`. This is used by the main
	 * `picomatch()` function to test the input string.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch.test(input, regex[, options]);
	 *
	 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
	 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
	 * ```
	 * @param {String} `input` String to test.
	 * @param {RegExp} `regex`
	 * @return {Object} Returns an object with matching info.
	 * @api public
	 */

	picomatch.test = (input, regex, options, { glob, posix } = {}) => {
	  if (typeof input !== 'string') {
	    throw new TypeError('Expected input to be a string');
	  }

	  if (input === '') {
	    return { isMatch: false, output: '' };
	  }

	  const opts = options || {};
	  const format = opts.format || (posix ? utils.toPosixSlashes : null);
	  let match = input === glob;
	  let output = (match && format) ? format(input) : input;

	  if (match === false) {
	    output = format ? format(input) : input;
	    match = output === glob;
	  }

	  if (match === false || opts.capture === true) {
	    if (opts.matchBase === true || opts.basename === true) {
	      match = picomatch.matchBase(input, regex, options, posix);
	    } else {
	      match = regex.exec(output);
	    }
	  }

	  return { isMatch: Boolean(match), match, output };
	};

	/**
	 * Match the basename of a filepath.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch.matchBase(input, glob[, options]);
	 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
	 * ```
	 * @param {String} `input` String to test.
	 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
	 * @return {Boolean}
	 * @api public
	 */

	picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
	  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
	  return regex.test(path.basename(input));
	};

	/**
	 * Returns true if **any** of the given glob `patterns` match the specified `string`.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch.isMatch(string, patterns[, options]);
	 *
	 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
	 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
	 * ```
	 * @param {String|Array} str The string to test.
	 * @param {String|Array} patterns One or more glob patterns to use for matching.
	 * @param {Object} [options] See available [options](#options).
	 * @return {Boolean} Returns true if any patterns match `str`
	 * @api public
	 */

	picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

	/**
	 * Parse a glob pattern to create the source string for a regular
	 * expression.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * const result = picomatch.parse(pattern[, options]);
	 * ```
	 * @param {String} `pattern`
	 * @param {Object} `options`
	 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
	 * @api public
	 */

	picomatch.parse = (pattern, options) => {
	  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
	  return parse(pattern, { ...options, fastpaths: false });
	};

	/**
	 * Scan a glob pattern to separate the pattern into segments.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch.scan(input[, options]);
	 *
	 * const result = picomatch.scan('!./foo/*.js');
	 * console.log(result);
	 * { prefix: '!./',
	 *   input: '!./foo/*.js',
	 *   start: 3,
	 *   base: 'foo',
	 *   glob: '*.js',
	 *   isBrace: false,
	 *   isBracket: false,
	 *   isGlob: true,
	 *   isExtglob: false,
	 *   isGlobstar: false,
	 *   negated: true }
	 * ```
	 * @param {String} `input` Glob pattern to scan.
	 * @param {Object} `options`
	 * @return {Object} Returns an object with
	 * @api public
	 */

	picomatch.scan = (input, options) => scan(input, options);

	/**
	 * Compile a regular expression from the `state` object returned by the
	 * [parse()](#parse) method.
	 *
	 * @param {Object} `state`
	 * @param {Object} `options`
	 * @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
	 * @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
	 * @return {RegExp}
	 * @api public
	 */

	picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
	  if (returnOutput === true) {
	    return state.output;
	  }

	  const opts = options || {};
	  const prepend = opts.contains ? '' : '^';
	  const append = opts.contains ? '' : '$';

	  let source = `${prepend}(?:${state.output})${append}`;
	  if (state && state.negated === true) {
	    source = `^(?!${source}).*$`;
	  }

	  const regex = picomatch.toRegex(source, options);
	  if (returnState === true) {
	    regex.state = state;
	  }

	  return regex;
	};

	/**
	 * Create a regular expression from a parsed glob pattern.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * const state = picomatch.parse('*.js');
	 * // picomatch.compileRe(state[, options]);
	 *
	 * console.log(picomatch.compileRe(state));
	 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	 * ```
	 * @param {String} `state` The object returned from the `.parse` method.
	 * @param {Object} `options`
	 * @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
	 * @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
	 * @return {RegExp} Returns a regex created from the given pattern.
	 * @api public
	 */

	picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
	  if (!input || typeof input !== 'string') {
	    throw new TypeError('Expected a non-empty string');
	  }

	  let parsed = { negated: false, fastpaths: true };

	  if (options.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
	    parsed.output = parse.fastpaths(input, options);
	  }

	  if (!parsed.output) {
	    parsed = parse(input, options);
	  }

	  return picomatch.compileRe(parsed, options, returnOutput, returnState);
	};

	/**
	 * Create a regular expression from the given regex source string.
	 *
	 * ```js
	 * const picomatch = require('picomatch');
	 * // picomatch.toRegex(source[, options]);
	 *
	 * const { output } = picomatch.parse('*.js');
	 * console.log(picomatch.toRegex(output));
	 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
	 * ```
	 * @param {String} `source` Regular expression source string.
	 * @param {Object} `options`
	 * @return {RegExp}
	 * @api public
	 */

	picomatch.toRegex = (source, options) => {
	  try {
	    const opts = options || {};
	    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
	  } catch (err) {
	    if (options && options.debug === true) throw err;
	    return /$^/;
	  }
	};

	/**
	 * Picomatch constants.
	 * @return {Object}
	 */

	picomatch.constants = constants;

	/**
	 * Expose "picomatch"
	 */

	picomatch_1 = picomatch;
	return picomatch_1;
}

var picomatch;
var hasRequiredPicomatch;

function requirePicomatch () {
	if (hasRequiredPicomatch) return picomatch;
	hasRequiredPicomatch = 1;

	picomatch = requirePicomatch$1();
	return picomatch;
}

var micromatch_1;
var hasRequiredMicromatch;

function requireMicromatch () {
	if (hasRequiredMicromatch) return micromatch_1;
	hasRequiredMicromatch = 1;

	const util = require$$0$1;
	const braces = requireBraces();
	const picomatch = requirePicomatch();
	const utils = requireUtils$2();

	const isEmptyString = v => v === '' || v === './';
	const hasBraces = v => {
	  const index = v.indexOf('{');
	  return index > -1 && v.indexOf('}', index) > -1;
	};

	/**
	 * Returns an array of strings that match one or more glob patterns.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm(list, patterns[, options]);
	 *
	 * console.log(mm(['a.js', 'a.txt'], ['*.js']));
	 * //=> [ 'a.js' ]
	 * ```
	 * @param {String|Array<string>} `list` List of strings to match.
	 * @param {String|Array<string>} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `options` See available [options](#options)
	 * @return {Array} Returns an array of matches
	 * @summary false
	 * @api public
	 */

	const micromatch = (list, patterns, options) => {
	  patterns = [].concat(patterns);
	  list = [].concat(list);

	  let omit = new Set();
	  let keep = new Set();
	  let items = new Set();
	  let negatives = 0;

	  let onResult = state => {
	    items.add(state.output);
	    if (options && options.onResult) {
	      options.onResult(state);
	    }
	  };

	  for (let i = 0; i < patterns.length; i++) {
	    let isMatch = picomatch(String(patterns[i]), { ...options, onResult }, true);
	    let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
	    if (negated) negatives++;

	    for (let item of list) {
	      let matched = isMatch(item, true);

	      let match = negated ? !matched.isMatch : matched.isMatch;
	      if (!match) continue;

	      if (negated) {
	        omit.add(matched.output);
	      } else {
	        omit.delete(matched.output);
	        keep.add(matched.output);
	      }
	    }
	  }

	  let result = negatives === patterns.length ? [...items] : [...keep];
	  let matches = result.filter(item => !omit.has(item));

	  if (options && matches.length === 0) {
	    if (options.failglob === true) {
	      throw new Error(`No matches found for "${patterns.join(', ')}"`);
	    }

	    if (options.nonull === true || options.nullglob === true) {
	      return options.unescape ? patterns.map(p => p.replace(/\\/g, '')) : patterns;
	    }
	  }

	  return matches;
	};

	/**
	 * Backwards compatibility
	 */

	micromatch.match = micromatch;

	/**
	 * Returns a matcher function from the given glob `pattern` and `options`.
	 * The returned function takes a string to match as its only argument and returns
	 * true if the string is a match.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.matcher(pattern[, options]);
	 *
	 * const isMatch = mm.matcher('*.!(*a)');
	 * console.log(isMatch('a.a')); //=> false
	 * console.log(isMatch('a.b')); //=> true
	 * ```
	 * @param {String} `pattern` Glob pattern
	 * @param {Object} `options`
	 * @return {Function} Returns a matcher function.
	 * @api public
	 */

	micromatch.matcher = (pattern, options) => picomatch(pattern, options);

	/**
	 * Returns true if **any** of the given glob `patterns` match the specified `string`.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.isMatch(string, patterns[, options]);
	 *
	 * console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
	 * console.log(mm.isMatch('a.a', 'b.*')); //=> false
	 * ```
	 * @param {String} `str` The string to test.
	 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `[options]` See available [options](#options).
	 * @return {Boolean} Returns true if any patterns match `str`
	 * @api public
	 */

	micromatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

	/**
	 * Backwards compatibility
	 */

	micromatch.any = micromatch.isMatch;

	/**
	 * Returns a list of strings that _**do not match any**_ of the given `patterns`.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.not(list, patterns[, options]);
	 *
	 * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
	 * //=> ['b.b', 'c.c']
	 * ```
	 * @param {Array} `list` Array of strings to match.
	 * @param {String|Array} `patterns` One or more glob pattern to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Array} Returns an array of strings that **do not match** the given patterns.
	 * @api public
	 */

	micromatch.not = (list, patterns, options = {}) => {
	  patterns = [].concat(patterns).map(String);
	  let result = new Set();
	  let items = [];

	  let onResult = state => {
	    if (options.onResult) options.onResult(state);
	    items.push(state.output);
	  };

	  let matches = new Set(micromatch(list, patterns, { ...options, onResult }));

	  for (let item of items) {
	    if (!matches.has(item)) {
	      result.add(item);
	    }
	  }
	  return [...result];
	};

	/**
	 * Returns true if the given `string` contains the given pattern. Similar
	 * to [.isMatch](#isMatch) but the pattern can match any part of the string.
	 *
	 * ```js
	 * var mm = require('micromatch');
	 * // mm.contains(string, pattern[, options]);
	 *
	 * console.log(mm.contains('aa/bb/cc', '*b'));
	 * //=> true
	 * console.log(mm.contains('aa/bb/cc', '*d'));
	 * //=> false
	 * ```
	 * @param {String} `str` The string to match.
	 * @param {String|Array} `patterns` Glob pattern to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Boolean} Returns true if any of the patterns matches any part of `str`.
	 * @api public
	 */

	micromatch.contains = (str, pattern, options) => {
	  if (typeof str !== 'string') {
	    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
	  }

	  if (Array.isArray(pattern)) {
	    return pattern.some(p => micromatch.contains(str, p, options));
	  }

	  if (typeof pattern === 'string') {
	    if (isEmptyString(str) || isEmptyString(pattern)) {
	      return false;
	    }

	    if (str.includes(pattern) || (str.startsWith('./') && str.slice(2).includes(pattern))) {
	      return true;
	    }
	  }

	  return micromatch.isMatch(str, pattern, { ...options, contains: true });
	};

	/**
	 * Filter the keys of the given object with the given `glob` pattern
	 * and `options`. Does not attempt to match nested keys. If you need this feature,
	 * use [glob-object][] instead.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.matchKeys(object, patterns[, options]);
	 *
	 * const obj = { aa: 'a', ab: 'b', ac: 'c' };
	 * console.log(mm.matchKeys(obj, '*b'));
	 * //=> { ab: 'b' }
	 * ```
	 * @param {Object} `object` The object with keys to filter.
	 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Object} Returns an object with only keys that match the given patterns.
	 * @api public
	 */

	micromatch.matchKeys = (obj, patterns, options) => {
	  if (!utils.isObject(obj)) {
	    throw new TypeError('Expected the first argument to be an object');
	  }
	  let keys = micromatch(Object.keys(obj), patterns, options);
	  let res = {};
	  for (let key of keys) res[key] = obj[key];
	  return res;
	};

	/**
	 * Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.some(list, patterns[, options]);
	 *
	 * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	 * // true
	 * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
	 * // false
	 * ```
	 * @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
	 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Boolean} Returns true if any `patterns` matches any of the strings in `list`
	 * @api public
	 */

	micromatch.some = (list, patterns, options) => {
	  let items = [].concat(list);

	  for (let pattern of [].concat(patterns)) {
	    let isMatch = picomatch(String(pattern), options);
	    if (items.some(item => isMatch(item))) {
	      return true;
	    }
	  }
	  return false;
	};

	/**
	 * Returns true if every string in the given `list` matches
	 * any of the given glob `patterns`.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.every(list, patterns[, options]);
	 *
	 * console.log(mm.every('foo.js', ['foo.js']));
	 * // true
	 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
	 * // true
	 * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	 * // false
	 * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
	 * // false
	 * ```
	 * @param {String|Array} `list` The string or array of strings to test.
	 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Boolean} Returns true if all `patterns` matches all of the strings in `list`
	 * @api public
	 */

	micromatch.every = (list, patterns, options) => {
	  let items = [].concat(list);

	  for (let pattern of [].concat(patterns)) {
	    let isMatch = picomatch(String(pattern), options);
	    if (!items.every(item => isMatch(item))) {
	      return false;
	    }
	  }
	  return true;
	};

	/**
	 * Returns true if **all** of the given `patterns` match
	 * the specified string.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.all(string, patterns[, options]);
	 *
	 * console.log(mm.all('foo.js', ['foo.js']));
	 * // true
	 *
	 * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
	 * // false
	 *
	 * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
	 * // true
	 *
	 * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
	 * // true
	 * ```
	 * @param {String|Array} `str` The string to test.
	 * @param {String|Array} `patterns` One or more glob patterns to use for matching.
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Boolean} Returns true if any patterns match `str`
	 * @api public
	 */

	micromatch.all = (str, patterns, options) => {
	  if (typeof str !== 'string') {
	    throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
	  }

	  return [].concat(patterns).every(p => picomatch(p, options)(str));
	};

	/**
	 * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.capture(pattern, string[, options]);
	 *
	 * console.log(mm.capture('test/*.js', 'test/foo.js'));
	 * //=> ['foo']
	 * console.log(mm.capture('test/*.js', 'foo/bar.css'));
	 * //=> null
	 * ```
	 * @param {String} `glob` Glob pattern to use for matching.
	 * @param {String} `input` String to match
	 * @param {Object} `options` See available [options](#options) for changing how matches are performed
	 * @return {Array|null} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
	 * @api public
	 */

	micromatch.capture = (glob, input, options) => {
	  let posix = utils.isWindows(options);
	  let regex = picomatch.makeRe(String(glob), { ...options, capture: true });
	  let match = regex.exec(posix ? utils.toPosixSlashes(input) : input);

	  if (match) {
	    return match.slice(1).map(v => v === void 0 ? '' : v);
	  }
	};

	/**
	 * Create a regular expression from the given glob `pattern`.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * // mm.makeRe(pattern[, options]);
	 *
	 * console.log(mm.makeRe('*.js'));
	 * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
	 * ```
	 * @param {String} `pattern` A glob pattern to convert to regex.
	 * @param {Object} `options`
	 * @return {RegExp} Returns a regex created from the given pattern.
	 * @api public
	 */

	micromatch.makeRe = (...args) => picomatch.makeRe(...args);

	/**
	 * Scan a glob pattern to separate the pattern into segments. Used
	 * by the [split](#split) method.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * const state = mm.scan(pattern[, options]);
	 * ```
	 * @param {String} `pattern`
	 * @param {Object} `options`
	 * @return {Object} Returns an object with
	 * @api public
	 */

	micromatch.scan = (...args) => picomatch.scan(...args);

	/**
	 * Parse a glob pattern to create the source string for a regular
	 * expression.
	 *
	 * ```js
	 * const mm = require('micromatch');
	 * const state = mm.parse(pattern[, options]);
	 * ```
	 * @param {String} `glob`
	 * @param {Object} `options`
	 * @return {Object} Returns an object with useful properties and output to be used as regex source string.
	 * @api public
	 */

	micromatch.parse = (patterns, options) => {
	  let res = [];
	  for (let pattern of [].concat(patterns || [])) {
	    for (let str of braces(String(pattern), options)) {
	      res.push(picomatch.parse(str, options));
	    }
	  }
	  return res;
	};

	/**
	 * Process the given brace `pattern`.
	 *
	 * ```js
	 * const { braces } = require('micromatch');
	 * console.log(braces('foo/{a,b,c}/bar'));
	 * //=> [ 'foo/(a|b|c)/bar' ]
	 *
	 * console.log(braces('foo/{a,b,c}/bar', { expand: true }));
	 * //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
	 * ```
	 * @param {String} `pattern` String with brace pattern to process.
	 * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
	 * @return {Array}
	 * @api public
	 */

	micromatch.braces = (pattern, options) => {
	  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
	  if ((options && options.nobrace === true) || !hasBraces(pattern)) {
	    return [pattern];
	  }
	  return braces(pattern, options);
	};

	/**
	 * Expand braces
	 */

	micromatch.braceExpand = (pattern, options) => {
	  if (typeof pattern !== 'string') throw new TypeError('Expected a string');
	  return micromatch.braces(pattern, { ...options, expand: true });
	};

	/**
	 * Expose micromatch
	 */

	// exposed for tests
	micromatch.hasBraces = hasBraces;
	micromatch_1 = micromatch;
	return micromatch_1;
}

var hasRequiredPattern;

function requirePattern () {
	if (hasRequiredPattern) return pattern;
	hasRequiredPattern = 1;
	Object.defineProperty(pattern, "__esModule", { value: true });
	pattern.isAbsolute = pattern.partitionAbsoluteAndRelative = pattern.removeDuplicateSlashes = pattern.matchAny = pattern.convertPatternsToRe = pattern.makeRe = pattern.getPatternParts = pattern.expandBraceExpansion = pattern.expandPatternsWithBraceExpansion = pattern.isAffectDepthOfReadingPattern = pattern.endsWithSlashGlobStar = pattern.hasGlobStar = pattern.getBaseDirectory = pattern.isPatternRelatedToParentDirectory = pattern.getPatternsOutsideCurrentDirectory = pattern.getPatternsInsideCurrentDirectory = pattern.getPositivePatterns = pattern.getNegativePatterns = pattern.isPositivePattern = pattern.isNegativePattern = pattern.convertToNegativePattern = pattern.convertToPositivePattern = pattern.isDynamicPattern = pattern.isStaticPattern = void 0;
	const path = path$2;
	const globParent = requireGlobParent();
	const micromatch = requireMicromatch();
	const GLOBSTAR = '**';
	const ESCAPE_SYMBOL = '\\';
	const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
	const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
	const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
	const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
	const BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
	/**
	 * Matches a sequence of two or more consecutive slashes, excluding the first two slashes at the beginning of the string.
	 * The latter is due to the presence of the device path at the beginning of the UNC path.
	 */
	const DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
	function isStaticPattern(pattern, options = {}) {
	    return !isDynamicPattern(pattern, options);
	}
	pattern.isStaticPattern = isStaticPattern;
	function isDynamicPattern(pattern, options = {}) {
	    /**
	     * A special case with an empty string is necessary for matching patterns that start with a forward slash.
	     * An empty string cannot be a dynamic pattern.
	     * For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
	     */
	    if (pattern === '') {
	        return false;
	    }
	    /**
	     * When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
	     * filepath directly (without read directory).
	     */
	    if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) {
	        return true;
	    }
	    if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) {
	        return true;
	    }
	    if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) {
	        return true;
	    }
	    if (options.braceExpansion !== false && hasBraceExpansion(pattern)) {
	        return true;
	    }
	    return false;
	}
	pattern.isDynamicPattern = isDynamicPattern;
	function hasBraceExpansion(pattern) {
	    const openingBraceIndex = pattern.indexOf('{');
	    if (openingBraceIndex === -1) {
	        return false;
	    }
	    const closingBraceIndex = pattern.indexOf('}', openingBraceIndex + 1);
	    if (closingBraceIndex === -1) {
	        return false;
	    }
	    const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
	    return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
	}
	function convertToPositivePattern(pattern) {
	    return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
	}
	pattern.convertToPositivePattern = convertToPositivePattern;
	function convertToNegativePattern(pattern) {
	    return '!' + pattern;
	}
	pattern.convertToNegativePattern = convertToNegativePattern;
	function isNegativePattern(pattern) {
	    return pattern.startsWith('!') && pattern[1] !== '(';
	}
	pattern.isNegativePattern = isNegativePattern;
	function isPositivePattern(pattern) {
	    return !isNegativePattern(pattern);
	}
	pattern.isPositivePattern = isPositivePattern;
	function getNegativePatterns(patterns) {
	    return patterns.filter(isNegativePattern);
	}
	pattern.getNegativePatterns = getNegativePatterns;
	function getPositivePatterns(patterns) {
	    return patterns.filter(isPositivePattern);
	}
	pattern.getPositivePatterns = getPositivePatterns;
	/**
	 * Returns patterns that can be applied inside the current directory.
	 *
	 * @example
	 * // ['./*', '*', 'a/*']
	 * getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	 */
	function getPatternsInsideCurrentDirectory(patterns) {
	    return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
	}
	pattern.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
	/**
	 * Returns patterns to be expanded relative to (outside) the current directory.
	 *
	 * @example
	 * // ['../*', './../*']
	 * getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	 */
	function getPatternsOutsideCurrentDirectory(patterns) {
	    return patterns.filter(isPatternRelatedToParentDirectory);
	}
	pattern.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
	function isPatternRelatedToParentDirectory(pattern) {
	    return pattern.startsWith('..') || pattern.startsWith('./..');
	}
	pattern.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
	function getBaseDirectory(pattern) {
	    return globParent(pattern, { flipBackslashes: false });
	}
	pattern.getBaseDirectory = getBaseDirectory;
	function hasGlobStar(pattern) {
	    return pattern.includes(GLOBSTAR);
	}
	pattern.hasGlobStar = hasGlobStar;
	function endsWithSlashGlobStar(pattern) {
	    return pattern.endsWith('/' + GLOBSTAR);
	}
	pattern.endsWithSlashGlobStar = endsWithSlashGlobStar;
	function isAffectDepthOfReadingPattern(pattern) {
	    const basename = path.basename(pattern);
	    return endsWithSlashGlobStar(pattern) || isStaticPattern(basename);
	}
	pattern.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
	function expandPatternsWithBraceExpansion(patterns) {
	    return patterns.reduce((collection, pattern) => {
	        return collection.concat(expandBraceExpansion(pattern));
	    }, []);
	}
	pattern.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
	function expandBraceExpansion(pattern) {
	    const patterns = micromatch.braces(pattern, { expand: true, nodupes: true, keepEscaping: true });
	    /**
	     * Sort the patterns by length so that the same depth patterns are processed side by side.
	     * `a/{b,}/{c,}/*` – `['a///*', 'a/b//*', 'a//c/*', 'a/b/c/*']`
	     */
	    patterns.sort((a, b) => a.length - b.length);
	    /**
	     * Micromatch can return an empty string in the case of patterns like `{a,}`.
	     */
	    return patterns.filter((pattern) => pattern !== '');
	}
	pattern.expandBraceExpansion = expandBraceExpansion;
	function getPatternParts(pattern, options) {
	    let { parts } = micromatch.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
	    /**
	     * The scan method returns an empty array in some cases.
	     * See micromatch/picomatch#58 for more details.
	     */
	    if (parts.length === 0) {
	        parts = [pattern];
	    }
	    /**
	     * The scan method does not return an empty part for the pattern with a forward slash.
	     * This is another part of micromatch/picomatch#58.
	     */
	    if (parts[0].startsWith('/')) {
	        parts[0] = parts[0].slice(1);
	        parts.unshift('');
	    }
	    return parts;
	}
	pattern.getPatternParts = getPatternParts;
	function makeRe(pattern, options) {
	    return micromatch.makeRe(pattern, options);
	}
	pattern.makeRe = makeRe;
	function convertPatternsToRe(patterns, options) {
	    return patterns.map((pattern) => makeRe(pattern, options));
	}
	pattern.convertPatternsToRe = convertPatternsToRe;
	function matchAny(entry, patternsRe) {
	    return patternsRe.some((patternRe) => patternRe.test(entry));
	}
	pattern.matchAny = matchAny;
	/**
	 * This package only works with forward slashes as a path separator.
	 * Because of this, we cannot use the standard `path.normalize` method, because on Windows platform it will use of backslashes.
	 */
	function removeDuplicateSlashes(pattern) {
	    return pattern.replace(DOUBLE_SLASH_RE, '/');
	}
	pattern.removeDuplicateSlashes = removeDuplicateSlashes;
	function partitionAbsoluteAndRelative(patterns) {
	    const absolute = [];
	    const relative = [];
	    for (const pattern of patterns) {
	        if (isAbsolute(pattern)) {
	            absolute.push(pattern);
	        }
	        else {
	            relative.push(pattern);
	        }
	    }
	    return [absolute, relative];
	}
	pattern.partitionAbsoluteAndRelative = partitionAbsoluteAndRelative;
	function isAbsolute(pattern) {
	    return path.isAbsolute(pattern);
	}
	pattern.isAbsolute = isAbsolute;
	return pattern;
}

var stream$3 = {};

var merge2_1;
var hasRequiredMerge2;

function requireMerge2 () {
	if (hasRequiredMerge2) return merge2_1;
	hasRequiredMerge2 = 1;
	/*
	 * merge2
	 * https://github.com/teambition/merge2
	 *
	 * Copyright (c) 2014-2020 Teambition
	 * Licensed under the MIT license.
	 */
	const Stream = require$$0$2;
	const PassThrough = Stream.PassThrough;
	const slice = Array.prototype.slice;

	merge2_1 = merge2;

	function merge2 () {
	  const streamsQueue = [];
	  const args = slice.call(arguments);
	  let merging = false;
	  let options = args[args.length - 1];

	  if (options && !Array.isArray(options) && options.pipe == null) {
	    args.pop();
	  } else {
	    options = {};
	  }

	  const doEnd = options.end !== false;
	  const doPipeError = options.pipeError === true;
	  if (options.objectMode == null) {
	    options.objectMode = true;
	  }
	  if (options.highWaterMark == null) {
	    options.highWaterMark = 64 * 1024;
	  }
	  const mergedStream = PassThrough(options);

	  function addStream () {
	    for (let i = 0, len = arguments.length; i < len; i++) {
	      streamsQueue.push(pauseStreams(arguments[i], options));
	    }
	    mergeStream();
	    return this
	  }

	  function mergeStream () {
	    if (merging) {
	      return
	    }
	    merging = true;

	    let streams = streamsQueue.shift();
	    if (!streams) {
	      process.nextTick(endStream);
	      return
	    }
	    if (!Array.isArray(streams)) {
	      streams = [streams];
	    }

	    let pipesCount = streams.length + 1;

	    function next () {
	      if (--pipesCount > 0) {
	        return
	      }
	      merging = false;
	      mergeStream();
	    }

	    function pipe (stream) {
	      function onend () {
	        stream.removeListener('merge2UnpipeEnd', onend);
	        stream.removeListener('end', onend);
	        if (doPipeError) {
	          stream.removeListener('error', onerror);
	        }
	        next();
	      }
	      function onerror (err) {
	        mergedStream.emit('error', err);
	      }
	      // skip ended stream
	      if (stream._readableState.endEmitted) {
	        return next()
	      }

	      stream.on('merge2UnpipeEnd', onend);
	      stream.on('end', onend);

	      if (doPipeError) {
	        stream.on('error', onerror);
	      }

	      stream.pipe(mergedStream, { end: false });
	      // compatible for old stream
	      stream.resume();
	    }

	    for (let i = 0; i < streams.length; i++) {
	      pipe(streams[i]);
	    }

	    next();
	  }

	  function endStream () {
	    merging = false;
	    // emit 'queueDrain' when all streams merged.
	    mergedStream.emit('queueDrain');
	    if (doEnd) {
	      mergedStream.end();
	    }
	  }

	  mergedStream.setMaxListeners(0);
	  mergedStream.add = addStream;
	  mergedStream.on('unpipe', function (stream) {
	    stream.emit('merge2UnpipeEnd');
	  });

	  if (args.length) {
	    addStream.apply(null, args);
	  }
	  return mergedStream
	}

	// check and pause streams for pipe.
	function pauseStreams (streams, options) {
	  if (!Array.isArray(streams)) {
	    // Backwards-compat with old-style streams
	    if (!streams._readableState && streams.pipe) {
	      streams = streams.pipe(PassThrough(options));
	    }
	    if (!streams._readableState || !streams.pause || !streams.pipe) {
	      throw new Error('Only readable stream can be merged.')
	    }
	    streams.pause();
	  } else {
	    for (let i = 0, len = streams.length; i < len; i++) {
	      streams[i] = pauseStreams(streams[i], options);
	    }
	  }
	  return streams
	}
	return merge2_1;
}

var hasRequiredStream$3;

function requireStream$3 () {
	if (hasRequiredStream$3) return stream$3;
	hasRequiredStream$3 = 1;
	Object.defineProperty(stream$3, "__esModule", { value: true });
	stream$3.merge = void 0;
	const merge2 = requireMerge2();
	function merge(streams) {
	    const mergedStream = merge2(streams);
	    streams.forEach((stream) => {
	        stream.once('error', (error) => mergedStream.emit('error', error));
	    });
	    mergedStream.once('close', () => propagateCloseEventToSources(streams));
	    mergedStream.once('end', () => propagateCloseEventToSources(streams));
	    return mergedStream;
	}
	stream$3.merge = merge;
	function propagateCloseEventToSources(streams) {
	    streams.forEach((stream) => stream.emit('close'));
	}
	return stream$3;
}

var string = {};

var hasRequiredString;

function requireString () {
	if (hasRequiredString) return string;
	hasRequiredString = 1;
	Object.defineProperty(string, "__esModule", { value: true });
	string.isEmpty = string.isString = void 0;
	function isString(input) {
	    return typeof input === 'string';
	}
	string.isString = isString;
	function isEmpty(input) {
	    return input === '';
	}
	string.isEmpty = isEmpty;
	return string;
}

var hasRequiredUtils$1;

function requireUtils$1 () {
	if (hasRequiredUtils$1) return utils$3;
	hasRequiredUtils$1 = 1;
	Object.defineProperty(utils$3, "__esModule", { value: true });
	utils$3.string = utils$3.stream = utils$3.pattern = utils$3.path = utils$3.fs = utils$3.errno = utils$3.array = void 0;
	const array = requireArray();
	utils$3.array = array;
	const errno = requireErrno();
	utils$3.errno = errno;
	const fs = requireFs$3();
	utils$3.fs = fs;
	const path = requirePath();
	utils$3.path = path;
	const pattern = requirePattern();
	utils$3.pattern = pattern;
	const stream = requireStream$3();
	utils$3.stream = stream;
	const string = requireString();
	utils$3.string = string;
	return utils$3;
}

var hasRequiredTasks;

function requireTasks () {
	if (hasRequiredTasks) return tasks;
	hasRequiredTasks = 1;
	Object.defineProperty(tasks, "__esModule", { value: true });
	tasks.convertPatternGroupToTask = tasks.convertPatternGroupsToTasks = tasks.groupPatternsByBaseDirectory = tasks.getNegativePatternsAsPositive = tasks.getPositivePatterns = tasks.convertPatternsToTasks = tasks.generate = void 0;
	const utils = requireUtils$1();
	function generate(input, settings) {
	    const patterns = processPatterns(input, settings);
	    const ignore = processPatterns(settings.ignore, settings);
	    const positivePatterns = getPositivePatterns(patterns);
	    const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
	    const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
	    const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
	    const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, /* dynamic */ false);
	    const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, /* dynamic */ true);
	    return staticTasks.concat(dynamicTasks);
	}
	tasks.generate = generate;
	function processPatterns(input, settings) {
	    let patterns = input;
	    /**
	     * The original pattern like `{,*,**,a/*}` can lead to problems checking the depth when matching entry
	     * and some problems with the micromatch package (see fast-glob issues: #365, #394).
	     *
	     * To solve this problem, we expand all patterns containing brace expansion. This can lead to a slight slowdown
	     * in matching in the case of a large set of patterns after expansion.
	     */
	    if (settings.braceExpansion) {
	        patterns = utils.pattern.expandPatternsWithBraceExpansion(patterns);
	    }
	    /**
	     * If the `baseNameMatch` option is enabled, we must add globstar to patterns, so that they can be used
	     * at any nesting level.
	     *
	     * We do this here, because otherwise we have to complicate the filtering logic. For example, we need to change
	     * the pattern in the filter before creating a regular expression. There is no need to change the patterns
	     * in the application. Only on the input.
	     */
	    if (settings.baseNameMatch) {
	        patterns = patterns.map((pattern) => pattern.includes('/') ? pattern : `**/${pattern}`);
	    }
	    /**
	     * This method also removes duplicate slashes that may have been in the pattern or formed as a result of expansion.
	     */
	    return patterns.map((pattern) => utils.pattern.removeDuplicateSlashes(pattern));
	}
	/**
	 * Returns tasks grouped by basic pattern directories.
	 *
	 * Patterns that can be found inside (`./`) and outside (`../`) the current directory are handled separately.
	 * This is necessary because directory traversal starts at the base directory and goes deeper.
	 */
	function convertPatternsToTasks(positive, negative, dynamic) {
	    const tasks = [];
	    const patternsOutsideCurrentDirectory = utils.pattern.getPatternsOutsideCurrentDirectory(positive);
	    const patternsInsideCurrentDirectory = utils.pattern.getPatternsInsideCurrentDirectory(positive);
	    const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
	    const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
	    tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
	    /*
	     * For the sake of reducing future accesses to the file system, we merge all tasks within the current directory
	     * into a global task, if at least one pattern refers to the root (`.`). In this case, the global task covers the rest.
	     */
	    if ('.' in insideCurrentDirectoryGroup) {
	        tasks.push(convertPatternGroupToTask('.', patternsInsideCurrentDirectory, negative, dynamic));
	    }
	    else {
	        tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
	    }
	    return tasks;
	}
	tasks.convertPatternsToTasks = convertPatternsToTasks;
	function getPositivePatterns(patterns) {
	    return utils.pattern.getPositivePatterns(patterns);
	}
	tasks.getPositivePatterns = getPositivePatterns;
	function getNegativePatternsAsPositive(patterns, ignore) {
	    const negative = utils.pattern.getNegativePatterns(patterns).concat(ignore);
	    const positive = negative.map(utils.pattern.convertToPositivePattern);
	    return positive;
	}
	tasks.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
	function groupPatternsByBaseDirectory(patterns) {
	    const group = {};
	    return patterns.reduce((collection, pattern) => {
	        const base = utils.pattern.getBaseDirectory(pattern);
	        if (base in collection) {
	            collection[base].push(pattern);
	        }
	        else {
	            collection[base] = [pattern];
	        }
	        return collection;
	    }, group);
	}
	tasks.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
	function convertPatternGroupsToTasks(positive, negative, dynamic) {
	    return Object.keys(positive).map((base) => {
	        return convertPatternGroupToTask(base, positive[base], negative, dynamic);
	    });
	}
	tasks.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
	function convertPatternGroupToTask(base, positive, negative, dynamic) {
	    return {
	        dynamic,
	        positive,
	        negative,
	        base,
	        patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
	    };
	}
	tasks.convertPatternGroupToTask = convertPatternGroupToTask;
	return tasks;
}

var async$5 = {};

var async$4 = {};

var out$3 = {};

var async$3 = {};

var async$2 = {};

var out$2 = {};

var async$1 = {};

var out$1 = {};

var async = {};

var hasRequiredAsync$5;

function requireAsync$5 () {
	if (hasRequiredAsync$5) return async;
	hasRequiredAsync$5 = 1;
	Object.defineProperty(async, "__esModule", { value: true });
	async.read = void 0;
	function read(path, settings, callback) {
	    settings.fs.lstat(path, (lstatError, lstat) => {
	        if (lstatError !== null) {
	            callFailureCallback(callback, lstatError);
	            return;
	        }
	        if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
	            callSuccessCallback(callback, lstat);
	            return;
	        }
	        settings.fs.stat(path, (statError, stat) => {
	            if (statError !== null) {
	                if (settings.throwErrorOnBrokenSymbolicLink) {
	                    callFailureCallback(callback, statError);
	                    return;
	                }
	                callSuccessCallback(callback, lstat);
	                return;
	            }
	            if (settings.markSymbolicLink) {
	                stat.isSymbolicLink = () => true;
	            }
	            callSuccessCallback(callback, stat);
	        });
	    });
	}
	async.read = read;
	function callFailureCallback(callback, error) {
	    callback(error);
	}
	function callSuccessCallback(callback, result) {
	    callback(null, result);
	}
	return async;
}

var sync$5 = {};

var hasRequiredSync$5;

function requireSync$5 () {
	if (hasRequiredSync$5) return sync$5;
	hasRequiredSync$5 = 1;
	Object.defineProperty(sync$5, "__esModule", { value: true });
	sync$5.read = void 0;
	function read(path, settings) {
	    const lstat = settings.fs.lstatSync(path);
	    if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
	        return lstat;
	    }
	    try {
	        const stat = settings.fs.statSync(path);
	        if (settings.markSymbolicLink) {
	            stat.isSymbolicLink = () => true;
	        }
	        return stat;
	    }
	    catch (error) {
	        if (!settings.throwErrorOnBrokenSymbolicLink) {
	            return lstat;
	        }
	        throw error;
	    }
	}
	sync$5.read = read;
	return sync$5;
}

var settings$3 = {};

var fs$2 = {};

var hasRequiredFs$2;

function requireFs$2 () {
	if (hasRequiredFs$2) return fs$2;
	hasRequiredFs$2 = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.createFileSystemAdapter = exports$1.FILE_SYSTEM_ADAPTER = void 0;
		const fs = fs$4;
		exports$1.FILE_SYSTEM_ADAPTER = {
		    lstat: fs.lstat,
		    stat: fs.stat,
		    lstatSync: fs.lstatSync,
		    statSync: fs.statSync
		};
		function createFileSystemAdapter(fsMethods) {
		    if (fsMethods === undefined) {
		        return exports$1.FILE_SYSTEM_ADAPTER;
		    }
		    return Object.assign(Object.assign({}, exports$1.FILE_SYSTEM_ADAPTER), fsMethods);
		}
		exports$1.createFileSystemAdapter = createFileSystemAdapter; 
	} (fs$2));
	return fs$2;
}

var hasRequiredSettings$3;

function requireSettings$3 () {
	if (hasRequiredSettings$3) return settings$3;
	hasRequiredSettings$3 = 1;
	Object.defineProperty(settings$3, "__esModule", { value: true });
	const fs = requireFs$2();
	class Settings {
	    constructor(_options = {}) {
	        this._options = _options;
	        this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
	        this.fs = fs.createFileSystemAdapter(this._options.fs);
	        this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
	        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
	    }
	    _getValue(option, value) {
	        return option !== null && option !== void 0 ? option : value;
	    }
	}
	settings$3.default = Settings;
	return settings$3;
}

var hasRequiredOut$3;

function requireOut$3 () {
	if (hasRequiredOut$3) return out$1;
	hasRequiredOut$3 = 1;
	Object.defineProperty(out$1, "__esModule", { value: true });
	out$1.statSync = out$1.stat = out$1.Settings = void 0;
	const async = requireAsync$5();
	const sync = requireSync$5();
	const settings_1 = requireSettings$3();
	out$1.Settings = settings_1.default;
	function stat(path, optionsOrSettingsOrCallback, callback) {
	    if (typeof optionsOrSettingsOrCallback === 'function') {
	        async.read(path, getSettings(), optionsOrSettingsOrCallback);
	        return;
	    }
	    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
	}
	out$1.stat = stat;
	function statSync(path, optionsOrSettings) {
	    const settings = getSettings(optionsOrSettings);
	    return sync.read(path, settings);
	}
	out$1.statSync = statSync;
	function getSettings(settingsOrOptions = {}) {
	    if (settingsOrOptions instanceof settings_1.default) {
	        return settingsOrOptions;
	    }
	    return new settings_1.default(settingsOrOptions);
	}
	return out$1;
}

/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var queueMicrotask_1;
var hasRequiredQueueMicrotask;

function requireQueueMicrotask () {
	if (hasRequiredQueueMicrotask) return queueMicrotask_1;
	hasRequiredQueueMicrotask = 1;
	let promise;

	queueMicrotask_1 = typeof queueMicrotask === 'function'
	  ? queueMicrotask.bind(typeof window !== 'undefined' ? window : commonjsGlobal)
	  // reuse resolved promise, and allocate it lazily
	  : cb => (promise || (promise = Promise.resolve()))
	    .then(cb)
	    .catch(err => setTimeout(() => { throw err }, 0));
	return queueMicrotask_1;
}

/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

var runParallel_1;
var hasRequiredRunParallel;

function requireRunParallel () {
	if (hasRequiredRunParallel) return runParallel_1;
	hasRequiredRunParallel = 1;
	runParallel_1 = runParallel;

	const queueMicrotask = requireQueueMicrotask();

	function runParallel (tasks, cb) {
	  let results, pending, keys;
	  let isSync = true;

	  if (Array.isArray(tasks)) {
	    results = [];
	    pending = tasks.length;
	  } else {
	    keys = Object.keys(tasks);
	    results = {};
	    pending = keys.length;
	  }

	  function done (err) {
	    function end () {
	      if (cb) cb(err, results);
	      cb = null;
	    }
	    if (isSync) queueMicrotask(end);
	    else end();
	  }

	  function each (i, err, result) {
	    results[i] = result;
	    if (--pending === 0 || err) {
	      done(err);
	    }
	  }

	  if (!pending) {
	    // empty
	    done(null);
	  } else if (keys) {
	    // object
	    keys.forEach(function (key) {
	      tasks[key](function (err, result) { each(key, err, result); });
	    });
	  } else {
	    // array
	    tasks.forEach(function (task, i) {
	      task(function (err, result) { each(i, err, result); });
	    });
	  }

	  isSync = false;
	}
	return runParallel_1;
}

var constants = {};

var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;
	Object.defineProperty(constants, "__esModule", { value: true });
	constants.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
	const NODE_PROCESS_VERSION_PARTS = process.versions.node.split('.');
	if (NODE_PROCESS_VERSION_PARTS[0] === undefined || NODE_PROCESS_VERSION_PARTS[1] === undefined) {
	    throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
	}
	const MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
	const MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
	const SUPPORTED_MAJOR_VERSION = 10;
	const SUPPORTED_MINOR_VERSION = 10;
	const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
	const IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
	/**
	 * IS `true` for Node.js 10.10 and greater.
	 */
	constants.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
	return constants;
}

var utils = {};

var fs$1 = {};

var hasRequiredFs$1;

function requireFs$1 () {
	if (hasRequiredFs$1) return fs$1;
	hasRequiredFs$1 = 1;
	Object.defineProperty(fs$1, "__esModule", { value: true });
	fs$1.createDirentFromStats = void 0;
	class DirentFromStats {
	    constructor(name, stats) {
	        this.name = name;
	        this.isBlockDevice = stats.isBlockDevice.bind(stats);
	        this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
	        this.isDirectory = stats.isDirectory.bind(stats);
	        this.isFIFO = stats.isFIFO.bind(stats);
	        this.isFile = stats.isFile.bind(stats);
	        this.isSocket = stats.isSocket.bind(stats);
	        this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
	    }
	}
	function createDirentFromStats(name, stats) {
	    return new DirentFromStats(name, stats);
	}
	fs$1.createDirentFromStats = createDirentFromStats;
	return fs$1;
}

var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;
	Object.defineProperty(utils, "__esModule", { value: true });
	utils.fs = void 0;
	const fs = requireFs$1();
	utils.fs = fs;
	return utils;
}

var common$1 = {};

var hasRequiredCommon$1;

function requireCommon$1 () {
	if (hasRequiredCommon$1) return common$1;
	hasRequiredCommon$1 = 1;
	Object.defineProperty(common$1, "__esModule", { value: true });
	common$1.joinPathSegments = void 0;
	function joinPathSegments(a, b, separator) {
	    /**
	     * The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
	     */
	    if (a.endsWith(separator)) {
	        return a + b;
	    }
	    return a + separator + b;
	}
	common$1.joinPathSegments = joinPathSegments;
	return common$1;
}

var hasRequiredAsync$4;

function requireAsync$4 () {
	if (hasRequiredAsync$4) return async$1;
	hasRequiredAsync$4 = 1;
	Object.defineProperty(async$1, "__esModule", { value: true });
	async$1.readdir = async$1.readdirWithFileTypes = async$1.read = void 0;
	const fsStat = requireOut$3();
	const rpl = requireRunParallel();
	const constants_1 = requireConstants();
	const utils = requireUtils();
	const common = requireCommon$1();
	function read(directory, settings, callback) {
	    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
	        readdirWithFileTypes(directory, settings, callback);
	        return;
	    }
	    readdir(directory, settings, callback);
	}
	async$1.read = read;
	function readdirWithFileTypes(directory, settings, callback) {
	    settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
	        if (readdirError !== null) {
	            callFailureCallback(callback, readdirError);
	            return;
	        }
	        const entries = dirents.map((dirent) => ({
	            dirent,
	            name: dirent.name,
	            path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
	        }));
	        if (!settings.followSymbolicLinks) {
	            callSuccessCallback(callback, entries);
	            return;
	        }
	        const tasks = entries.map((entry) => makeRplTaskEntry(entry, settings));
	        rpl(tasks, (rplError, rplEntries) => {
	            if (rplError !== null) {
	                callFailureCallback(callback, rplError);
	                return;
	            }
	            callSuccessCallback(callback, rplEntries);
	        });
	    });
	}
	async$1.readdirWithFileTypes = readdirWithFileTypes;
	function makeRplTaskEntry(entry, settings) {
	    return (done) => {
	        if (!entry.dirent.isSymbolicLink()) {
	            done(null, entry);
	            return;
	        }
	        settings.fs.stat(entry.path, (statError, stats) => {
	            if (statError !== null) {
	                if (settings.throwErrorOnBrokenSymbolicLink) {
	                    done(statError);
	                    return;
	                }
	                done(null, entry);
	                return;
	            }
	            entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
	            done(null, entry);
	        });
	    };
	}
	function readdir(directory, settings, callback) {
	    settings.fs.readdir(directory, (readdirError, names) => {
	        if (readdirError !== null) {
	            callFailureCallback(callback, readdirError);
	            return;
	        }
	        const tasks = names.map((name) => {
	            const path = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
	            return (done) => {
	                fsStat.stat(path, settings.fsStatSettings, (error, stats) => {
	                    if (error !== null) {
	                        done(error);
	                        return;
	                    }
	                    const entry = {
	                        name,
	                        path,
	                        dirent: utils.fs.createDirentFromStats(name, stats)
	                    };
	                    if (settings.stats) {
	                        entry.stats = stats;
	                    }
	                    done(null, entry);
	                });
	            };
	        });
	        rpl(tasks, (rplError, entries) => {
	            if (rplError !== null) {
	                callFailureCallback(callback, rplError);
	                return;
	            }
	            callSuccessCallback(callback, entries);
	        });
	    });
	}
	async$1.readdir = readdir;
	function callFailureCallback(callback, error) {
	    callback(error);
	}
	function callSuccessCallback(callback, result) {
	    callback(null, result);
	}
	return async$1;
}

var sync$4 = {};

var hasRequiredSync$4;

function requireSync$4 () {
	if (hasRequiredSync$4) return sync$4;
	hasRequiredSync$4 = 1;
	Object.defineProperty(sync$4, "__esModule", { value: true });
	sync$4.readdir = sync$4.readdirWithFileTypes = sync$4.read = void 0;
	const fsStat = requireOut$3();
	const constants_1 = requireConstants();
	const utils = requireUtils();
	const common = requireCommon$1();
	function read(directory, settings) {
	    if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
	        return readdirWithFileTypes(directory, settings);
	    }
	    return readdir(directory, settings);
	}
	sync$4.read = read;
	function readdirWithFileTypes(directory, settings) {
	    const dirents = settings.fs.readdirSync(directory, { withFileTypes: true });
	    return dirents.map((dirent) => {
	        const entry = {
	            dirent,
	            name: dirent.name,
	            path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
	        };
	        if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) {
	            try {
	                const stats = settings.fs.statSync(entry.path);
	                entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
	            }
	            catch (error) {
	                if (settings.throwErrorOnBrokenSymbolicLink) {
	                    throw error;
	                }
	            }
	        }
	        return entry;
	    });
	}
	sync$4.readdirWithFileTypes = readdirWithFileTypes;
	function readdir(directory, settings) {
	    const names = settings.fs.readdirSync(directory);
	    return names.map((name) => {
	        const entryPath = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
	        const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
	        const entry = {
	            name,
	            path: entryPath,
	            dirent: utils.fs.createDirentFromStats(name, stats)
	        };
	        if (settings.stats) {
	            entry.stats = stats;
	        }
	        return entry;
	    });
	}
	sync$4.readdir = readdir;
	return sync$4;
}

var settings$2 = {};

var fs = {};

var hasRequiredFs;

function requireFs () {
	if (hasRequiredFs) return fs;
	hasRequiredFs = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.createFileSystemAdapter = exports$1.FILE_SYSTEM_ADAPTER = void 0;
		const fs = fs$4;
		exports$1.FILE_SYSTEM_ADAPTER = {
		    lstat: fs.lstat,
		    stat: fs.stat,
		    lstatSync: fs.lstatSync,
		    statSync: fs.statSync,
		    readdir: fs.readdir,
		    readdirSync: fs.readdirSync
		};
		function createFileSystemAdapter(fsMethods) {
		    if (fsMethods === undefined) {
		        return exports$1.FILE_SYSTEM_ADAPTER;
		    }
		    return Object.assign(Object.assign({}, exports$1.FILE_SYSTEM_ADAPTER), fsMethods);
		}
		exports$1.createFileSystemAdapter = createFileSystemAdapter; 
	} (fs));
	return fs;
}

var hasRequiredSettings$2;

function requireSettings$2 () {
	if (hasRequiredSettings$2) return settings$2;
	hasRequiredSettings$2 = 1;
	Object.defineProperty(settings$2, "__esModule", { value: true });
	const path = path$2;
	const fsStat = requireOut$3();
	const fs = requireFs();
	class Settings {
	    constructor(_options = {}) {
	        this._options = _options;
	        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
	        this.fs = fs.createFileSystemAdapter(this._options.fs);
	        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
	        this.stats = this._getValue(this._options.stats, false);
	        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
	        this.fsStatSettings = new fsStat.Settings({
	            followSymbolicLink: this.followSymbolicLinks,
	            fs: this.fs,
	            throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
	        });
	    }
	    _getValue(option, value) {
	        return option !== null && option !== void 0 ? option : value;
	    }
	}
	settings$2.default = Settings;
	return settings$2;
}

var hasRequiredOut$2;

function requireOut$2 () {
	if (hasRequiredOut$2) return out$2;
	hasRequiredOut$2 = 1;
	Object.defineProperty(out$2, "__esModule", { value: true });
	out$2.Settings = out$2.scandirSync = out$2.scandir = void 0;
	const async = requireAsync$4();
	const sync = requireSync$4();
	const settings_1 = requireSettings$2();
	out$2.Settings = settings_1.default;
	function scandir(path, optionsOrSettingsOrCallback, callback) {
	    if (typeof optionsOrSettingsOrCallback === 'function') {
	        async.read(path, getSettings(), optionsOrSettingsOrCallback);
	        return;
	    }
	    async.read(path, getSettings(optionsOrSettingsOrCallback), callback);
	}
	out$2.scandir = scandir;
	function scandirSync(path, optionsOrSettings) {
	    const settings = getSettings(optionsOrSettings);
	    return sync.read(path, settings);
	}
	out$2.scandirSync = scandirSync;
	function getSettings(settingsOrOptions = {}) {
	    if (settingsOrOptions instanceof settings_1.default) {
	        return settingsOrOptions;
	    }
	    return new settings_1.default(settingsOrOptions);
	}
	return out$2;
}

var queue = {exports: {}};

var reusify_1;
var hasRequiredReusify;

function requireReusify () {
	if (hasRequiredReusify) return reusify_1;
	hasRequiredReusify = 1;

	function reusify (Constructor) {
	  var head = new Constructor();
	  var tail = head;

	  function get () {
	    var current = head;

	    if (current.next) {
	      head = current.next;
	    } else {
	      head = new Constructor();
	      tail = head;
	    }

	    current.next = null;

	    return current
	  }

	  function release (obj) {
	    tail.next = obj;
	    tail = obj;
	  }

	  return {
	    get: get,
	    release: release
	  }
	}

	reusify_1 = reusify;
	return reusify_1;
}

var hasRequiredQueue;

function requireQueue () {
	if (hasRequiredQueue) return queue.exports;
	hasRequiredQueue = 1;

	/* eslint-disable no-var */

	var reusify = requireReusify();

	function fastqueue (context, worker, _concurrency) {
	  if (typeof context === 'function') {
	    _concurrency = worker;
	    worker = context;
	    context = null;
	  }

	  if (!(_concurrency >= 1)) {
	    throw new Error('fastqueue concurrency must be equal to or greater than 1')
	  }

	  var cache = reusify(Task);
	  var queueHead = null;
	  var queueTail = null;
	  var _running = 0;
	  var errorHandler = null;

	  var self = {
	    push: push,
	    drain: noop,
	    saturated: noop,
	    pause: pause,
	    paused: false,

	    get concurrency () {
	      return _concurrency
	    },
	    set concurrency (value) {
	      if (!(value >= 1)) {
	        throw new Error('fastqueue concurrency must be equal to or greater than 1')
	      }
	      _concurrency = value;

	      if (self.paused) return
	      for (; queueHead && _running < _concurrency;) {
	        _running++;
	        release();
	      }
	    },

	    running: running,
	    resume: resume,
	    idle: idle,
	    length: length,
	    getQueue: getQueue,
	    unshift: unshift,
	    empty: noop,
	    kill: kill,
	    killAndDrain: killAndDrain,
	    error: error,
	    abort: abort
	  };

	  return self

	  function running () {
	    return _running
	  }

	  function pause () {
	    self.paused = true;
	  }

	  function length () {
	    var current = queueHead;
	    var counter = 0;

	    while (current) {
	      current = current.next;
	      counter++;
	    }

	    return counter
	  }

	  function getQueue () {
	    var current = queueHead;
	    var tasks = [];

	    while (current) {
	      tasks.push(current.value);
	      current = current.next;
	    }

	    return tasks
	  }

	  function resume () {
	    if (!self.paused) return
	    self.paused = false;
	    if (queueHead === null) {
	      _running++;
	      release();
	      return
	    }
	    for (; queueHead && _running < _concurrency;) {
	      _running++;
	      release();
	    }
	  }

	  function idle () {
	    return _running === 0 && self.length() === 0
	  }

	  function push (value, done) {
	    var current = cache.get();

	    current.context = context;
	    current.release = release;
	    current.value = value;
	    current.callback = done || noop;
	    current.errorHandler = errorHandler;

	    if (_running >= _concurrency || self.paused) {
	      if (queueTail) {
	        queueTail.next = current;
	        queueTail = current;
	      } else {
	        queueHead = current;
	        queueTail = current;
	        self.saturated();
	      }
	    } else {
	      _running++;
	      worker.call(context, current.value, current.worked);
	    }
	  }

	  function unshift (value, done) {
	    var current = cache.get();

	    current.context = context;
	    current.release = release;
	    current.value = value;
	    current.callback = done || noop;
	    current.errorHandler = errorHandler;

	    if (_running >= _concurrency || self.paused) {
	      if (queueHead) {
	        current.next = queueHead;
	        queueHead = current;
	      } else {
	        queueHead = current;
	        queueTail = current;
	        self.saturated();
	      }
	    } else {
	      _running++;
	      worker.call(context, current.value, current.worked);
	    }
	  }

	  function release (holder) {
	    if (holder) {
	      cache.release(holder);
	    }
	    var next = queueHead;
	    if (next && _running <= _concurrency) {
	      if (!self.paused) {
	        if (queueTail === queueHead) {
	          queueTail = null;
	        }
	        queueHead = next.next;
	        next.next = null;
	        worker.call(context, next.value, next.worked);
	        if (queueTail === null) {
	          self.empty();
	        }
	      } else {
	        _running--;
	      }
	    } else if (--_running === 0) {
	      self.drain();
	    }
	  }

	  function kill () {
	    queueHead = null;
	    queueTail = null;
	    self.drain = noop;
	  }

	  function killAndDrain () {
	    queueHead = null;
	    queueTail = null;
	    self.drain();
	    self.drain = noop;
	  }

	  function abort () {
	    var current = queueHead;
	    queueHead = null;
	    queueTail = null;

	    while (current) {
	      var next = current.next;
	      var callback = current.callback;
	      var errorHandler = current.errorHandler;
	      var val = current.value;
	      var context = current.context;

	      // Reset the task state
	      current.value = null;
	      current.callback = noop;
	      current.errorHandler = null;

	      // Call error handler if present
	      if (errorHandler) {
	        errorHandler(new Error('abort'), val);
	      }

	      // Call callback with error
	      callback.call(context, new Error('abort'));

	      // Release the task back to the pool
	      current.release(current);

	      current = next;
	    }

	    self.drain = noop;
	  }

	  function error (handler) {
	    errorHandler = handler;
	  }
	}

	function noop () {}

	function Task () {
	  this.value = null;
	  this.callback = noop;
	  this.next = null;
	  this.release = noop;
	  this.context = null;
	  this.errorHandler = null;

	  var self = this;

	  this.worked = function worked (err, result) {
	    var callback = self.callback;
	    var errorHandler = self.errorHandler;
	    var val = self.value;
	    self.value = null;
	    self.callback = noop;
	    if (self.errorHandler) {
	      errorHandler(err, val);
	    }
	    callback.call(self.context, err, result);
	    self.release(self);
	  };
	}

	function queueAsPromised (context, worker, _concurrency) {
	  if (typeof context === 'function') {
	    _concurrency = worker;
	    worker = context;
	    context = null;
	  }

	  function asyncWrapper (arg, cb) {
	    worker.call(this, arg)
	      .then(function (res) {
	        cb(null, res);
	      }, cb);
	  }

	  var queue = fastqueue(context, asyncWrapper, _concurrency);

	  var pushCb = queue.push;
	  var unshiftCb = queue.unshift;

	  queue.push = push;
	  queue.unshift = unshift;
	  queue.drained = drained;

	  return queue

	  function push (value) {
	    var p = new Promise(function (resolve, reject) {
	      pushCb(value, function (err, result) {
	        if (err) {
	          reject(err);
	          return
	        }
	        resolve(result);
	      });
	    });

	    // Let's fork the promise chain to
	    // make the error bubble up to the user but
	    // not lead to a unhandledRejection
	    p.catch(noop);

	    return p
	  }

	  function unshift (value) {
	    var p = new Promise(function (resolve, reject) {
	      unshiftCb(value, function (err, result) {
	        if (err) {
	          reject(err);
	          return
	        }
	        resolve(result);
	      });
	    });

	    // Let's fork the promise chain to
	    // make the error bubble up to the user but
	    // not lead to a unhandledRejection
	    p.catch(noop);

	    return p
	  }

	  function drained () {
	    var p = new Promise(function (resolve) {
	      process.nextTick(function () {
	        if (queue.idle()) {
	          resolve();
	        } else {
	          var previousDrain = queue.drain;
	          queue.drain = function () {
	            if (typeof previousDrain === 'function') previousDrain();
	            resolve();
	            queue.drain = previousDrain;
	          };
	        }
	      });
	    });

	    return p
	  }
	}

	queue.exports = fastqueue;
	queue.exports.promise = queueAsPromised;
	return queue.exports;
}

var common = {};

var hasRequiredCommon;

function requireCommon () {
	if (hasRequiredCommon) return common;
	hasRequiredCommon = 1;
	Object.defineProperty(common, "__esModule", { value: true });
	common.joinPathSegments = common.replacePathSegmentSeparator = common.isAppliedFilter = common.isFatalError = void 0;
	function isFatalError(settings, error) {
	    if (settings.errorFilter === null) {
	        return true;
	    }
	    return !settings.errorFilter(error);
	}
	common.isFatalError = isFatalError;
	function isAppliedFilter(filter, value) {
	    return filter === null || filter(value);
	}
	common.isAppliedFilter = isAppliedFilter;
	function replacePathSegmentSeparator(filepath, separator) {
	    return filepath.split(/[/\\]/).join(separator);
	}
	common.replacePathSegmentSeparator = replacePathSegmentSeparator;
	function joinPathSegments(a, b, separator) {
	    if (a === '') {
	        return b;
	    }
	    /**
	     * The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
	     */
	    if (a.endsWith(separator)) {
	        return a + b;
	    }
	    return a + separator + b;
	}
	common.joinPathSegments = joinPathSegments;
	return common;
}

var reader$1 = {};

var hasRequiredReader$1;

function requireReader$1 () {
	if (hasRequiredReader$1) return reader$1;
	hasRequiredReader$1 = 1;
	Object.defineProperty(reader$1, "__esModule", { value: true });
	const common = requireCommon();
	class Reader {
	    constructor(_root, _settings) {
	        this._root = _root;
	        this._settings = _settings;
	        this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
	    }
	}
	reader$1.default = Reader;
	return reader$1;
}

var hasRequiredAsync$3;

function requireAsync$3 () {
	if (hasRequiredAsync$3) return async$2;
	hasRequiredAsync$3 = 1;
	Object.defineProperty(async$2, "__esModule", { value: true });
	const events_1 = require$$0$3;
	const fsScandir = requireOut$2();
	const fastq = requireQueue();
	const common = requireCommon();
	const reader_1 = requireReader$1();
	class AsyncReader extends reader_1.default {
	    constructor(_root, _settings) {
	        super(_root, _settings);
	        this._settings = _settings;
	        this._scandir = fsScandir.scandir;
	        this._emitter = new events_1.EventEmitter();
	        this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
	        this._isFatalError = false;
	        this._isDestroyed = false;
	        this._queue.drain = () => {
	            if (!this._isFatalError) {
	                this._emitter.emit('end');
	            }
	        };
	    }
	    read() {
	        this._isFatalError = false;
	        this._isDestroyed = false;
	        setImmediate(() => {
	            this._pushToQueue(this._root, this._settings.basePath);
	        });
	        return this._emitter;
	    }
	    get isDestroyed() {
	        return this._isDestroyed;
	    }
	    destroy() {
	        if (this._isDestroyed) {
	            throw new Error('The reader is already destroyed');
	        }
	        this._isDestroyed = true;
	        this._queue.killAndDrain();
	    }
	    onEntry(callback) {
	        this._emitter.on('entry', callback);
	    }
	    onError(callback) {
	        this._emitter.once('error', callback);
	    }
	    onEnd(callback) {
	        this._emitter.once('end', callback);
	    }
	    _pushToQueue(directory, base) {
	        const queueItem = { directory, base };
	        this._queue.push(queueItem, (error) => {
	            if (error !== null) {
	                this._handleError(error);
	            }
	        });
	    }
	    _worker(item, done) {
	        this._scandir(item.directory, this._settings.fsScandirSettings, (error, entries) => {
	            if (error !== null) {
	                done(error, undefined);
	                return;
	            }
	            for (const entry of entries) {
	                this._handleEntry(entry, item.base);
	            }
	            done(null, undefined);
	        });
	    }
	    _handleError(error) {
	        if (this._isDestroyed || !common.isFatalError(this._settings, error)) {
	            return;
	        }
	        this._isFatalError = true;
	        this._isDestroyed = true;
	        this._emitter.emit('error', error);
	    }
	    _handleEntry(entry, base) {
	        if (this._isDestroyed || this._isFatalError) {
	            return;
	        }
	        const fullpath = entry.path;
	        if (base !== undefined) {
	            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
	        }
	        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
	            this._emitEntry(entry);
	        }
	        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
	            this._pushToQueue(fullpath, base === undefined ? undefined : entry.path);
	        }
	    }
	    _emitEntry(entry) {
	        this._emitter.emit('entry', entry);
	    }
	}
	async$2.default = AsyncReader;
	return async$2;
}

var hasRequiredAsync$2;

function requireAsync$2 () {
	if (hasRequiredAsync$2) return async$3;
	hasRequiredAsync$2 = 1;
	Object.defineProperty(async$3, "__esModule", { value: true });
	const async_1 = requireAsync$3();
	class AsyncProvider {
	    constructor(_root, _settings) {
	        this._root = _root;
	        this._settings = _settings;
	        this._reader = new async_1.default(this._root, this._settings);
	        this._storage = [];
	    }
	    read(callback) {
	        this._reader.onError((error) => {
	            callFailureCallback(callback, error);
	        });
	        this._reader.onEntry((entry) => {
	            this._storage.push(entry);
	        });
	        this._reader.onEnd(() => {
	            callSuccessCallback(callback, this._storage);
	        });
	        this._reader.read();
	    }
	}
	async$3.default = AsyncProvider;
	function callFailureCallback(callback, error) {
	    callback(error);
	}
	function callSuccessCallback(callback, entries) {
	    callback(null, entries);
	}
	return async$3;
}

var stream$2 = {};

var hasRequiredStream$2;

function requireStream$2 () {
	if (hasRequiredStream$2) return stream$2;
	hasRequiredStream$2 = 1;
	Object.defineProperty(stream$2, "__esModule", { value: true });
	const stream_1 = require$$0$2;
	const async_1 = requireAsync$3();
	class StreamProvider {
	    constructor(_root, _settings) {
	        this._root = _root;
	        this._settings = _settings;
	        this._reader = new async_1.default(this._root, this._settings);
	        this._stream = new stream_1.Readable({
	            objectMode: true,
	            read: () => { },
	            destroy: () => {
	                if (!this._reader.isDestroyed) {
	                    this._reader.destroy();
	                }
	            }
	        });
	    }
	    read() {
	        this._reader.onError((error) => {
	            this._stream.emit('error', error);
	        });
	        this._reader.onEntry((entry) => {
	            this._stream.push(entry);
	        });
	        this._reader.onEnd(() => {
	            this._stream.push(null);
	        });
	        this._reader.read();
	        return this._stream;
	    }
	}
	stream$2.default = StreamProvider;
	return stream$2;
}

var sync$3 = {};

var sync$2 = {};

var hasRequiredSync$3;

function requireSync$3 () {
	if (hasRequiredSync$3) return sync$2;
	hasRequiredSync$3 = 1;
	Object.defineProperty(sync$2, "__esModule", { value: true });
	const fsScandir = requireOut$2();
	const common = requireCommon();
	const reader_1 = requireReader$1();
	class SyncReader extends reader_1.default {
	    constructor() {
	        super(...arguments);
	        this._scandir = fsScandir.scandirSync;
	        this._storage = [];
	        this._queue = new Set();
	    }
	    read() {
	        this._pushToQueue(this._root, this._settings.basePath);
	        this._handleQueue();
	        return this._storage;
	    }
	    _pushToQueue(directory, base) {
	        this._queue.add({ directory, base });
	    }
	    _handleQueue() {
	        for (const item of this._queue.values()) {
	            this._handleDirectory(item.directory, item.base);
	        }
	    }
	    _handleDirectory(directory, base) {
	        try {
	            const entries = this._scandir(directory, this._settings.fsScandirSettings);
	            for (const entry of entries) {
	                this._handleEntry(entry, base);
	            }
	        }
	        catch (error) {
	            this._handleError(error);
	        }
	    }
	    _handleError(error) {
	        if (!common.isFatalError(this._settings, error)) {
	            return;
	        }
	        throw error;
	    }
	    _handleEntry(entry, base) {
	        const fullpath = entry.path;
	        if (base !== undefined) {
	            entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
	        }
	        if (common.isAppliedFilter(this._settings.entryFilter, entry)) {
	            this._pushToStorage(entry);
	        }
	        if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) {
	            this._pushToQueue(fullpath, base === undefined ? undefined : entry.path);
	        }
	    }
	    _pushToStorage(entry) {
	        this._storage.push(entry);
	    }
	}
	sync$2.default = SyncReader;
	return sync$2;
}

var hasRequiredSync$2;

function requireSync$2 () {
	if (hasRequiredSync$2) return sync$3;
	hasRequiredSync$2 = 1;
	Object.defineProperty(sync$3, "__esModule", { value: true });
	const sync_1 = requireSync$3();
	class SyncProvider {
	    constructor(_root, _settings) {
	        this._root = _root;
	        this._settings = _settings;
	        this._reader = new sync_1.default(this._root, this._settings);
	    }
	    read() {
	        return this._reader.read();
	    }
	}
	sync$3.default = SyncProvider;
	return sync$3;
}

var settings$1 = {};

var hasRequiredSettings$1;

function requireSettings$1 () {
	if (hasRequiredSettings$1) return settings$1;
	hasRequiredSettings$1 = 1;
	Object.defineProperty(settings$1, "__esModule", { value: true });
	const path = path$2;
	const fsScandir = requireOut$2();
	class Settings {
	    constructor(_options = {}) {
	        this._options = _options;
	        this.basePath = this._getValue(this._options.basePath, undefined);
	        this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
	        this.deepFilter = this._getValue(this._options.deepFilter, null);
	        this.entryFilter = this._getValue(this._options.entryFilter, null);
	        this.errorFilter = this._getValue(this._options.errorFilter, null);
	        this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path.sep);
	        this.fsScandirSettings = new fsScandir.Settings({
	            followSymbolicLinks: this._options.followSymbolicLinks,
	            fs: this._options.fs,
	            pathSegmentSeparator: this._options.pathSegmentSeparator,
	            stats: this._options.stats,
	            throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
	        });
	    }
	    _getValue(option, value) {
	        return option !== null && option !== void 0 ? option : value;
	    }
	}
	settings$1.default = Settings;
	return settings$1;
}

var hasRequiredOut$1;

function requireOut$1 () {
	if (hasRequiredOut$1) return out$3;
	hasRequiredOut$1 = 1;
	Object.defineProperty(out$3, "__esModule", { value: true });
	out$3.Settings = out$3.walkStream = out$3.walkSync = out$3.walk = void 0;
	const async_1 = requireAsync$2();
	const stream_1 = requireStream$2();
	const sync_1 = requireSync$2();
	const settings_1 = requireSettings$1();
	out$3.Settings = settings_1.default;
	function walk(directory, optionsOrSettingsOrCallback, callback) {
	    if (typeof optionsOrSettingsOrCallback === 'function') {
	        new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
	        return;
	    }
	    new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
	}
	out$3.walk = walk;
	function walkSync(directory, optionsOrSettings) {
	    const settings = getSettings(optionsOrSettings);
	    const provider = new sync_1.default(directory, settings);
	    return provider.read();
	}
	out$3.walkSync = walkSync;
	function walkStream(directory, optionsOrSettings) {
	    const settings = getSettings(optionsOrSettings);
	    const provider = new stream_1.default(directory, settings);
	    return provider.read();
	}
	out$3.walkStream = walkStream;
	function getSettings(settingsOrOptions = {}) {
	    if (settingsOrOptions instanceof settings_1.default) {
	        return settingsOrOptions;
	    }
	    return new settings_1.default(settingsOrOptions);
	}
	return out$3;
}

var reader = {};

var hasRequiredReader;

function requireReader () {
	if (hasRequiredReader) return reader;
	hasRequiredReader = 1;
	Object.defineProperty(reader, "__esModule", { value: true });
	const path = path$2;
	const fsStat = requireOut$3();
	const utils = requireUtils$1();
	class Reader {
	    constructor(_settings) {
	        this._settings = _settings;
	        this._fsStatSettings = new fsStat.Settings({
	            followSymbolicLink: this._settings.followSymbolicLinks,
	            fs: this._settings.fs,
	            throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
	        });
	    }
	    _getFullEntryPath(filepath) {
	        return path.resolve(this._settings.cwd, filepath);
	    }
	    _makeEntry(stats, pattern) {
	        const entry = {
	            name: pattern,
	            path: pattern,
	            dirent: utils.fs.createDirentFromStats(pattern, stats)
	        };
	        if (this._settings.stats) {
	            entry.stats = stats;
	        }
	        return entry;
	    }
	    _isFatalError(error) {
	        return !utils.errno.isEnoentCodeError(error) && !this._settings.suppressErrors;
	    }
	}
	reader.default = Reader;
	return reader;
}

var stream$1 = {};

var hasRequiredStream$1;

function requireStream$1 () {
	if (hasRequiredStream$1) return stream$1;
	hasRequiredStream$1 = 1;
	Object.defineProperty(stream$1, "__esModule", { value: true });
	const stream_1 = require$$0$2;
	const fsStat = requireOut$3();
	const fsWalk = requireOut$1();
	const reader_1 = requireReader();
	class ReaderStream extends reader_1.default {
	    constructor() {
	        super(...arguments);
	        this._walkStream = fsWalk.walkStream;
	        this._stat = fsStat.stat;
	    }
	    dynamic(root, options) {
	        return this._walkStream(root, options);
	    }
	    static(patterns, options) {
	        const filepaths = patterns.map(this._getFullEntryPath, this);
	        const stream = new stream_1.PassThrough({ objectMode: true });
	        stream._write = (index, _enc, done) => {
	            return this._getEntry(filepaths[index], patterns[index], options)
	                .then((entry) => {
	                if (entry !== null && options.entryFilter(entry)) {
	                    stream.push(entry);
	                }
	                if (index === filepaths.length - 1) {
	                    stream.end();
	                }
	                done();
	            })
	                .catch(done);
	        };
	        for (let i = 0; i < filepaths.length; i++) {
	            stream.write(i);
	        }
	        return stream;
	    }
	    _getEntry(filepath, pattern, options) {
	        return this._getStat(filepath)
	            .then((stats) => this._makeEntry(stats, pattern))
	            .catch((error) => {
	            if (options.errorFilter(error)) {
	                return null;
	            }
	            throw error;
	        });
	    }
	    _getStat(filepath) {
	        return new Promise((resolve, reject) => {
	            this._stat(filepath, this._fsStatSettings, (error, stats) => {
	                return error === null ? resolve(stats) : reject(error);
	            });
	        });
	    }
	}
	stream$1.default = ReaderStream;
	return stream$1;
}

var hasRequiredAsync$1;

function requireAsync$1 () {
	if (hasRequiredAsync$1) return async$4;
	hasRequiredAsync$1 = 1;
	Object.defineProperty(async$4, "__esModule", { value: true });
	const fsWalk = requireOut$1();
	const reader_1 = requireReader();
	const stream_1 = requireStream$1();
	class ReaderAsync extends reader_1.default {
	    constructor() {
	        super(...arguments);
	        this._walkAsync = fsWalk.walk;
	        this._readerStream = new stream_1.default(this._settings);
	    }
	    dynamic(root, options) {
	        return new Promise((resolve, reject) => {
	            this._walkAsync(root, options, (error, entries) => {
	                if (error === null) {
	                    resolve(entries);
	                }
	                else {
	                    reject(error);
	                }
	            });
	        });
	    }
	    async static(patterns, options) {
	        const entries = [];
	        const stream = this._readerStream.static(patterns, options);
	        // After #235, replace it with an asynchronous iterator.
	        return new Promise((resolve, reject) => {
	            stream.once('error', reject);
	            stream.on('data', (entry) => entries.push(entry));
	            stream.once('end', () => resolve(entries));
	        });
	    }
	}
	async$4.default = ReaderAsync;
	return async$4;
}

var provider = {};

var deep = {};

var partial = {};

var matcher = {};

var hasRequiredMatcher;

function requireMatcher () {
	if (hasRequiredMatcher) return matcher;
	hasRequiredMatcher = 1;
	Object.defineProperty(matcher, "__esModule", { value: true });
	const utils = requireUtils$1();
	class Matcher {
	    constructor(_patterns, _settings, _micromatchOptions) {
	        this._patterns = _patterns;
	        this._settings = _settings;
	        this._micromatchOptions = _micromatchOptions;
	        this._storage = [];
	        this._fillStorage();
	    }
	    _fillStorage() {
	        for (const pattern of this._patterns) {
	            const segments = this._getPatternSegments(pattern);
	            const sections = this._splitSegmentsIntoSections(segments);
	            this._storage.push({
	                complete: sections.length <= 1,
	                pattern,
	                segments,
	                sections
	            });
	        }
	    }
	    _getPatternSegments(pattern) {
	        const parts = utils.pattern.getPatternParts(pattern, this._micromatchOptions);
	        return parts.map((part) => {
	            const dynamic = utils.pattern.isDynamicPattern(part, this._settings);
	            if (!dynamic) {
	                return {
	                    dynamic: false,
	                    pattern: part
	                };
	            }
	            return {
	                dynamic: true,
	                pattern: part,
	                patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
	            };
	        });
	    }
	    _splitSegmentsIntoSections(segments) {
	        return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
	    }
	}
	matcher.default = Matcher;
	return matcher;
}

var hasRequiredPartial;

function requirePartial () {
	if (hasRequiredPartial) return partial;
	hasRequiredPartial = 1;
	Object.defineProperty(partial, "__esModule", { value: true });
	const matcher_1 = requireMatcher();
	class PartialMatcher extends matcher_1.default {
	    match(filepath) {
	        const parts = filepath.split('/');
	        const levels = parts.length;
	        const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
	        for (const pattern of patterns) {
	            const section = pattern.sections[0];
	            /**
	             * In this case, the pattern has a globstar and we must read all directories unconditionally,
	             * but only if the level has reached the end of the first group.
	             *
	             * fixtures/{a,b}/**
	             *  ^ true/false  ^ always true
	            */
	            if (!pattern.complete && levels > section.length) {
	                return true;
	            }
	            const match = parts.every((part, index) => {
	                const segment = pattern.segments[index];
	                if (segment.dynamic && segment.patternRe.test(part)) {
	                    return true;
	                }
	                if (!segment.dynamic && segment.pattern === part) {
	                    return true;
	                }
	                return false;
	            });
	            if (match) {
	                return true;
	            }
	        }
	        return false;
	    }
	}
	partial.default = PartialMatcher;
	return partial;
}

var hasRequiredDeep;

function requireDeep () {
	if (hasRequiredDeep) return deep;
	hasRequiredDeep = 1;
	Object.defineProperty(deep, "__esModule", { value: true });
	const utils = requireUtils$1();
	const partial_1 = requirePartial();
	class DeepFilter {
	    constructor(_settings, _micromatchOptions) {
	        this._settings = _settings;
	        this._micromatchOptions = _micromatchOptions;
	    }
	    getFilter(basePath, positive, negative) {
	        const matcher = this._getMatcher(positive);
	        const negativeRe = this._getNegativePatternsRe(negative);
	        return (entry) => this._filter(basePath, entry, matcher, negativeRe);
	    }
	    _getMatcher(patterns) {
	        return new partial_1.default(patterns, this._settings, this._micromatchOptions);
	    }
	    _getNegativePatternsRe(patterns) {
	        const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
	        return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
	    }
	    _filter(basePath, entry, matcher, negativeRe) {
	        if (this._isSkippedByDeep(basePath, entry.path)) {
	            return false;
	        }
	        if (this._isSkippedSymbolicLink(entry)) {
	            return false;
	        }
	        const filepath = utils.path.removeLeadingDotSegment(entry.path);
	        if (this._isSkippedByPositivePatterns(filepath, matcher)) {
	            return false;
	        }
	        return this._isSkippedByNegativePatterns(filepath, negativeRe);
	    }
	    _isSkippedByDeep(basePath, entryPath) {
	        /**
	         * Avoid unnecessary depth calculations when it doesn't matter.
	         */
	        if (this._settings.deep === Infinity) {
	            return false;
	        }
	        return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
	    }
	    _getEntryLevel(basePath, entryPath) {
	        const entryPathDepth = entryPath.split('/').length;
	        if (basePath === '') {
	            return entryPathDepth;
	        }
	        const basePathDepth = basePath.split('/').length;
	        return entryPathDepth - basePathDepth;
	    }
	    _isSkippedSymbolicLink(entry) {
	        return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
	    }
	    _isSkippedByPositivePatterns(entryPath, matcher) {
	        return !this._settings.baseNameMatch && !matcher.match(entryPath);
	    }
	    _isSkippedByNegativePatterns(entryPath, patternsRe) {
	        return !utils.pattern.matchAny(entryPath, patternsRe);
	    }
	}
	deep.default = DeepFilter;
	return deep;
}

var entry$1 = {};

var hasRequiredEntry$1;

function requireEntry$1 () {
	if (hasRequiredEntry$1) return entry$1;
	hasRequiredEntry$1 = 1;
	Object.defineProperty(entry$1, "__esModule", { value: true });
	const utils = requireUtils$1();
	class EntryFilter {
	    constructor(_settings, _micromatchOptions) {
	        this._settings = _settings;
	        this._micromatchOptions = _micromatchOptions;
	        this.index = new Map();
	    }
	    getFilter(positive, negative) {
	        const [absoluteNegative, relativeNegative] = utils.pattern.partitionAbsoluteAndRelative(negative);
	        const patterns = {
	            positive: {
	                all: utils.pattern.convertPatternsToRe(positive, this._micromatchOptions)
	            },
	            negative: {
	                absolute: utils.pattern.convertPatternsToRe(absoluteNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true })),
	                relative: utils.pattern.convertPatternsToRe(relativeNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }))
	            }
	        };
	        return (entry) => this._filter(entry, patterns);
	    }
	    _filter(entry, patterns) {
	        const filepath = utils.path.removeLeadingDotSegment(entry.path);
	        if (this._settings.unique && this._isDuplicateEntry(filepath)) {
	            return false;
	        }
	        if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) {
	            return false;
	        }
	        const isMatched = this._isMatchToPatternsSet(filepath, patterns, entry.dirent.isDirectory());
	        if (this._settings.unique && isMatched) {
	            this._createIndexRecord(filepath);
	        }
	        return isMatched;
	    }
	    _isDuplicateEntry(filepath) {
	        return this.index.has(filepath);
	    }
	    _createIndexRecord(filepath) {
	        this.index.set(filepath, undefined);
	    }
	    _onlyFileFilter(entry) {
	        return this._settings.onlyFiles && !entry.dirent.isFile();
	    }
	    _onlyDirectoryFilter(entry) {
	        return this._settings.onlyDirectories && !entry.dirent.isDirectory();
	    }
	    _isMatchToPatternsSet(filepath, patterns, isDirectory) {
	        const isMatched = this._isMatchToPatterns(filepath, patterns.positive.all, isDirectory);
	        if (!isMatched) {
	            return false;
	        }
	        const isMatchedByRelativeNegative = this._isMatchToPatterns(filepath, patterns.negative.relative, isDirectory);
	        if (isMatchedByRelativeNegative) {
	            return false;
	        }
	        const isMatchedByAbsoluteNegative = this._isMatchToAbsoluteNegative(filepath, patterns.negative.absolute, isDirectory);
	        if (isMatchedByAbsoluteNegative) {
	            return false;
	        }
	        return true;
	    }
	    _isMatchToAbsoluteNegative(filepath, patternsRe, isDirectory) {
	        if (patternsRe.length === 0) {
	            return false;
	        }
	        const fullpath = utils.path.makeAbsolute(this._settings.cwd, filepath);
	        return this._isMatchToPatterns(fullpath, patternsRe, isDirectory);
	    }
	    _isMatchToPatterns(filepath, patternsRe, isDirectory) {
	        if (patternsRe.length === 0) {
	            return false;
	        }
	        // Trying to match files and directories by patterns.
	        const isMatched = utils.pattern.matchAny(filepath, patternsRe);
	        // A pattern with a trailling slash can be used for directory matching.
	        // To apply such pattern, we need to add a tralling slash to the path.
	        if (!isMatched && isDirectory) {
	            return utils.pattern.matchAny(filepath + '/', patternsRe);
	        }
	        return isMatched;
	    }
	}
	entry$1.default = EntryFilter;
	return entry$1;
}

var error = {};

var hasRequiredError;

function requireError () {
	if (hasRequiredError) return error;
	hasRequiredError = 1;
	Object.defineProperty(error, "__esModule", { value: true });
	const utils = requireUtils$1();
	class ErrorFilter {
	    constructor(_settings) {
	        this._settings = _settings;
	    }
	    getFilter() {
	        return (error) => this._isNonFatalError(error);
	    }
	    _isNonFatalError(error) {
	        return utils.errno.isEnoentCodeError(error) || this._settings.suppressErrors;
	    }
	}
	error.default = ErrorFilter;
	return error;
}

var entry = {};

var hasRequiredEntry;

function requireEntry () {
	if (hasRequiredEntry) return entry;
	hasRequiredEntry = 1;
	Object.defineProperty(entry, "__esModule", { value: true });
	const utils = requireUtils$1();
	class EntryTransformer {
	    constructor(_settings) {
	        this._settings = _settings;
	    }
	    getTransformer() {
	        return (entry) => this._transform(entry);
	    }
	    _transform(entry) {
	        let filepath = entry.path;
	        if (this._settings.absolute) {
	            filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
	            filepath = utils.path.unixify(filepath);
	        }
	        if (this._settings.markDirectories && entry.dirent.isDirectory()) {
	            filepath += '/';
	        }
	        if (!this._settings.objectMode) {
	            return filepath;
	        }
	        return Object.assign(Object.assign({}, entry), { path: filepath });
	    }
	}
	entry.default = EntryTransformer;
	return entry;
}

var hasRequiredProvider;

function requireProvider () {
	if (hasRequiredProvider) return provider;
	hasRequiredProvider = 1;
	Object.defineProperty(provider, "__esModule", { value: true });
	const path = path$2;
	const deep_1 = requireDeep();
	const entry_1 = requireEntry$1();
	const error_1 = requireError();
	const entry_2 = requireEntry();
	class Provider {
	    constructor(_settings) {
	        this._settings = _settings;
	        this.errorFilter = new error_1.default(this._settings);
	        this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
	        this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
	        this.entryTransformer = new entry_2.default(this._settings);
	    }
	    _getRootDirectory(task) {
	        return path.resolve(this._settings.cwd, task.base);
	    }
	    _getReaderOptions(task) {
	        const basePath = task.base === '.' ? '' : task.base;
	        return {
	            basePath,
	            pathSegmentSeparator: '/',
	            concurrency: this._settings.concurrency,
	            deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
	            entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
	            errorFilter: this.errorFilter.getFilter(),
	            followSymbolicLinks: this._settings.followSymbolicLinks,
	            fs: this._settings.fs,
	            stats: this._settings.stats,
	            throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
	            transform: this.entryTransformer.getTransformer()
	        };
	    }
	    _getMicromatchOptions() {
	        return {
	            dot: this._settings.dot,
	            matchBase: this._settings.baseNameMatch,
	            nobrace: !this._settings.braceExpansion,
	            nocase: !this._settings.caseSensitiveMatch,
	            noext: !this._settings.extglob,
	            noglobstar: !this._settings.globstar,
	            posix: true,
	            strictSlashes: false
	        };
	    }
	}
	provider.default = Provider;
	return provider;
}

var hasRequiredAsync;

function requireAsync () {
	if (hasRequiredAsync) return async$5;
	hasRequiredAsync = 1;
	Object.defineProperty(async$5, "__esModule", { value: true });
	const async_1 = requireAsync$1();
	const provider_1 = requireProvider();
	class ProviderAsync extends provider_1.default {
	    constructor() {
	        super(...arguments);
	        this._reader = new async_1.default(this._settings);
	    }
	    async read(task) {
	        const root = this._getRootDirectory(task);
	        const options = this._getReaderOptions(task);
	        const entries = await this.api(root, task, options);
	        return entries.map((entry) => options.transform(entry));
	    }
	    api(root, task, options) {
	        if (task.dynamic) {
	            return this._reader.dynamic(root, options);
	        }
	        return this._reader.static(task.patterns, options);
	    }
	}
	async$5.default = ProviderAsync;
	return async$5;
}

var stream = {};

var hasRequiredStream;

function requireStream () {
	if (hasRequiredStream) return stream;
	hasRequiredStream = 1;
	Object.defineProperty(stream, "__esModule", { value: true });
	const stream_1 = require$$0$2;
	const stream_2 = requireStream$1();
	const provider_1 = requireProvider();
	class ProviderStream extends provider_1.default {
	    constructor() {
	        super(...arguments);
	        this._reader = new stream_2.default(this._settings);
	    }
	    read(task) {
	        const root = this._getRootDirectory(task);
	        const options = this._getReaderOptions(task);
	        const source = this.api(root, task, options);
	        const destination = new stream_1.Readable({ objectMode: true, read: () => { } });
	        source
	            .once('error', (error) => destination.emit('error', error))
	            .on('data', (entry) => destination.emit('data', options.transform(entry)))
	            .once('end', () => destination.emit('end'));
	        destination
	            .once('close', () => source.destroy());
	        return destination;
	    }
	    api(root, task, options) {
	        if (task.dynamic) {
	            return this._reader.dynamic(root, options);
	        }
	        return this._reader.static(task.patterns, options);
	    }
	}
	stream.default = ProviderStream;
	return stream;
}

var sync$1 = {};

var sync = {};

var hasRequiredSync$1;

function requireSync$1 () {
	if (hasRequiredSync$1) return sync;
	hasRequiredSync$1 = 1;
	Object.defineProperty(sync, "__esModule", { value: true });
	const fsStat = requireOut$3();
	const fsWalk = requireOut$1();
	const reader_1 = requireReader();
	class ReaderSync extends reader_1.default {
	    constructor() {
	        super(...arguments);
	        this._walkSync = fsWalk.walkSync;
	        this._statSync = fsStat.statSync;
	    }
	    dynamic(root, options) {
	        return this._walkSync(root, options);
	    }
	    static(patterns, options) {
	        const entries = [];
	        for (const pattern of patterns) {
	            const filepath = this._getFullEntryPath(pattern);
	            const entry = this._getEntry(filepath, pattern, options);
	            if (entry === null || !options.entryFilter(entry)) {
	                continue;
	            }
	            entries.push(entry);
	        }
	        return entries;
	    }
	    _getEntry(filepath, pattern, options) {
	        try {
	            const stats = this._getStat(filepath);
	            return this._makeEntry(stats, pattern);
	        }
	        catch (error) {
	            if (options.errorFilter(error)) {
	                return null;
	            }
	            throw error;
	        }
	    }
	    _getStat(filepath) {
	        return this._statSync(filepath, this._fsStatSettings);
	    }
	}
	sync.default = ReaderSync;
	return sync;
}

var hasRequiredSync;

function requireSync () {
	if (hasRequiredSync) return sync$1;
	hasRequiredSync = 1;
	Object.defineProperty(sync$1, "__esModule", { value: true });
	const sync_1 = requireSync$1();
	const provider_1 = requireProvider();
	class ProviderSync extends provider_1.default {
	    constructor() {
	        super(...arguments);
	        this._reader = new sync_1.default(this._settings);
	    }
	    read(task) {
	        const root = this._getRootDirectory(task);
	        const options = this._getReaderOptions(task);
	        const entries = this.api(root, task, options);
	        return entries.map(options.transform);
	    }
	    api(root, task, options) {
	        if (task.dynamic) {
	            return this._reader.dynamic(root, options);
	        }
	        return this._reader.static(task.patterns, options);
	    }
	}
	sync$1.default = ProviderSync;
	return sync$1;
}

var settings = {};

var hasRequiredSettings;

function requireSettings () {
	if (hasRequiredSettings) return settings;
	hasRequiredSettings = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
		const fs = fs$4;
		const os = require$$0;
		/**
		 * The `os.cpus` method can return zero. We expect the number of cores to be greater than zero.
		 * https://github.com/nodejs/node/blob/7faeddf23a98c53896f8b574a6e66589e8fb1eb8/lib/os.js#L106-L107
		 */
		const CPU_COUNT = Math.max(os.cpus().length, 1);
		exports$1.DEFAULT_FILE_SYSTEM_ADAPTER = {
		    lstat: fs.lstat,
		    lstatSync: fs.lstatSync,
		    stat: fs.stat,
		    statSync: fs.statSync,
		    readdir: fs.readdir,
		    readdirSync: fs.readdirSync
		};
		class Settings {
		    constructor(_options = {}) {
		        this._options = _options;
		        this.absolute = this._getValue(this._options.absolute, false);
		        this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
		        this.braceExpansion = this._getValue(this._options.braceExpansion, true);
		        this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
		        this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
		        this.cwd = this._getValue(this._options.cwd, process.cwd());
		        this.deep = this._getValue(this._options.deep, Infinity);
		        this.dot = this._getValue(this._options.dot, false);
		        this.extglob = this._getValue(this._options.extglob, true);
		        this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
		        this.fs = this._getFileSystemMethods(this._options.fs);
		        this.globstar = this._getValue(this._options.globstar, true);
		        this.ignore = this._getValue(this._options.ignore, []);
		        this.markDirectories = this._getValue(this._options.markDirectories, false);
		        this.objectMode = this._getValue(this._options.objectMode, false);
		        this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
		        this.onlyFiles = this._getValue(this._options.onlyFiles, true);
		        this.stats = this._getValue(this._options.stats, false);
		        this.suppressErrors = this._getValue(this._options.suppressErrors, false);
		        this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
		        this.unique = this._getValue(this._options.unique, true);
		        if (this.onlyDirectories) {
		            this.onlyFiles = false;
		        }
		        if (this.stats) {
		            this.objectMode = true;
		        }
		        // Remove the cast to the array in the next major (#404).
		        this.ignore = [].concat(this.ignore);
		    }
		    _getValue(option, value) {
		        return option === undefined ? value : option;
		    }
		    _getFileSystemMethods(methods = {}) {
		        return Object.assign(Object.assign({}, exports$1.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
		    }
		}
		exports$1.default = Settings; 
	} (settings));
	return settings;
}

var out;
var hasRequiredOut;

function requireOut () {
	if (hasRequiredOut) return out;
	hasRequiredOut = 1;
	const taskManager = requireTasks();
	const async_1 = requireAsync();
	const stream_1 = requireStream();
	const sync_1 = requireSync();
	const settings_1 = requireSettings();
	const utils = requireUtils$1();
	async function FastGlob(source, options) {
	    assertPatternsInput(source);
	    const works = getWorks(source, async_1.default, options);
	    const result = await Promise.all(works);
	    return utils.array.flatten(result);
	}
	// https://github.com/typescript-eslint/typescript-eslint/issues/60
	// eslint-disable-next-line no-redeclare
	(function (FastGlob) {
	    FastGlob.glob = FastGlob;
	    FastGlob.globSync = sync;
	    FastGlob.globStream = stream;
	    FastGlob.async = FastGlob;
	    function sync(source, options) {
	        assertPatternsInput(source);
	        const works = getWorks(source, sync_1.default, options);
	        return utils.array.flatten(works);
	    }
	    FastGlob.sync = sync;
	    function stream(source, options) {
	        assertPatternsInput(source);
	        const works = getWorks(source, stream_1.default, options);
	        /**
	         * The stream returned by the provider cannot work with an asynchronous iterator.
	         * To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
	         * This affects performance (+25%). I don't see best solution right now.
	         */
	        return utils.stream.merge(works);
	    }
	    FastGlob.stream = stream;
	    function generateTasks(source, options) {
	        assertPatternsInput(source);
	        const patterns = [].concat(source);
	        const settings = new settings_1.default(options);
	        return taskManager.generate(patterns, settings);
	    }
	    FastGlob.generateTasks = generateTasks;
	    function isDynamicPattern(source, options) {
	        assertPatternsInput(source);
	        const settings = new settings_1.default(options);
	        return utils.pattern.isDynamicPattern(source, settings);
	    }
	    FastGlob.isDynamicPattern = isDynamicPattern;
	    function escapePath(source) {
	        assertPatternsInput(source);
	        return utils.path.escape(source);
	    }
	    FastGlob.escapePath = escapePath;
	    function convertPathToPattern(source) {
	        assertPatternsInput(source);
	        return utils.path.convertPathToPattern(source);
	    }
	    FastGlob.convertPathToPattern = convertPathToPattern;
	    (function (posix) {
	        function escapePath(source) {
	            assertPatternsInput(source);
	            return utils.path.escapePosixPath(source);
	        }
	        posix.escapePath = escapePath;
	        function convertPathToPattern(source) {
	            assertPatternsInput(source);
	            return utils.path.convertPosixPathToPattern(source);
	        }
	        posix.convertPathToPattern = convertPathToPattern;
	    })(FastGlob.posix || (FastGlob.posix = {}));
	    (function (win32) {
	        function escapePath(source) {
	            assertPatternsInput(source);
	            return utils.path.escapeWindowsPath(source);
	        }
	        win32.escapePath = escapePath;
	        function convertPathToPattern(source) {
	            assertPatternsInput(source);
	            return utils.path.convertWindowsPathToPattern(source);
	        }
	        win32.convertPathToPattern = convertPathToPattern;
	    })(FastGlob.win32 || (FastGlob.win32 = {}));
	})(FastGlob || (FastGlob = {}));
	function getWorks(source, _Provider, options) {
	    const patterns = [].concat(source);
	    const settings = new settings_1.default(options);
	    const tasks = taskManager.generate(patterns, settings);
	    const provider = new _Provider(settings);
	    return tasks.map(provider.read, provider);
	}
	function assertPatternsInput(input) {
	    const source = [].concat(input);
	    const isValidSource = source.every((item) => utils.string.isString(item) && !utils.string.isEmpty(item));
	    if (!isValidSource) {
	        throw new TypeError('Patterns must be a string (non empty) or an array of strings');
	    }
	}
	out = FastGlob;
	return out;
}

var outExports = requireOut();
var fg = /*@__PURE__*/getDefaultExportFromCjs(outExports);

const balanced = (a, b, str) => {
    const ma = a instanceof RegExp ? maybeMatch(a, str) : a;
    const mb = b instanceof RegExp ? maybeMatch(b, str) : b;
    const r = ma !== null && mb != null && range(ma, mb, str);
    return (r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + ma.length, r[1]),
        post: str.slice(r[1] + mb.length),
    });
};
const maybeMatch = (reg, str) => {
    const m = str.match(reg);
    return m ? m[0] : null;
};
const range = (a, b, str) => {
    let begs, beg, left, right = undefined, result;
    let ai = str.indexOf(a);
    let bi = str.indexOf(b, ai + 1);
    let i = ai;
    if (ai >= 0 && bi > 0) {
        if (a === b) {
            return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
            if (i === ai) {
                begs.push(i);
                ai = str.indexOf(a, i + 1);
            }
            else if (begs.length === 1) {
                const r = begs.pop();
                if (r !== undefined)
                    result = [r, bi];
            }
            else {
                beg = begs.pop();
                if (beg !== undefined && beg < left) {
                    left = beg;
                    right = bi;
                }
                bi = str.indexOf(b, i + 1);
            }
            i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length && right !== undefined) {
            result = [left, right];
        }
    }
    return result;
};

const escSlash = '\0SLASH' + Math.random() + '\0';
const escOpen = '\0OPEN' + Math.random() + '\0';
const escClose = '\0CLOSE' + Math.random() + '\0';
const escComma = '\0COMMA' + Math.random() + '\0';
const escPeriod = '\0PERIOD' + Math.random() + '\0';
const escSlashPattern = new RegExp(escSlash, 'g');
const escOpenPattern = new RegExp(escOpen, 'g');
const escClosePattern = new RegExp(escClose, 'g');
const escCommaPattern = new RegExp(escComma, 'g');
const escPeriodPattern = new RegExp(escPeriod, 'g');
const slashPattern = /\\\\/g;
const openPattern = /\\{/g;
const closePattern = /\\}/g;
const commaPattern = /\\,/g;
const periodPattern = /\\\./g;
const EXPANSION_MAX = 100_000;
function numeric(str) {
    return !isNaN(str) ? parseInt(str, 10) : str.charCodeAt(0);
}
function escapeBraces(str) {
    return str
        .replace(slashPattern, escSlash)
        .replace(openPattern, escOpen)
        .replace(closePattern, escClose)
        .replace(commaPattern, escComma)
        .replace(periodPattern, escPeriod);
}
function unescapeBraces(str) {
    return str
        .replace(escSlashPattern, '\\')
        .replace(escOpenPattern, '{')
        .replace(escClosePattern, '}')
        .replace(escCommaPattern, ',')
        .replace(escPeriodPattern, '.');
}
/**
 * Basically just str.split(","), but handling cases
 * where we have nested braced sections, which should be
 * treated as individual members, like {a,{b,c},d}
 */
function parseCommaParts(str) {
    if (!str) {
        return [''];
    }
    const parts = [];
    const m = balanced('{', '}', str);
    if (!m) {
        return str.split(',');
    }
    const { pre, body, post } = m;
    const p = pre.split(',');
    p[p.length - 1] += '{' + body + '}';
    const postParts = parseCommaParts(post);
    if (post.length) {
        p[p.length - 1] += postParts.shift();
        p.push.apply(p, postParts);
    }
    parts.push.apply(parts, p);
    return parts;
}
function expand(str, options = {}) {
    if (!str) {
        return [];
    }
    const { max = EXPANSION_MAX } = options;
    // I don't know why Bash 4.3 does this, but it does.
    // Anything starting with {} will have the first two bytes preserved
    // but *only* at the top level, so {},a}b will not expand to anything,
    // but a{},b}c will be expanded to [a}c,abc].
    // One could argue that this is a bug in Bash, but since the goal of
    // this module is to match Bash's rules, we escape a leading {}
    if (str.slice(0, 2) === '{}') {
        str = '\\{\\}' + str.slice(2);
    }
    return expand_(escapeBraces(str), max, true).map(unescapeBraces);
}
function embrace(str) {
    return '{' + str + '}';
}
function isPadded(el) {
    return /^-?0\d/.test(el);
}
function lte(i, y) {
    return i <= y;
}
function gte(i, y) {
    return i >= y;
}
function expand_(str, max, isTop) {
    /** @type {string[]} */
    const expansions = [];
    const m = balanced('{', '}', str);
    if (!m)
        return [str];
    // no need to expand pre, since it is guaranteed to be free of brace-sets
    const pre = m.pre;
    const post = m.post.length ? expand_(m.post, max, false) : [''];
    if (/\$$/.test(m.pre)) {
        for (let k = 0; k < post.length && k < max; k++) {
            const expansion = pre + '{' + m.body + '}' + post[k];
            expansions.push(expansion);
        }
    }
    else {
        const isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
        const isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
        const isSequence = isNumericSequence || isAlphaSequence;
        const isOptions = m.body.indexOf(',') >= 0;
        if (!isSequence && !isOptions) {
            // {a},b}
            if (m.post.match(/,(?!,).*\}/)) {
                str = m.pre + '{' + m.body + escClose + m.post;
                return expand_(str, max, true);
            }
            return [str];
        }
        let n;
        if (isSequence) {
            n = m.body.split(/\.\./);
        }
        else {
            n = parseCommaParts(m.body);
            if (n.length === 1 && n[0] !== undefined) {
                // x{{a,b}}y ==> x{a}y x{b}y
                n = expand_(n[0], max, false).map(embrace);
                //XXX is this necessary? Can't seem to hit it in tests.
                /* c8 ignore start */
                if (n.length === 1) {
                    return post.map(p => m.pre + n[0] + p);
                }
                /* c8 ignore stop */
            }
        }
        // at this point, n is the parts, and we know it's not a comma set
        // with a single entry.
        let N;
        if (isSequence && n[0] !== undefined && n[1] !== undefined) {
            const x = numeric(n[0]);
            const y = numeric(n[1]);
            const width = Math.max(n[0].length, n[1].length);
            let incr = n.length === 3 && n[2] !== undefined ? Math.abs(numeric(n[2])) : 1;
            let test = lte;
            const reverse = y < x;
            if (reverse) {
                incr *= -1;
                test = gte;
            }
            const pad = n.some(isPadded);
            N = [];
            for (let i = x; test(i, y); i += incr) {
                let c;
                if (isAlphaSequence) {
                    c = String.fromCharCode(i);
                    if (c === '\\') {
                        c = '';
                    }
                }
                else {
                    c = String(i);
                    if (pad) {
                        const need = width - c.length;
                        if (need > 0) {
                            const z = new Array(need + 1).join('0');
                            if (i < 0) {
                                c = '-' + z + c.slice(1);
                            }
                            else {
                                c = z + c;
                            }
                        }
                    }
                }
                N.push(c);
            }
        }
        else {
            N = [];
            for (let j = 0; j < n.length; j++) {
                N.push.apply(N, expand_(n[j], max, false));
            }
        }
        for (let j = 0; j < N.length; j++) {
            for (let k = 0; k < post.length && expansions.length < max; k++) {
                const expansion = pre + N[j] + post[k];
                if (!isTop || isSequence || expansion) {
                    expansions.push(expansion);
                }
            }
        }
    }
    return expansions;
}

const MAX_PATTERN_LENGTH = 1024 * 64;
const assertValidPattern = (pattern) => {
    if (typeof pattern !== 'string') {
        throw new TypeError('invalid pattern');
    }
    if (pattern.length > MAX_PATTERN_LENGTH) {
        throw new TypeError('pattern is too long');
    }
};

// translate the various posix character classes into unicode properties
// this works across all unicode locales
// { <posix class>: [<translation>, /u flag required, negated]
const posixClasses = {
    '[:alnum:]': ['\\p{L}\\p{Nl}\\p{Nd}', true],
    '[:alpha:]': ['\\p{L}\\p{Nl}', true],
    '[:ascii:]': ['\\x' + '00-\\x' + '7f', false],
    '[:blank:]': ['\\p{Zs}\\t', true],
    '[:cntrl:]': ['\\p{Cc}', true],
    '[:digit:]': ['\\p{Nd}', true],
    '[:graph:]': ['\\p{Z}\\p{C}', true, true],
    '[:lower:]': ['\\p{Ll}', true],
    '[:print:]': ['\\p{C}', true],
    '[:punct:]': ['\\p{P}', true],
    '[:space:]': ['\\p{Z}\\t\\r\\n\\v\\f', true],
    '[:upper:]': ['\\p{Lu}', true],
    '[:word:]': ['\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}', true],
    '[:xdigit:]': ['A-Fa-f0-9', false],
};
// only need to escape a few things inside of brace expressions
// escapes: [ \ ] -
const braceEscape = (s) => s.replace(/[[\]\\-]/g, '\\$&');
// escape all regexp magic characters
const regexpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// everything has already been escaped, we just have to join
const rangesToString = (ranges) => ranges.join('');
// takes a glob string at a posix brace expression, and returns
// an equivalent regular expression source, and boolean indicating
// whether the /u flag needs to be applied, and the number of chars
// consumed to parse the character class.
// This also removes out of order ranges, and returns ($.) if the
// entire class just no good.
const parseClass = (glob, position) => {
    const pos = position;
    /* c8 ignore start */
    if (glob.charAt(pos) !== '[') {
        throw new Error('not in a brace expression');
    }
    /* c8 ignore stop */
    const ranges = [];
    const negs = [];
    let i = pos + 1;
    let sawStart = false;
    let uflag = false;
    let escaping = false;
    let negate = false;
    let endPos = pos;
    let rangeStart = '';
    WHILE: while (i < glob.length) {
        const c = glob.charAt(i);
        if ((c === '!' || c === '^') && i === pos + 1) {
            negate = true;
            i++;
            continue;
        }
        if (c === ']' && sawStart && !escaping) {
            endPos = i + 1;
            break;
        }
        sawStart = true;
        if (c === '\\') {
            if (!escaping) {
                escaping = true;
                i++;
                continue;
            }
            // escaped \ char, fall through and treat like normal char
        }
        if (c === '[' && !escaping) {
            // either a posix class, a collation equivalent, or just a [
            for (const [cls, [unip, u, neg]] of Object.entries(posixClasses)) {
                if (glob.startsWith(cls, i)) {
                    // invalid, [a-[] is fine, but not [a-[:alpha]]
                    if (rangeStart) {
                        return ['$.', false, glob.length - pos, true];
                    }
                    i += cls.length;
                    if (neg)
                        negs.push(unip);
                    else
                        ranges.push(unip);
                    uflag = uflag || u;
                    continue WHILE;
                }
            }
        }
        // now it's just a normal character, effectively
        escaping = false;
        if (rangeStart) {
            // throw this range away if it's not valid, but others
            // can still match.
            if (c > rangeStart) {
                ranges.push(braceEscape(rangeStart) + '-' + braceEscape(c));
            }
            else if (c === rangeStart) {
                ranges.push(braceEscape(c));
            }
            rangeStart = '';
            i++;
            continue;
        }
        // now might be the start of a range.
        // can be either c-d or c-] or c<more...>] or c] at this point
        if (glob.startsWith('-]', i + 1)) {
            ranges.push(braceEscape(c + '-'));
            i += 2;
            continue;
        }
        if (glob.startsWith('-', i + 1)) {
            rangeStart = c;
            i += 2;
            continue;
        }
        // not the start of a range, just a single character
        ranges.push(braceEscape(c));
        i++;
    }
    if (endPos < i) {
        // didn't see the end of the class, not a valid class,
        // but might still be valid as a literal match.
        return ['', false, 0, false];
    }
    // if we got no ranges and no negates, then we have a range that
    // cannot possibly match anything, and that poisons the whole glob
    if (!ranges.length && !negs.length) {
        return ['$.', false, glob.length - pos, true];
    }
    // if we got one positive range, and it's a single character, then that's
    // not actually a magic pattern, it's just that one literal character.
    // we should not treat that as "magic", we should just return the literal
    // character. [_] is a perfectly valid way to escape glob magic chars.
    if (negs.length === 0 &&
        ranges.length === 1 &&
        /^\\?.$/.test(ranges[0]) &&
        !negate) {
        const r = ranges[0].length === 2 ? ranges[0].slice(-1) : ranges[0];
        return [regexpEscape(r), false, endPos - pos, false];
    }
    const sranges = '[' + (negate ? '^' : '') + rangesToString(ranges) + ']';
    const snegs = '[' + (negate ? '' : '^') + rangesToString(negs) + ']';
    const comb = ranges.length && negs.length ? '(' + sranges + '|' + snegs + ')'
        : ranges.length ? sranges
            : snegs;
    return [comb, uflag, endPos - pos, true];
};

/**
 * Un-escape a string that has been escaped with {@link escape}.
 *
 * If the {@link MinimatchOptions.windowsPathsNoEscape} option is used, then
 * square-bracket escapes are removed, but not backslash escapes.
 *
 * For example, it will turn the string `'[*]'` into `*`, but it will not
 * turn `'\\*'` into `'*'`, because `\` is a path separator in
 * `windowsPathsNoEscape` mode.
 *
 * When `windowsPathsNoEscape` is not set, then both square-bracket escapes and
 * backslash escapes are removed.
 *
 * Slashes (and backslashes in `windowsPathsNoEscape` mode) cannot be escaped
 * or unescaped.
 *
 * When `magicalBraces` is not set, escapes of braces (`{` and `}`) will not be
 * unescaped.
 */
const unescape$1 = (s, { windowsPathsNoEscape = false, magicalBraces = true, } = {}) => {
    if (magicalBraces) {
        return windowsPathsNoEscape ?
            s.replace(/\[([^\/\\])\]/g, '$1')
            : s
                .replace(/((?!\\).|^)\[([^\/\\])\]/g, '$1$2')
                .replace(/\\([^\/])/g, '$1');
    }
    return windowsPathsNoEscape ?
        s.replace(/\[([^\/\\{}])\]/g, '$1')
        : s
            .replace(/((?!\\).|^)\[([^\/\\{}])\]/g, '$1$2')
            .replace(/\\([^\/{}])/g, '$1');
};

// parse a single path portion
var _a;
const types = new Set(['!', '?', '+', '*', '@']);
const isExtglobType = (c) => types.has(c);
const isExtglobAST = (c) => isExtglobType(c.type);
// Map of which extglob types can adopt the children of a nested extglob
//
// anything but ! can adopt a matching type:
// +(a|+(b|c)|d) => +(a|b|c|d)
// *(a|*(b|c)|d) => *(a|b|c|d)
// @(a|@(b|c)|d) => @(a|b|c|d)
// ?(a|?(b|c)|d) => ?(a|b|c|d)
//
// * can adopt anything, because 0 or repetition is allowed
// *(a|?(b|c)|d) => *(a|b|c|d)
// *(a|+(b|c)|d) => *(a|b|c|d)
// *(a|@(b|c)|d) => *(a|b|c|d)
//
// + can adopt @, because 1 or repetition is allowed
// +(a|@(b|c)|d) => +(a|b|c|d)
//
// + and @ CANNOT adopt *, because 0 would be allowed
// +(a|*(b|c)|d) => would match "", on *(b|c)
// @(a|*(b|c)|d) => would match "", on *(b|c)
//
// + and @ CANNOT adopt ?, because 0 would be allowed
// +(a|?(b|c)|d) => would match "", on ?(b|c)
// @(a|?(b|c)|d) => would match "", on ?(b|c)
//
// ? can adopt @, because 0 or 1 is allowed
// ?(a|@(b|c)|d) => ?(a|b|c|d)
//
// ? and @ CANNOT adopt * or +, because >1 would be allowed
// ?(a|*(b|c)|d) => would match bbb on *(b|c)
// @(a|*(b|c)|d) => would match bbb on *(b|c)
// ?(a|+(b|c)|d) => would match bbb on +(b|c)
// @(a|+(b|c)|d) => would match bbb on +(b|c)
//
// ! CANNOT adopt ! (nothing else can either)
// !(a|!(b|c)|d) => !(a|b|c|d) would fail to match on b (not not b|c)
//
// ! can adopt @
// !(a|@(b|c)|d) => !(a|b|c|d)
//
// ! CANNOT adopt *
// !(a|*(b|c)|d) => !(a|b|c|d) would match on bbb, not allowed
//
// ! CANNOT adopt +
// !(a|+(b|c)|d) => !(a|b|c|d) would match on bbb, not allowed
//
// ! CANNOT adopt ?
// x!(a|?(b|c)|d) => x!(a|b|c|d) would fail to match "x"
const adoptionMap = new Map([
    ['!', ['@']],
    ['?', ['?', '@']],
    ['@', ['@']],
    ['*', ['*', '+', '?', '@']],
    ['+', ['+', '@']],
]);
// nested extglobs that can be adopted in, but with the addition of
// a blank '' element.
const adoptionWithSpaceMap = new Map([
    ['!', ['?']],
    ['@', ['?']],
    ['+', ['?', '*']],
]);
// union of the previous two maps
const adoptionAnyMap = new Map([
    ['!', ['?', '@']],
    ['?', ['?', '@']],
    ['@', ['?', '@']],
    ['*', ['*', '+', '?', '@']],
    ['+', ['+', '@', '?', '*']],
]);
// Extglobs that can take over their parent if they are the only child
// the key is parent, value maps child to resulting extglob parent type
// '@' is omitted because it's a special case. An `@` extglob with a single
// member can always be usurped by that subpattern.
const usurpMap = new Map([
    ['!', new Map([['!', '@']])],
    [
        '?',
        new Map([
            ['*', '*'],
            ['+', '*'],
        ]),
    ],
    [
        '@',
        new Map([
            ['!', '!'],
            ['?', '?'],
            ['@', '@'],
            ['*', '*'],
            ['+', '+'],
        ]),
    ],
    [
        '+',
        new Map([
            ['?', '*'],
            ['*', '*'],
        ]),
    ],
]);
// Patterns that get prepended to bind to the start of either the
// entire string, or just a single path portion, to prevent dots
// and/or traversal patterns, when needed.
// Exts don't need the ^ or / bit, because the root binds that already.
const startNoTraversal = '(?!(?:^|/)\\.\\.?(?:$|/))';
const startNoDot = '(?!\\.)';
// characters that indicate a start of pattern needs the "no dots" bit,
// because a dot *might* be matched. ( is not in the list, because in
// the case of a child extglob, it will handle the prevention itself.
const addPatternStart = new Set(['[', '.']);
// cases where traversal is A-OK, no dot prevention needed
const justDots = new Set(['..', '.']);
const reSpecials = new Set('().*{}+?[]^$\\!');
const regExpEscape$1 = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// any single thing other than /
const qmark$1 = '[^/]';
// * => any number of characters
const star$1 = qmark$1 + '*?';
// use + when we need to ensure that *something* matches, because the * is
// the only thing in the path portion.
const starNoEmpty = qmark$1 + '+?';
// remove the \ chars that we added if we end up doing a nonmagic compare
// const deslash = (s: string) => s.replace(/\\(.)/g, '$1')
let ID = 0;
class AST {
    type;
    #root;
    #hasMagic;
    #uflag = false;
    #parts = [];
    #parent;
    #parentIndex;
    #negs;
    #filledNegs = false;
    #options;
    #toString;
    // set to true if it's an extglob with no children
    // (which really means one child of '')
    #emptyExt = false;
    id = ++ID;
    get depth() {
        return (this.#parent?.depth ?? -1) + 1;
    }
    [Symbol.for('nodejs.util.inspect.custom')]() {
        return {
            '@@type': 'AST',
            id: this.id,
            type: this.type,
            root: this.#root.id,
            parent: this.#parent?.id,
            depth: this.depth,
            partsLength: this.#parts.length,
            parts: this.#parts,
        };
    }
    constructor(type, parent, options = {}) {
        this.type = type;
        // extglobs are inherently magical
        if (type)
            this.#hasMagic = true;
        this.#parent = parent;
        this.#root = this.#parent ? this.#parent.#root : this;
        this.#options = this.#root === this ? options : this.#root.#options;
        this.#negs = this.#root === this ? [] : this.#root.#negs;
        if (type === '!' && !this.#root.#filledNegs)
            this.#negs.push(this);
        this.#parentIndex = this.#parent ? this.#parent.#parts.length : 0;
    }
    get hasMagic() {
        /* c8 ignore start */
        if (this.#hasMagic !== undefined)
            return this.#hasMagic;
        /* c8 ignore stop */
        for (const p of this.#parts) {
            if (typeof p === 'string')
                continue;
            if (p.type || p.hasMagic)
                return (this.#hasMagic = true);
        }
        // note: will be undefined until we generate the regexp src and find out
        return this.#hasMagic;
    }
    // reconstructs the pattern
    toString() {
        if (this.#toString !== undefined)
            return this.#toString;
        if (!this.type) {
            return (this.#toString = this.#parts.map(p => String(p)).join(''));
        }
        else {
            return (this.#toString =
                this.type + '(' + this.#parts.map(p => String(p)).join('|') + ')');
        }
    }
    #fillNegs() {
        /* c8 ignore start */
        if (this !== this.#root)
            throw new Error('should only call on root');
        if (this.#filledNegs)
            return this;
        /* c8 ignore stop */
        // call toString() once to fill this out
        this.toString();
        this.#filledNegs = true;
        let n;
        while ((n = this.#negs.pop())) {
            if (n.type !== '!')
                continue;
            // walk up the tree, appending everthing that comes AFTER parentIndex
            let p = n;
            let pp = p.#parent;
            while (pp) {
                for (let i = p.#parentIndex + 1; !pp.type && i < pp.#parts.length; i++) {
                    for (const part of n.#parts) {
                        /* c8 ignore start */
                        if (typeof part === 'string') {
                            throw new Error('string part in extglob AST??');
                        }
                        /* c8 ignore stop */
                        part.copyIn(pp.#parts[i]);
                    }
                }
                p = pp;
                pp = p.#parent;
            }
        }
        return this;
    }
    push(...parts) {
        for (const p of parts) {
            if (p === '')
                continue;
            /* c8 ignore start */
            if (typeof p !== 'string' &&
                !(p instanceof _a && p.#parent === this)) {
                throw new Error('invalid part: ' + p);
            }
            /* c8 ignore stop */
            this.#parts.push(p);
        }
    }
    toJSON() {
        const ret = this.type === null ?
            this.#parts
                .slice()
                .map(p => (typeof p === 'string' ? p : p.toJSON()))
            : [this.type, ...this.#parts.map(p => p.toJSON())];
        if (this.isStart() && !this.type)
            ret.unshift([]);
        if (this.isEnd() &&
            (this === this.#root ||
                (this.#root.#filledNegs && this.#parent?.type === '!'))) {
            ret.push({});
        }
        return ret;
    }
    isStart() {
        if (this.#root === this)
            return true;
        // if (this.type) return !!this.#parent?.isStart()
        if (!this.#parent?.isStart())
            return false;
        if (this.#parentIndex === 0)
            return true;
        // if everything AHEAD of this is a negation, then it's still the "start"
        const p = this.#parent;
        for (let i = 0; i < this.#parentIndex; i++) {
            const pp = p.#parts[i];
            if (!(pp instanceof _a && pp.type === '!')) {
                return false;
            }
        }
        return true;
    }
    isEnd() {
        if (this.#root === this)
            return true;
        if (this.#parent?.type === '!')
            return true;
        if (!this.#parent?.isEnd())
            return false;
        if (!this.type)
            return this.#parent?.isEnd();
        // if not root, it'll always have a parent
        /* c8 ignore start */
        const pl = this.#parent ? this.#parent.#parts.length : 0;
        /* c8 ignore stop */
        return this.#parentIndex === pl - 1;
    }
    copyIn(part) {
        if (typeof part === 'string')
            this.push(part);
        else
            this.push(part.clone(this));
    }
    clone(parent) {
        const c = new _a(this.type, parent);
        for (const p of this.#parts) {
            c.copyIn(p);
        }
        return c;
    }
    static #parseAST(str, ast, pos, opt, extDepth) {
        const maxDepth = opt.maxExtglobRecursion ?? 2;
        let escaping = false;
        let inBrace = false;
        let braceStart = -1;
        let braceNeg = false;
        if (ast.type === null) {
            // outside of a extglob, append until we find a start
            let i = pos;
            let acc = '';
            while (i < str.length) {
                const c = str.charAt(i++);
                // still accumulate escapes at this point, but we do ignore
                // starts that are escaped
                if (escaping || c === '\\') {
                    escaping = !escaping;
                    acc += c;
                    continue;
                }
                if (inBrace) {
                    if (i === braceStart + 1) {
                        if (c === '^' || c === '!') {
                            braceNeg = true;
                        }
                    }
                    else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                        inBrace = false;
                    }
                    acc += c;
                    continue;
                }
                else if (c === '[') {
                    inBrace = true;
                    braceStart = i;
                    braceNeg = false;
                    acc += c;
                    continue;
                }
                // we don't have to check for adoption here, because that's
                // done at the other recursion point.
                const doRecurse = !opt.noext &&
                    isExtglobType(c) &&
                    str.charAt(i) === '(' &&
                    extDepth <= maxDepth;
                if (doRecurse) {
                    ast.push(acc);
                    acc = '';
                    const ext = new _a(c, ast);
                    i = _a.#parseAST(str, ext, i, opt, extDepth + 1);
                    ast.push(ext);
                    continue;
                }
                acc += c;
            }
            ast.push(acc);
            return i;
        }
        // some kind of extglob, pos is at the (
        // find the next | or )
        let i = pos + 1;
        let part = new _a(null, ast);
        const parts = [];
        let acc = '';
        while (i < str.length) {
            const c = str.charAt(i++);
            // still accumulate escapes at this point, but we do ignore
            // starts that are escaped
            if (escaping || c === '\\') {
                escaping = !escaping;
                acc += c;
                continue;
            }
            if (inBrace) {
                if (i === braceStart + 1) {
                    if (c === '^' || c === '!') {
                        braceNeg = true;
                    }
                }
                else if (c === ']' && !(i === braceStart + 2 && braceNeg)) {
                    inBrace = false;
                }
                acc += c;
                continue;
            }
            else if (c === '[') {
                inBrace = true;
                braceStart = i;
                braceNeg = false;
                acc += c;
                continue;
            }
            const doRecurse = !opt.noext &&
                isExtglobType(c) &&
                str.charAt(i) === '(' &&
                /* c8 ignore start - the maxDepth is sufficient here */
                (extDepth <= maxDepth || (ast && ast.#canAdoptType(c)));
            /* c8 ignore stop */
            if (doRecurse) {
                const depthAdd = ast && ast.#canAdoptType(c) ? 0 : 1;
                part.push(acc);
                acc = '';
                const ext = new _a(c, part);
                part.push(ext);
                i = _a.#parseAST(str, ext, i, opt, extDepth + depthAdd);
                continue;
            }
            if (c === '|') {
                part.push(acc);
                acc = '';
                parts.push(part);
                part = new _a(null, ast);
                continue;
            }
            if (c === ')') {
                if (acc === '' && ast.#parts.length === 0) {
                    ast.#emptyExt = true;
                }
                part.push(acc);
                acc = '';
                ast.push(...parts, part);
                return i;
            }
            acc += c;
        }
        // unfinished extglob
        // if we got here, it was a malformed extglob! not an extglob, but
        // maybe something else in there.
        ast.type = null;
        ast.#hasMagic = undefined;
        ast.#parts = [str.substring(pos - 1)];
        return i;
    }
    #canAdoptWithSpace(child) {
        return this.#canAdopt(child, adoptionWithSpaceMap);
    }
    #canAdopt(child, map = adoptionMap) {
        if (!child ||
            typeof child !== 'object' ||
            child.type !== null ||
            child.#parts.length !== 1 ||
            this.type === null) {
            return false;
        }
        const gc = child.#parts[0];
        if (!gc || typeof gc !== 'object' || gc.type === null) {
            return false;
        }
        return this.#canAdoptType(gc.type, map);
    }
    #canAdoptType(c, map = adoptionAnyMap) {
        return !!map.get(this.type)?.includes(c);
    }
    #adoptWithSpace(child, index) {
        const gc = child.#parts[0];
        const blank = new _a(null, gc, this.options);
        blank.#parts.push('');
        gc.push(blank);
        this.#adopt(child, index);
    }
    #adopt(child, index) {
        const gc = child.#parts[0];
        this.#parts.splice(index, 1, ...gc.#parts);
        for (const p of gc.#parts) {
            if (typeof p === 'object')
                p.#parent = this;
        }
        this.#toString = undefined;
    }
    #canUsurpType(c) {
        const m = usurpMap.get(this.type);
        return !!(m?.has(c));
    }
    #canUsurp(child) {
        if (!child ||
            typeof child !== 'object' ||
            child.type !== null ||
            child.#parts.length !== 1 ||
            this.type === null ||
            this.#parts.length !== 1) {
            return false;
        }
        const gc = child.#parts[0];
        if (!gc || typeof gc !== 'object' || gc.type === null) {
            return false;
        }
        return this.#canUsurpType(gc.type);
    }
    #usurp(child) {
        const m = usurpMap.get(this.type);
        const gc = child.#parts[0];
        const nt = m?.get(gc.type);
        /* c8 ignore start - impossible */
        if (!nt)
            return false;
        /* c8 ignore stop */
        this.#parts = gc.#parts;
        for (const p of this.#parts) {
            if (typeof p === 'object') {
                p.#parent = this;
            }
        }
        this.type = nt;
        this.#toString = undefined;
        this.#emptyExt = false;
    }
    static fromGlob(pattern, options = {}) {
        const ast = new _a(null, undefined, options);
        _a.#parseAST(pattern, ast, 0, options, 0);
        return ast;
    }
    // returns the regular expression if there's magic, or the unescaped
    // string if not.
    toMMPattern() {
        // should only be called on root
        /* c8 ignore start */
        if (this !== this.#root)
            return this.#root.toMMPattern();
        /* c8 ignore stop */
        const glob = this.toString();
        const [re, body, hasMagic, uflag] = this.toRegExpSource();
        // if we're in nocase mode, and not nocaseMagicOnly, then we do
        // still need a regular expression if we have to case-insensitively
        // match capital/lowercase characters.
        const anyMagic = hasMagic ||
            this.#hasMagic ||
            (this.#options.nocase &&
                !this.#options.nocaseMagicOnly &&
                glob.toUpperCase() !== glob.toLowerCase());
        if (!anyMagic) {
            return body;
        }
        const flags = (this.#options.nocase ? 'i' : '') + (uflag ? 'u' : '');
        return Object.assign(new RegExp(`^${re}$`, flags), {
            _src: re,
            _glob: glob,
        });
    }
    get options() {
        return this.#options;
    }
    // returns the string match, the regexp source, whether there's magic
    // in the regexp (so a regular expression is required) and whether or
    // not the uflag is needed for the regular expression (for posix classes)
    // TODO: instead of injecting the start/end at this point, just return
    // the BODY of the regexp, along with the start/end portions suitable
    // for binding the start/end in either a joined full-path makeRe context
    // (where we bind to (^|/), or a standalone matchPart context (where
    // we bind to ^, and not /).  Otherwise slashes get duped!
    //
    // In part-matching mode, the start is:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: ^(?!\.\.?$)
    // - if dots allowed or not possible: ^
    // - if dots possible and not allowed: ^(?!\.)
    // end is:
    // - if not isEnd(): nothing
    // - else: $
    //
    // In full-path matching mode, we put the slash at the START of the
    // pattern, so start is:
    // - if first pattern: same as part-matching mode
    // - if not isStart(): nothing
    // - if traversal possible, but not allowed: /(?!\.\.?(?:$|/))
    // - if dots allowed or not possible: /
    // - if dots possible and not allowed: /(?!\.)
    // end is:
    // - if last pattern, same as part-matching mode
    // - else nothing
    //
    // Always put the (?:$|/) on negated tails, though, because that has to be
    // there to bind the end of the negated pattern portion, and it's easier to
    // just stick it in now rather than try to inject it later in the middle of
    // the pattern.
    //
    // We can just always return the same end, and leave it up to the caller
    // to know whether it's going to be used joined or in parts.
    // And, if the start is adjusted slightly, can do the same there:
    // - if not isStart: nothing
    // - if traversal possible, but not allowed: (?:/|^)(?!\.\.?$)
    // - if dots allowed or not possible: (?:/|^)
    // - if dots possible and not allowed: (?:/|^)(?!\.)
    //
    // But it's better to have a simpler binding without a conditional, for
    // performance, so probably better to return both start options.
    //
    // Then the caller just ignores the end if it's not the first pattern,
    // and the start always gets applied.
    //
    // But that's always going to be $ if it's the ending pattern, or nothing,
    // so the caller can just attach $ at the end of the pattern when building.
    //
    // So the todo is:
    // - better detect what kind of start is needed
    // - return both flavors of starting pattern
    // - attach $ at the end of the pattern when creating the actual RegExp
    //
    // Ah, but wait, no, that all only applies to the root when the first pattern
    // is not an extglob. If the first pattern IS an extglob, then we need all
    // that dot prevention biz to live in the extglob portions, because eg
    // +(*|.x*) can match .xy but not .yx.
    //
    // So, return the two flavors if it's #root and the first child is not an
    // AST, otherwise leave it to the child AST to handle it, and there,
    // use the (?:^|/) style of start binding.
    //
    // Even simplified further:
    // - Since the start for a join is eg /(?!\.) and the start for a part
    // is ^(?!\.), we can just prepend (?!\.) to the pattern (either root
    // or start or whatever) and prepend ^ or / at the Regexp construction.
    toRegExpSource(allowDot) {
        const dot = allowDot ?? !!this.#options.dot;
        if (this.#root === this) {
            this.#flatten();
            this.#fillNegs();
        }
        if (!isExtglobAST(this)) {
            const noEmpty = this.isStart() &&
                this.isEnd() &&
                !this.#parts.some(s => typeof s !== 'string');
            const src = this.#parts
                .map(p => {
                const [re, _, hasMagic, uflag] = typeof p === 'string' ?
                    _a.#parseGlob(p, this.#hasMagic, noEmpty)
                    : p.toRegExpSource(allowDot);
                this.#hasMagic = this.#hasMagic || hasMagic;
                this.#uflag = this.#uflag || uflag;
                return re;
            })
                .join('');
            let start = '';
            if (this.isStart()) {
                if (typeof this.#parts[0] === 'string') {
                    // this is the string that will match the start of the pattern,
                    // so we need to protect against dots and such.
                    // '.' and '..' cannot match unless the pattern is that exactly,
                    // even if it starts with . or dot:true is set.
                    const dotTravAllowed = this.#parts.length === 1 && justDots.has(this.#parts[0]);
                    if (!dotTravAllowed) {
                        const aps = addPatternStart;
                        // check if we have a possibility of matching . or ..,
                        // and prevent that.
                        const needNoTrav = 
                        // dots are allowed, and the pattern starts with [ or .
                        (dot && aps.has(src.charAt(0))) ||
                            // the pattern starts with \., and then [ or .
                            (src.startsWith('\\.') && aps.has(src.charAt(2))) ||
                            // the pattern starts with \.\., and then [ or .
                            (src.startsWith('\\.\\.') && aps.has(src.charAt(4)));
                        // no need to prevent dots if it can't match a dot, or if a
                        // sub-pattern will be preventing it anyway.
                        const needNoDot = !dot && !allowDot && aps.has(src.charAt(0));
                        start =
                            needNoTrav ? startNoTraversal
                                : needNoDot ? startNoDot
                                    : '';
                    }
                }
            }
            // append the "end of path portion" pattern to negation tails
            let end = '';
            if (this.isEnd() &&
                this.#root.#filledNegs &&
                this.#parent?.type === '!') {
                end = '(?:$|\\/)';
            }
            const final = start + src + end;
            return [
                final,
                unescape$1(src),
                (this.#hasMagic = !!this.#hasMagic),
                this.#uflag,
            ];
        }
        // We need to calculate the body *twice* if it's a repeat pattern
        // at the start, once in nodot mode, then again in dot mode, so a
        // pattern like *(?) can match 'x.y'
        const repeated = this.type === '*' || this.type === '+';
        // some kind of extglob
        const start = this.type === '!' ? '(?:(?!(?:' : '(?:';
        let body = this.#partsToRegExp(dot);
        if (this.isStart() && this.isEnd() && !body && this.type !== '!') {
            // invalid extglob, has to at least be *something* present, if it's
            // the entire path portion.
            const s = this.toString();
            const me = this;
            me.#parts = [s];
            me.type = null;
            me.#hasMagic = undefined;
            return [s, unescape$1(this.toString()), false, false];
        }
        let bodyDotAllowed = !repeated || allowDot || dot || !startNoDot ?
            ''
            : this.#partsToRegExp(true);
        if (bodyDotAllowed === body) {
            bodyDotAllowed = '';
        }
        if (bodyDotAllowed) {
            body = `(?:${body})(?:${bodyDotAllowed})*?`;
        }
        // an empty !() is exactly equivalent to a starNoEmpty
        let final = '';
        if (this.type === '!' && this.#emptyExt) {
            final = (this.isStart() && !dot ? startNoDot : '') + starNoEmpty;
        }
        else {
            const close = this.type === '!' ?
                // !() must match something,but !(x) can match ''
                '))' +
                    (this.isStart() && !dot && !allowDot ? startNoDot : '') +
                    star$1 +
                    ')'
                : this.type === '@' ? ')'
                    : this.type === '?' ? ')?'
                        : this.type === '+' && bodyDotAllowed ? ')'
                            : this.type === '*' && bodyDotAllowed ? `)?`
                                : `)${this.type}`;
            final = start + body + close;
        }
        return [
            final,
            unescape$1(body),
            (this.#hasMagic = !!this.#hasMagic),
            this.#uflag,
        ];
    }
    #flatten() {
        if (!isExtglobAST(this)) {
            for (const p of this.#parts) {
                if (typeof p === 'object') {
                    p.#flatten();
                }
            }
        }
        else {
            // do up to 10 passes to flatten as much as possible
            let iterations = 0;
            let done = false;
            do {
                done = true;
                for (let i = 0; i < this.#parts.length; i++) {
                    const c = this.#parts[i];
                    if (typeof c === 'object') {
                        c.#flatten();
                        if (this.#canAdopt(c)) {
                            done = false;
                            this.#adopt(c, i);
                        }
                        else if (this.#canAdoptWithSpace(c)) {
                            done = false;
                            this.#adoptWithSpace(c, i);
                        }
                        else if (this.#canUsurp(c)) {
                            done = false;
                            this.#usurp(c);
                        }
                    }
                }
            } while (!done && ++iterations < 10);
        }
        this.#toString = undefined;
    }
    #partsToRegExp(dot) {
        return this.#parts
            .map(p => {
            // extglob ASTs should only contain parent ASTs
            /* c8 ignore start */
            if (typeof p === 'string') {
                throw new Error('string type in extglob ast??');
            }
            /* c8 ignore stop */
            // can ignore hasMagic, because extglobs are already always magic
            const [re, _, _hasMagic, uflag] = p.toRegExpSource(dot);
            this.#uflag = this.#uflag || uflag;
            return re;
        })
            .filter(p => !(this.isStart() && this.isEnd()) || !!p)
            .join('|');
    }
    static #parseGlob(glob, hasMagic, noEmpty = false) {
        let escaping = false;
        let re = '';
        let uflag = false;
        // multiple stars that aren't globstars coalesce into one *
        let inStar = false;
        for (let i = 0; i < glob.length; i++) {
            const c = glob.charAt(i);
            if (escaping) {
                escaping = false;
                re += (reSpecials.has(c) ? '\\' : '') + c;
                continue;
            }
            if (c === '*') {
                if (inStar)
                    continue;
                inStar = true;
                re += noEmpty && /^[*]+$/.test(glob) ? starNoEmpty : star$1;
                hasMagic = true;
                continue;
            }
            else {
                inStar = false;
            }
            if (c === '\\') {
                if (i === glob.length - 1) {
                    re += '\\\\';
                }
                else {
                    escaping = true;
                }
                continue;
            }
            if (c === '[') {
                const [src, needUflag, consumed, magic] = parseClass(glob, i);
                if (consumed) {
                    re += src;
                    uflag = uflag || needUflag;
                    i += consumed - 1;
                    hasMagic = hasMagic || magic;
                    continue;
                }
            }
            if (c === '?') {
                re += qmark$1;
                hasMagic = true;
                continue;
            }
            re += regExpEscape$1(c);
        }
        return [re, unescape$1(glob), !!hasMagic, uflag];
    }
}
_a = AST;

/**
 * Escape all magic characters in a glob pattern.
 *
 * If the {@link MinimatchOptions.windowsPathsNoEscape}
 * option is used, then characters are escaped by wrapping in `[]`, because
 * a magic character wrapped in a character class can only be satisfied by
 * that exact character.  In this mode, `\` is _not_ escaped, because it is
 * not interpreted as a magic character, but instead as a path separator.
 *
 * If the {@link MinimatchOptions.magicalBraces} option is used,
 * then braces (`{` and `}`) will be escaped.
 */
const escape = (s, { windowsPathsNoEscape = false, magicalBraces = false, } = {}) => {
    // don't need to escape +@! because we escape the parens
    // that make those magic, and escaping ! as [!] isn't valid,
    // because [!]] is a valid glob class meaning not ']'.
    if (magicalBraces) {
        return windowsPathsNoEscape ?
            s.replace(/[?*()[\]{}]/g, '[$&]')
            : s.replace(/[?*()[\]\\{}]/g, '\\$&');
    }
    return windowsPathsNoEscape ?
        s.replace(/[?*()[\]]/g, '[$&]')
        : s.replace(/[?*()[\]\\]/g, '\\$&');
};

const minimatch = (p, pattern, options = {}) => {
    assertValidPattern(pattern);
    // shortcut: comments match nothing.
    if (!options.nocomment && pattern.charAt(0) === '#') {
        return false;
    }
    return new Minimatch(pattern, options).match(p);
};
// Optimized checking for the most common glob patterns.
const starDotExtRE = /^\*+([^+@!?\*\[\(]*)$/;
const starDotExtTest = (ext) => (f) => !f.startsWith('.') && f.endsWith(ext);
const starDotExtTestDot = (ext) => (f) => f.endsWith(ext);
const starDotExtTestNocase = (ext) => {
    ext = ext.toLowerCase();
    return (f) => !f.startsWith('.') && f.toLowerCase().endsWith(ext);
};
const starDotExtTestNocaseDot = (ext) => {
    ext = ext.toLowerCase();
    return (f) => f.toLowerCase().endsWith(ext);
};
const starDotStarRE = /^\*+\.\*+$/;
const starDotStarTest = (f) => !f.startsWith('.') && f.includes('.');
const starDotStarTestDot = (f) => f !== '.' && f !== '..' && f.includes('.');
const dotStarRE = /^\.\*+$/;
const dotStarTest = (f) => f !== '.' && f !== '..' && f.startsWith('.');
const starRE = /^\*+$/;
const starTest = (f) => f.length !== 0 && !f.startsWith('.');
const starTestDot = (f) => f.length !== 0 && f !== '.' && f !== '..';
const qmarksRE = /^\?+([^+@!?\*\[\(]*)?$/;
const qmarksTestNocase = ([$0, ext = '']) => {
    const noext = qmarksTestNoExt([$0]);
    if (!ext)
        return noext;
    ext = ext.toLowerCase();
    return (f) => noext(f) && f.toLowerCase().endsWith(ext);
};
const qmarksTestNocaseDot = ([$0, ext = '']) => {
    const noext = qmarksTestNoExtDot([$0]);
    if (!ext)
        return noext;
    ext = ext.toLowerCase();
    return (f) => noext(f) && f.toLowerCase().endsWith(ext);
};
const qmarksTestDot = ([$0, ext = '']) => {
    const noext = qmarksTestNoExtDot([$0]);
    return !ext ? noext : (f) => noext(f) && f.endsWith(ext);
};
const qmarksTest = ([$0, ext = '']) => {
    const noext = qmarksTestNoExt([$0]);
    return !ext ? noext : (f) => noext(f) && f.endsWith(ext);
};
const qmarksTestNoExt = ([$0]) => {
    const len = $0.length;
    return (f) => f.length === len && !f.startsWith('.');
};
const qmarksTestNoExtDot = ([$0]) => {
    const len = $0.length;
    return (f) => f.length === len && f !== '.' && f !== '..';
};
/* c8 ignore start */
const defaultPlatform = (typeof process === 'object' && process ?
    (typeof process.env === 'object' &&
        process.env &&
        process.env.__MINIMATCH_TESTING_PLATFORM__) ||
        process.platform
    : 'posix');
const path = {
    win32: { sep: '\\' },
    posix: { sep: '/' },
};
/* c8 ignore stop */
const sep = defaultPlatform === 'win32' ? path.win32.sep : path.posix.sep;
minimatch.sep = sep;
const GLOBSTAR = Symbol('globstar **');
minimatch.GLOBSTAR = GLOBSTAR;
// any single thing other than /
// don't need to escape / when using new RegExp()
const qmark = '[^/]';
// * => any number of characters
const star = qmark + '*?';
// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
const twoStarDot = '(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?';
// not a ^ or / followed by a dot,
// followed by anything, any number of times.
const twoStarNoDot = '(?:(?!(?:\\/|^)\\.).)*?';
const filter = (pattern, options = {}) => (p) => minimatch(p, pattern, options);
minimatch.filter = filter;
const ext = (a, b = {}) => Object.assign({}, a, b);
const defaults = (def) => {
    if (!def || typeof def !== 'object' || !Object.keys(def).length) {
        return minimatch;
    }
    const orig = minimatch;
    const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
    return Object.assign(m, {
        Minimatch: class Minimatch extends orig.Minimatch {
            constructor(pattern, options = {}) {
                super(pattern, ext(def, options));
            }
            static defaults(options) {
                return orig.defaults(ext(def, options)).Minimatch;
            }
        },
        AST: class AST extends orig.AST {
            /* c8 ignore start */
            constructor(type, parent, options = {}) {
                super(type, parent, ext(def, options));
            }
            /* c8 ignore stop */
            static fromGlob(pattern, options = {}) {
                return orig.AST.fromGlob(pattern, ext(def, options));
            }
        },
        unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
        escape: (s, options = {}) => orig.escape(s, ext(def, options)),
        filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
        defaults: (options) => orig.defaults(ext(def, options)),
        makeRe: (pattern, options = {}) => orig.makeRe(pattern, ext(def, options)),
        braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
        match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
        sep: orig.sep,
        GLOBSTAR: GLOBSTAR,
    });
};
minimatch.defaults = defaults;
// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
const braceExpand = (pattern, options = {}) => {
    assertValidPattern(pattern);
    // Thanks to Yeting Li <https://github.com/yetingli> for
    // improving this regexp to avoid a ReDOS vulnerability.
    if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
        // shortcut. no need to expand.
        return [pattern];
    }
    return expand(pattern, { max: options.braceExpandMax });
};
minimatch.braceExpand = braceExpand;
// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
const makeRe = (pattern, options = {}) => new Minimatch(pattern, options).makeRe();
minimatch.makeRe = makeRe;
const match = (list, pattern, options = {}) => {
    const mm = new Minimatch(pattern, options);
    list = list.filter(f => mm.match(f));
    if (mm.options.nonull && !list.length) {
        list.push(pattern);
    }
    return list;
};
minimatch.match = match;
// replace stuff like \* with *
const globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
const regExpEscape = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
class Minimatch {
    options;
    set;
    pattern;
    windowsPathsNoEscape;
    nonegate;
    negate;
    comment;
    empty;
    preserveMultipleSlashes;
    partial;
    globSet;
    globParts;
    nocase;
    isWindows;
    platform;
    windowsNoMagicRoot;
    maxGlobstarRecursion;
    regexp;
    constructor(pattern, options = {}) {
        assertValidPattern(pattern);
        options = options || {};
        this.options = options;
        this.maxGlobstarRecursion = options.maxGlobstarRecursion ?? 200;
        this.pattern = pattern;
        this.platform = options.platform || defaultPlatform;
        this.isWindows = this.platform === 'win32';
        // avoid the annoying deprecation flag lol
        const awe = ('allowWindow' + 'sEscape');
        this.windowsPathsNoEscape =
            !!options.windowsPathsNoEscape || options[awe] === false;
        if (this.windowsPathsNoEscape) {
            this.pattern = this.pattern.replace(/\\/g, '/');
        }
        this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
        this.regexp = null;
        this.negate = false;
        this.nonegate = !!options.nonegate;
        this.comment = false;
        this.empty = false;
        this.partial = !!options.partial;
        this.nocase = !!this.options.nocase;
        this.windowsNoMagicRoot =
            options.windowsNoMagicRoot !== undefined ?
                options.windowsNoMagicRoot
                : !!(this.isWindows && this.nocase);
        this.globSet = [];
        this.globParts = [];
        this.set = [];
        // make the set of regexps etc.
        this.make();
    }
    hasMagic() {
        if (this.options.magicalBraces && this.set.length > 1) {
            return true;
        }
        for (const pattern of this.set) {
            for (const part of pattern) {
                if (typeof part !== 'string')
                    return true;
            }
        }
        return false;
    }
    debug(..._) { }
    make() {
        const pattern = this.pattern;
        const options = this.options;
        // empty patterns and comments match nothing.
        if (!options.nocomment && pattern.charAt(0) === '#') {
            this.comment = true;
            return;
        }
        if (!pattern) {
            this.empty = true;
            return;
        }
        // step 1: figure out negation, etc.
        this.parseNegate();
        // step 2: expand braces
        this.globSet = [...new Set(this.braceExpand())];
        if (options.debug) {
            this.debug = (...args) => console.error(...args);
        }
        this.debug(this.pattern, this.globSet);
        // step 3: now we have a set, so turn each one into a series of
        // path-portion matching patterns.
        // These will be regexps, except in the case of "**", which is
        // set to the GLOBSTAR object for globstar behavior,
        // and will not contain any / characters
        //
        // First, we preprocess to make the glob pattern sets a bit simpler
        // and deduped.  There are some perf-killing patterns that can cause
        // problems with a glob walk, but we can simplify them down a bit.
        const rawGlobParts = this.globSet.map(s => this.slashSplit(s));
        this.globParts = this.preprocess(rawGlobParts);
        this.debug(this.pattern, this.globParts);
        // glob --> regexps
        let set = this.globParts.map((s, _, __) => {
            if (this.isWindows && this.windowsNoMagicRoot) {
                // check if it's a drive or unc path.
                const isUNC = s[0] === '' &&
                    s[1] === '' &&
                    (s[2] === '?' || !globMagic.test(s[2])) &&
                    !globMagic.test(s[3]);
                const isDrive = /^[a-z]:/i.test(s[0]);
                if (isUNC) {
                    return [
                        ...s.slice(0, 4),
                        ...s.slice(4).map(ss => this.parse(ss)),
                    ];
                }
                else if (isDrive) {
                    return [s[0], ...s.slice(1).map(ss => this.parse(ss))];
                }
            }
            return s.map(ss => this.parse(ss));
        });
        this.debug(this.pattern, set);
        // filter out everything that didn't compile properly.
        this.set = set.filter(s => s.indexOf(false) === -1);
        // do not treat the ? in UNC paths as magic
        if (this.isWindows) {
            for (let i = 0; i < this.set.length; i++) {
                const p = this.set[i];
                if (p[0] === '' &&
                    p[1] === '' &&
                    this.globParts[i][2] === '?' &&
                    typeof p[3] === 'string' &&
                    /^[a-z]:$/i.test(p[3])) {
                    p[2] = '?';
                }
            }
        }
        this.debug(this.pattern, this.set);
    }
    // various transforms to equivalent pattern sets that are
    // faster to process in a filesystem walk.  The goal is to
    // eliminate what we can, and push all ** patterns as far
    // to the right as possible, even if it increases the number
    // of patterns that we have to process.
    preprocess(globParts) {
        // if we're not in globstar mode, then turn ** into *
        if (this.options.noglobstar) {
            for (let i = 0; i < globParts.length; i++) {
                for (let j = 0; j < globParts[i].length; j++) {
                    if (globParts[i][j] === '**') {
                        globParts[i][j] = '*';
                    }
                }
            }
        }
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
            // aggressive optimization for the purpose of fs walking
            globParts = this.firstPhasePreProcess(globParts);
            globParts = this.secondPhasePreProcess(globParts);
        }
        else if (optimizationLevel >= 1) {
            // just basic optimizations to remove some .. parts
            globParts = this.levelOneOptimize(globParts);
        }
        else {
            // just collapse multiple ** portions into one
            globParts = this.adjascentGlobstarOptimize(globParts);
        }
        return globParts;
    }
    // just get rid of adjascent ** portions
    adjascentGlobstarOptimize(globParts) {
        return globParts.map(parts => {
            let gs = -1;
            while (-1 !== (gs = parts.indexOf('**', gs + 1))) {
                let i = gs;
                while (parts[i + 1] === '**') {
                    i++;
                }
                if (i !== gs) {
                    parts.splice(gs, i - gs);
                }
            }
            return parts;
        });
    }
    // get rid of adjascent ** and resolve .. portions
    levelOneOptimize(globParts) {
        return globParts.map(parts => {
            parts = parts.reduce((set, part) => {
                const prev = set[set.length - 1];
                if (part === '**' && prev === '**') {
                    return set;
                }
                if (part === '..') {
                    if (prev && prev !== '..' && prev !== '.' && prev !== '**') {
                        set.pop();
                        return set;
                    }
                }
                set.push(part);
                return set;
            }, []);
            return parts.length === 0 ? [''] : parts;
        });
    }
    levelTwoFileOptimize(parts) {
        if (!Array.isArray(parts)) {
            parts = this.slashSplit(parts);
        }
        let didSomething = false;
        do {
            didSomething = false;
            // <pre>/<e>/<rest> -> <pre>/<rest>
            if (!this.preserveMultipleSlashes) {
                for (let i = 1; i < parts.length - 1; i++) {
                    const p = parts[i];
                    // don't squeeze out UNC patterns
                    if (i === 1 && p === '' && parts[0] === '')
                        continue;
                    if (p === '.' || p === '') {
                        didSomething = true;
                        parts.splice(i, 1);
                        i--;
                    }
                }
                if (parts[0] === '.' &&
                    parts.length === 2 &&
                    (parts[1] === '.' || parts[1] === '')) {
                    didSomething = true;
                    parts.pop();
                }
            }
            // <pre>/<p>/../<rest> -> <pre>/<rest>
            let dd = 0;
            while (-1 !== (dd = parts.indexOf('..', dd + 1))) {
                const p = parts[dd - 1];
                if (p && p !== '.' && p !== '..' && p !== '**') {
                    didSomething = true;
                    parts.splice(dd - 1, 2);
                    dd -= 2;
                }
            }
        } while (didSomething);
        return parts.length === 0 ? [''] : parts;
    }
    // First phase: single-pattern processing
    // <pre> is 1 or more portions
    // <rest> is 1 or more portions
    // <p> is any portion other than ., .., '', or **
    // <e> is . or ''
    //
    // **/.. is *brutal* for filesystem walking performance, because
    // it effectively resets the recursive walk each time it occurs,
    // and ** cannot be reduced out by a .. pattern part like a regexp
    // or most strings (other than .., ., and '') can be.
    //
    // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
    // <pre>/<e>/<rest> -> <pre>/<rest>
    // <pre>/<p>/../<rest> -> <pre>/<rest>
    // **/**/<rest> -> **/<rest>
    //
    // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
    // this WOULD be allowed if ** did follow symlinks, or * didn't
    firstPhasePreProcess(globParts) {
        let didSomething = false;
        do {
            didSomething = false;
            // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
            for (let parts of globParts) {
                let gs = -1;
                while (-1 !== (gs = parts.indexOf('**', gs + 1))) {
                    let gss = gs;
                    while (parts[gss + 1] === '**') {
                        // <pre>/**/**/<rest> -> <pre>/**/<rest>
                        gss++;
                    }
                    // eg, if gs is 2 and gss is 4, that means we have 3 **
                    // parts, and can remove 2 of them.
                    if (gss > gs) {
                        parts.splice(gs + 1, gss - gs);
                    }
                    let next = parts[gs + 1];
                    const p = parts[gs + 2];
                    const p2 = parts[gs + 3];
                    if (next !== '..')
                        continue;
                    if (!p ||
                        p === '.' ||
                        p === '..' ||
                        !p2 ||
                        p2 === '.' ||
                        p2 === '..') {
                        continue;
                    }
                    didSomething = true;
                    // edit parts in place, and push the new one
                    parts.splice(gs, 1);
                    const other = parts.slice(0);
                    other[gs] = '**';
                    globParts.push(other);
                    gs--;
                }
                // <pre>/<e>/<rest> -> <pre>/<rest>
                if (!this.preserveMultipleSlashes) {
                    for (let i = 1; i < parts.length - 1; i++) {
                        const p = parts[i];
                        // don't squeeze out UNC patterns
                        if (i === 1 && p === '' && parts[0] === '')
                            continue;
                        if (p === '.' || p === '') {
                            didSomething = true;
                            parts.splice(i, 1);
                            i--;
                        }
                    }
                    if (parts[0] === '.' &&
                        parts.length === 2 &&
                        (parts[1] === '.' || parts[1] === '')) {
                        didSomething = true;
                        parts.pop();
                    }
                }
                // <pre>/<p>/../<rest> -> <pre>/<rest>
                let dd = 0;
                while (-1 !== (dd = parts.indexOf('..', dd + 1))) {
                    const p = parts[dd - 1];
                    if (p && p !== '.' && p !== '..' && p !== '**') {
                        didSomething = true;
                        const needDot = dd === 1 && parts[dd + 1] === '**';
                        const splin = needDot ? ['.'] : [];
                        parts.splice(dd - 1, 2, ...splin);
                        if (parts.length === 0)
                            parts.push('');
                        dd -= 2;
                    }
                }
            }
        } while (didSomething);
        return globParts;
    }
    // second phase: multi-pattern dedupes
    // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
    // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
    // {<pre>/**/<rest>,<pre>/<rest>} -> <pre>/**/<rest>
    //
    // {<pre>/**/<rest>,<pre>/**/<p>/<rest>} -> <pre>/**/<rest>
    // ^-- not valid because ** doens't follow symlinks
    secondPhasePreProcess(globParts) {
        for (let i = 0; i < globParts.length - 1; i++) {
            for (let j = i + 1; j < globParts.length; j++) {
                const matched = this.partsMatch(globParts[i], globParts[j], !this.preserveMultipleSlashes);
                if (matched) {
                    globParts[i] = [];
                    globParts[j] = matched;
                    break;
                }
            }
        }
        return globParts.filter(gs => gs.length);
    }
    partsMatch(a, b, emptyGSMatch = false) {
        let ai = 0;
        let bi = 0;
        let result = [];
        let which = '';
        while (ai < a.length && bi < b.length) {
            if (a[ai] === b[bi]) {
                result.push(which === 'b' ? b[bi] : a[ai]);
                ai++;
                bi++;
            }
            else if (emptyGSMatch && a[ai] === '**' && b[bi] === a[ai + 1]) {
                result.push(a[ai]);
                ai++;
            }
            else if (emptyGSMatch && b[bi] === '**' && a[ai] === b[bi + 1]) {
                result.push(b[bi]);
                bi++;
            }
            else if (a[ai] === '*' &&
                b[bi] &&
                (this.options.dot || !b[bi].startsWith('.')) &&
                b[bi] !== '**') {
                if (which === 'b')
                    return false;
                which = 'a';
                result.push(a[ai]);
                ai++;
                bi++;
            }
            else if (b[bi] === '*' &&
                a[ai] &&
                (this.options.dot || !a[ai].startsWith('.')) &&
                a[ai] !== '**') {
                if (which === 'a')
                    return false;
                which = 'b';
                result.push(b[bi]);
                ai++;
                bi++;
            }
            else {
                return false;
            }
        }
        // if we fall out of the loop, it means they two are identical
        // as long as their lengths match
        return a.length === b.length && result;
    }
    parseNegate() {
        if (this.nonegate)
            return;
        const pattern = this.pattern;
        let negate = false;
        let negateOffset = 0;
        for (let i = 0; i < pattern.length && pattern.charAt(i) === '!'; i++) {
            negate = !negate;
            negateOffset++;
        }
        if (negateOffset)
            this.pattern = pattern.slice(negateOffset);
        this.negate = negate;
    }
    // set partial to true to test if, for example,
    // "/a/b" matches the start of "/*/b/*/d"
    // Partial means, if you run out of file before you run
    // out of pattern, then that's fine, as long as all
    // the parts match.
    matchOne(file, pattern, partial = false) {
        let fileStartIndex = 0;
        let patternStartIndex = 0;
        // UNC paths like //?/X:/... can match X:/... and vice versa
        // Drive letters in absolute drive or unc paths are always compared
        // case-insensitively.
        if (this.isWindows) {
            const fileDrive = typeof file[0] === 'string' && /^[a-z]:$/i.test(file[0]);
            const fileUNC = !fileDrive &&
                file[0] === '' &&
                file[1] === '' &&
                file[2] === '?' &&
                /^[a-z]:$/i.test(file[3]);
            const patternDrive = typeof pattern[0] === 'string' && /^[a-z]:$/i.test(pattern[0]);
            const patternUNC = !patternDrive &&
                pattern[0] === '' &&
                pattern[1] === '' &&
                pattern[2] === '?' &&
                typeof pattern[3] === 'string' &&
                /^[a-z]:$/i.test(pattern[3]);
            const fdi = fileUNC ? 3
                : fileDrive ? 0
                    : undefined;
            const pdi = patternUNC ? 3
                : patternDrive ? 0
                    : undefined;
            if (typeof fdi === 'number' && typeof pdi === 'number') {
                const [fd, pd] = [
                    file[fdi],
                    pattern[pdi],
                ];
                // start matching at the drive letter index of each
                if (fd.toLowerCase() === pd.toLowerCase()) {
                    pattern[pdi] = fd;
                    patternStartIndex = pdi;
                    fileStartIndex = fdi;
                }
            }
        }
        // resolve and reduce . and .. portions in the file as well.
        // don't need to do the second phase, because it's only one string[]
        const { optimizationLevel = 1 } = this.options;
        if (optimizationLevel >= 2) {
            file = this.levelTwoFileOptimize(file);
        }
        if (pattern.includes(GLOBSTAR)) {
            return this.#matchGlobstar(file, pattern, partial, fileStartIndex, patternStartIndex);
        }
        return this.#matchOne(file, pattern, partial, fileStartIndex, patternStartIndex);
    }
    #matchGlobstar(file, pattern, partial, fileIndex, patternIndex) {
        // split the pattern into head, tail, and middle of ** delimited parts
        const firstgs = pattern.indexOf(GLOBSTAR, patternIndex);
        const lastgs = pattern.lastIndexOf(GLOBSTAR);
        // split the pattern up into globstar-delimited sections
        // the tail has to be at the end, and the others just have
        // to be found in order from the head.
        const [head, body, tail] = partial ? [
            pattern.slice(patternIndex, firstgs),
            pattern.slice(firstgs + 1),
            [],
        ] : [
            pattern.slice(patternIndex, firstgs),
            pattern.slice(firstgs + 1, lastgs),
            pattern.slice(lastgs + 1),
        ];
        // check the head, from the current file/pattern index.
        if (head.length) {
            const fileHead = file.slice(fileIndex, fileIndex + head.length);
            if (!this.#matchOne(fileHead, head, partial, 0, 0)) {
                return false;
            }
            fileIndex += head.length;
            patternIndex += head.length;
        }
        // now we know the head matches!
        // if the last portion is not empty, it MUST match the end
        // check the tail
        let fileTailMatch = 0;
        if (tail.length) {
            // if head + tail > file, then we cannot possibly match
            if (tail.length + fileIndex > file.length)
                return false;
            // try to match the tail
            let tailStart = file.length - tail.length;
            if (this.#matchOne(file, tail, partial, tailStart, 0)) {
                fileTailMatch = tail.length;
            }
            else {
                // affordance for stuff like a/**/* matching a/b/
                // if the last file portion is '', and there's more to the pattern
                // then try without the '' bit.
                if (file[file.length - 1] !== '' ||
                    fileIndex + tail.length === file.length) {
                    return false;
                }
                tailStart--;
                if (!this.#matchOne(file, tail, partial, tailStart, 0)) {
                    return false;
                }
                fileTailMatch = tail.length + 1;
            }
        }
        // now we know the tail matches!
        // the middle is zero or more portions wrapped in **, possibly
        // containing more ** sections.
        // so a/**/b/**/c/**/d has become **/b/**/c/**
        // if it's empty, it means a/**/b, just verify we have no bad dots
        // if there's no tail, so it ends on /**, then we must have *something*
        // after the head, or it's not a matc
        if (!body.length) {
            let sawSome = !!fileTailMatch;
            for (let i = fileIndex; i < file.length - fileTailMatch; i++) {
                const f = String(file[i]);
                sawSome = true;
                if (f === '.' ||
                    f === '..' ||
                    (!this.options.dot && f.startsWith('.'))) {
                    return false;
                }
            }
            // in partial mode, we just need to get past all file parts
            return partial || sawSome;
        }
        // now we know that there's one or more body sections, which can
        // be matched anywhere from the 0 index (because the head was pruned)
        // through to the length-fileTailMatch index.
        // split the body up into sections, and note the minimum index it can
        // be found at (start with the length of all previous segments)
        // [section, before, after]
        const bodySegments = [[[], 0]];
        let currentBody = bodySegments[0];
        let nonGsParts = 0;
        const nonGsPartsSums = [0];
        for (const b of body) {
            if (b === GLOBSTAR) {
                nonGsPartsSums.push(nonGsParts);
                currentBody = [[], 0];
                bodySegments.push(currentBody);
            }
            else {
                currentBody[0].push(b);
                nonGsParts++;
            }
        }
        let i = bodySegments.length - 1;
        const fileLength = file.length - fileTailMatch;
        for (const b of bodySegments) {
            b[1] = fileLength - (nonGsPartsSums[i--] + b[0].length);
        }
        return !!this.#matchGlobStarBodySections(file, bodySegments, fileIndex, 0, partial, 0, !!fileTailMatch);
    }
    // return false for "nope, not matching"
    // return null for "not matching, cannot keep trying"
    #matchGlobStarBodySections(file, 
    // pattern section, last possible position for it
    bodySegments, fileIndex, bodyIndex, partial, globStarDepth, sawTail) {
        // take the first body segment, and walk from fileIndex to its "after"
        // value at the end
        // If it doesn't match at that position, we increment, until we hit
        // that final possible position, and give up.
        // If it does match, then advance and try to rest.
        // If any of them fail we keep walking forward.
        // this is still a bit recursively painful, but it's more constrained
        // than previous implementations, because we never test something that
        // can't possibly be a valid matching condition.
        const bs = bodySegments[bodyIndex];
        if (!bs) {
            // just make sure that there's no bad dots
            for (let i = fileIndex; i < file.length; i++) {
                sawTail = true;
                const f = file[i];
                if (f === '.' ||
                    f === '..' ||
                    (!this.options.dot && f.startsWith('.'))) {
                    return false;
                }
            }
            return sawTail;
        }
        // have a non-globstar body section to test
        const [body, after] = bs;
        while (fileIndex <= after) {
            const m = this.#matchOne(file.slice(0, fileIndex + body.length), body, partial, fileIndex, 0);
            // if limit exceeded, no match. intentional false negative,
            // acceptable break in correctness for security.
            if (m && globStarDepth < this.maxGlobstarRecursion) {
                // match! see if the rest match. if so, we're done!
                const sub = this.#matchGlobStarBodySections(file, bodySegments, fileIndex + body.length, bodyIndex + 1, partial, globStarDepth + 1, sawTail);
                if (sub !== false) {
                    return sub;
                }
            }
            const f = file[fileIndex];
            if (f === '.' ||
                f === '..' ||
                (!this.options.dot && f.startsWith('.'))) {
                return false;
            }
            fileIndex++;
        }
        // walked off. no point continuing
        return partial || null;
    }
    #matchOne(file, pattern, partial, fileIndex, patternIndex) {
        let fi;
        let pi;
        let pl;
        let fl;
        for (fi = fileIndex,
            pi = patternIndex,
            fl = file.length,
            pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
            this.debug('matchOne loop');
            let p = pattern[pi];
            let f = file[fi];
            this.debug(pattern, p, f);
            // should be impossible.
            // some invalid regexp stuff in the set.
            /* c8 ignore start */
            if (p === false || p === GLOBSTAR) {
                return false;
            }
            /* c8 ignore stop */
            // something other than **
            // non-magic patterns just have to match exactly
            // patterns with magic have been turned into regexps.
            let hit;
            if (typeof p === 'string') {
                hit = f === p;
                this.debug('string match', p, f, hit);
            }
            else {
                hit = p.test(f);
                this.debug('pattern match', p, f, hit);
            }
            if (!hit)
                return false;
        }
        // Note: ending in / means that we'll get a final ""
        // at the end of the pattern.  This can only match a
        // corresponding "" at the end of the file.
        // If the file ends in /, then it can only match a
        // a pattern that ends in /, unless the pattern just
        // doesn't have any more for it. But, a/b/ should *not*
        // match "a/b/*", even though "" matches against the
        // [^/]*? pattern, except in partial mode, where it might
        // simply not be reached yet.
        // However, a/b/ should still satisfy a/*
        // now either we fell off the end of the pattern, or we're done.
        if (fi === fl && pi === pl) {
            // ran out of pattern and filename at the same time.
            // an exact hit!
            return true;
        }
        else if (fi === fl) {
            // ran out of file, but still had pattern left.
            // this is ok if we're doing the match as part of
            // a glob fs traversal.
            return partial;
        }
        else if (pi === pl) {
            // ran out of pattern, still have file left.
            // this is only acceptable if we're on the very last
            // empty segment of a file with a trailing slash.
            // a/* should match a/b/
            return fi === fl - 1 && file[fi] === '';
            /* c8 ignore start */
        }
        else {
            // should be unreachable.
            throw new Error('wtf?');
        }
        /* c8 ignore stop */
    }
    braceExpand() {
        return braceExpand(this.pattern, this.options);
    }
    parse(pattern) {
        assertValidPattern(pattern);
        const options = this.options;
        // shortcuts
        if (pattern === '**')
            return GLOBSTAR;
        if (pattern === '')
            return '';
        // far and away, the most common glob pattern parts are
        // *, *.*, and *.<ext>  Add a fast check method for those.
        let m;
        let fastTest = null;
        if ((m = pattern.match(starRE))) {
            fastTest = options.dot ? starTestDot : starTest;
        }
        else if ((m = pattern.match(starDotExtRE))) {
            fastTest = (options.nocase ?
                options.dot ?
                    starDotExtTestNocaseDot
                    : starDotExtTestNocase
                : options.dot ? starDotExtTestDot
                    : starDotExtTest)(m[1]);
        }
        else if ((m = pattern.match(qmarksRE))) {
            fastTest = (options.nocase ?
                options.dot ?
                    qmarksTestNocaseDot
                    : qmarksTestNocase
                : options.dot ? qmarksTestDot
                    : qmarksTest)(m);
        }
        else if ((m = pattern.match(starDotStarRE))) {
            fastTest = options.dot ? starDotStarTestDot : starDotStarTest;
        }
        else if ((m = pattern.match(dotStarRE))) {
            fastTest = dotStarTest;
        }
        const re = AST.fromGlob(pattern, this.options).toMMPattern();
        if (fastTest && typeof re === 'object') {
            // Avoids overriding in frozen environments
            Reflect.defineProperty(re, 'test', { value: fastTest });
        }
        return re;
    }
    makeRe() {
        if (this.regexp || this.regexp === false)
            return this.regexp;
        // at this point, this.set is a 2d array of partial
        // pattern strings, or "**".
        //
        // It's better to use .match().  This function shouldn't
        // be used, really, but it's pretty convenient sometimes,
        // when you just want to work with a regex.
        const set = this.set;
        if (!set.length) {
            this.regexp = false;
            return this.regexp;
        }
        const options = this.options;
        const twoStar = options.noglobstar ? star
            : options.dot ? twoStarDot
                : twoStarNoDot;
        const flags = new Set(options.nocase ? ['i'] : []);
        // regexpify non-globstar patterns
        // if ** is only item, then we just do one twoStar
        // if ** is first, and there are more, prepend (\/|twoStar\/)? to next
        // if ** is last, append (\/twoStar|) to previous
        // if ** is in the middle, append (\/|\/twoStar\/) to previous
        // then filter out GLOBSTAR symbols
        let re = set
            .map(pattern => {
            const pp = pattern.map(p => {
                if (p instanceof RegExp) {
                    for (const f of p.flags.split(''))
                        flags.add(f);
                }
                return (typeof p === 'string' ? regExpEscape(p)
                    : p === GLOBSTAR ? GLOBSTAR
                        : p._src);
            });
            pp.forEach((p, i) => {
                const next = pp[i + 1];
                const prev = pp[i - 1];
                if (p !== GLOBSTAR || prev === GLOBSTAR) {
                    return;
                }
                if (prev === undefined) {
                    if (next !== undefined && next !== GLOBSTAR) {
                        pp[i + 1] = '(?:\\/|' + twoStar + '\\/)?' + next;
                    }
                    else {
                        pp[i] = twoStar;
                    }
                }
                else if (next === undefined) {
                    pp[i - 1] = prev + '(?:\\/|\\/' + twoStar + ')?';
                }
                else if (next !== GLOBSTAR) {
                    pp[i - 1] = prev + '(?:\\/|\\/' + twoStar + '\\/)' + next;
                    pp[i + 1] = GLOBSTAR;
                }
            });
            const filtered = pp.filter(p => p !== GLOBSTAR);
            // For partial matches, we need to make the pattern match
            // any prefix of the full path. We do this by generating
            // alternative patterns that match progressively longer prefixes.
            if (this.partial && filtered.length >= 1) {
                const prefixes = [];
                for (let i = 1; i <= filtered.length; i++) {
                    prefixes.push(filtered.slice(0, i).join('/'));
                }
                return '(?:' + prefixes.join('|') + ')';
            }
            return filtered.join('/');
        })
            .join('|');
        // need to wrap in parens if we had more than one thing with |,
        // otherwise only the first will be anchored to ^ and the last to $
        const [open, close] = set.length > 1 ? ['(?:', ')'] : ['', ''];
        // must match entire pattern
        // ending in a * or ** will make it less strict.
        re = '^' + open + re + close + '$';
        // In partial mode, '/' should always match as it's a valid prefix for any pattern
        if (this.partial) {
            re = '^(?:\\/|' + open + re.slice(1, -1) + close + ')$';
        }
        // can match anything, as long as it's not this.
        if (this.negate)
            re = '^(?!' + re + ').+$';
        try {
            this.regexp = new RegExp(re, [...flags].join(''));
            /* c8 ignore start */
        }
        catch (ex) {
            // should be impossible
            this.regexp = false;
        }
        /* c8 ignore stop */
        return this.regexp;
    }
    slashSplit(p) {
        // if p starts with // on windows, we preserve that
        // so that UNC paths aren't broken.  Otherwise, any number of
        // / characters are coalesced into one, unless
        // preserveMultipleSlashes is set to true.
        if (this.preserveMultipleSlashes) {
            return p.split('/');
        }
        else if (this.isWindows && /^\/\/[^\/]+/.test(p)) {
            // add an extra '' for the one we lose
            return ['', ...p.split(/\/+/)];
        }
        else {
            return p.split(/\/+/);
        }
    }
    match(f, partial = this.partial) {
        this.debug('match', f, this.pattern);
        // short-circuit in the case of busted things.
        // comments, etc.
        if (this.comment) {
            return false;
        }
        if (this.empty) {
            return f === '';
        }
        if (f === '/' && partial) {
            return true;
        }
        const options = this.options;
        // windows: need to use /, not \
        if (this.isWindows) {
            f = f.split('\\').join('/');
        }
        // treat the test path as a set of pathparts.
        const ff = this.slashSplit(f);
        this.debug(this.pattern, 'split', ff);
        // just ONE of the pattern sets in this.set needs to match
        // in order for it to be valid.  If negating, then just one
        // match means that we have failed.
        // Either way, return on the first hit.
        const set = this.set;
        this.debug(this.pattern, 'set', set);
        // Find the basename of the path by looking for the last non-empty segment
        let filename = ff[ff.length - 1];
        if (!filename) {
            for (let i = ff.length - 2; !filename && i >= 0; i--) {
                filename = ff[i];
            }
        }
        for (let i = 0; i < set.length; i++) {
            const pattern = set[i];
            let file = ff;
            if (options.matchBase && pattern.length === 1) {
                file = [filename];
            }
            const hit = this.matchOne(file, pattern, partial);
            if (hit) {
                if (options.flipNegate) {
                    return true;
                }
                return !this.negate;
            }
        }
        // didn't get any hits.  this is success if it's a negative
        // pattern, failure otherwise.
        if (options.flipNegate) {
            return false;
        }
        return this.negate;
    }
    static defaults(def) {
        return minimatch.defaults(def).Minimatch;
    }
}
/* c8 ignore stop */
minimatch.AST = AST;
minimatch.Minimatch = Minimatch;
minimatch.escape = escape;
minimatch.unescape = unescape$1;

function globArray(patterns, options) {
  const list = [];

  patterns.forEach(pattern => {
    if (pattern[0] === '!') {
      let i = list.length-1;
      while(i > -1) {
        if (!minimatch(list[i], pattern)) {
          list.splice(i, 1);
        }
        i--;
      }

    }
    else {
      const newList = fg.sync(pattern, options);
      newList.forEach(item => {
        if (list.indexOf(item)===-1) {
          list.push(item);
        }
      });
    }
  });

  return list;
}

function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }
// ESM-safe require (handles config files that are CJS modules)
const _require = module$1.createRequire((typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === 'SCRIPT' && _documentCurrentScript.src || new URL('postcss.cjs', document.baseURI).href)));

// ─── Types ────────────────────────────────────────────────────────────────────




















// ─── State & Caching ──────────────────────────────────────────────────────────

let _processor = null;
let _lastConfigMtime = 0;
let _resolvedConfigFile;

// Cache to prevent re-reading/re-parsing unchanged files during HMR
const _fileCache = new Map();

function getProcessor(configFile) {
  if (configFile && fs$4.existsSync(configFile)) {
    const mtime = fs$4.statSync(configFile).mtimeMs;
    const isSameFile = configFile === _resolvedConfigFile;
    const isUnchanged = mtime === _lastConfigMtime;

    if (_processor === null || !isSameFile || !isUnchanged) {
      const resolved = _require.resolve(configFile);
      delete _require.cache[resolved];
      
      try {
        const config = _require(resolved);
        _processor = new Processor(config);
      } catch (e) {
        console.error('[cloudcss] Error loading configuration:', e);
        throw e;
      }
      
      _lastConfigMtime = mtime;
      _resolvedConfigFile = configFile;
    }
  } else if (_processor === null) {
    _processor = new Processor();
  }

  return _processor;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

function cloudcssPlugin(options = {}) {
  const configFile = options.config ? path$2.resolve(options.config) : undefined;

  return {
    postcssPlugin: 'cloudcss',

    async AtRule(atRule, { result }) {
      if (atRule.name !== 'cloudcss') return;

      const processor = getProcessor(configFile);
      const config = processor.allConfig ;
      const parent = result.opts.from;

      // Helper to safely register dependencies and bypass Turbopack's bridge bugs
      const registerDependency = (msg) => {
        // Only append parent if it is strictly defined
        if (parent) msg.parent = parent;
        result.messages.push(msg );
      };

      // ── Register config file as a dependency ──────────────────────────────
      if (_resolvedConfigFile) {
        registerDependency({
          type: 'dependency',
          plugin: 'cloudcss',
          file: path$2.normalize(_resolvedConfigFile),
        });
      }

      // ── Resolve file list ──────────────────────────────────────────────────
      const patterns = _nullishCoalesce(_optionalChain([config, 'access', _ => _.extract, 'optionalAccess', _2 => _2.include]), () => ( ['src/**/*.{js,ts,jsx,tsx}']));
      const exclude  = _nullishCoalesce(_optionalChain([config, 'access', _3 => _3.extract, 'optionalAccess', _4 => _4.exclude]), () => ( ['node_modules', '.git', '.next']));
      const cwd = configFile ? path$2.dirname(configFile) : process.cwd();

      const files = globArray(
        [...patterns, ...exclude.map((i) => `!${i}`)],
        { cwd }
      )
        .map((f) => path$2.resolve(f))
        .filter(fs$4.existsSync);

      // ── Register files + directories as HMR dependencies ──────────────────
      const watchedDirs = new Set();

      for (const file of files) {
        registerDependency({
          type: 'dependency',
          plugin: 'cloudcss',
          file: path$2.normalize(file),
        });
        watchedDirs.add(path$2.dirname(file));
      }

      for (const dir of watchedDirs) {
        registerDependency({
          type: 'dir-dependency',
          plugin: 'cloudcss',
          dir: path$2.normalize(dir),  // Standard PostCSS expectation
          file: path$2.normalize(dir), // 🚨 THE FIX: Satisfies Turbopack's generic buggy bridge
          glob: '**/*',              // Safe fallback for other bundlers
        });
      }

      // ── Parse files in parallel (with caching) ───────────────────────────
      const styleSheet = new StyleSheet();

      const settled = await Promise.allSettled(
        files.map(async (file) => {
          const stats = await fs$4.promises.stat(file);
          const mtime = stats.mtimeMs;
          const cached = _fileCache.get(file);

          if (cached && cached.mtime === mtime) {
            return cached;
          }

          const content = await fs$4.promises.readFile(file, 'utf8');
          const classes  = new HTMLParser(content)
            .parseClasses()
            .map((i) => i.result);

          const utilityStyleSheet = processor.interpret(classes.join(' ')).styleSheet;
          
          const cacheEntry = { mtime, content, utilityStyleSheet };
          _fileCache.set(file, cacheEntry);
          
          return cacheEntry;
        })
      );

      // Cache cleanup: Remove files that no longer exist
      const currentFilesSet = new Set(files);
      for (const cachedFilePath of _fileCache.keys()) {
        if (!currentFilesSet.has(cachedFilePath)) {
          _fileCache.delete(cachedFilePath);
        }
      }

      // ── Compile Styles ─────────────────────────────────────────────────────
      for (let i = 0; i < settled.length; i++) {
        const item = settled[i];

        if (item.status === 'rejected') {
          console.warn(`[cloudcss] Warning: Skipping "${files[i]}" due to error:`, item.reason);
          continue;
        }

        const { content, utilityStyleSheet } = item.value;
        styleSheet.extend(utilityStyleSheet);

        if (config.preflight) {
          styleSheet.extend(processor.preflight(content));
        }
      }

      // ── Emit ───────────────────────────────────────────────────────────────
      const css = styleSheet.sort().combine().build(options.minify);
      atRule.replaceWith(postcss.parse(css) );
    },
  };
}

cloudcssPlugin.postcss = true;

module.exports = cloudcssPlugin;

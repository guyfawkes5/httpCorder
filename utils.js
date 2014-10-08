var util = require('util');

module.exports = {
    alias: alias,
	apply: apply,
	each: each,
	filter: filter
};

function each(iter, fn) {
	if (util.isArray(iter)) {
		for (var i = 0, l = iter.length; i < l; ++i) {
			if (fn.call(iter, iter[i], i) === false) {
				break;
			}
		}
	} else {
		for (var i in iter) {
			fn.call(iter, i, iter[i]);
		}
	}
}

function apply() {
	var args = Array.prototype.slice.call(arguments),
		i, target, source, property;
	for (i = args.length - 1; i > 0; --i) {
		target = args[i - 1];
		source = args[i];
		for (property in source) {
			if (hasOwnProperty.call(source, property)) {
				target[property] = source[property];
			}
		}
	}
	return target;
}

function filter(obj, props) {
	var filtered = {};
	each(props, function(prop) {
		if (typeof prop === 'object') {
			filtered[prop] = filter(obj[prop], prop);
		} else {
			filtered[prop] = obj[prop];
		}
	});
	return filtered;
}

function alias(obj, props) {
    each(props, function (prop) {
        obj[props[prop]] = obj[prop];
    });
}
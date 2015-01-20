var util = require('util');

module.exports = {
	apply: apply,
	each: each,
	filter: filter,
    mask: mask
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

function filter(obj, props, limit) {
	var filtered = {};
	each(props, function(prop) {
		if (limit > 0 && typeof props[prop] === 'object') {
			filtered[prop] = filter(obj[prop], props[prop], limit - 1);
		} else {
			filtered[prop] = obj[prop];
		}
	});
	return filtered;
}

function mask(target, maskObj) {
    each(maskObj, function(key, val) {
        if (typeof val === 'object') {
            mask(target[key], maskObj[key]);
        } else if (val === false) {
            delete target[key];
        }
    });
    return target;
}
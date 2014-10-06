var util = require('util');

module.exports = {
	apply: apply,
	each: each,
	filter: filter,
	equals: equals,
	isEmptyObject: isEmptyObject,
	clone: clone,
	filterIn: filterIn
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

function equals(first, second) {
	second = clone(second);
	for (var prop in first) {
		if (hasOwnProperty.call(first, prop)) {
			if (first[prop] !== second[prop]) {
				return false;
			} else {
				delete second[prop];
			}
		}
	}
	return isEmptyObject(second);
}

function isEmptyObject(obj) {
	for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
        	return false;
        }
    }
	return true;
}

function clone(obj) {
	var cloneObj = obj.constructor(),
		key;
	if (obj === null || typeof(obj) !== 'object') {
        return obj;
	}
    for (key in obj) {
    	cloneObj[key] = clone(obj[key]);
    }
    return cloneObj;
}

function filterIn(obj, filter) {
	var filtered = {};
	each(filter, function(name) {
		if (obj[name]) {
			filtered[name] = obj[name];
		}
	});
	return filtered;
}

function filterOut(obj, filter) {
	each(filter, function(name) {
		delete obj[name];
	});
	return obj;
}
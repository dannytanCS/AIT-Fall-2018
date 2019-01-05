// hoffy.js

function longestString(...args){
    if (args.length === 0) {
        return undefined;
    }
    return args.reduce(function (a, b) { return a.length > b.length ? a : b; });
}

function maybe(fn) {
    function newFunction(...args) {
        const dummy = args.filter( word => word === undefined || word === null);
        return dummy.length === 0 ? fn(...args): undefined;
    }
    return newFunction;
}


function filterWith(fn) {
    function newFunction(arg) {
		return arg.filter(fn);
	}
	return newFunction;
}

function steppedForEach(arr, fn, step) {
    if (arr.length === 0) {
        return;
    }
    fn.apply(this, arr.slice(0, step));
    return steppedForEach(arr.slice(step, arr.length), fn, step);
}


function constrainDecorator(fn, min, max) {
    function newFunction(arg) {
        if (min === undefined || max === undefined) {
            return fn(arg);
        }
        else if (arg < min) {
            return fn(min);
        }
        else if (arg > max) {
            return fn(max);
        }
        else {
            return fn(arg);
        }
    }
    return newFunction;
}


function limitCallsDecorator(fn, n) {
    let count = 0;
    const maxCount = n;
    function newFunction(...args) {
        if (count < maxCount) {
            count++;
            return fn(args);
        }
        else {
            return undefined;
        }
    }
    return newFunction;
}

function bundleArgs(fn, ...args) {
    function newFunction(...otherArgs) {
        return fn.apply(this, args.concat(otherArgs));
    }
    return newFunction;
}

function sequence(...args) {
    function newFunction(arg) {
        return args.reduce((ans, fn) => fn(ans), arg);
    }
    return newFunction;
}

module.exports = {
    longestString: longestString,
    maybe: maybe,
    filterWith: filterWith,
    steppedForEach: steppedForEach,
    constrainDecorator: constrainDecorator,
    limitCallsDecorator: limitCallsDecorator,
    bundleArgs: bundleArgs,
    sequence: sequence
};
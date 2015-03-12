define(function(require, exports, module) {
	function createContext(baseClass, params) {
		var classNames = {};
		var modifiers = {};
		var defaultParams = {
			format: {
				block: 'b{Name}',
				element: '__e{Name}',
				modifier: '__m{Name}'
			},
			root: ''
		};

		var params = extend({}, defaultParams, params);
		var abstract = {
			element: function(name) {
				return createContext(format(params.format.element, name), {
					root: baseClass
				});
			},

			add: {
				modifier: addModifier,
				className: addClassName
			},

			remove: {
				modifier: removeModifier,
				className: removeClassName
			},

			toString: function() {
				var result = [format(params.format.block, baseClass)];

				Object.keys(modifiers).forEach(function(modifier) {
					if (modifiers[modifier]) {
						result.push(format(params.format.modifier, modifier));
					}
				});

				Object.keys(classNames).forEach(function(name) {
					if (classNames[name]) {
						result.push(name);
					}
				});

				return result.join(' ');
			}
		};

		function format(rule, name) {
			return baseClass + '-' + name;
		}

		function addModifier(name) {
			add(name, modifiers);
			return abstract;
		}

		function addClassName(name) {
			add(name, classNames);
			return abstract;
		}

		function removeModifier(name) {
			remove(name, modifiers);
			return abstract;
		}

		function removeClassName(name) {
			remove(name, classNames);
			return abstract;
		}

		// Возвращаем инстанс.
		return Object.create(abstract);
	}

	function extend(target) {
		var sources = Array.prototype.slice.call(arguments, 1);

		sources.forEach(function(source) {
			if (source) {
				for (var prop in source) {
					target[prop] = source[prop];
				}
			}
		});

		return target;
	}

	function set(dictionary, name, value) {
		if (name != null) {
			if (typeof(name) === 'string') {
				dictionary[name] = !!value;
			} else if (typeof(name) === 'object') {
				var items = name;

				if (!(name instanceof Array)) {
					items = Object.keys(name);
				}

				items.forEach(function(item) {
					dictionary[item] = !!value;
				});
			}
		}
	}

	function add(name, dictionary) {
		set(dictionary, name, true);
	}

	function remove(name, dictionary) {
		set(dictionary, name, false);
	}

	module.exports = function createBlock(baseClass) {
		return createContext(baseClass);
	}
});
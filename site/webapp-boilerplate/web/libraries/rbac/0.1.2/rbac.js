// rbac, v0.1.2
// Copyright (c)2013 Cheton Wu (cheton).
// Distributed under MIT license
(function () {

    var root = this,
        jQuery = root.jQuery,
        rbac = {},
        currentRole = false;

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = rbac;
    } else {
        root.rbac = root.rbac || rbac;
    }

    // defaults
    var o = {
        debug: false,
        addjQueryPlugin: true,
        role: false,
        rules: {}
    };

    function unique(arr) {
        var hash = {}, result = [];
        for (var i = 0, l = arr.length; i < l; ++i) {
            if ( ! hash.hasOwnProperty(arr[i]) ) {
                hash[ arr[i] ] = true;
                result.push(arr[i]);
            }
        }
        return result;
    }

    function array_intersect(arr1) {
        // http://kevin.vanzonneveld.net
        // +   original by: Brett Zamir (http://brett-zamir.me)
        // %        note 1: These only output associative arrays (would need to be
        // %        note 1: all numeric and counting from zero to be numeric)
        // *     example 1: $array1 = {'a' : 'green', 0:'red', 1: 'blue'};
        // *     example 1: $array2 = {'b' : 'green', 0:'yellow', 1:'red'};
        // *     example 1: $array3 = ['green', 'red'];
        // *     example 1: $result = array_intersect($array1, $array2, $array3);
        // *     returns 1: {0: 'red', a: 'green'}
        var retArr = {},
        argl = arguments.length,
        arglm1 = argl - 1,
        k1 = '',
        arr = {},
        i = 0,
        k = '';

        arr1keys: for (k1 in arr1) {
            arrs: for (i = 1; i < argl; i++) {
                arr = arguments[i];
                for (k in arr) {
                    if (arr[k] === arr1[k1]) {
                        if (i === arglm1) {
                            retArr[k1] = arr1[k1];
                        }
                        // If the innermost loop always leads at least once to an equal value, continue the loop until done
                        continue arrs;
                    }
                }
                // If it reaches here, it wasn't found in at least one array, so try next value
                continue arr1keys;
            }
        }

        return retArr;
    }

    function extend(target, source) {
        if ( ! source || typeof source === 'function') {
            return target;
        }
        
        for (var attr in source) {
            target[attr] = source[attr];
        }
        return target;
    }

    function inheritsRolePermissions(rules) {

        function inheritedRolePermissions(role, rules) {
            if ( ! rules[role]) {
                return;
            }
            var permissions = rules[role].permissions || [];
            rules[role].inherits = rules[role].inherits || [];
            for (var i = 0; i < rules[role].inherits.length; ++i) {
                var inheritedRole = rules[role].inherits[i];
                permissions = unique(permissions.concat(inheritedRolePermissions(inheritedRole, rules)));
            }
            return permissions;
        }

        for (var role in rules) {
            if ( ! rules.hasOwnProperty(role)) {
                continue;
            }
            rules[role].permissions = inheritedRolePermissions(role, rules);
            if (o.debug) {
                console.log('role=' + role + ', permissions=[' + rules[role].permissions.join(', ') + ']');
            }
        }
    }

    function init(options, cb) {
        
        if (typeof options === 'function') {
            cb = options;
            options = {};
        }
        options = options || {};
        
        // Overrides defaults with passed in options
        extend(o, options);

        currentRole = o.role;

        inheritsRolePermissions(o.rules);

        // Adds JQuery plugin
        if ($ && o.addjQueryPlugin) {
            addjQueryPlugin();
        }

        if (cb) {
            cb(rbac);
        }
    }

    function setRole(role, cb) {
        return init({role: role}, cb);
    }
    
    function role() {
        return currentRole;
    }

    function permissions(role) {
        if (role === undefined) {
            role = currentRole;
        }
        return (o.rules[role] && o.rules[role].permissions) || [];
    }

    function addjQueryPlugin() {
    
        function parse(el) {
            var roles = el.data('rbac-roles') || '';
            var permissions = el.data('rbac-permissions') || '';

            if (roles.length > 0) {
                roles = roles.split(',');
            } else {
                roles = [];
            }
            if (permissions.length > 0) {
                permissions = permissions.split(',');
            } else {
                permissions = [];
            }

            if (o.role === false) {
                el.remove();
                return;
            }

            // Assertion checking: current role must exist in rule settings
            if ( ! o.rules[o.role]) {
                el.remove();
                return;
            }

            // Check if role exists
            if (roles.length > 0) {
                if (jQuery.inArray(o.role, roles) < 0) {
                    el.remove();
                    return;
                }
            }

            // Find intersection of two arrays and check permissions
            if (permissions.length > 0) {
                var obj = array_intersect(o.rules[o.role].permissions || [], permissions);
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        ++size;
                    }
                }
                if (size === 0) {
                    el.remove();
                    return;
                }
            }

        }
    
        // fn
        jQuery.fn.rbac = function() {
            return this.each(function() {
                // self
                parse($(this));
    
                // child elements
                var els = $(this).find('[data-rbac-roles],[data-rbac-permissions]');
                els.each(function() { 
                    parse($(this));
                });
            });
        };
    }

    // public api interface
    rbac.init = init;
    rbac.setRole = setRole;
    rbac.role = role;
    rbac.permissions = permissions;

}());

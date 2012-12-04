/**
 * jQuery Checkbox Set Plugin (https://github.com/cheton/jquery-checkboxset)
 *
 * Copyright (c) Cheton Wu (https://github.com/cheton)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

    $.fn.checkboxset = function(options) {
        var defaults = {
            tristate : true,
            data : {},
            change : function(name) { }
        };

        var config = $.extend({}, defaults, options, { $_selector : $(this) });

        /**
         * Public Methods
         */

        /**
         * Returns the checked status with the given name
         */
        this.checked = function(name) {
            return config.$_selector.find("input[name='" + name + "']").prop("checked");
        }

        /**
         * Returns the indeterminate status with the given name
         */
        this.indeterminate = function(name) {
            return config.$_selector.find("input[name='" + name + "']").prop("indeterminate");
        }

        __init__(config, config.data, "");

        return this;
    }

    /**
     * Private Methods
     */

    __init__ = function(config, obj, prefix) {
        for (var key in obj) {
            var checked = false;
            var val = obj[key];
            if (isset(val.checked)) {
                config.$_selector.find("input[name='" + key + "']").each(function() {
                    $(this).prop("checked", val.checked);
                });
                delete val.checked;
            }
            if ( ! empty(val)) {
                __init__(config, val, empty(prefix) ? key : prefix + "." + key);
            }
            config.$_selector.find("input[name='" + key + "']").each(function(index) {
                $(this).on(
                    "click", { prefix : prefix, name : key, descendants : val },
                    function(e) {
                        var checked = $(this).prop("checked");
                        traverse_descendants(config, e.data.descendants, checked);
                        traverse_ancestors(config, e.data.prefix);
                        config.change(e.data.name, index); // change callback
                    }
                );
            });
        }
        traverse_ancestors(config, prefix);
    }

    traverse_descendants = function(config, objs, checked) {
        for (var key in objs) {
            var val = objs[key];
            if ( ! empty(val)) {
                traverse_descendants(config, val, checked);
            }
            config.$_selector.find("input[name='" + key + "']").each(function() {
                $(this).prop("checked", checked);
            });
            if (config.tristate) {
                config.$_selector.find("input[name='" + key + "']").each(function() {
                    $(this).prop("indeterminate", false);
                });
            }
        }
    }

    traverse_ancestors = function(config, prefix) {
        if (empty(prefix))
            return;
        var arr = prefix.split(".");
        var obj = config.data;
        for (var i = 0; i < arr.length; i++) {
            obj = obj[arr[i]];
            if ( ! isset(obj))
                break; // skip undefined or null object
        }
        var count = 0, checked = 0, indeterminate = 0;
        for (var name in obj) {
            config.$_selector.find("input[name='" + name + "']").each(function() {
                if ($(this).prop("checked")) {
                    ++checked;
                }
                if ($(this).prop("indeterminate")) {
                    ++indeterminate;
                }
                ++count;
            });
        }
        var name = arr.pop();
        config.$_selector.find("input[name='" + name + "']").each(function() {
            $(this).prop("checked", checked > 0);
        });
        if (config.tristate) {
            config.$_selector.find("input[name='" + name + "']").each(function() {
                $(this).prop("indeterminate", (checked > 0 && count != checked) || (indeterminate > 0));
            });
        }
        traverse_ancestors(config, arr.join("."));
    }

    function isset(mixed_var) {
        return (mixed_var != null) && (mixed_var != undefined);
    }

    function empty(mixed_var) {
        if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false || typeof mixed_var === 'undefined') {
            return true;
        }

        if ( ! mixed_var) {
            return true;
        }
        if (typeof mixed_var == 'object') {
            for (var key in mixed_var) {
                return false;
            }
            return true;
        }
        return false;
    }

})(jQuery);

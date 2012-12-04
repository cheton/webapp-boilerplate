/**
 * jQuery Localize Plugin (https://github.com/cheton/jquery-localize)
 *
 * Copyright (c) Cheton Wu (https://github.com/cheton)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

    $.fn.localize = function(options) {
        var defaults = {
            attr : "l10n",
            data : {},
            sections : []
        };

        var config = $.extend({}, defaults, options, { $_selector : $(this) });

        config.$_selector.find("*[" + config.attr + "]").each(function() {
            var $this = $(this);
            var name = $this.attr(config.attr);
            var value = null;

            if ( ! isset(name) || name == "")
                return;

            for (i in config.sections) {
                value = getObjectValue(config.data[config.sections[i]], name);
                if (isset(value))
                    break;
            }
            if ( ! isset(value)) {
                value = getObjectValue(config.data, name); // finally use the absolute name
            }
        
            if (isset(value)) {
                var tag_name = $this.get(0).tagName;
                switch (tag_name) {
                    case 'INPUT': {
                        var type_name = $this.attr('type').toUpperCase();
                        if (type_name == 'BUTTON' || type_name == 'SUBMIT' || type_name == 'RESET' || type_name == 'HIDDEN' || type_name == 'TEXT') {
                            $this.attr('value', value);
                        } else if (type_name == 'CHECKBOX' || type_name == 'RADIO') {
                            $this.after(value);
                        }
                    }
                    break;

                    case 'A':
                    case 'IMG': {
                        $this.attr('title', value);
                    }
                    break;

                    default: {
                        $this.html(value);
                    }
                    break;
                }
            } else {
                if ($.browser.mozilla) {
                    console.log("Cannot find localized string with the name: " + name);
                }
            }
        });
    }
    
    /**
     * Private Methods
     */

    function isset(mixed_var) {
        return (mixed_var != null) && (mixed_var != undefined);
    }

    function getObjectValue(obj, key) {
        var r = new RegExp(/([\w\-\.]+)\[([^\]]*)\]/);
        var val, arr;

        if ( ! obj || ! key)
            return null;

        arr = key.split('.');
        for (var i = 0; i < arr.length; i++) {
            var match = arr[i].match(r);
            if (match) {
                match[2] = trim(match[2], "\"'");
                obj = obj[match[1]] ? obj[match[1]][match[2]] : null;
            } else {
                obj = obj[arr[i]];
            }
            if ( ! isset(obj))
            break; // skip undefined or null object
        }
        return obj;
    }

})(jQuery);

define(function(require, exports, module) {
"use strict";

var $ = require("libs.jquery");
var i18n = require("libs.i18next");
var router = require("libs.director");

function changePage(url) {
    $("iframe[id='body-content']").attr("src", url);
}

var routes = {
    '/basic': function() {
        changePage('basic.html');
    },
    '/advanced': function() {
        changePage('advanced.html');
    },
    '/table': function() {
        changePage('table.html');
    }
};

module.exports = {
    init: function(app) {
        var _self = this;
        var defaultPage = "#/basic";
        var activePage = location.hash;

        if ( ! activePage) {
            location.hash = defaultPage;
        }

        $("ul[id='sidebar'] li").each(function() {
            var $anchor = $(this).find('a');
            if ($anchor.attr('href') === activePage) {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
        });

        $("#sidebar").on("click", "li", function() {
            $(this).siblings().removeClass("active");
            $(this).addClass("active");
        });

        $("select[id='setLng'] option").each(function() {
            var val = $(this).val();
            if (i18n.lng() === val) {
                $(this).prop("selected", "selected");
            }
        });

        $("select[id='setLng']").change(function() {
            var lng = $(this).find("option:selected").val();
            $.ajax({
                url: '/api/locale/' + lng,
                success: function() {
                    console.log('set lng to ' + lng);
                    window.location.reload();
                }
            });
        });

        $("body").i18n();

        // Client-side routing (aka hash-routing)
        router(routes).init();
    }
};

});

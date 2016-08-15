$(function() {
    "use strict";
    var Engine = {
        globals: {
            fastclick: function() {
                FastClick.attach(document.body);
            }, // end fastclick
            foundation: function() {
                $(document).foundation();
            } // end foundation
        }
    };
    Engine.globals.fastclick();
    Engine.globals.foundation();
});

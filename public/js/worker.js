// Import qlb scripts.
importScripts(
    '../qlb/qlb.js',
    '../qlb/parser.js', 
    '../qlb/primitives.js'
);

// What actions can be called from outside the worker.
var actions = {
    isLineEnd: function (str) {
        function callback (result) {
            postMessage({
                type: 'isLineEndResult',
                data: result
            });
        }
        if (/\n\s*$/.test(str)) {
            // Empty line, don't continue.
            callback(false);
        } else {
            try {
                Qlb.parser.parse(str);
                callback(false);
            } catch (e) {
                if (/\)$/.test(str)) {
                    // Indent once.
                    callback(1);
                } else {
                    // Continue line just don't indent.
                    callback(0);
                }
            } 
        }
    },
    execute: function (data) {
        var ret = Qlb.execute(data);
        // XXX: Fix.
        // Execute may return a function and worker messaging can't handle
        // function transport.
        if (typeof ret === 'function') {
            ret = undefined;
        }
        postMessage({
            type: 'result',
            data: ret
        });
    }
};

Qlb.init({
    console: {
        log: function (str) {
            postMessage({
                type: 'log',
                data: str
            });
        },
        warn: function (str) {
            postMessage({
                type: 'warn',
            data: str
            });
        }
    }
});

self.addEventListener('message', function(e) {

    var action = e.data.type,
        data = e.data.data;
    if (actions[action]) {
        actions[action](data);
    }

}, false);


// vim: set et fenc=utf-8 ff=unix sts=4 sw=4 ts=4 : 

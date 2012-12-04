module.exports = function(grunt) {

var fs = require('fs');
var path = require('path');

function rtrim(str, charlist) {
    // Removes trailing whitespace  
    charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');
    var re = new RegExp('[' + charlist + ']+$', 'g');
    return (str + '').replace(re, '');
}

function rmdir(dir) {
    if (fs.existsSync(dir)) {
        var stats = fs.lstatSync(dir);
        if ( ! stats.isDirectory()) {
            fs.unlinkSync(dir);
            return;
        }

        var list = fs.readdirSync(dir);
        for(var i = 0; i < list.length; i++) {
            var filename = path.join(dir, list[i]);
            var stat = fs.statSync(filename);
            
            if(filename == "." || filename == "..") {
                // pass these files
            } else if(stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename);
            } else {
                // rm fiilename
                fs.unlinkSync(filename);
            }
        }
        fs.rmdirSync(dir);
    } else {
        fs.unlinkSync(dir);
    }
}

// Register a deploy task to deploy packages to the distribution directory
grunt.registerMultiTask('clean', 'Clean the distribution directory.', function() {
    var list = this.data;

    list.forEach(function(item) {
        var dirs = grunt.file.expand(item);

        dirs.forEach(function(dir) {
            dir = rtrim(dir, path.separator);
            grunt.log.writeln('Cleaning the ' + dir);
            try {
                rmdir(dir);
                grunt.log.ok();
            } catch (e) {
                grunt.log.error(e);
                grunt.verbose.error(e);
                grunt.fail.warn('Clean operation failed.');
            }
        });
    });
});

};

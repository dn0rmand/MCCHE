module.exports = function(grunt) 
{
    // Project configuration.
    grunt.initConfig(
    {
        cssmin: {
            options: {
                sourceMap:false
            },
            "dist/css/mcche.min.css": [
                "source/css/bootstrap.css",
                "source/css/style.css",
                "source/css/font-awesome.css",
                "sources/css/lsb.css"				                
            ]
        },
        uglify: {
            options: {
                __compress: 
                {
                    unused:false,
                    dead_code:true
                },
                compress:false,
                preserveComments: false,
                beautify: false,
                mangle:true,
                sourceMap: false
            },
            'dist/js/mcche.min.js': [
                    'source/js/jquery-1.11.1.min.js',
                    'source/js/bootstrap.js',
                    'source/js/w3.js',
                    'source/js/responsiveslides.min.js',
                    'source/js/jarallax.js',
                    'source/js/SmoothScroll.min.js',
                    'source/js/move-top.js',
                    'source/js/easing.js',
                    'source/js/lsb.min.js',
                    "source/js/decode.js"
            ]
        },
        watch: {
            css: {
              files: 'source/css/*',
              tasks: ['cssmin'],
              options: {
                atBegin:true
              },
            },
            js: {
                files: 'source/js/*',
                tasks: ['uglify'],
                options: {
                    atBegin:true
                },
            },
            html: {
              files: ['source/*', 'source/include/.*', '!source/css/*', '!source/js/*'],
              tasks: ['build'],
              options: {
                atBegin:true
              },
            }
          }        
    });

    grunt.task.registerTask('build', 'Copy files to dist an pre-process them', function(arg1, arg2) 
	{
        const fsExtra    = require("fs-extra");
        const fileSystem = require("file-system");
        const Path       = require("path");
        
        var templates = {};

        //var log = grunt.log.writeln;
        var log = function() { }

        function copyFile(filename)
        {
            var deep    = filename.split(Path.sep).length-1;
            var destin  = Path.join("dist", filename);
            var source  = Path.join("source", filename);
            var options = undefined;
            var stats   = fsExtra.statSync(source);
                
        //    stats.atime = stats.atime || stats.ctime;
        //    stats.mtime = stats.mtime || stats.atime;
        
            if (Path.extname(source).toLowerCase() == ".html")
            {
                options = 
                {
                    encoding: "utf8",
                    process: function(content) 
                    {
                        return replace(content, deep, stats);
                    }
                }
            }
        
            fileSystem.copyFileSync(source, destin, options);
            fsExtra.utimesSync(destin, stats.atime, stats.mtime);
        
            return destin;
        }
        
        function loadTemplate(name, refPath, tags)
        {
            var template = templates[name];
        
            if (template === undefined) 
            {
                log("Loading template " + name);
        
                var path    = "source/include/." + name + ".html";
                var content = fsExtra.readFileSync(path, "utf8");
                var stats   = fsExtra.statSync(path)
        
                template = { content:content, stats: stats };
                templates[name] = template;
            }
        
            // Make a copy
            template = {
                content: template.content,
                stats:   template.stats
            };
        
            if (template.content.indexOf("{{refPath}}") < 0)
            {
                log("no {{refPath}} in template " + name);
            }
        
            template.content = template.content.replace(/{{refPath}}/g, refPath);
        
            if (tags)
            {
                tags.split(",").forEach(function(tag) 
                {
                    var t = tag.trim();
                    if (t.length > 0) 
                    {
                        var s = 'tag="'+t+'"';
                        var r = 'active="true"';
        
                        template.content = template.content.replace(s, r);
                    }
                });
            }
        
            return template;
        }
        
        function replace(content, deep, stats)
        {
            var refPath = "";
        
            if (deep > 0)
            {
                var p = [];
                for(var i = 0; i < deep; i++)
                    p.push("..");
                refPath = p.join("/") + "/";
            }
        
            log("deep = " + deep + " -> [" + refPath + "]");
        
            var reg = /<include \s*src="(?:..\/)*include\/(.*)\.html"\s*(?:ref-path="[\.\/]+")?\s*(?:tag="(.*)")?\s*(?:><\/include>|\/>)/ig ;
            
            var matches;
        
            do
            {
                matches = reg.exec(content);
                if(matches != null)
                {
                    var len = matches[0].length;
                    var before = matches.input.substring(0, matches.index);
                    var after  = matches.input.substring(matches.index+len);
        
                    var template = matches[1];
                    var tags     = matches[2];
        
                    var tpl = loadTemplate(template, refPath, tags);
                    if (tpl.stats.mtime > stats.mtime)
                        stats.mtime = tpl.stats.mtime;
                    content = before + tpl.content + after;
                }
            }
            while (matches != null);
        
            return content;
        }
        
        // function shouldProcess(filename, relative)
        // {
        //     if (filename == null) // Must be a folder
        //         return false;
        //     if (filename.length < 1 || filename[0] == ".")
        //         return false;
        
        //     if (relative.indexOf("obsolete/") == 0) // Ignore obsolte files
        //         return false;
        //     if (relative.indexOf("include/") == 0) // Ignore template
        //         return false;
        
        //     return true;
        // }
        
        log("Step 1: Empty dist folder");
        
        // fsExtra.emptyDirSync("dist"); // Ensure dist is empty
        fileSystem.recurseSync("dist", function(filepath, relative, filename) 
        {
            if (relative.indexOf("css") != 0 && relative.indexOf("js") != 0)
            {
                if (!filename)
                {
                    fsExtra.rmdirSync(filepath);
                }
                else if ("dist/" + relative == filepath)
                {
                    fileSystem.unlinkSync(filepath);
                    grunt.log.writeln("deleted file " + filepath);
                }
            }
        });
        
        log("Step 2: Get list of files");
        
        var filter= fileSystem.fileMatch([
          "source/**/*", 
          "!source/js/**/*", 
          "!source/css/**/*", 
          "!source/obsolete/**/*", 
          "!source/include/**/*", 
          "!source/**/.*"
        ], true);
        
        var files = [];
        // var files2= [];
        
        fileSystem.recurseSync("source", function(filepath, relative, filename) 
        {
            if (filename && filter(filepath))
                files.push(relative);
        });
        
        log(files.length + " files found.");
        
        log("Step 2: copy/process files");
        
        files.forEach(function(f) 
        { 
            copyFile(f); 
        }); 
        
        log("All done!!!");
	});

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'cssmin', 'build']);
};
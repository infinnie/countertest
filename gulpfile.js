var gulp = require("gulp"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    Transform = require("stream").Transform,
    crypto = require("crypto"),
    fileLookUp = {},
    destPath = "build/dist",
    path = require("path"),
    pathBase = path.resolve() + path.sep,
    addHash = function (original) {
        var t = new Transform({ objectMode: true });
        t._transform = function (file, encoding, callback) {
            var hash = crypto.createHash("sha256"),
                history = file.history,
                curHistory = history[history.length - 1],
                hashedFileName;
            hash.update(file._contents);
            hashedFileName = curHistory.replace(/(\.[^.]+)$/, "-" + hash.digest("hex").slice(0, 8) + "$1");
            original = original || curHistory;
            fileLookUp[original] = hashedFileName;
            history.push(hashedFileName);
            callback(null, file);
        };
        return t;
    };

gulp.task("thing", function () {
    return gulp.src("jsx/**/*.jsx").pipe(babel()).pipe(gulp.dest("build"));
});

gulp.task("build:define", function () {
    return gulp.src("define.js").pipe(uglify({ ie8: true })).pipe(addHash()).pipe(gulp.dest(destPath));
});

gulp.task("build:main", gulp.series("thing", function () {
    return gulp.src(["lib/h.js", "lib/app.js", "build/main.js"])
        .pipe(concat("main-bundle.js"))
        .pipe(uglify({ ie8: true }))
        .pipe(addHash("jsx/main.jsx"))
        .pipe(gulp.dest(destPath));
}));

gulp.task("build:counter", gulp.series("thing", function () {
    return gulp.src(["js/counterfunctions.js", "js/connect.js", "build/counter.js"])
        .pipe(concat("counter-bundle.js"))
        .pipe(uglify({ ie8: true }))
        .pipe(addHash("jsx/counter.jsx"))
        .pipe(gulp.dest(destPath));
}));

gulp.task("build", gulp.series(gulp.parallel("build:define", "build:main", "build:counter"), function () {
    return gulp.src("index.src.html").pipe(function () {
        var t = new Transform({ objectMode: true });
        t._transform = function (file, encoding, callback) {
            var fileContent = file._contents.toString(encoding);
            Object.keys(fileLookUp).forEach(function (x) {
                // make it suitable for conversion to regular expressions
                var y = x.replace(pathBase, "").replace(/[\\/]/g, "\\/").replace(/\./g, "\\.");
                fileContent = fileContent.replace(new RegExp("%" + y), fileLookUp[x].replace(/^.*?\\([^\\]+)$/, "/" + destPath + "/$1"));
            });
            file._contents = Buffer.from(fileContent);
            callback(null, file);
        };
        return t;
    }()).pipe(concat("index.html")).pipe(gulp.dest("."));
}));
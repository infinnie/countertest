var gulp = require("gulp"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat");
gulp.task("thing", function () {
    return gulp.src("jsx/**/*.jsx").pipe(babel()).pipe(gulp.dest("build"));
});

gulp.task("build:main", ["thing"], function () {
    return gulp.src(["lib/h.js", "lib/app.js", "build/main.js"])
        .pipe(concat("main-dist.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/dist/"));
});

gulp.task("build:counter", ["thing"], function () {
    return gulp.src(["js/counterfunctions.js", "js/connect.js", "build/counter.js"])
        .pipe(concat("counter-dist.js"))
        .pipe(uglify())
        .pipe(gulp.dest("build/dist/"));
});

gulp.task("build", ["build:main", "build:counter"]);
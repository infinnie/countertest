var gulp=require("gulp"),babel=require("gulp-babel");
gulp.task("thing",function(){
    return gulp.src("jsx/**/*.jsx").pipe(babel()).pipe(gulp.dest("build"));
});
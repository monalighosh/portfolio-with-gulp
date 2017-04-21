var gulp = require("gulp");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var csslint = require('gulp-csslint');
var jshint = require("gulp-jshint");
var uglify = require("gulp-uglify");
var htmllint = require("gulp-htmllint");
var imagemin = require("gulp-imagemin");
var rename = require("gulp-rename");
var git = require("gulp-git");
var browserSync = require("browser-sync").create();
var runSequence = require('run-sequence');

//CSS tasks
//Sass, css lints
gulp.task("sass", function(){
	return gulp.src("sass/**/*.scss")
	.pipe(sass())
	.pipe(csslint())
	.pipe(csslint.formatter())
	.pipe(gulp.dest("css"));
});

//Minifies, autoprefixes
gulp.task("styles", function(){
	var processors = [autoprefixer, cssnano];

	return gulp.src("css/*.css")
	.pipe(postcss(processors))
	.pipe(rename({
		suffix: "-min"
	}))
	.pipe(gulp.dest("build/css"));
});

//Scripts
//Lints, uglifies, tests
gulp.task("scripts", function(){
	return gulp.src("js/*.js")
	.pipe(jshint())
	.pipe(jshint.reporter())
	.pipe(uglify())
	.pipe(rename({
		suffix: "-min"
	}))
	.pipe(gulp.dest("build/js"))
	.pipe(browserSync.reload({
      stream: true
    }));
});

//HTML
//Lints html
gulp.task("html", function(){
	return gulp.src("index.html")
	.pipe(htmllint())
	.pipe(gulp.dest("./"));
});


//Images
//Optimizes
gulp.task("images", function(){
	return gulp.src("images/*")
	.pipe(imagemin())
	.pipe(gulp.dest("build/images"));
});

//BrowserSync
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })
})

//Watch task
//Watches sass and js files
gulp.task("watch", ["browserSync", "sass", "scripts"], function(){
	gulp.watch("sass/**/*.scss", ["sass"]);
	gulp.watch("js/*.js", ["scripts"]);
	gulp.watch("index.html", browserSync.reload);
});

//Git tasks
//Git add
gulp.task("add", function(){
	return gulp.src(["gulpfile.js", "package.json"])
	.pipe(git.add())
});


//Git commit
gulp.task("commit", function(){
	return gulp.src(["gulpfile.js", "package.json"])
	.pipe(git.commit("Commiting updated files"))
});

//Git push
gulp.task("push", function(){
	git.push("origin", "master", function(err){
		if(err) throw err;
	});
});

//Default task
gulp.task("default", function(cb){
	runSequence("scripts", "sass", "styles", "html", "watch", cb);
	console.log("Gulp is building files");
});

// Publishing to git
gulp.task("gitpublish", function(cb){
	runSequence("add", "commit", "push", cb);
	console.log('Pushing files to git');
});
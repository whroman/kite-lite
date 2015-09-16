var gulp = require("gulp");
var gp = require('gulp-load-plugins')();

var data = require("./data");

var process = {};
process.spawn = require('child_process').spawn;
process.log = function (data) {
  if (data) console.log(data.toString());
}

var paths = {};

paths.build = "./resources/build";

paths.templates = {
  src: "./templates/index.ejs",
  watch: "./templates/**/*.ejs"
};

paths.scss = {
  src: "./resources/scss/index.scss",
  watch: "./resources/scss/**/*.scss",
  options: {
    sourcemap: true,
    style: "compressed"
  }
};

gulp.task("ejs", function() {
  gulp.src(paths.templates.src)
    .pipe(gp.ejs(data))
    .pipe(gulp.dest("./"));
});

gulp.task('scss', function () {
  return gp.rubySass(paths.scss.src, paths.scss.options)
    .on('error', gp.rubySass.logError)
    .pipe(gp.sourcemaps.write('maps', {
      includeContent: false
    }))
    .pipe(gulp.dest(paths.build));
});

gulp.task("server", function () {
  var linter = process.spawn("npm", ["run", "server"]);
  linter.stdout.on('data', process.log);
  linter.stderr.on('data', process.log);
});

gulp.task("watch", function () {
  gulp.watch(paths.templates.watch, ['ejs']);
  gulp.watch(paths.scss.watch, ['scss']);
});

gulp.task("dev", [
  "server",
  "ejs",
  "scss",
  "watch"
]);

gulp.task("default", ["dev"]);
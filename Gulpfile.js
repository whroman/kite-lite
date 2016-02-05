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
  watch: "./templates/**/*.ejs",
  pages: [
    {
      src: "./templates/pages/home.ejs",
      dest: "./"
    },
    {
      src: "./templates/pages/boardlight.ejs",
      dest: "./boardlight"
    },
    {
      src: "./templates/pages/about-us.ejs",
      dest: "./about-us"
    },
    {
      src: "./templates/pages/winglight.ejs",
      dest: "./winglight"
    }
  ]
};

paths.scss = {
  src: "./resources/scss/index.scss",
  watch: "./resources/scss/**/*.scss",
  options: {
    sourcemap: true,
    style: "compressed"
  }
};

var ejsTasks = [];

paths.templates.pages.forEach(function (page) {
  var taskName = "ejs:" + page.dest;

  ejsTasks.push(taskName);

  gulp.task(taskName, function() {
    return gulp.src(page.src)
      .pipe(gp.rename("index.html"))
      .pipe(gp.ejs({dest: page.dest}, {
        ext: ".html"
      }).on('error', gp.util.log))
      .pipe(gulp.dest(page.dest));
  });
});

gulp.task("ejs", ejsTasks);

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

gulp.task("build", [
  "ejs",
  "scss"
]);

gulp.task("dev", [
  "server",
  "build",
  "watch"
]);

gulp.task("default", ["dev"]);
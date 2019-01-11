var gulp = require('gulp')
// var sass = require('gulp-sass')

// css
var cleanCSS = require('gulp-clean-css')
var postcss = require('gulp-postcss')
var sourcemaps = require('gulp-sourcemaps')
var concat = require('gulp-concat')

// browser refresh
var browserSync = require('browser-sync').create()

// images
var imagemin = require("gulp-imagemin")

// github
var ghpages = require("gh-pages")


// sass.compiler = require('node-sass');

gulp.task("css", function () {

  return gulp.src([
    "src/css/reset.css",
    "src/css/typography.css",
    "src/css/app.css"
  ])
    // we want to run "sass css/app.scss app.css --watch"
    .pipe(sourcemaps.init())
    .pipe(
      postcss([
        require("autoprefixer"),
        require("postcss-preset-env")({
          stage: 1,
          browsers: ["IE 11", "last 2 versions"]
        }),
      ])
    )

    // this take reset + typo + app 3 things and send to postcss, join it to new app.css, 
    //  clean up and write to dist place

    .pipe(concat("app.css"))

    // .pipe(sass())
    .pipe(
      cleanCSS({
        compatibility: 'ie8'
      })
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("dist"))
    .pipe(browserSync.stream())
})

gulp.task("html", function () {
  return gulp.src("src/*.html")
    .pipe(gulp.dest("dist"))
})

gulp.task("fonts", function () {
  return gulp.src("src/fonts/*")
    .pipe(gulp.dest("dist/fonts"))
})

gulp.task("images", function () {
  return gulp.src("src/img/*")
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"))
})


gulp.task("watch", function () {

  browserSync.init({
    server: {
      baseDir: "dist"
    }
  })

  // if we add any font or new changes
  gulp.watch("src/*.html", ["html"]).on("change", browserSync.reload)
  gulp.watch("src/css/*", ["css"])
  gulp.watch("src/fonts/*", ["fonts"])
  gulp.watch("src/img/*", ["images"])
})

gulp.task("deploy", function () {
  ghpages.publish("dist")
})

gulp.task('default', ["html", "css", "fonts", "images", "watch"]);
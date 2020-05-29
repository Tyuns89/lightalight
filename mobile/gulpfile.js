'use strict'

const gulp = require('gulp')
const debug = require('gulp-debug')
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css');

gulp.task('build_css', function () {
  return gulp.src('src/assets/css/bem/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('bem.css'))
    .pipe(gulp.dest('src/'))
    .pipe(debug())
})

gulp.task('watch', function () {
  gulp.watch('src/assets/css/bem/**/*.css', gulp.series('build_css'));
})


const imagemin = require('gulp-imagemin');

// Compress Task
gulp.task('compress', function() {
  gulp.src('img_imagemin/**')
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeUnknownsAndDefaults: false}, {cleanupIDs: false}]
    }))
    .pipe(gulp.dest('img_optimizing/'));
});

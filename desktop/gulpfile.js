'use strict'

const gulp = require('gulp')
const debug = require('gulp-debug')
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css');


gulp.task('build_css', function () {
  return gulp.src('src/assets/css/bem/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(concat('bem_style.css'))
    .pipe(gulp.dest('src/'))
    .pipe(debug())
})

gulp.task('watch', function () {
  gulp.watch('src/assets/css/**/*.css', gulp.series('build_css'));
})

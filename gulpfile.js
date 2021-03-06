// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
// var outputdir = './dist/';
var outputdir = './app/';

var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
    gulp.src('./app/js/bundled.js')
      .pipe(clean({force: true}));
});
gulp.task('less', function () {
  return gulp.src('./app/css/*.less')
    .pipe(less())
    .pipe(gulp.dest('./app/css'));
});
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest(outputdir + '/css' ));
});

gulp.task('babel', function() {
    gulp.src('app/js/main.js')
      .pipe(babel({
          presets: ['es2015']
      }))
      .pipe(gulp.dest(outputdir + '/js'));
});
gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});
gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888,
    livereload: true
  });
});
gulp.task('reloadconnect', function () {
  gulp.src(['app/**/*.js'])
    .pipe(connect.reload())
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});
gulp.task('watch', function() {
  gulp.watch('./app/js/*.js', ['browserify', 'reloadconnect']);
  gulp.watch('./app/css/*.*', ['less', 'reloadconnect']);
  gulp.watch('./app/*.html', ['reloadconnect']);
});
gulp.task('browserify', function() {
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  // .pipe(uglify('bundled.js'))
  .pipe(gulp.dest(outputdir+'/js'));
});

gulp.task('autoprefix', function(){
  gulp.src('./app/css/main.css')
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(gulp.dest('./app/css/main.css'))
})

gulp.task('browserifyDist', function() {
  gulp.src(['app/js/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: true
  }))
  .pipe(concat('bundled.js'))
  // .pipe(uglify('bundled.js'))
  .pipe(gulp.dest(outputdir+'/js'));
});

// *** default task *** //
gulp.task('default', function() {
  runSequence(
    ['clean'],
    ['less', /*'autoprefix',*/ 'connect', 'watch', 'browserify']
  );
});
// *** build task *** //
gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['less', 'copy-html-files', 'copy-bower-components', 'minify-css', 'connectDist', 'browserify']
  );
});

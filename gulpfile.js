/* global require */
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const panini = require('panini');
const path = require('path');
const minify = require('gulp-minify');
const settings = {
    publicDir: '.',
    sassDir: 'scss',
    fontsDir: 'fonts',
    cssDir: 'build/css'
};

/**
 * serve task, will launch browserSync and launch index.html files,
 * and watch the changes for html and sass files.
 **/
gulp.task('serve', ['compress','copy-fonts','sass'], function() {

    gulp.src(settings.publicDir + '/pages/*.html')
    .pipe(panini({
      root: 'pages/',
      layouts: 'layouts/',
      partials: 'partials/',
      helpers: 'helpers/',
      data: 'data/'
    }))
    .pipe(gulp.dest('build'));

    /**
     * Launch BrowserSync from publicDir
     */
    browserSync.init({
        server: settings.publicDir + '/build'
    });

    /**
     * watch for changes in sass files
     */
    gulp.watch(settings.sassDir + "/**/*.scss", ['sass']);

    /**
     * watch for changes in html files
     */
    gulp.watch(settings.publicDir + "/*.html").on('change', browserSync.reload);

    gulp.watch(['./src/{layouts,pages,partials,helpers,data}/**/*'], [panini.refresh]);

});

gulp.watch(['./src/{layouts,partials,helpers,data}/**/*'], [panini.refresh]);

/**
 * compress task, will compress the .js files,
 */

gulp.task('compress', function() {
  gulp.src(settings.publicDir + '/js/*.js')
    .pipe(minify({
        ext:{
            src:'-debug.js',
            min:'.js'
        },
        exclude: ['tasks'],
        ignoreFiles: ['.combo.js', '-min.js']
    }))
    .pipe(gulp.dest(settings.publicDir + '/build/js'))
});

/**
 * sass task, will compile the .SCSS files,
 * and handle the error through plumber and notify through system message.
 */
gulp.task('sass', function() {
    return gulp.src(settings.sassDir + "/**/*.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix('last 2 version'))
        .pipe(sass({ outputStyle:'compressed' } ))
        .pipe(gulp.dest(settings.cssDir))
        .pipe(browserSync.stream());
});

/**
 * copy-fonts task, will copy the font files,
 */
gulp.task('copy-fonts', function() {
    return gulp.src(settings.fontsDir + '/**')
        .pipe(gulp.dest(settings.publicDir + '/build/fonts'));
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the site, launch BrowserSync then watch
 * files for changes
 */
gulp.task('default', ['serve']);

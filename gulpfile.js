const gulp = require('gulp');
const typescript = require('gulp-typescript');
const merge = require('merge2');
const { compilerOptions: tsconfig } = require('./tsconfig.json');

const files = {
  srcFiles: 'src/**/*.{ts,tsx}',
  libDir: 'lib',
  esDir: 'es'
};

function buildLib() {
  const result = gulp.src(files.srcFiles)
    .pipe(typescript({
      ...tsconfig,
      module: 'commonjs'
    }));

  return merge([
    result.js.pipe(gulp.dest(files.libDir)),
    result.dts.pipe(gulp.dest(files.libDir))
  ]);
}

function buildEs() {
  const result = gulp.src(files.srcFiles)
    .pipe(typescript(tsconfig));

  return merge([
    result.js.pipe(gulp.dest(files.esDir)),
    result.dts.pipe(gulp.dest(files.esDir))
  ]);
}

exports.default = gulp.parallel(buildLib, buildEs);
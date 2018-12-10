const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const nodemon = require('gulp-nodemon');
const del = require('del');

// 设置路径
const paths = {
  src: 'src/*',
  dest: 'dist/*',
  server: {  
    index: 'dist/index.js'  
 }  
}

// 在执行之前必须先清空目录
function clean(){
  return del(['dist']);
}

// 转化ES6 
// gulp.src()中第二个参数必须写，否则不会将src中的目录生成到dist目录中
// babel()将ECS6语法转化为ES5语法
// uglify是不支持ES6语法的
// gulp.dest()编译到指定的文件夹
function scripts(){
  return gulp.src(paths.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest));
}

// nodemon 监控src并自动执行脚本
function nodemons(done){
  nodemon({
    script: paths.server.index,
    ext: 'js',
    watch: paths.src,
    tasks: ['default'],
    env: { 'NODE_ENV': 'development' }
  })
  done();
}

const build = gulp.series(clean,gulp.parallel(scripts));
const server = gulp.series(clean, scripts, nodemons);

gulp.task('default', build);
gulp.task('serve', server);

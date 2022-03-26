var gulp = require('gulp');
var replace = require('gulp-replace');

gulp.task('replace', function () {
    return gulp.src(['node_modules/@recogito/recogito-js/dist/recogito.min.js'])
        .pipe(replace('Commenta...', 'Добавить комментарий...'))
        .pipe(replace('Rispondi...', 'Добавить ещё...'))
        .pipe(replace('Aggiungi tag...', 'Добавить тэг...'))
        .pipe(replace('Annulla', 'Отменить'))
        .pipe(replace('Chiudi', 'Закрыть'))
        .pipe(replace('Edit', 'Редактировать'))
        .pipe(replace('Delete', 'Удалить'))
        .pipe(replace('Ok', 'Ок'))
        .pipe(gulp.dest('node_modules/@recogito/recogito-js/dist'));
});

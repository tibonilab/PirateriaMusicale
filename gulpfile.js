'use_strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const sftp = require('gulp-sftp');
const gssh = require('gulp-ssh');
const del = require('del');
const argv = require('yargs').argv;
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const getWebpackConfig = require('./webpack.config');

const checkHost = () => {
    if (!argv.env || !['staging', 'production'].includes(argv.env)) {
        throw new Error('\nPlease specify --env parameter for this task!\nYou can choose between "staging" or "production"\n\nnpm run deploy-- --env=<env>\n\n');
    }
};

const isProduction = argv.env === 'production';

const configFile = isProduction
    ? 'gulp.config'
    : 'gulp.staging.config';

gutil.log(`Using "/${configFile}" for current task`);

const { webApps, sshConfig } = require(`./${configFile}`);

gulp.task('clean', () => {
    checkHost();

    return del('./build');
});

gulp.task('build', gulp.series('clean', cb => {
    checkHost();

    const config = getWebpackConfig({ production: isProduction });

    webpack(config, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString());
        cb();
    });
}));

gulp.task('deploy-frontend', gulp.series('build', () => {
    checkHost();

    const opts = {
        ...webApps.frontend,
        log: gutil.log
    };

    return gulp
        .src('build/**', { base: './build', buffer: false })
        .pipe(sftp(opts));
}));


gulp.task('pre-deploy-backend', () => {
    checkHost();

    const opts = {
        ...webApps.backend,
        log: gutil.log
    };

    return gulp
        .src(['json-adapter/**', '!json-adapter/node_modules', '!json-adapter/node_modules/**'], { base: './json-adapter', buffer: false })
        .pipe(sftp(opts));
});

gulp.task('deploy-backend', gulp.series('pre-deploy-backend', () => {
    checkHost();

    const ssh = new gssh({ sshConfig });

    return ssh
        .shell(
            [
                `cd ${webApps.backend.remotePath}`,
                'npm install',
                'sudo service apache2 reload'
            ],
            { filePath: 'shell.log' }
        );
}));

gulp.task('deploy-dataset', () => {
    checkHost();

    const opts = {
        ...webApps.dataset,
        log: gutil.log
    };

    return gulp
        .src('dataset/**', { base: './dataset', buffer: false })
        .pipe(sftp(opts));
});

gulp.task('deploy', gulp.parallel('deploy-dataset', 'deploy-backend', 'deploy-frontend'));

gulp.task('webpack-dev-server', () => {
    const config = getWebpackConfig({
        production: false,
        dev: true
    });
    const compiler = webpack(config);

    const devServerOptions = Object.assign({}, config.devServer, {
        host: 'localhost',
        port: 8080
    });

    const devServer = new webpackDevServer(devServerOptions, compiler);

    (async () => await devServer.start())();
});
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

let rl;
let type = process.argv[2];
let name = process.argv[3];
let directory = process.argv[4] || '.';

const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Template</title>
</head>
<body>
  <h1>Hello</h1>
  <p>CLI</p>
</body>
</html>
`;

const routerTemplate = `
const router = express.Router();

router.get('/', (req, res, next) => {
  try {
    res.send('ok');
  } catch(error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
`;

const exist = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (e) {
    return false;
  }
}

const mkdirp = (dir) => {
  const dirname = path.relative('.', path.normalize(dir)).split(path.sep).filter(p => !!p);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  })
};

const makeTemplate = (type, name, directory) => {
  mkdirp(directory);
  if (type === 'html') {
    const pathToFile = path.join(directory, `${name}.html`);

    if (exist(pathToFile) ) {
      console.error(chalk.bold.red('이미 해당 파일이 존재합니다.'));
    } else {
      fs.writeFileSync(pathToFile, htmlTemplate);
      console.log(chalk.bold.green(pathToFile, '생성완료'));
    }

  } else if (type === 'express-router') {
    const pathToFile = path.join(directory, `${name}.js`);

    if (exist(pathToFile) ) {
      console.error('이미 해당 파일이 존재합니다.');
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(pathToFile, '생성완료');
    }    

  } else {
    console.error('html 또는 express-router 둘 중 하나를 입력하세요.')
  }
};

//////////////////////////////////////////////////////////////////////////
let triggered = false;

program
  .version('0.0.1', '-v, --version') // 버전 표기
  .usage('[options]'); // 명령어 설명

program
  .command('template <type>')
  .usage('--name <name> --path [path]') // --옵션, -단축옵션, <필수>, [선택]
  .description('템플릿을 생성합니다.') // 말로 설명
  .alias('tmpl')
  .option('-n, --name <name>', '파일명을 입력하세요.', 'index') // 실제 옵션 설정
  .option('-d, --directory [path]', '생성 경로를 입력하세요.', '.')
  .action((type, options) => {
    makeTemplate(type, options.name, options.directory);
    triggered = true;
  });

program
  .command('*', { noHelp: true })
  .action(() => {
    console.log('해당 명령어를 찾을 수 없습니다.');
    program.help();
    triggered = true;
  });

program.parse(process.argv);

if (!triggered) {
  inquirer.prompt([{
    type: 'list', // 프롬프트 종류
    name: 'type', // 질문명
    message: '템플릿 종류를 선택하세요', // 메시지
    choices: ['html', 'express-router'], // 선택지
  }, {
    type: 'input',
    name: 'name',
    message: '파일의 이름을 입력하세요.',
    default: 'index', // 기본값
  }, {
    type: 'input',
    name: 'directory',
    message: '파일이 위치할 폴더의 경로를 입력하세요.',
    default: '.' // 기본값은 현재경로.
  }, {
    type: 'confirm',
    name: 'confirm',
    message: '생성하시겠습니까?',
  }]).then((answers) => {
    if (answers.confirm) {
      makeTemplate(answers.type, answers.name, answers.directory);
    }
  })
}
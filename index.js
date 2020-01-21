#!/usr/bin/env node
// 위의 주석은 window에서는 단순 주석이지만 mac이나 리눅스에서는 경로를 의미한다.

// process.argv : 사용자가 입력한 내용을 배열로 출력한다.
// porcess.argv[0] : 노드 설치 경로
// process.argv[1] : 파일 위치 경로
// console.log("Hello CLI", process.argv);

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.clear();
const answerCallback = (answer) => {
  if (answer === 'y') {
    console.log("Thanks!");

  } else if (answer === 'n') {
    console.log("Sorry!");
    
  } else {
    console.clear();
    console.log("Only y or n");
    rl.question("Is this example useful? (y/n)", answerCallback);
  }
  rl.close();
};
rl.question('Is this example useful? (y/n)', answerCallback);
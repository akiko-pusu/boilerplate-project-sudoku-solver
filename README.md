# [Sudoku Solver](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver)

## Sudoku Solverの課題

- All puzzle logic can go into /controllers/sudoku-solver.js
  - ロジックは全て ``/controllers/sudoku-solver.js`` にまとめること
- All routing logic can go into /routes/api.js
  - ルーティングに関するロジックは ``/routes/api.js`` にまとめること
- See the puzzle-strings.js file in /controllers for some sample puzzles your application should solve
  - ``puzzle-strings.js`` がサンプルのパズル問題
- To run the challenge tests on this page, set NODE_ENV to test without quotes in the .env file
  - テストスクリプトを走らせる場合は、``.env`` ファイルで ``NODE_ENV=test`` に設定すること
- To run the tests in the console, use the command npm run test. To open the Repl.it console, press Ctrl+Shift+P (Cmd if on a Mac) and type "open shell"
  - コンソールからテストを走らせる場合は、``npm run test`` を実行すること

Repl.itを使うことが前提になっていますが、今回もローカル開発環境で作成し、Gitpodで検証していきます。

### テストの内容

Write the following tests in tests/1_unit-tests.js:

- Logic handles a valid puzzle string of 81 characters
- Logic handles a puzzle string with invalid characters (not 1-9 or .)
- Logic handles a puzzle string that is not 81 characters in length
- Logic handles a valid row placement
- Logic handles an invalid row placement
- Logic handles a valid column placement
- Logic handles an invalid column placement
- Logic handles a valid region (3x3 grid) placement
- Logic handles an invalid region (3x3 grid) placement
- Valid puzzle strings pass the solver
- Invalid puzzle strings fail the solver
- Solver returns the the expected solution for an incomplete puzzzle

Write the following tests in tests/2_functional-tests.js

- Solve a puzzle with valid puzzle string: POST request to /api/solve
- Solve a puzzle with missing puzzle string: POST request to /api/solve
- Solve a puzzle with invalid characters: POST request to /api/solve
- Solve a puzzle with incorrect length: POST request to /api/solve
- Solve a puzzle that cannot be solved: POST request to /api/solve
- Check a puzzle placement with all fields: POST request to /api/check
- Check a puzzle placement with single placement conflict: POST request to /api/check
- Check a puzzle placement with multiple placement conflicts: POST request to /api/check
- Check a puzzle placement with all placement conflicts: POST request to /api/check
- Check a puzzle placement with missing required fields: POST request to /api/check
- Check a puzzle placement with invalid characters: POST request to /api/check
- Check a puzzle placement with incorrect length: POST request to /api/check
- Check a puzzle placement with invalid placement coordinate: POST request to /api/check
- Check a puzzle placement with invalid placement value: POST request to /api/check

-------

ということで、npm runでは  ``tests/2_functional-tests.js`` が実行できるようにする。
また、``tests/1_unit-tests.js`` はコマンドライン（タームなるから）npm run testで動くようにする。

## ユニットテスト

未実装の段階で、以下の通り。

```bash
% npm run test

> sudoku-solver@2.0.0 test /work/boilerplate-project-sudoku-solver
> mocha --timeout 5000 --require @babel/register --recursive --exit --ui tdd tests/

Listening on port 3000


  0 passing (1ms)
```

### Functionalテスト

未実装の段階で、以下の通り。

```bash
% npm run start

> sudoku-solver@2.0.0 start /work/boilerplate-project-sudoku-solver
> nodemon server.js

[nodemon] 2.0.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
Listening on port 3000
Running Tests...


  0 passing (0ms)
```

### freeCodeCamp側のテスト
　
<https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver>を通してテストをする場合は、NODE_ENV=testの状態で起動すること。
``/_api/get-tests`` のエンドポイントに対してリクエストを発行し、帰ってきた結果を配列として読み込んでチェックするテストがあるからです。

- freeCodeCamp側のテストブラウザテストは以下のソースコードが該当
  - <https://github.com/freeCodeCamp/freeCodeCamp/blob/29e91dc3a314d68583b2cf782c635127ea41ca8c/curriculum/challenges/chinese/06-quality-assurance/quality-assurance-projects/sudoku-solver.md>
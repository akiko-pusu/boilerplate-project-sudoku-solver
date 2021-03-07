const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/solver.js');
const puzzlesAndSolutions = require('../controllers/puzzle-strings');

suite('UnitTests', () => {
  suite('Function validate(puzzleString)', function () {

    // Logic handles a valid puzzle string of 81 characters
    test('logic handles a valid puzzle string of 81 characters', function (done) {

      // 問題と答えのペアの配列を取り出し
      let puzzleAndSolution = puzzlesAndSolutions.puzzlesAndSolutions[0]

      // 問題(puzzle)は0番目 [puzzle, solution]
      let puzzle = puzzleAndSolution[0]

      // Solver#validate(value) で入力値の長さのバリデーションを実施（81文字)
      assert.equal(Solver.isValidPuzzleString(puzzle), true);
      done();
    });

    // 1-9 or .でない文字列を含む場合のチェック
    test('logic handles a puzzle string with invalid characters (not 1-9 or .', function (done) {
      let input = '1.5d.2.84..63h12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      assert.equal(Solver.isValidPuzzleString(input), 'Invalid characters in puzzle');
      done();
    });

    // 82文字の場合のチェック
    test('logic handles a puzzle string that is not 81 characters in length', function (done) {
      let input = '1.5d.2.84..63h12.7.2..5.....9..1....8.2.3674.3.7.2..9.47....8..1..16....926914.37.'
      assert.equal(input.length, 82);
      assert.equal(Solver.isValidPuzzleString(input), 'Expected puzzle to be 81 characters long');
      done();
    })
  })


  suite('Function solve(puzzleString)', function () {
    test('Valid puzzle strings pass the solver', function (done) {
      let input = puzzlesAndSolutions.puzzlesAndSolutions[0]
      let solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
      input = input[0].split(',')
      input = input[0];

      let grid = Solver.convertToGrid(input);
      console.log(grid);

      let solver = new Solver(grid);
      let result = solver.getSolvedPuzzleString();
      assert.equal(result, solution);
      done();
    })
  })
});

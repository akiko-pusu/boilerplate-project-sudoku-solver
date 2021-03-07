class Solver {
  // 文字列を引数に取り、指定の文字ずつ配列に格納します
  // デフォルトは9区切りにします
  // Solver.convertToGrid(puzzleString)
  static convertToGrid(puzzleString, divider = 9) {
    let grid = [];

    // 9個ずつ取り出して格納します
    for (let i = 0; i < puzzleString.length; i += divider) {
      for (let j = 0; j < divider; j++) {
        grid.push(puzzleString.slice(i, i + divider).split(''))
        break;
      }
    }

    return grid;
  }

  static isValidPuzzleString(puzzleString) {
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }

    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    // パターンマッチでチェックします (1-9とドット以外の文字にマッチしたらエラー
    let regexSudoku = /[^1-9\.]/
    let validationResult = regexSudoku.exec(puzzleString);

    if (validationResult) {
      return 'Invalid characters in puzzle';
    }
    return true;
  }

  static argumentValidator(row, col, value) {
    let rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    // パターンマッチでチェック（1から9までの数字1文字だけ）
    const pattern = /^[1-9]$/;
    if (!pattern.exec(value)) {
      return 'Invalid value';
    }

    // rowはAからFまでにマッチすること
    if (!(rowNames.includes(row))) {
      return 'Invalid coordinate';
    }

    // colもパターンマッチでチェック
    if (!pattern.exec(col)) {
      return 'Invalid coordinate';
    }
    return true;
  }

  /*
    solver = new Solver();
    solver.solve();
  */
  constructor(grid = []) {
    // orginalGrid is immutable...
    this.orginalGrid = grid;

    this.solved = false;
    this.grid = this.copyFromOriginalGrid();
  }

  copyFromOriginalGrid() {
    return Solver.convertToGrid(this.orginalGrid.flat().join(''));
  }

  getOriginalGrid() {
    return this.orginalGrid;
  }

  getGrid() {
    return this.grid;
  }

  // 横の列に重複がないかどうか / 縦方向に重複がないか / 指定のグリッド内に配置されるか
  isValid(row, col, k) {
    this.isValidResult = {};
    let conflictRow = false;
    let conflictCol = false;
    let conflictGrid = false;

    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(col / 3) + i % 3;

      conflictRow = (this.grid[row][i] == k && col != i);
      conflictCol = (this.grid[i][col] == k && row != i);
      conflictGrid = (this.grid[m][n] == k && col != i && row != i);

      if (conflictRow || conflictCol || conflictGrid) {
        return false;
      }
    }
    return true;
  }

  // Main function!
  solve() {
    // not implemented
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.grid[i][j] == '.') {
          for (let k = 1; k <= 9; k++) {
            if (this.isValid(i, j, k)) {
              // 配置可能なら置き換えます
              this.grid[i][j] = `${k}`;
              if (this.solve(this.grid)) {
                return true;
              } else {
                this.grid[i][j] = '.';
              }
            }
          }
          return false;
        }
      }
    }

    this.solved = true;
    return true;
  }

  getSolvedPuzzleString(refresh = false) {
    if (refresh) {
      this.solved = false;
      this.grid = this.copyFromOriginalGrid();
      this.isValidResult = {};
    }

    if (this.solved) {
      return this.grid.flat().join('')
    }

    if (this.solve()) {
      return this.getSolvedPuzzleString()
    }

    return 'Something Error';
  }

  isRightValueViaCoordinate(rowName, col, value) {
    const rowNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    let row = rowNames.indexOf(rowName);
    return this.isRightValue(row, col - 1, value);
  }

  isRightValue(row, col, value) {
    if (!this.solved) {
      this.solve();
    }

    this.isValidResult = {};
    let conflictRow = false;
    let conflictCol = false;
    let conflictGrid = false;

    for (let i = 0; i < 9; i++) {
      if (this.grid[row][i] == value && col != i) {
        conflictRow = true;
        break;
      }
    }

    for (let i = 0; i < 9; i++) {
      if (this.grid[i][col] == value && row != i) {
        conflictCol = true;
        break;
      }
    }

    // let tartgetGridRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);

    for (let i = 0; i < 9; i++) {
      const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
      const n = 3 * Math.floor(col / 3) + i % 3;

      console.log(`row: ${row} / col: ${col} / m: ${m} / n: ${n} - ${this.grid[m][n]}`);
      /* if (this.grid[m][n] == value && m == row && n == col - 1) {
        conflictGrid = false;
        break;
      }
      */

      if (this.grid[m][n] == value && m != row && n != col - 1) {
        conflictGrid = true;
        break;
      }
    }

    if (conflictRow || conflictCol || conflictGrid) {
      this.isValidResult = {
        conflictRow: conflictRow,
        conflictCol: conflictCol,
        conflictGrid: conflictGrid
      }
      return false;
    }

    return true;
  }
}

module.exports = Solver;

/*
const Solver = require('./controllers/solver.js');
puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
grid = Solver.convertToGrid(puzzle);

solver = new Solver(grid);

solver.solve();
solver.getSolvedPuzzleString();

solver.isRightValue(0,2,9);

*/

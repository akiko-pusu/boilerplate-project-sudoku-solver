const util = require('util');
let solution;
class SudokuSolver {
  constructor(height, width) {
    this.Rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  }

  // 問題の文字列に対し、指定された座標（row: A col: 1など)にドットを挿入する
  dotPlacer(puzzleString, row, col) {
    let str;
    let {
      puzzleStringMappedToRows
    } = this.puzzleStringProcessor(puzzleString);

    str = puzzleStringMappedToRows[this.Rows[row]];

    // ここで置き換え
    str = str.substring(0, col - 1) + '.' + str.substring(col - 1 + 1);

    puzzleStringMappedToRows[this.Rows[row]] = str;

    return this.puzzleStringReverseProcessor(puzzleStringMappedToRows);
  }

  // 問題の文字列に対し、指定された座標（row: A col: 1など)に当たる文字が . かどうかをチェック
  checkIfDot(puzzleString, row, col) {
    let {
      puzzleStringMappedToRows
    } = this.puzzleStringProcessor(puzzleString);

    // インデックスなので col - 1にして確認
    if (puzzleStringMappedToRows[this.Rows[row]][col - 1] == '.') {
      return true;
    }
    return false;
  }

  // 引数で渡ってくる値が適切な型や範囲かどうかをチェック
  // row: A, B. C..を期待
  // col: 1 - 9 のいずれかを期待
  // value: 1- 9 のいずれかを期待
  argumentValidator(row, col, value) {
    // パターンマッチでチェック（1から9までの数字1文字だけ）
    const pattern = /^[1-9]$/;
    if (!pattern.exec(value)) {
      return 'Invalid value';
    }

    // rowはAからFまでにマッチすること
    if (!(this.Rows.includes(row))) {
      return 'Invalid coordinate';
    }

    // colもパターンマッチでチェック
    if (!pattern.exec(col)) {
      return 'Invalid coordinate';
    }
    return true;
  }

  // 入力された文字を、A-I行ごとに9文字ずつ分けた結果を返します
  puzzleStringProcessor(puzzleString) {
    let structeredPuzzleString = [];

    // 文字列（81文字）を引数に取り、9文字ずつ配列に格納します
    for (let i = 0; i < puzzleString.length; i = i + 9) {
      for (let j = 0; j < 9; j++) {
        structeredPuzzleString.push(puzzleString.slice(i, i + 9))
        break;
      }
    }

    // 9個ずつに区切った配列を、Key/Valueの形でマップに格納します
    // Exp. Map['A'] = '123456789' / Map['B'] = '3691...87'
    // const Rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    let puzzleStringMappedToRows = {};
    this.Rows.forEach((key, i) => puzzleStringMappedToRows[key] = structeredPuzzleString[i]);

    // オブジェクトとして結果を返します
    /*
      { { 'A': '123456789', 'B': '3691...87', ..... }　}
    */
    return {
      puzzleStringMappedToRows,
    };
  }

  // マップと配列に格納したデータを、文字列に戻します
  // { 'A': '123456789', 'B': '3691...87', ..... }
  // 1234567893691...87..... に戻します
  // helper function that reverses puzzleStringProcessor function, and returns a string
  puzzleStringReverseProcessor(puzzleStringMappedToRows) {
    let puzzleString = [];
    let i;
    let j;
    for (i = 0; i < 9; i) {
      for (j = 0; j < 9; j) {
        puzzleString.push(puzzleStringMappedToRows[this.Rows[i]][j]);
        j++
      }
      i++
    }
    return puzzleString.join("");
  }

  // helper function that determines the region of the target coordinate
  // 指定された座標が所属するリージョン（区画）を特定する (合計81個の数字で、3x3のマスの枠を1リージョンとする)
  regionator(row, column) {

    // 数独の区画は9個分
    // Rows A-C to Columns 1-3 equals region 1 which means Rows[0,1,2] and Column [1,2,3]
    // Rows A-C to Columns 4-6 equals region 2 which means Rows[0,1,2] and Column [4,5,6]
    // Rows A-C to Columns 7-9 equals region 3 which means Rows[0,1,2] and Column [7,8,9]

    // Rows D-F to Columns 1-3 equals region 4 which means Rows[3,4,5] and Column [1,2,3]
    // Rows D-F to Columns 4-6 equals region 5 which means Rows[3,4,5] and Column [4,5,6]
    // Rows D-F to Columns 7-9 equals region 6 which means Rows[3,4,5] and Column [7,8,9]

    // Rows G-I to Columns 1-3 equals region 7 which means Rows[6,7,8] and Column [1,2,3]
    // Rows G-I to columns 4-6 equals region 8 which means Rows[6,7,8] and Column [4,5,6]
    // Rows G-I to columns 7-9 equals region 9 which means Rows[6,7,8] and Column [7,8,9]

    let region;

    // まず列でリージョンを設定（縦の列に3つずつ区分）
    switch (true) {
      case column > 6:
        region = 3;
        break;
      case column > 3:
        region = 2;
        break;
      default:
        region = 1;
    }

    // 行でさらにリージョンを設定（ABC..に3行つずつ区分）
    switch (true) {
      case ['A', 'B', 'C'].includes(row):
        region = region;
        break;
      case ['D', 'E', 'F'].includes(row):
        region += 3;
        break;
      // あとはG, H, I
      default:
        region += 6;
    }

    // 3x3のマス1まとまりとして、何区画目にあたるかを返す
    return region;
  }

  // helper function that creates appropriate region string(Array)
  regionStringMaker(puzzleStringMappedToRows, region) {
    let allNum = Object.values(puzzleStringMappedToRows).join('');

    let quotient = Math.floor(region / 3);
    let remainder = region % 3;

    let first = (region - 1) * 3;
    if (remainder > 0 && quotient > 0) {
      first = quotient * 27 + (remainder - 1) * 3;
    }

    if (remainder == 0 && quotient > 1) {
      first = (quotient - 1) * 27 + 6;
    }

    let second = first + 9;
    let third = first + 18;

    let retVal = allNum.slice(first, first + 3) + allNum.slice(second, second + 3) + allNum.slice(third, third + 3);
    return retVal.split('');
  }

  // 入力値のバリデーションを行います
  // 基本は81文字（9x9）を受け付けます
  validate(puzzleString) {
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

  // 問題の文字列が与えられた時に、指定した座標の位置に、推測した引数の値が入りうるかをチェック
  // 行方向（横方向）にすでに推測した値が入っているかを確認し、まだ存在しなければ値を設定可能と判定
  checkRowPlacement(puzzleStringMappedToRows, row, column, value) {
    // いったん '.' の文字にvalueを配置してみて、同じ行にすでに同じ値が存在していないかをチェック
    for (let k = 0; k < puzzleStringMappedToRows[row].length; k++) {
      if (Number(puzzleStringMappedToRows[row][k]) === value) {
        // 推測する値(value)がすでにスキャン対象の行に存在していたら、推測する値は使えないのでfalseで抜ける
        return false;
      }
    }

    return true;
  }

  // 問題の文字列が与えられた時に、指定した座標の位置に、推測した引数の値が入りうるかをチェック
  // 列方向（縦方向）にすでに推測した値が入っているかを確認し、まだ存在しなければ値を設定可能と判定
  checkColPlacement(puzzleStringMappedToRows, row, column, value) {
    // いったん '.' の文字にvalueを配置してみて、同じ列にすでに同じ値が存在していないかをチェック
    // A1, B1, C1 .... という具合にスキャンしていき、すでに値が入っていたらfalse
    for (let k = 0; k < puzzleStringMappedToRows[row].length; k++) {
      if (Number(puzzleStringMappedToRows[this.Rows[k]][column - 1]) === value) {
        return false;
      }
    }

    return true;
  }

  // 指定の範囲に存在するかのチェック
  checkRegionPlacement(puzzleStringMappedToRows, row, column, value) {
    let region = this.regionator(row, column);

    let regionString = this.regionStringMaker(puzzleStringMappedToRows, region);
    if (regionString.includes(value.toString())) {
      return false;
    }

    return true;
  }

  validateCommonAndReturnMap(puzzleString, row, column, value) {
    if (!this.validate(puzzleString)) {
      return false;
    }
    // 引数のチェック
    if (!this.argumentValidator(row, column, value, this.Rows)) {
      return false;
    }

    const {
      puzzleStringMappedToRows
    } = this.puzzleStringProcessor(puzzleString);

    let targetCoordinate = puzzleStringMappedToRows[row][column - 1];

    if (targetCoordinate !== '.') {
      return false;
    }

    return puzzleStringMappedToRows
  }

  // ここでは再起関数を使います！
  sudokuSolver(puzzleString) {
    // 総当たりで解いていきます
    for (let i = 0; i < 9; i++) {
      for (let j = 1; j < 10; j++) {
        // 該当の位置の文字がドットの場合
        if (this.checkIfDot(puzzleString, i, j)) {
          for (let k = 1; k <= 9; k++) {
            let map = this.validateCommonAndReturnMap(puzzleString, this.Rows[i], j, k);
            if (map == false) { break; }

            // 横方向、縦方向にもk(value)を配置可能であるか確認
            if (
              this.checkRowPlacement(map, this.Rows[i], j, k) &&
              this.checkColPlacement(map, this.Rows[i], j, k) &&
              this.checkRegionPlacement(map, this.Rows[i], j, k)
            ) {

              // マッチした「最初の1つ」をk(value)に置き換えて、問題の文字列も更新します
              puzzleString = puzzleString.replace('.', k)

              // 再帰関数として自分自身を呼び出します。判定が出て . がなくなれば抜けます
              if (this.sudokuSolver(puzzleString)) {
                return true
              } else {
                // まだ処理が必要な場合は、巻き戻ります
                puzzleString = this.dotPlacer(puzzleString, i, j)
              }
            }
          }
          return false;
        }
      }
    }

    solution = puzzleString;
    return true
  }

  solve(puzzleString) {
    if (!this.sudokuSolver(puzzleString)) {
      return false;
    }

    return solution;
  }
}

module.exports = SudokuSolver;

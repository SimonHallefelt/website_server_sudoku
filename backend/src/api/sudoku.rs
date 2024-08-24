use actix_web::{
    post,
    put,
    Error,
    error::ResponseError,
    web::Path,
    web::Json,
    web::Data,
    HttpResponse,
    http::{header::ContentType, StatusCode}
};
use serde::{Serialize, Deserialize};
use rand::prelude::*;

#[derive(Deserialize, Serialize)]
struct IsSudokuCorrect {
    allSudokuValues: Vec<Vec<i8>>,
}

#[derive(Serialize)]
struct ResponseIsSudokuCorrect {
    message: String,
    points: i8,
}

#[derive(Serialize)]
struct ResponseNewSudoku {
    new_sudoku: Vec<Vec<i8>>,
}

#[post("/post/isSudokuCorrect")]
pub async fn post_is_sudoku_correct(info: Json<IsSudokuCorrect>) -> Json<ResponseIsSudokuCorrect> {
    println!("Got a post! isSudokuCorrect");
    println!("Post data: {:?}", info.allSudokuValues);
    if is_sudoku_correct(&info.allSudokuValues) {
        println!("Sudoku is correct!");
        Json(ResponseIsSudokuCorrect {message: "Sudoku is correct!".to_string(), points: 1})
    } else {
        Json(ResponseIsSudokuCorrect {message: "Sudoku is not correct!".to_string(), points: 0})
    }
}

#[post("/post/newSudoku")]
pub async fn post_new_sudoku() -> Json<ResponseNewSudoku> {
    println!("Got a post! newSudoku");
    let sudoku = new_sudoku(35);
    println!("newSudoku: {:?}", sudoku);
    Json(ResponseNewSudoku {new_sudoku: sudoku})
}



fn new_sudoku(numbers_to_add: i32) -> Vec<Vec<i8>> {
    loop {
        let mut sudoku = vec![vec![0; 9]; 9];
        let mut numbers_left = numbers_to_add;
        while numbers_left > 0 {
            let mut rng = rand::thread_rng();
            let row = rng.gen_range(0..=8);
            let col = rng.gen_range(0..=8);
            if sudoku[row][col] != 0 {
                continue;
            }
            sudoku[row][col] = rng.gen_range(0..=8) + 1;


            if no_double_number(&sudoku, row, col) {
                numbers_left -= 1;
                continue;
            }
            sudoku[row][col] = 0;
        }

        println!("newSudoku initial numbers added: {:?}", sudoku);
        if sudoku_solvable(&mut sudoku.clone()) {
            return sudoku;
        }
    }
}

fn is_sudoku_correct(sudoku: &Vec<Vec<i8>>) -> bool {
    // test rows
    for array in sudoku {
        if !contains_1_to_9(array) {
            println!("row false");
            return false;
        }
    }
    // test columns
    for i in 0..9 {
        let mut col = Vec::new();
        for array in sudoku {
            col.push(array[i]);
        }
        if !contains_1_to_9(&col) {
            println!("col false");
            return false;
        }
    }
    // test 3x3
    for i in 0..3 {
        for j in 0..3 {
            let mut array = Vec::new();
            for k in 0..3 {
                for h in 0..3 {
                    array.push(sudoku[i*3+k][j*3+h]);
                }
            }
            if !contains_1_to_9(&array) {
                println!("3x3 false");
                return false;
            }
        }
    }
    // all correct
    println!("sudoku was correct");
    return true;
}

fn contains_1_to_9(array: &Vec<i8>) -> bool {
    for i in 1..10 {
        let mut found = false;
        for &value in array {
            if value == i {
                found = true;
            }
        }
        if !found {
            return false;
        }
    }
    return true;
}

fn sudoku_solvable(sudoku: &mut Vec<Vec<i8>>) -> bool {
    let mut numbers: Vec<i8> = vec![1,2,3,4,5,6,7,8,9];
    let mut first_zero = (9,9);
    'outer: for i in 0..9 {
        for j in 0..9 {
            if sudoku[i][j] == 0 {
                first_zero = (i, j);
                break 'outer;
            }
        }
    }
    if first_zero.0 == 9 && first_zero.1 == 9 {
        println!("Solution to new sudoku: {:?}", sudoku);
        return true;
    }
    while !numbers.is_empty() {
        sudoku[first_zero.0][first_zero.1] = numbers.pop().unwrap();
        if no_double_number(&sudoku, first_zero.0, first_zero.1) {
            if sudoku_solvable(sudoku) {
                return true;
            }
        }
        sudoku[first_zero.0][first_zero.1] = 0;
    }
    return false;
}

fn no_double_number(sudoku: &Vec<Vec<i8>>, row: usize, col: usize) -> bool {
    let value = sudoku[row][col];
    // row and col
    for i in 0..9 {
        if sudoku[row][i] == value && i != col {
            return false;
        }
        if sudoku[i][col] == value && i != row {
            return false;
        }
    }
    // 9x9 box
    let row_box_start = row/3; // will it optimize away multiplication and division?
    let col_box_start = col/3;
    for i in 0..3 {
        for j in 0..3 {
            if sudoku[i+row_box_start*3][j+col_box_start*3] == value && (i+row_box_start*3 != row || j+col_box_start*3 != col) {
                return false;
            }
        }
    }
    return true;
}
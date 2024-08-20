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

#[derive(Deserialize, Serialize)]
struct IsSudokuCorrect {
    allSudokuValues: Vec<Vec<i8>>,
}

#[derive(Serialize)]
struct ResponseIsSudokuCorrect {
    message: String,
    points: i8,
}

#[post("/post/isSudokuCorrect")]
pub async fn post_is_sudoku_correct(info: Json<IsSudokuCorrect>) -> Json<ResponseIsSudokuCorrect> {
    println!("Got a post!");
    println!("Post data: {:?}", info.allSudokuValues);
    if is_sudoku_correct(&info.allSudokuValues) {
        println!("Sudoku is correct!");
        Json(ResponseIsSudokuCorrect {message: "Sudoku is correct!".to_string(), points: 1})
    } else {
        Json(ResponseIsSudokuCorrect {message: "Sudoku is not correct!".to_string(), points: 0})
    }

}

fn is_sudoku_correct(allSudokuValues: &Vec<Vec<i8>>) -> bool {
    // test rows
    for array in allSudokuValues {
        if !contains_1_to_9(array) {
            println!("row false");
            return false;
        }
    }
    // test columns
    for i in 0..9 {
        let mut col = Vec::new();
        for array in allSudokuValues {
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
                    array.push(allSudokuValues[i*3+k][j*3+h]);
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
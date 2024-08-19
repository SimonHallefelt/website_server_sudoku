mod api;

use api::make_sudoku::{
    say_hello,
};

use api::task::{
    get_task,
};

use api::web_pages::{
    home_page,
    home_page_js,
    home_page_style
};

use actix_web::{
    HttpServer,
    App,
    web::Data,
    middleware::Logger
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = 80; // can be 80 or 8080
    let address = "127.0.0.1";
    std::env::set_var("RUST_LOG", "debug");
    std::env::set_var("RUST_bACKTRACE", "1");
    env_logger::init();

    println!("Hello, world!");
    println!("{}", say_hello());

    HttpServer::new(move || {
        let logger = Logger::default();
        App::new()
        .wrap(logger)
        .service(home_page)
        .service(get_task)
        .service(home_page_style)
        .service(home_page_js)
        // .service(Files::new("static", ".").prefer_utf8(true))
    })
    .bind((address, port))?
    .workers(4) // default system cpu cores (can remove row)
    .run()
    .await
}

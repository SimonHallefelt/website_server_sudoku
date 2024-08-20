use actix_web::{
    get,
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

#[get("/")]
pub async fn home_page() -> Result<HttpResponse, Error> {
    Ok(
        HttpResponse::build(StatusCode::OK)
        .content_type("text/html; carset=utf-8")
        .body(include_str!("../../../frontend/homepage.html"))
    )
}

#[get("/static/homepage.css")]
pub async fn home_page_style() -> Result<HttpResponse, Error> {
    Ok(
        HttpResponse::build(StatusCode::OK)
        .content_type("text/css; carset=utf-8")
        .body(include_str!("../../../frontend/homepage.css"))
    )
}

#[get("/script/homepage.js")]
pub async fn home_page_js() -> Result<HttpResponse, Error> {
    Ok(
        HttpResponse::build(StatusCode::OK)
        .content_type("text/js; carset=utf-8")
        .body(include_str!("../../../frontend/homepage.js"))
    )
}
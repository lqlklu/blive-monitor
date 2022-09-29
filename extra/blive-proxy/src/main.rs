use actix_cors::Cors;
use actix_web::{get, http, web, App, HttpServer, Responder, Result};
mod info;
use info::get_room_info;

#[get("/roominfo/{roomid}")]
async fn room_info(roomid: web::Path<u32>) -> Result<impl Responder> {
  let info = get_room_info(*roomid).await.unwrap();
  Ok(web::Json(info))
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
  HttpServer::new(|| {
    let cors = Cors::default()
      .allowed_origin_fn(|_origin, _req_head| true)
      .allowed_methods(vec!["GET", "POST"])
      .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
      .allowed_header(http::header::CONTENT_TYPE)
      .max_age(3600);

    App::new().wrap(cors).service(room_info)
  })
  .bind(("127.0.0.1", 2233))?
  .run()
  .await
}

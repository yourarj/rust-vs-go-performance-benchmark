use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Person {
    name: String,
    email: String,
    age: u8,
}

#[post("/people")]
async fn handle_people(people: web::Json<Vec<Person>>) -> impl Responder {
    let count = people.len();
    let response = format!("Received {} people", count);
    HttpResponse::Ok().body(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(handle_people))
        .bind("127.0.0.1:8080")?
        .run()
        .await
}

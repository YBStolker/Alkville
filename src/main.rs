use std::env;
use std::path::Path;

use rocket::fs::relative;
use rocket::fs::FileServer;
use rocket::fs::NamedFile;
use rocket::get;
use rocket::routes;
use rocket::Error;
use rocket::Rocket;

#[get("/")]
async fn index() -> Option<NamedFile> {
    let path = Path::new(relative!("public/index.html"));
    NamedFile::open(path).await.ok()
}

#[rocket::main]
async fn main() -> Result<(), Error> {
    env::set_var("RUST_BACKTRACE", "1");

    let _rocket = Rocket::build()
        .mount("/", routes![index])
        .mount("/templates", FileServer::from(relative!("templates")))
        .mount("/public", FileServer::from(relative!("public")))
        .launch()
        .await?;

    Ok(())
}

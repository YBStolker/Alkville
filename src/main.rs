use std::collections::HashMap;
use std::env;
use std::fs::read_dir;
use std::fs::read_to_string;
use std::path::Path;
use std::path::PathBuf;

use rocket::fs::relative;
use rocket::fs::FileServer;
use rocket::fs::NamedFile;
use rocket::get;
use rocket::routes;
use rocket::serde::json::Json;
use rocket::Build;
use rocket::Error;
use rocket::Rocket;

#[get("/")]
async fn index() -> Option<NamedFile> {
    let path = Path::new(relative!("public/index.html"));
    NamedFile::open(path).await.ok()
}

#[get("/fetch_all")]
async fn fetch_all() -> Option<Json<HashMap<String, String>>> {
    let directory_path = PathBuf::from(relative!("templates"));
    let mut collector: HashMap<String, String> = HashMap::new();
    gather_files_and_content_of_directory(directory_path, &mut collector).ok()?;

    Some(Json(collector))
}

fn gather_files_and_content_of_directory(
    path: PathBuf,
    collector: &mut HashMap<String, String>,
) -> std::io::Result<()> {
    if !path.is_dir() {
        let content = read_to_string(path.clone())?;
        let path = path.clone().to_string_lossy().to_string();
        let mut path = path.split("templates").collect::<Vec<_>>();
        path.remove(0);
        let path = path.join("templates");
        let first_char = path.chars().collect::<Vec<_>>().get(0).unwrap().to_string();
        let path = first_char.clone() + "templates" + &path;
        let path = path.replace(first_char.as_str(), "/");

        collector.insert(path, content);

        Ok(())
    } else {
        for entry in read_dir(path)? {
            let entry = entry?;
            let path = entry.path();
            gather_files_and_content_of_directory(path, collector)?;
        }

        Ok(())
    }
}

fn get_rocket() -> Rocket<Build> {
    let rocket = Rocket::build()
        .mount("/", routes![index])
        .mount("/templates", routes![fetch_all])
        .mount("/public", FileServer::from(relative!("public")));

    rocket
}

#[rocket::main]
async fn main() -> Result<(), Error> {
    env::set_var("RUST_BACKTRACE", "1");

    get_rocket().launch().await?;

    Ok(())
}

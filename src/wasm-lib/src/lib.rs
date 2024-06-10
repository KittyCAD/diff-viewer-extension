mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub async fn greet(token: &str) -> Result<JsValue, JsError> {
    let client = kittycad::Client::new(token);
    let result = client.users().get_self().await;
    let Some(email) = result.unwrap().email else {
        return Err(JsError::new(&format!("Server returned error")));
    };
    Ok(JsValue::from_str(email.as_str()))
}

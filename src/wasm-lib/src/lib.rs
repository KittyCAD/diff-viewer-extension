mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn greet() -> JsValue {
    return JsValue::from_str("hello, world");
}

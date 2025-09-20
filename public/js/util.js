/**
 * @template T
 * @template E
 * @typedef {{ 
 *  ok?: T,
 *  err?: E,
 *  is_ok: boolean,
 *  is_err: boolean,
 * }} Result<T, E>
 */

/**
 * Returns the Ok variant of a result
 * @param {T} val 
 * @returns {Result<T, any>}
 */
function ok(val) {
    return {
        ok: val,
        get is_ok() { return true; },
        get is_err() { return false; },
    };
}

/**
 * Returns the Err variant of a result
 * @param {E} val 
 * @returns {Result<any, E>}
 */
function err(val) {
    return {
        err: val,
        get is_ok() { return false; },
        get is_err() { return true; },
    };
}

/**
 * Calls all function to prevent changing an object recursively
 * @param {any} obj the object to be locked
 * @returns {any} returns the locked object
 */
function freeze_entire_object(obj) {
    if (typeof obj === "object") {
        for (const key in obj) {
            freeze_entire_object(obj[key]);
        }
    }

    Object.freeze(obj);

    // These functions are subsets of Object.freeze and don't need to be called.
    // Object.preventExtensions(obj);
    // Object.seal(obj);

    return obj;
}

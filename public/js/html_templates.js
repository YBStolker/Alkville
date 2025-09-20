const html_templates = {};

$(async function () {
    const { err, is_err } = await get_all_html_template();
    if (is_err) {
        console.error(err);
    }
})

/**
 * Fetches all html templates
 * @returns {Result<undefined, { type: "fetch_failed" | "fetch_empty", message: string, data?: any }>}
 */
async function get_all_html_template() {
    const response = await fetch("/templates/fetch_all");
    if (!response.ok) {
        return err({ type: "fetch_failed", message: "Get html templates fetch failed.", data: response });
    }
    const templates = await response.json();
    if (!templates) {
        return err(`Get templates response empty.`);
    }

    for (const [key, value] of Object.entries(templates)) {
        html_templates[key] = value;
    }

    freeze_entire_object(html_templates);

    return ok();
}

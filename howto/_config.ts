import lume from "lume/mod.ts";

const site = lume({
    location: new URL("https://howto.hyperfetch.net"),
    prettyUrls: false,
});

site.copy("public", ".");

export default site;

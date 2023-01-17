import lume from "lume/mod.ts";
import inline from "lume/plugins/inline.ts";
import sass from "lume/plugins/sass.ts";

const site = lume({
    location: new URL("https://howto.hyperfetch.net"),
    prettyUrls: false,
});

site.use(inline());
site.use(sass());

site.copy("public", ".");

export default site;

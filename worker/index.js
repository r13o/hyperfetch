class ElementHandler {
  #prefix;
  #target;

  constructor(prefix, target) {
    this.#prefix = prefix;
    this.#target = target;
  }

  element(element) {
    for (const name of ['href', 'src', 'action']) {
      if (element.hasAttribute(name)) {
        element.setAttribute(name, this.#modifyURL(element.getAttribute(name)))
      }
    }
  }

  #modifyURL(url) {
    if (url.startsWith('http')) {
      return this.#prefix + url;
    }
    return this.#prefix + new URL(url, this.#target).toString()
  }
}

export default {
  async fetch(incoming) {
    const original = new URL(incoming.url);
    if (original.pathname === '/favicon.ico') {
      return await fetch('https://howto.hyperfetch.net' + original.pathname);
    }
    if (original.pathname === '/robots.txt') {
      return new Response(`User-agent: *
Disallow: /
`);
    }
    if (original.pathname.startsWith('/http')) {
      const prefix = original.origin + '/';
      const target = new URL(original.pathname.substring(1) + original.search);
      const outgoing = new Request(target, incoming);
      if (outgoing.headers.has('host')) {
        outgoing.headers.set('host', target.host)
      }
      if (outgoing.headers.has('referer')) {
        outgoing.headers.set('referer', outgoing.headers.get('referer').replace(prefix, ''))
      }
      const response = await fetch(outgoing);
      if (response.status >= 300 && response.status < 400) {
        return Response.redirect(prefix + response.headers.get('location'), response.status);
      }
      return new HTMLRewriter().on('[href],[src],form[action]', new ElementHandler(prefix, target)).transform(response);
    }
    return Response.redirect('https://howto.hyperfetch.net', 301);
  },
};

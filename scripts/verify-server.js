/**
 * Verifies the Metro dev server end to end: fetches the Expo manifest, then
 * requests the actual JS bundle and fails loudly if Metro reports a build error.
 * Usage: node scripts/verify-server.js [baseUrl]
 */
const base = process.argv[2] || 'http://localhost:8081';

async function get(path, headers = {}) {
  const res = await fetch(base + path, { headers });
  const text = await res.text();
  return { status: res.status, text };
}

(async () => {
  let manifest;
  try {
    const res = await get('/', {
      'expo-platform': 'ios',
      accept: 'application/expo+json,application/json',
    });
    manifest = JSON.parse(res.text);
    const c = manifest.extra.expoClient;
    console.log('manifest        : HTTP ' + res.status);
    console.log('  name          : ' + c.name);
    console.log('  slug          : ' + c.slug);
    console.log('  sdkVersion    : ' + c.sdkVersion);
    console.log('  hostUri       : ' + c.hostUri);
  } catch (e) {
    console.log('manifest        : FAILED — ' + e.message);
    process.exitCode = 1;
    return;
  }

  // launchAsset.url is already absolute; rewrite the host so it matches base.
  const url = manifest.launchAsset.url.replace(/^https?:\/\/[^/]+/, base);
  const started = Date.now();
  console.log('\nbundling ' + url + ' …');
  try {
    const res = await fetch(url, { headers: { accept: 'text/javascript' } }).then((r) =>
      r.text().then((t) => ({ status: r.status, text: t }))
    );
    const kb = (res.text.length / 1024).toFixed(0);
    const secs = ((Date.now() - started) / 1000).toFixed(1);

    // Metro reports build failures as a JSON payload in the bundle body.
    let buildError = null;
    try {
      const parsed = JSON.parse(res.text);
      if (parsed && parsed.type === 'TransformError' || parsed?.name === 'SyntaxError') {
        buildError = parsed.message || parsed.error;
      }
    } catch {
      /* a real bundle is not JSON, which is the good case */
    }

    if (buildError) {
      console.log('bundle          : BUILD ERROR');
      console.log(buildError);
      process.exitCode = 1;
      return;
    }
    console.log('bundle          : HTTP ' + res.status + ', ' + kb + ' KB in ' + secs + 's');
    console.log('result          : OK — compiles and serves');
  } catch (e) {
    console.log('bundle          : FAILED — ' + e.message);
    process.exitCode = 1;
  }
})();

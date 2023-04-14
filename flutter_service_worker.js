'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"index.html": "3080430bfb91338bd28cb998d9fb2ebd",
"/": "3080430bfb91338bd28cb998d9fb2ebd",
"main.dart.js": "d9fc8d956cc17bf45561967b7284ddb5",
"icons/Icon-maskable-192.png": "f7d18412b442064be28c52f0f601638c",
"icons/Icon-512.png": "5b206221d41a0007ae7ff4234e7eb445",
"icons/Icon-maskable-512.png": "5b206221d41a0007ae7ff4234e7eb445",
"icons/Icon-192.png": "f7d18412b442064be28c52f0f601638c",
"manifest.json": "becbe78f0171888e329e6df051215d36",
"flutter.js": "a85fcf6324d3c4d3ae3be1ae4931e9c5",
"favicon.png": "4c89c4f634023ddc49b795f8410e8c75",
"version.json": "ff966ab969ba381b900e61629bfb9789",
"assets/packages/shuffle_uikit/assets/fonts/Syne-Regular.ttf": "fa217abea499da5bd958370129f4a7e1",
"assets/packages/shuffle_uikit/assets/fonts/Syne-SemiBold.ttf": "438d460aecd1d1a1b1de5b593b185ddc",
"assets/packages/shuffle_uikit/assets/fonts/Syne-Bold.ttf": "57467f8e3329483212102dff968c295d",
"assets/packages/shuffle_uikit/assets/images/svg/white_star.svg": "5a6b30b6a4249a45cb52cfa6b69b42f5",
"assets/packages/shuffle_uikit/assets/images/svg/cocktail.svg": "ee5d13e6c64ba219ca5717a9ffac8e8a",
"assets/packages/shuffle_uikit/assets/images/svg/chevron_right.svg": "4e10eda5e5596a51b263293103228f30",
"assets/packages/shuffle_uikit/assets/images/svg/star.svg": "d8d6fb15311d965839e0eb4b54b170ac",
"assets/packages/shuffle_uikit/assets/images/svg/like.svg": "4730afea8517f1a321fbd17108992deb",
"assets/packages/shuffle_uikit/assets/images/svg/triple_arrow.svg": "a20eaac4886fab916549ac4271f4b8e7",
"assets/packages/shuffle_uikit/assets/images/svg/chevron_left.svg": "21f5aaed3371b9b293078da2be425caa",
"assets/packages/shuffle_uikit/assets/images/png/profile_avatar.png": "827f8c0cca8abe806362de525120c2c1",
"assets/packages/shuffle_uikit/assets/images/png/atmosphere.png": "2262e65620263e3787c97dff1631370f",
"assets/packages/shuffle_uikit/assets/images/png/event_avatar.png": "b7ef1464c2a65494b4b59de99523dd8b",
"assets/packages/shuffle_uikit/assets/images/png/profile_story_1.png": "b6771b7db36ed5927964c3ac558279f7",
"assets/packages/shuffle_uikit/assets/images/png/profile_post_1.png": "ccbf3bbab9d37c20b72f45ecb40e45e6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/FontManifest.json": "528667b72b990b80cc6bb08308bca0d5",
"assets/NOTICES": "2c68be700dfc53787d8b1783c1e5b9ab",
"assets/AssetManifest.json": "40ba59aeecf4a06832c0f6fce97169c8"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}

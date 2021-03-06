# Upgrade notes

**Note:** This is a cumulative upgrade notes file, that provides detailed instructions
on how to migrate your previously generated Falcon-based project to a newer version.

> Make sure you remove your `node_modules` folders from both `client` and `server` apps
> to ensure a proper installation of NPM packages before any upgrade between Falcon versions.

## Falcon 0.2.0 to 0.3.0

### Falcon-Client 0.3.0

If you were using `Async` components, please change them `loadable` instead:

```diff
- import AsyncComponent from 'src/components/Async';
+ import loadable from 'src/components/loadable';
```

[`src/components/loadable` component source](https://github.com/deity-io/falcon/blob/master/examples/shop-with-blog/client/src/components/loadable.js)

```diff
- const Category = AsyncComponent(() => import(/* webpackChunkName: "shop/category" */ './pages/shop/Category'));
+ const Category = loadable(() => import(/* webpackChunkName: "shop/category" */ './pages/shop/Category'));
```

[Detailed diff for `shop-and-blog` example](https://github.com/deity-io/falcon/pull/226/commits/e88f4a37836ae23b5524c3af2afd7ebc9b430f24)

You'll also need to update `package.json`

```diff
- "react-async-component": "^2.0.0",
+ "@loadable/component": "^5.2.1",
```

[Detailed diff for `shop-and-blog` example package.json](https://github.com/deity-io/falcon/pull/226/files#diff-dfa8eb367f571d913bbd7ee38a1a5cd0)

## Falcon 0.1.0 to 0.2.0

### Falcon-Server 0.2.0

- Change your `apis` and `extensions` config keys to the following structure:

```diff
{
  ...,
-  "apis": [
-    {
-      "name": "api-wordpress",
+  "apis": {
+    "api-wordpress": {
       "package": "@deity/falcon-wordpress-api",
       "config": {
         "host": "wordpress.deity.io",
         "protocol": "https",
         "apiPrefix": "/wp-json",
         "apiSuffix": "/wp/v2"
       }
     },
   },
```

- If you were using "endpoints" within your ApiDataSource class - you have to move them to a separate config
  section (read more about Endpoints [here](https://falcon.deity.io/docs/falcon-server/endpoints))
- `Events` enum object has been moved to `@deity/falcon-server-env` package:

```diff
- const { Events } = require('@deity/falcon-server');
+ const { Events } = require('@deity/falcon-server-env');
```

### Falcon-Client 0.2.0

- Rename `client/razzle.config.js` to `client/falcon-client.build.config.js`

```diff
- const { razzlePluginFalconClient } = require('@deity/falcon-client');

module.exports = {
-  plugins: [
-    razzlePluginFalconClient({
-      i18n: {
-        resourcePackages: ['@deity/falcon-i18n'],
-        filter: { lng: ['en'] }
-      }
-    })
-  ]
+  clearConsole: true,
+  useWebmanifest: true,
+  i18n: {
+    resourcePackages: ['@deity/falcon-i18n'],
+    filter: { lng: ['en'] }
+  }
};
```

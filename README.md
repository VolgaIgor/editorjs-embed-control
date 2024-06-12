# Embed Block Tool for Editor.js

Provides Block tool for embedded content for the [Editor.js](https://editorjs.io).

Based on [editor-js/embed](https://github.com/editor-js/embed).

## Preview
![Preview image](https://github.com/VolgaIgor/editorjs-embed-control/raw/main/asset/screenshot.png)

## List of services supported

> `service` — is a service name that will be saved to Tool's [output JSON](#output-data)

- [YouTube](https://youtube.com) - `youtube` service
- [Twitch](https://twitch.tv) - `twitch-video` service for videos
- 👇 Any other [customized service](#add-more-services)

## Installation

Get the package

```shell
$ npm i editorjs-embed-control
```

Include module at your application

```javascript
import EmbedControl from 'editorjs-embed-control';
```

### Load from CDN

You can load a specific version of the package from jsDelivr CDN.

Require this script on a page with Editor.js.

```html
<script src="https://cdn.jsdelivr.net/npm/editorjs-embed-control"></script>
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/embed.umd.js` file to your page.

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: EmbedControl,
  },

  ...
});
```

## Available configuration

### Enabling / disabling services

Embed Tool supports some services by default (see above). You can specify services you would like to use:

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: {
      class: EmbedControl,
      config: {
        services: {
          youtube: true,
          twitch-video: false
        }
      }
    },
  },

  ...
});
```

> Note that if you pass services you want to use like in the example above, others will not be enabled.

### Add more services

You can provide your own services using simple configuration.

First, you should create a Service configuration object. It contains following fields:

| Field      | Type       | Description |
| ---------- | ---------- | ----------- |
| `regex`    | `RegExp`   | Pattern of pasted URLs. You should use regexp groups to extract resource id
| `embedUrl` | `string`   | Url of resource\`s embed page. Use `<%= remote_id %>` to substitute resource identifier
| `html`     | `string`   | HTML code of iframe with embedded content. `embedUrl` will be set as iframe `src`
| `height`   | `number`   | _Optional_. Height of inserted iframe
| `width`    | `number`   | _Optional_. Width of inserted iframe
| `id`       | `Function` | _Optional_. If your id is complex you can provide function to make the id from extraced regexp groups

Example:

```javascript
{
  regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
  embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
  html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
  height: 300,
  width: 600,
  id: (groups) => groups.join('/embed/')
}
```

When you create a Service configuration object, you can provide it with Tool\`s configuration:

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: {
      class: EmbedControl,
      config: {
        services: {
          youtube: true,
          coub: true,
          codepen: {
            regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
            embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
            html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
            height: 300,
            width: 600,
            id: (groups) => groups.join('/embed/')
          }
        }
      }
    },
  },

  ...
});
```

You can take the configs from the original project: https://github.com/editor-js/embed/blob/master/src/services.js

### Inline Toolbar
Editor.js provides useful inline toolbar. You can allow it\`s usage in the Embed Tool caption by providing `inlineToolbar: true`.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: {
      class: EmbedControl,
      inlineToolbar: true
    },
  },

  ...
});
```

### Localization
You can change the module name, labels and service names:
```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    embed: EmbedControl,
  },
  i18n: {
    messages: {
      toolNames: {
        "Video": "Видео"
      },
      tools: {
        embed: {
          'Enter a link': 'Вставьте ссылку',
          'Enter a caption': 'Подпись',
          'Support services:': 'Поддерживаемые сервисы:',
          'youtube': 'YouTube',
          ...
        }
      }
    }
  },
  ...
});
```

## Output data

| Field   | Type     | Description
| ------- | -------- | -----------
| service | `string` | service unique name
| source  | `string` | source URL
| embed   | `string` | URL for source embed page
| width   | `number` | embedded content width
| height  | `number` | embedded content height
| caption | `string` | content caption


```json
{
  "type" : "embed",
  "data" : {
    "service" : "coub",
    "source" : "https://coub.com/view/1czcdf",
    "embed" : "https://coub.com/embed/1czcdf",
    "width" : 580,
    "height" : 320,
    "caption" : "My Life"
  }
}
```

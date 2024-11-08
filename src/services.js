/* eslint-disable no-useless-escape */
export default {
  youtube: {
    regex: /(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|shorts\/|watch))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)/,
    embedUrl: 'https://www.youtube.com/embed/<%= remote_id %>',
    html: '<iframe style="width:100%;" height="320" frameborder="0" allowfullscreen></iframe>',
    height: 320,
    width: 580,
    id: ([id, params]) => {
      if (!params && id) {
        return id;
      }

      const paramsMap = {
        start: 'start',
        end: 'end',
        t: 'start',
        // eslint-disable-next-line camelcase
        time_continue: 'start',
        list: 'list',
      };

      params = params.slice(1)
        .split('&')
        .map(param => {
          const [name, value] = param.split('=');

          if (!id && name === 'v') {
            id = value;

            return null;
          }

          if (!paramsMap[name]) {
            return null;
          }

          if (value === 'LL'
            || value.startsWith('RDMM')
            || value.startsWith('FL')) {
            return null;
          }

          return `${paramsMap[name]}=${value}`;
        })
        .filter(param => !!param);

      return id + '?' + params.join('&');
    },
  },
  'twitch-video': {
    regex: /https?:\/\/www\.twitch\.tv\/(?:[^\/\?\&]*\/v|videos)\/([0-9]*)/,
    embedUrl: 'https://player.twitch.tv/?<%= remote_id %>',
    html: '<iframe frameborder="0" allowfullscreen="true" scrolling="no" height="366" style="width:100%;"></iframe>',
    height: 366,
    width: 600,
    id: ([id]) => {
      let params = [];
      params.push('video=v' + id);
      params.push('parent=' + window.location.host);

      return params.join('&');
    },
  },
  "vk-video": {
    regex: /https?:\/\/vk.com\/video([-]?[\d]+)_([\d]+)/,
    embedUrl: 'https://vk.com/video_ext.php?<%= remote_id %>&hd=2',
    html: "<iframe style=\"width: 100%;\" height=\"320\" allow=\"autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;\" frameborder=\"0\" allowfullscreen></iframe>",
    height: 320,
    width: 580,
    id: (ids) => `oid=${ids[0]}&id=${ids[1]}`
  }
};

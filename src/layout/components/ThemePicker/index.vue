<template>
  <el-color-picker
    v-model="theme"
    :predefine="['#409EFF', '#1890ff', '#304156','#212121','#11a983', '#13c2c2', '#6959CD', '#f5222d', ]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
import { getLocalStorage } from '@monkey.do/monkey';

export default {
  name: "ThemePicker",

  props: {
    defaultTheme: {
      type: String,
      default: "#1890FF", // 默认primary色
    },
  },

  data() {
    return {
      theme: "",
    };
  },

  watch: {
    theme: {
      handler: function(val, old) {
        const oldVal = old || this.defaultTheme;
        if (typeof val !== 'string' || !val) return;

        const themeCluster = this.getThemeCluster(val.replace('#', ''));
        // styles
        const replaceStyle = (prevColor) => {
          const originalCluster = this.getThemeCluster(prevColor.replace('#', ''));

          const f = () => {
            const styles = [].slice.call(document.querySelectorAll('style')).filter(style => {
              const text = style.innerText;
              return new RegExp(prevColor, 'i').test(text) && !/Chalk Variables/.test(text);
            });

            styles.forEach(style => {
              const { innerText } = style;
              if (typeof innerText !== 'string') return;
              style.innerText = this.updateStyle(innerText, originalCluster, themeCluster);
            });

            this.$emit('change', val);
          };

          f();
        };
        // links
        const replaceLinks = (prevColor) => {
          const originalCluster = this.getThemeCluster(prevColor.replace('#', ''));
          const styleSheetsObj = document.styleSheets;
          Object.keys(styleSheetsObj).forEach(item => {
            if (styleSheetsObj[item].href) {
              this.getFile(styleSheetsObj[item].href).then(({ data }) => {
                if (new RegExp(prevColor, 'i').test(data)) {
                  const innerText = this.updateStyle(data, originalCluster, themeCluster);
                  this.createStyle(innerText);
                }
              });
            }
          });
          this.$emit('change', val);
        };
        if (!old && val !== this.defaultTheme) {
          replaceStyle(this.defaultTheme);
          replaceLinks(this.defaultTheme);
        }

        replaceStyle(oldVal);
        replaceLinks(oldVal);
      },
      immediate: true,
    },
  },
  mounted() {
    const localRb = getLocalStorage("rb-system-setting") || "";
    this.theme = localRb && localRb.theme ? localRb.theme : this.defaultTheme;
  },
  methods: {
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style;
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
      });
      return newStyle;
    },
    createStyle(text, id) {
      if (id) {
        // 如果存在style先删除
        const bodyStyle = document.querySelector(`#${id}`);
        if (bodyStyle) document.querySelector("head").removeChild(bodyStyle);
      }
      const style = document.createElement("style");
      if (id) style['id'] = id;
      style['innerHTML'] = text;
      document.querySelector("head").appendChild(style);
    },

    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        if (tint === 0) { // when primary color is in its rgb space
          return [red, green, blue].join(',');
        } else {
          red += Math.round(tint * (255 - red));
          green += Math.round(tint * (255 - green));
          blue += Math.round(tint * (255 - blue));

          red = red.toString(16);
          green = green.toString(16);
          blue = blue.toString(16);

          return `#${red}${green}${blue}`;
        }
      };

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16);
        let green = parseInt(color.slice(2, 4), 16);
        let blue = parseInt(color.slice(4, 6), 16);

        red = Math.round((1 - shade) * red);
        green = Math.round((1 - shade) * green);
        blue = Math.round((1 - shade) * blue);

        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);

        return `#${red}${green}${blue}`;
      };

      const clusters = [theme];
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
      }
      clusters.push(shadeColor(theme, 0.1));
      return clusters;
    },
    getFile(url, isBlob = false) {
      return new Promise((resolve, reject) => {
        const client = new XMLHttpRequest();
        client.responseType = isBlob ? 'blob' : '';
        client.onreadystatechange = () => {
          if (client.readyState !== 4) {
            return;
          }
          if (client.status === 200) {
            const urlArr = client.responseURL.split('/');
            resolve({
              data: client.response,
              url: urlArr[urlArr.length - 1],
            });
          } else {
            reject(new Error(client.statusText));
          }
        };
        client.open('GET', url);
        client.send();
      });
    },
  },
};
</script>

<style lang="scss">
  .theme-picker-dropdown {
    z-index: 10000!important;
  }
</style>

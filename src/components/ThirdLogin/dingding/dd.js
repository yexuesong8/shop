!(function(window, document) {
  function d(a) {
    var e; var c = document.createElement("iframe");
    var d = "https://login.dingtalk.com/login/qrcode.htm?goto=" + a.goto;
    // eslint-disable-next-line no-sequences
    d += a.style ? "&style=" + encodeURIComponent(a.style) : "",
    d += a.href ? "&href=" + a.href : "",
    c.src = d,
    c.frameBorder = "0",
    c.allowTransparency = "true",
    c.scrolling = "no",
    // c.width = a.width ? a.width + 'px' : "365px",
    c.height = a.height ? a.height + 'px' : "365px",
    e = document.getElementById(a.id),
    e.innerHTML = "",
    e.appendChild(c);
  }
  window.DDLogin = d;
}(window, document));

// import request from "axios";
//
// function runScript(str) {
//   const script = document.createElement('script');
//   script.type="text/javascript";
//   script.text=str;
//   document.getElementsByTagName('head')[0].appendChild(script);
//   document.head.removeChild(document.head.lastChild);
// }
//
// const getDing = async () => {
//   return request({ url: "http://g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js", methods: "get" }).then(res => {
//     if (res.data) runScript(res.data);
//     console.log(res);
//   });
// };
//
// export default getDing;

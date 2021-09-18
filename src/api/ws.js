let wsUri = "";

switch (process.env.RUN_ENV) {
  case "prod":
    wsUri = "ws://192.168.10.61:9000/ws";
    break;
  case "test":
    wsUri = "ws://192.168.10.62:9000/ws";
    break;
  case "dev":
    wsUri = "ws://192.168.10.60:9000/ws";
    break;
  default:
    wsUri = "ws://192.168.10.60:9000/ws";
}

export default wsUri;


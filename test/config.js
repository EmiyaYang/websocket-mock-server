function rule(input) {
  if (typeof input !== "object") return "Not object";
  switch (input.type) {
    case "text":
      return { type: "text", message: "Console has received your text msg." };
    case "image":
      return {
        type: "image",
        message: "https://www.baidu.com/img/bd_logo1.png"
      };
    default:
      break;
  }
}

module.exports = {
  port: 4040,
  autoMsgTimeout: 1000,
  rule
};

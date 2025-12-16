import fs from "fs";

export default {
  nodeResolve: {
    exportConditions: ["development", "browser"],
  },
  middleware: [
    function serveTodomvc(context, next) {
      if (context.url === "/base.js") {
        context.type = "application/javascript";
        context.body = fs.readFileSync("./node_modules/todomvc-common/base.js", "utf-8");
        return;
      }
      if (context.url === "/base.css") {
        context.type = "text/css";
        context.body = fs.readFileSync("./node_modules/todomvc-common/base.css", "utf-8");
        return;
      }
      return next();
    },
  ],
};

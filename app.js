const dotenv = require("dotenv");
dotenv.config({ path: "./env" });

// const express = require("express");
const path = require("path");
const cors = require("cors");
const resHandle = require("./src/utils/resHandler");
const connectDb = require("./config/db/connect");
const router = require("./routes");
const mongoose = require("mongoose");
const fs = require("fs");
const { createReadStream } = require("stream");
const { GridFSBucket } = require("mongodb");
const asyncHandler = require("./src/utils/asyncHandler");
// const { Server } = require("socket.io");
const spawn = require("cross-spawn");
// const { createServer } = require("http");

// All initialization here
// const app = express();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
// All variable declaration here
const port = Number(process.env.PORT || 8000);

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const { exec } = require("child_process");
const nodemon = require("nodemon");
let user;
io.on("connection", (socket) => {
  console.log("A user connected", socket?.id);
  // Send the output to the connected client
  user = socket;
  // user.emit("output", array);

  // socket.on("project", () => {});
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
server.listen(8000, () => {
  console.log(`Server running on http://localhost:${8000}`);
});
// TODO: Cors connect with env depend on Production | development environment
const option = {
  origin: "*",
  credentials: true,
};

// middlewares
app.use(cors(option));
app.use(express.json({ limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public/tmp/uploads")));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

connectDb();

// Routes
app.use("/api/v1/", router);

// app.post(
//   "/api/v1/host",
//   asyncHandler(async (req, res, next) => {
//     nodemon.emit("quit");
//     try {
//       const GIT_REPOSITORY_URL = req?.body?.gitUrl;

//       if (!GIT_REPOSITORY_URL) {
//         return res.status(400).json({ error: "Git URL is required" });
//       }

//       console.log("Executing script.js");

//       const repositoryName = GIT_REPOSITORY_URL?.split("/")[4]?.split(".")[0];

//       const outDirPath = path.join(__dirname, `output`);
//       const nextDirPath = path.join(
//         __dirname,
//         `output/${repositoryName?.toString()}`
//       );

//       // const startNewTerminalCommand = `start cmd /k "cd "${outDirPath}" && git clone "${GIT_REPOSITORY_URL}" && cd "${nextDirPath}" && npm install && npm start"`;

//       // const startNewTerminalCommandResult = spawn.sync(
//       //   startNewTerminalCommand,
//       //   {
//       //     cwd: outDirPath,
//       //     stdio: "inherit",
//       //     shell: true,
//       //   }
//       // );
//       // console.log(startNewTerminalCommandResult.stdout?.toString());
//       const startNewTerminalCommand = `cd "${outDirPath}" && git clone "${GIT_REPOSITORY_URL}" && cd "${nextDirPath}" && npm install && npm start`;

//       const openTerminalCommand = `start cmd /k "${startNewTerminalCommand}"`;

//       // const p = exec(
//       //   openTerminalCommand,
//       //   { cwd: outDirPath, shell: true },
//       //   (error, stdout, stderr) => {
//       //     if (error) {
//       //       console.error(`Error: ${error.message}`);
//       //       return;
//       //     }
//       //     console.log(stdout);
//       //   }
//       // );
//       // p.stdout.on("data", function (data) {
//       //   console.log(data.toString());
//       //   user.emit("output", data?.toString());
//       // });

//       // p.stdout.on("error", function (data) {
//       //   console.log("Error", data.toString());
//       //   user.emit("output", data?.toString());
//       // });

//       const p = spawn(openTerminalCommand, {
//         cwd: outDirPath,
//         shell: true,
//       });

//       p.stdout.on("data", function (data) {
//         console.log(data.toString());
//         user.emit("output", data?.toString());
//       });

//       p.stderr.on("data", function (data) {
//         console.error("Error", data.toString());
//         user.emit("output", data?.toString());
//       });

//       p.on("close", function (code) {
//         console.log("Script execution successful");
//         next();
//       });

//       p.on("error", function (err) {
//         console.error("Error in script execution:", err.message);
//         res.status(500).json({ error: "Script execution failed" });
//       });

//       console.log("Script execution successful");

//       // Placeholder for opening a new terminal (modify it based on your platform)
//       if (process.platform === "win32") {
//         spawn.sync("start cmd.exe", [], { stdio: "inherit", shell: true });
//       } else if (process.platform === "darwin") {
//         spawn.sync("open -a Terminal", [], { stdio: "inherit", shell: true });
//       } else {
//         spawn.sync("gnome-terminal", [], { stdio: "inherit", shell: true });
//       }

//       // Placeholder for a server close command (modify it as per your server setup)
//       // For example, if you are using Express:
//       // const server = require('./your_server_file');
//       // server.close();
//       nodemon({
//         script: "your-server-file.js", // Modify with your main server file
//         ignore: ["output/*"], // Ignore the directory where scripts are executed
//       });

//       next();
//     } catch (err) {
//       console.error("Error in script execution:", err.message);
//       res.status(500).json({ error: "Script execution failed" });
//     }
//   })
// );

// ... (your other imports and setup)

app.post(
  "/api/v1/host",
  asyncHandler(async (req, res, next) => {
    // Stop nodemon temporarily
    nodemon.emit("quit");

    try {
      const GIT_REPOSITORY_URL = req?.body?.gitUrl;

      if (!GIT_REPOSITORY_URL) {
        return res.status(400).json({ error: "Git URL is required" });
      }

      console.log("Executing script.js");

      const repositoryName = GIT_REPOSITORY_URL?.split("/")[4]?.split(".")[0];

      const outDirPath = path.join(__dirname, `output`);
      const nextDirPath = path.join(
        __dirname,
        `output/${repositoryName?.toString()}`
      );

      const startNewTerminalCommand = `cd "${outDirPath}" && git clone "${GIT_REPOSITORY_URL}" && cd "${nextDirPath}" && npm install && npm start`;

      // const openTerminalCommand = `start cmd /k "${startNewTerminalCommand}"`;
      const openTerminalCommand = `start cmd /k "${startNewTerminalCommand}"`;

      const p = exec(
        openTerminalCommand,
        { cwd: outDirPath, shell: true },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }
          console.log(stdout);
        }
      );

      p.stdout.on("data", function (data) {
        console.log(data.toString());
        user.emit("output", data?.toString());
      });

      p.stdout.on("data", function (data) {
        console.error("Error", data.toString());
        user.emit("output", data?.toString());
      });

      p.on("close", function (code) {
        user.emit("output", code?.toString());
        console.log("Script execution successful");

        // Restart nodemon after script execution
        nodemon({
          script: "./app.js", // Modify with your main server file
          ignore: ["output/*"], // Ignore the directory where scripts are executed
        });

        next();
      });

      p.on("error", function (err) {
        console.error("Error in script execution:", err.message);
        res.status(500).json({ error: "Script execution failed" });
      });
    } catch (err) {
      console.error("Error in script execution:", err.message);
      res.status(500).json({ error: "Script execution failed" });
    }
  })
);

// ... (rest of your code)

app.use(resHandle);

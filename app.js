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
const httpProxy = require("http-proxy");
// const { createServer } = require("http");

// All initialization here
// const app = express();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
// All variable declaration here
const port = Number(process.env.PORT || 8000);
const proxy = httpProxy.createProxy();
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const { exec, execSync } = require("child_process");
const nodemon = require("nodemon");
let user;
let userId;
io.on("connection", (socket) => {
  console.log("A user connected", socket?.id);
  // Send the output to the connected client
  user = socket;
  socket.join(socket.id);
  userId = socket.id;
  socket.on("join", function (room) {
    console.log("🚀 ~ room:", room);
    socket.join(room);
  });
  // user?.to(userId)?.emit("output", array);

  // socket.on("project", () => {});
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// app.use((req, res) => {
//   const hostname = req.hostname;
//   const subdomain = hostname.split(".")[0];

//   const BASE_PATH = "http://localhost:8000/api/v1/";
//   // Custom Domain - DB Query

//   const resolvesTo = `${BASE_PATH}/${subdomain}`;

//   return proxy.web(req, res, { target: resolvesTo, changeOrigin: true });
// });

// proxy.on("proxyReq", (proxyReq, req, res) => {
//   const url = req.url;
//   if (url === "http://localhost:3000/") proxyReq.path += "index.html";
//   // proxy.web(req, res, { target: "http://localhost:3000/" });
// });

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
//       //   user?.to(userId)?.emit("output", data?.toString());
//       // });

//       // p.stdout.on("error", function (data) {
//       //   console.log("Error", data.toString());
//       //   user?.to(userId)?.emit("output", data?.toString());
//       // });

//       const p = spawn(openTerminalCommand, {
//         cwd: outDirPath,
//         shell: true,
//       });

//       p.stdout.on("data", function (data) {
//         console.log(data.toString());
//         user?.to(userId)?.emit("output", data?.toString());
//       });

//       p.stderr.on("data", function (data) {
//         console.error("Error", data.toString());
//         user?.to(userId)?.emit("output", data?.toString());
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

// app.post(
//   "/api/v1/host",
//   asyncHandler(async (req, res, next) => {
//     // Stop nodemon temporarily
//     nodemon.emit("quit");

//     try {
//       const GIT_REPOSITORY_URL = req?.body?.gitUrl;

//       if (!GIT_REPOSITORY_URL) {
//         return res.status(400).json({ error: "Git URL is required" });
//       }

//       console.log("Executing script.js");
//       user?.to(userId)?.emit("output", "Executing script.js");

//       const repositoryName = GIT_REPOSITORY_URL?.split("/")[4]?.split(".")[0];

//       const outDirPath = path.join(__dirname, `output`);
//       const nextDirPath = path.join(
//         __dirname,
//         `output/${repositoryName?.toString()}`
//       );

//       const gitCloneCommand = `start cmd /k cd "${outDirPath}" && git clone "${GIT_REPOSITORY_URL}" && cd "${nextDirPath}" && npm install && npm start`;
//       // const npmInstallCommand = "npm install";
//       // const npmStartCommand = "npm start";

//       const commands = [
//         { command: gitCloneCommand, cwd: outDirPath },
//         // { command: npmInstallCommand, cwd: nextDirPath },
//         // { command: npmStartCommand, cwd: nextDirPath },
//       ];

//       const executeCommand = (command, cwd) => {
//         const childProcess = spawn(command, { shell: true, cwd });

//         childProcess.stdout.on("data", (data) => {
//           console.log(data.toString());
//           user?.to(userId)?.emit("output", data.toString());
//         });

//         childProcess.stderr.on("data", (data) => {
//           console.error(data.toString());
//           user?.to(userId)?.emit("output", data.toString());
//         });

//         childProcess.on("close", (code) => {
//           console.log(`Child process exited with code ${code}`);
//         });
//       };

//       // Execute commands in separate terminals
//       for (const { command, cwd } of commands) {
//         executeCommand(command, cwd);
//       }

//       // Continue with the rest of your code...
//       console.log("Script execution successful");
//       // execSync("nodemon ./app.js", { stdio: "inherit" }); // Modify with your main server file
//       next();
//       res.status(200).json({ message: "Script execution successful" });
//     } catch (err) {
//       console.error("Error in script execution:", err.message);
//       res.status(500).json({ error: "Script execution failed" });
//     }
//   })
// );

app.get(
  "/api/v1/",
  asyncHandler(async (req, res, next) => {
    try {
      console.log(userId);
      // user.join(userId);
      const distFolderPath = path.join(__dirname, "output");
      const distFolderContents = fs.readdirSync(distFolderPath, {
        recursive: true,
      });

      for (const file of distFolderContents) {
        const filePath = path.join(distFolderPath, file);

        if (fs.lstatSync(filePath).isDirectory()) {
          const packageJsonPath = path.join(filePath, "package.json");

          if (fs.existsSync(packageJsonPath)) {
            const packageJsonContent = fs.readFileSync(
              packageJsonPath,
              "utf-8"
            );
            const packageJson = JSON.parse(packageJsonContent);

            // Check if "start" or "dev" script exists
            if (
              packageJson.scripts &&
              (packageJson.scripts.start || packageJson.scripts.dev)
            ) {
              // Add 'cd' to change the working directory
              if (packageJson.scripts.start || packageJson.scripts.dev) {
                console.log(
                  `Start Script: ${
                    packageJson.scripts.start || packageJson.scripts.dev
                  }`
                );
                const bashCommand = `cd ${filePath} && git pull && npm i && ${
                  packageJson.scripts.start || packageJson.scripts.dev
                }`;
                const childProcess = spawn(bashCommand, {
                  cwd: __dirname,
                  shell: true,
                });

                childProcess.stdout.on("data", (data) => {
                  console.log(data.toString());
                  user?.to(userId)?.emit("output", data.toString());
                });

                childProcess.stderr.on("data", (data) => {
                  console.error(data.toString());
                  user?.to(userId)?.emit("output", data.toString());
                });
              }
            }
          }
        }
      }

      next();
      return res.status(400).json({ error: "Git URL is required" });
    } catch (error) {
      console.error("Error in script execution:", error.message);
      return res.status(500).json({ error: "Script execution failed" });
    }
  })
);

app.post(
  "/api/v1/host",
  asyncHandler(async (req, res, next) => {
    nodemon.emit("quit");

    try {
      console.log(userId);
      // user.join(userId);
      const GIT_REPOSITORY_URL = req?.body?.gitUrl;

      if (!GIT_REPOSITORY_URL) {
        return res.status(400).json({ error: "Git URL is required" });
      }

      console.log(userId);
      console.log("Executing script.sh");
      user?.to(userId)?.emit("output", "Executing script.sh");

      const repositoryName = GIT_REPOSITORY_URL?.split("/")[4]?.split(".")[0];

      const outDirPath = path.join(__dirname, "output");
      const nextDirPath = path.join(
        __dirname,
        "output",
        repositoryName?.toString()
      );

      const scriptPath = path.join(__dirname, "myscript.sh");

      // Properly handle paths with spaces
      const bashCommand = `bash "${scriptPath}" "${GIT_REPOSITORY_URL}" "${repositoryName}"`;

      const childProcess = spawn(bashCommand, { cwd: __dirname, shell: true });

      childProcess.stdout.on("data", (data) => {
        console.log(data.toString());
        user?.to(userId)?.emit("output", data.toString());
      });

      childProcess.stderr.on("data", (data) => {
        console.error(data.toString());
        user?.to(userId)?.emit("output", data.toString());
      });

      childProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Script execution successful");
          user?.to(userId)?.emit("output", "Script execution successful");
        } else {
          console.error("Script execution failed with code:", code);
          user
            ?.to(userId)
            ?.emit("output", `Script execution failed with code: ${code}`);
          return res.status(500).json({ error: "Script execution failed" });
        }
        next();
        return res.status(200).json({ message: "Script execution successful" });
      });
    } catch (err) {
      console.error("Error in script execution:", err.message);
      return res.status(500).json({ error: "Script execution failed" });
    }
  })
);

// ... (rest of your code)

app.use(resHandle);

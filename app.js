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

app.get(
  "/api/v1/",
  asyncHandler(async (req, res, next) => {
    try {
      console.log(userId);
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

            if (
              packageJson.scripts &&
              (packageJson.scripts.start || packageJson.scripts.dev)
            ) {
              if (packageJson.scripts.start || packageJson.scripts.dev) {
                console.log(
                  `Start Script: ${
                    packageJson.scripts.start || packageJson.scripts.dev
                  }`
                );
                const bashCommand = `cd ${filePath} && git pull && npm i && ${
                  packageJson.scripts.start || packageJson.scripts.dev
                }`;
                console.log("🚀 ~ asyncHandler ~ filePath:", filePath);
                // const bashCommand = `cd ${filePath} && git pull && npm i && npm start`;
                const childProcess = spawn(bashCommand, {
                  cwd: __dirname,
                  shell: true,
                });

                childProcess.stdout.on("data", (data) => {
                  console.log(data.toString());
                  io.to(userId).emit("output", data.toString());
                });

                childProcess.stderr.on("data", (data) => {
                  console.error(data.toString());
                  io?.to(userId)?.emit("output", data.toString());
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
        io?.to(userId)?.emit("output", data.toString());
      });

      childProcess.stderr.on("data", (data) => {
        console.error(data.toString());
        io?.to(userId)?.emit("output", data.toString());
      });

      childProcess.on("close", (code) => {
        if (code === 0) {
          console.log("Script execution successful");
          user?.to(userId)?.emit("output", "Script execution successful");
        } else {
          console.error("Script execution failed with code:", code);
          io?.to(userId)?.emit(
            "output",
            `Script execution failed with code: ${code}`
          );
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

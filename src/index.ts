import {
  notPreAuthRequiringApis,
  authorisedApis as preAuthRequiringApis,
} from "./http apis/apis";
import { HttpServerManager } from "./managers/HttpServerManager";
import { IoManager } from "./managers/IoManager";
import { QuizManager } from "./managers/QuizManager";
import { UserCredentialsManager } from "./managers/UserCredentialsManager";
import { UsersManager } from "./managers/UsersManager";
import http from "http";
import { Server } from "socket.io";
 HttpServerManager.getInstace();
const server = http.createServer(HttpServerManager.getApp());

// i thinks this is not needed
UserCredentialsManager.getInstance();
UsersManager.getInstance();
QuizManager.getInstance();

notPreAuthRequiringApis.forEach((api) => {
  HttpServerManager.registerApi(api);
});
const authRouter = HttpServerManager.createAuthorisationWall();
preAuthRequiringApis.forEach((api) => {
  HttpServerManager.registerAuthorisedApi(api, authRouter);
});

IoManager.getInstance(server);
const io = IoManager.getIo();
io.on("connection", (socket) => {
  IoManager.createWsListeners(socket);
  socket.on("disconnect", () => {});
});

server.listen(3000, () => {
  console.log("Server started");
});

UserCredentialsManager.debug();
UsersManager.debug();
QuizManager.debug();

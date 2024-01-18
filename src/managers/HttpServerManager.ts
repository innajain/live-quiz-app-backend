import express, { Router } from "express";
import { Api } from "../http apis/apis";
import cors from "cors";
import { UserCredentialsManager } from "./UserCredentialsManager";

export class HttpServerManager {
  private static instance: HttpServerManager;
  private static app: express.Express;

  private constructor() {
    HttpServerManager.app = express();
    HttpServerManager.app.use(express.json());
    HttpServerManager.app.use(cors());
  }

  public static getInstace(): HttpServerManager {
    if (!HttpServerManager.instance) {
      HttpServerManager.instance = new HttpServerManager();
    }
    return HttpServerManager.instance;
  }

  public static getApp(): express.Express {
    return this.app;
  }

  public static registerApi(api: Api) {
    if (api.method === "GET") {
      this.app.get(api.path, api.handler);
    } else if (api.method === "POST") {
      this.app.post(api.path, api.handler);
    }
  }

  public static createAuthorisationWall() {
    const authRouter = Router();
    this.app.use("/authorised", authRouter);

    authRouter.use((req, res, next) => {
      const verified =
        UserCredentialsManager.verifyUserCredentials({
          emailId: req.body.emailId,
          password: req.body.password,
        }).success;
      if (verified) {
        next();
      } else {
        res.status(401).send({
          success: false,
          message: "Not authorised",
        });
      }
    });

    authRouter.post("/", (req, res) => {
      res.status(200).send({
        success: true,
        message: "Authorised",
      });
    });

    return authRouter;
  }

  public static registerAuthorisedApi(api: Api, authRouter: Router) {
    if (api.method === "GET") {
      authRouter.get(api.path, api.handler);
    } else if (api.method === "POST") {
      authRouter.post(api.path, api.handler);
    }
  }
}

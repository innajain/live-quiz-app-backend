import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse, statusCodes } from "../apis";
import { QuizManager } from "../../managers/QuizManager";
import { UserCredentialsManager } from "../../managers/UserCredentialsManager";

export default function loginHandler({body: { emailId, password}}: Request<{}, {}, {
  emailId: string;
  password: string;
}>, res: Response) {
  const output = UserCredentialsManager.verifyUserCredentials({
    emailId,
    password, 
  });

  if (output.success) {
    if (output.message === "User verified") {
      sendSuccessResponse(res, {
        message: "Logged in",
      });
      return;
    }
  }
  if (output.message === "Incorrect password") {
    sendFailureResponse(res, {
      message: output.message,
      statusCode: statusCodes.badRequest,
    });
    return;
  }
  sendFailureResponse(res, {
    message: output.message!,
    statusCode: statusCodes.badRequest,
  });
}

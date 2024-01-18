import { Request, Response } from "express";
import {
  sendFailureResponse,
  sendSuccessResponse,
  statusCodes,
} from "../apis";
import { UserCredentialsManager } from "../../managers/UserCredentialsManager";

export default function signupHandler({body: {name, emailId, password}}: Request<{}, {}, {
  name: string;
  emailId: string;
  password: string;
}>, res: Response) {
  const output = UserCredentialsManager.addUserCredentials({
    name,
    emailId,
    password,
    
  });
  if (output.success) {
    sendSuccessResponse(res, {
      message: "OTP Sent",
    });
    return
  }
  sendFailureResponse(res, {
    message: "User already exists",
    statusCode: statusCodes.badRequest,
  });
}

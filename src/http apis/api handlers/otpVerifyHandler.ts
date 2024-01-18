import { Request, Response } from "express";
import {
  sendFailureResponse,
  sendSuccessResponse,
  statusCodes,
} from "../apis";
import { UserCredentialsManager } from "../../managers/UserCredentialsManager";

export default function otpVerifyHandler({body: { emailId, otp}}: Request<{}, {}, {
  emailId: string,
  otp: number,

}>,  res: Response) {
  const output = UserCredentialsManager.verifyOtp({
    emailId,
    otp
  });
  if (output.success) {
    sendSuccessResponse(res, {
      message: "Signup Complete",
    });
    return;
  }
  if (output.message === "User not found") {
    sendFailureResponse(res, {
      message: "Session expired",
      statusCode: statusCodes.badRequest,
    });
    return;
  }
  sendFailureResponse(res, {
    message: "Incorrect OTP",
    statusCode: statusCodes.badRequest,
  });
}

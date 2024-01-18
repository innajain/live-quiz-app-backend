import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse, statusCodes } from "../apis";
import { UsersManager } from "../../managers/UsersManager";

export default function getUserDataHandler(
  {
    body: { emailId },
  }: Request<
    {},
    {},
    {
      emailId: string;
    }
  >,
  res: Response
) {
  const output = UsersManager.getUserData({
    emailId,
  });
  sendSuccessResponse(res, {
    message: "User data",
    data: output.data,
  });
}

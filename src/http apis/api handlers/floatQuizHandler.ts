import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse, statusCodes } from "../apis";
import { QuizManager } from "../../managers/QuizManager";
import { UsersManager } from "../../managers/UsersManager";

export default function floatQuizHandler(
  { body: { draftQuizId, emailId } }: Request<{}, {}, { draftQuizId: string , 
  emailId: string
  }>,
  res: Response
) {
  const output = UsersManager.floatQuiz({draftQuizId, emailId});
  if (output.success) {
    sendSuccessResponse(res, {
      message: "Quiz floated",
      data: {
        quizId: output.quizId,
      },
    });
    return;
  }
  if (output.message === "Quiz not found") {
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

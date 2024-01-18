import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse, statusCodes } from "../apis";
import { QuizManager } from "../../managers/QuizManager";

export default function joinQuizHandler(
  { body: { name, quizId } }: Request<{}, {}, {
    name: string;
    quizId: string;
  }>,
  res: Response<ResponseType>
) {
  const output = QuizManager.joinQuiz({
    name,
    quizId,
  });
  if (output.success) {
    sendSuccessResponse(res, {
      message: "Joined Quiz",
      data: {
        userId: output.userId,
      },
    });
    return;
  }
  sendFailureResponse(res, {
    message: "Quiz not found",
    statusCode: statusCodes.badRequest,
  });
}

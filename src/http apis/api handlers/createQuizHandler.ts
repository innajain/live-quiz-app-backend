import { Request, Response } from "express";
import { sendFailureResponse, sendSuccessResponse, statusCodes } from "../apis";
import { UsersManager } from "../../managers/UsersManager";
import { QuizManager } from "../../managers/QuizManager";

export default function createQuizHandler(
  { body: { emailId } }: Request<{}, {}, { emailId: string }>,
  res: Response
) {
  const output = QuizManager.createQuiz({
    emailId,
  });

  sendSuccessResponse(res, {
    message: "Quiz created successfully",
    data: {
      draftQuizId: output.draftQuizId,
    },
  });
}

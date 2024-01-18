import { Request, Response } from "express";
import { Problem } from "../../managers/Quiz";
import { QuizManager } from "../../managers/QuizManager";
import { sendSuccessResponse } from "../apis";
import { UsersManager } from "../../managers/UsersManager";

export default function saveDraftQuizHandler(
  {
    body: { emailId, problemsArray },
  }: Request<
    {},
    {},
    {
      emailId: string;
      problemsArray: Problem[];
    }
  >,
  res: Response
) {
  const { draftQuizId } = UsersManager.saveDraftQuiz({
    emailId,
    problemsArray,
  });
  sendSuccessResponse(res, {
    message: "Quiz saved successfully",
    data: {
      draftQuizId,
    },
  });
}

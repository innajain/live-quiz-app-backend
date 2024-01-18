import { Request, Response } from "express";
import {
  sendFailureResponse,
  sendSuccessResponse,
  statusCodes,
} from "../apis";
import { QuizManager } from "../../managers/QuizManager";

export default function addProblemHandler({body: {name, emailId, password}}: Request<{}, {}, {
  name: string;
  emailId: string;
  password: string;
}>, res: Response) {
 
}

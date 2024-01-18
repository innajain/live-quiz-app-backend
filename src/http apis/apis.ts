import { Request, Response } from "express";
import signupHandler from "./api handlers/signupHandler";
import otpVerifyHandler from "./api handlers/otpVerifyHandler";
import joinQuizHandler from "./api handlers/joinQuizHandler";
import loginHandler from "./api handlers/loginHandler";
import getUserDataHandler from "./api handlers/getUserDataHandler";
import createQuizHandler from "./api handlers/createQuizHandler";
import addProblemHandler from "./api handlers/addProblemHandler";
import joinQuizAuthHandler from "./api handlers/joinQuizAuthHandler";
import floatQuizHandler from "./api handlers/floatQuizHandler";
import saveDraftQuizHandler from "./api handlers/saveDraftQuizHandler";

export function sendSuccessResponse(
  res: Response,
  { data, message }: {
    data?: any;
    message: string;
  }
) {
  res.status(200).send({
    success: true,
    message,
    data,
  });
}

export function sendFailureResponse(
  res: Response,
  {
    data,
    message,
    statusCode,
  }: { data?: any; message: string; statusCode: number }
) {
  res.status(400).send({
    success: false,
    message,
    data,
  });
}

export interface Api {
  path: string;
  method: string;
  handler: (req: Request, res: Response) => void;
}

export const statusCodes = {
  success: 200,
  badRequest: 400,
  notFound: 404,
  internalServerError: 500,
};

export const notPreAuthRequiringApis: Api[] = [
  {
    path: "/",
    method: "POST",
    handler: (req: Request, res: Response) => {
      sendSuccessResponse(res, {
        message: "Hello World!",
      });
    },
  },
  {
    path: "/signup",
    method: "POST",
    handler: signupHandler,
  },
  {
    path: "/otpVerify",
    method: "POST",
    handler: otpVerifyHandler,
  },
  {
    path: "/login",
    method: "POST",
    handler: loginHandler,
  },
  {
    path: "/joinQuiz",
    method: "POST",
    handler: joinQuizHandler,
  },
  
];


// these assume that valid emailId and password is present in req.body
export const authorisedApis:Api[] = [
  {
    path: "/getUserData",
    method: "POST",
    handler: getUserDataHandler,
  },
  {
    path: "/createQuiz",
    method: "POST",
    handler: createQuizHandler,
  },
  {
    path: "/saveDraftQuiz",
    method: "POST",
    handler: saveDraftQuizHandler,
  },
  // below two remaining
  {
    path: "/addProblem",
    method: "POST",
    handler: addProblemHandler,
  },
  {
    path: "/joinQuizAuth",
    method: "POST",
    handler: joinQuizAuthHandler,
  },
  {
    path: "/floatQuiz",
    method: "POST",
    handler: floatQuizHandler,
  },
];

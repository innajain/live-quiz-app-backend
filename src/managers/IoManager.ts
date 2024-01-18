import * as http from "http";
import { Server, Socket } from "socket.io";
import { QuizManager } from "./QuizManager";
import { UserCredentialsManager } from "./UserCredentialsManager";
export class IoManager {
  private static instance: IoManager;
  private static io: Server;

  constructor(server: http.Server) {
    IoManager.io = new Server(server, {
      cors: {
        origin: "*",
      },
    });
  }

  public static getInstance(server: http.Server): IoManager {
    if (!IoManager.instance) {
      IoManager.instance = new IoManager(server);
    }
    return IoManager.instance;
  }

  public static getIo(): Server {
    return this.io;
  }
  public static createWsListeners(socket: Socket) {
    socket.on(
      "joinQuiz",
      ({ quizId, userId }: { quizId: string; userId: string }) => {
        const { quiz } = QuizManager.getQuiz({ quizId });

        if (
          quiz &&
          quiz.participants.find((participant) => participant.userId === userId)
        ) {
          const problem =
            quiz.currentProblemIndex == -1
              ? undefined
              : quiz.problems[quiz.currentProblemIndex];
          const problemData = problem
            ? {
                question: problem.question,
                options: problem.options,
              }
            : undefined;
          socket.emit("joinQuizReply", {
            currentProblemIndex: quiz.currentProblemIndex,
            totalProblems: quiz.problems.length,
            currentProblem:
              quiz.currentProblemIndex == -1
                ? undefined
                : quiz.problems[quiz.currentProblemIndex],
          });
          socket.join(quizId.toString());

          socket.on(
            "submitAnswer",
            ({
              problemIdx,
              answer,
            }: {
              problemIdx: number;
              answer: number;
            }) => {
              quiz.submitAnswer({
                problemIdx,
                answer,
                userId,
              });
            }
          );

          socket.on("disconnect", () => {
            quiz.removeParticipant({ userId });
          });
        }
      }
    );
    socket.on(
      "joinQM",
      ({
        emailId,
        password,
        quizId,
      }: {
        emailId: string;
        password: string;
        quizId: string;
      }) => {
        const { quiz } = QuizManager.getQuiz({ quizId });

        if (!quiz) {
          socket.emit("joinQMReply", {
            success: false,
            message: "Quiz does not exist",
          });
          return;
        }
        if (quiz.adminEmailId !== emailId) {
          socket.emit("joinQMReply", {
            success: false,
            message: "You are not the QM of this quiz",
          });
          return;
        }
        if (
          !UserCredentialsManager.verifyUserCredentials({ emailId, password })
            .success
        ) {
          socket.emit("joinQMReply", {
            success: false,
            message: "Incorrect password",
          });
        }

        socket.join(emailId);
        socket.on("startQuiz", () => {
          quiz.startQuiz();
        });
        socket.on("nextProblem", () => {
          quiz.nextProblem();
        });
        socket.on("answerReveal", () => {
          quiz.answerReveal();
        });
        socket.on("showLeaderboard", () => {
          quiz.showLeaderboard();
        });
        socket.on("removeParticipant", ({ userId }: { userId: string }) => {
          quiz.removeParticipant({ userId });
        });
        socket.on("endQuiz", () => {
          quiz.endQuiz();
        });

        socket.emit("joinQMReply", {
          success: true,
          message: "Quiz floated",
          quiz
        })
      }
    );
  }
}

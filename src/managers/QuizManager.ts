import { DraftQuiz, Problem, Quiz } from "./Quiz";
import { UsersManager } from "./UsersManager";

export class QuizManager {
  private static instance: QuizManager;
  private static liveQuizzes: Quiz[];

  private constructor() {
    QuizManager.liveQuizzes = [];
  }

  public static getInstance(): QuizManager {
    if (!QuizManager.instance) {
      QuizManager.instance = new QuizManager();
    }
    return QuizManager.instance;
  }
  public static getQuiz({ quizId }: { quizId: string }): {
    success: boolean;
    quiz?: Quiz;
  } {
    const quiz = this.liveQuizzes.find((quiz) => quiz.quizId === quizId);
    if (quiz) {
      return { success: true, quiz };
    }
    return { success: false };
  }
  public static joinQuiz({ quizId, name }: { quizId: string; name: string }): {
    success: boolean;
    message?: "Quiz does not exit";
    userId?: string;
  } {
    const quiz = this.liveQuizzes.find((quiz) => quiz.quizId === quizId);
    if (quiz) {
      let userId = this.generateUserId();
      while (quiz.participants.find((user) => user.userId === userId)) {
        userId = this.generateUserId();
      }
      quiz.addParticipant(userId, name);
      return { success: true, userId };
    }
    return { success: false, message: "Quiz does not exit" };
  }

  private static generateUserId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  public static createQuiz({ emailId }: { emailId: string }) {
    const draftQuizId = UsersManager.createQuiz(emailId);
    return draftQuizId;
  }

  public static floatQuiz({
    emailId,
    draftQuiz,
  }: {
    emailId: string;
    draftQuiz: DraftQuiz;
  }) {
    let quizId = this.generateQuizId();
    while (QuizManager.isQuizLive({ quizId })) {
      quizId = this.generateQuizId();
    }
    const quiz = new Quiz({ quizId, adminEmailId: emailId });
    draftQuiz.problems.forEach((problem) => {
      quiz.addProblem(problem);
    });

    this.liveQuizzes.push(quiz);

    return quiz;
  }

  public static debug() {
    setInterval(() => {
      console.log("liveQuizzes: ", this.liveQuizzes);
      console.log("\n\n\n");
    }, 5000);
  }

  public static isQuizLive({ quizId }: { quizId: string }): boolean {
    return this.liveQuizzes.some((quiz) => quiz.quizId === quizId);
  }

  public static endQuiz({
    quizId,
    adminEmailId,
  }: {
    quizId: string;
    adminEmailId: string;
  }) {
    this.liveQuizzes = this.liveQuizzes.filter(
      (quiz) => quiz.quizId !== quizId
    );
    UsersManager.deleteQuiz({ emailId: adminEmailId, quizId });
  }


  private static generateQuizId(): string {
    let val = "";
    for (let i = 0; i < 8; i++) {
      val += Math.floor(Math.random() * 10).toString();
    }
    return val;
  }
}

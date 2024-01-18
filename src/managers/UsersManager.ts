import { DraftQuiz, Participant, Problem, Quiz } from "./Quiz";
import { QuizManager } from "./QuizManager";

export class User {
  name: string;
  emailId: string;
  draftQuizzes: DraftQuiz[];
  liveQuizzes: Quiz[];
  constructor(name: string, emailId: string) {
    this.name = name;
    this.emailId = emailId;
    this.draftQuizzes = [];
    this.liveQuizzes = [];
  }
}

export class UsersManager {
  private static instance: UsersManager;
  private static users: User[];
  private constructor() {
    UsersManager.users = [];
  }
  public static getInstance(): UsersManager {
    if (!UsersManager.instance) {
      UsersManager.instance = new UsersManager();
    }
    return UsersManager.instance;
  }
  public static addUser({ emailId, name }: { emailId: string; name: string }) {
    this.users.push(new User(name, emailId));
  }
  public static getUserData({ emailId }: { emailId: string }): {
    success: boolean;
    data?: {
      name: string;
      emailId: string;
      draftQuizzes: DraftQuiz[];
    };
  } {
    const user = this.users.find((user) => user.emailId === emailId);
    if (user) {
      return {
        success: true,
        data: {
          name: user.name,
          emailId: user.emailId,
          draftQuizzes: user.draftQuizzes,
        },
      };
    }
    return { success: false };
  }

  public static createQuiz(emailId: string) {
    const user = this.users.find((user) => user.emailId === emailId);
    let draftQuizId = this.generateDraftQuizId();
    while (user!.draftQuizzes.find((quiz) => quiz.quizId === draftQuizId)) {
      draftQuizId = this.generateDraftQuizId();
    }
    user!.draftQuizzes.push(new DraftQuiz(draftQuizId));
    return { draftQuizId };
  }

  private static generateDraftQuizId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  public static debug() {
    setInterval(() => {
      console.log("users: ", this.users);
    }, 5000);
  }
  public static floatQuiz({
    draftQuizId,
    emailId,
  }: {
    draftQuizId: string;
    emailId: string;
  }): {
    success: boolean;
    message?: "Quiz floated" | "Quiz not found" | "Quiz already floated";
    quizId?: string;
  } {
    const user = this.users.find((user) => user.emailId === emailId);
    const draftQuiz = user!.draftQuizzes.find(
      (quiz) => quiz.quizId === draftQuizId
    );
    if (!draftQuiz) {
      return { success: false, message: "Quiz not found" };
    }

    user!.draftQuizzes = user!.draftQuizzes.filter(
      (quiz) => quiz.quizId !== draftQuizId
    );
    const quiz = QuizManager.floatQuiz({
      emailId,
      draftQuiz: draftQuiz,
    });

    user?.liveQuizzes.push(quiz);

    return { success: true, message: "Quiz floated", quizId: quiz.quizId };
  }

  public static deleteQuiz({
    emailId,
    quizId,
  }: {
    emailId: string;
    quizId: string;
  }) {
    const user = this.users.find((user) => user.emailId === emailId);
    user!.liveQuizzes = user!.liveQuizzes.filter(
      (quiz) => quiz.quizId !== quizId
    );
  }

  public static saveDraftQuiz({
    emailId,
    problemsArray,
  }: {
    emailId: string;
    problemsArray: Problem[];
  }): { draftQuizId: string } {
    const user = this.users.find((user) => user.emailId === emailId)!;

    let draftQuizId = this.generateDraftQuizId();
    while (user!.draftQuizzes.find((quiz) => quiz.quizId === draftQuizId)) {
      draftQuizId = this.generateDraftQuizId();
    }
    const draftQuiz = new DraftQuiz(draftQuizId);
    draftQuiz.problems = problemsArray;
    user.draftQuizzes.push(draftQuiz);
    return { draftQuizId };
  }
}

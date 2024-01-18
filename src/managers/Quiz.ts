import { IoManager } from "./IoManager";
import { QuizManager } from "./QuizManager";
import { User } from "./UsersManager";

export type Problem = {
  question: string;
  options: string[];
  answer: number;
  timeAlloted: number;
};
export class DraftQuiz {
  quizId: string;
  problems: Problem[] = [];
  constructor(quizId: string) {
    this.quizId = quizId;
  }
}

export class Participant {
  name: string;
  userId: string;
  score: number = 0;
  constructor(name: string, userId: string) {
    this.name = name;
    this.userId = userId;
  }
}

export class Quiz {
  public quizId: string;
  public adminEmailId: string;
  public participants: Participant[] = [];
  public problems: Problem[] = [];
  public currentProblemIndex: number = -1;

  constructor({
    quizId,
    adminEmailId: admin,
  }: {
    quizId: string;
    adminEmailId: string;
  }) {
    this.quizId = quizId;
    this.adminEmailId = admin;
  }

  public addParticipant(userId: string, name: string) {
    this.participants.push(new Participant(name, userId));
    IoManager.getIo().to(this.quizId.toString()).emit("newParticipant");
    IoManager.getIo().to(this.adminEmailId).emit("newParticipant", {
      name,
      userId: userId,
    });
  }

  public addProblem(problem: Problem) {
    this.problems.push(problem);
  }

  public startQuiz() {
    this.currentProblemIndex = 0;
    IoManager.getIo()
      .to(this.quizId.toString())
      .emit("startQuiz", {
        problem: {
          question: this.problems[0].question,
          options: this.problems[0].options,
        },
      });
  }

  public endQuiz() {
    this.showLeaderboard();
    IoManager.getIo().to(this.quizId.toString()).emit("endQuiz");
    QuizManager.endQuiz({quizId: this.quizId, adminEmailId: this.adminEmailId});
  }

  public nextProblem() {
    this.currentProblemIndex++;
    if (this.currentProblemIndex === this.problems.length) {
      this.endQuiz();
    } else {
      IoManager.getIo()
        .to(this.quizId.toString())
        .emit("nextProblem", {
          problem: {
            question: this.problems[this.currentProblemIndex].question,
            options: this.problems[this.currentProblemIndex].options,
          },
        });
    }
  }
  public answerReveal() {
    IoManager.getIo().to(this.quizId.toString()).emit("answerReveal", {
      problemIdx: this.currentProblemIndex,
      answer: this.problems[this.currentProblemIndex].answer,
    });
  }
  public removeParticipant({ userId }: { userId: string }) {
    this.participants = this.participants.filter(
      (participant) => participant.userId !== userId
    );
    IoManager.getIo().to(this.quizId.toString()).emit("removeParticipant");
  }

  public showLeaderboard() {
    const topParticipants = this.participants
      .sort((a, b) => {
        return a.score - b.score;
      })
      .slice(0, 10);
    IoManager.getIo()
      .to(this.quizId.toString())
      .emit("showLeaderboard", {
        topParticipants: topParticipants.map((participant) => {
          return { name: participant.name, score: participant.score };
        }),
      });
    IoManager.getIo().to(this.adminEmailId).emit("showLeaderboard", {
      topParticipants,
    });
  }

  public submitAnswer({
    userId,
    answer,
    problemIdx,
  }: {
    userId: string;
    answer: number;
    problemIdx: number;
  }) {
    if (this.problems[this.currentProblemIndex].answer === answer) {
      const participant = this.participants.find(
        (participant) => participant.userId === userId
      );
      participant!.score++;
    }
  }
}

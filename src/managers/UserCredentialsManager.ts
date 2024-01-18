import { Socket } from "socket.io";
import { UsersManager } from "./UsersManager";
import { QuizManager } from "./QuizManager";

export class UserCredentialsManager {
  private static instance: UserCredentialsManager;
  private static userCredentials: { emailId: string; password: string }[];
  private static unverifiedUserCredentials: {
    emailId: string;
    password: string;
    otp: number;
    name: string;
  }[];

  private constructor() {
    UserCredentialsManager.userCredentials = [];

    UserCredentialsManager.unverifiedUserCredentials = [];
  }

  public static getInstance(): UserCredentialsManager {
    if (!this.instance) {
      this.instance = new UserCredentialsManager();
    }
    return this.instance;
  }

  public static verifyUserCredentials({
    emailId,
    password,
  }: {
    emailId: string;
    password: string;
  }): {
    success: boolean;
    message?: "User verified" | "Incorrect password" | "User does not exist";
  } {
    const user = this.userCredentials.find((user) => user.emailId === emailId);
    if (user) {
      if (user && user.password === password) {
        return { success: true, message: "User verified" };
      }
      return { success: false, message: "Incorrect password" };
    }
    return { success: false, message: "User does not exist" };
  }

  public static addUserCredentials({
    name,
    emailId,
    password,
  }: {
    name: string;
    emailId: string;
    password: string;
  }): { success: boolean } {
    // checks if user already exists
    const output = this.verifyUserCredentials({ emailId, password });
    if (!output.success && output.message === "User does not exist") {
      // if not, sends OTP and returns a reference string to the user
      this.unverifiedUserCredentials.push({
        emailId,
        password,
        otp: 123,
        name,
      });

      return { success: true };
    }
    return { success: false };
  }

  public static verifyOtp({ emailId, otp }: { emailId: string; otp: number }): {
    success: boolean;
    message?: "Signup Complete" | "User not found" | "Incorrect OTP";
  } {
    const user = this.unverifiedUserCredentials.find(
      (user) => user.emailId === emailId
    );
    if (user) {
      if (user.otp === otp) {
        this.userCredentials.push({ emailId, password: user.password });
        this.unverifiedUserCredentials = this.unverifiedUserCredentials.filter(
          (user) => user.emailId !== emailId
        );
        UsersManager.addUser({ emailId, name: user.name });
        return { success: true, message: "Signup Complete" };
      }
      return { success: false, message: "Incorrect OTP" };
    }
    return { success: false, message: "User not found" };
  }
  public static debug() {
    setInterval(() => {
      console.log("userCredentials: ", this.userCredentials);
      console.log(
        "unverifiedUserCredentials: ",
        this.unverifiedUserCredentials
      );
    }, 5000);
  }
}

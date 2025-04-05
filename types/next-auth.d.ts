import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: string[];
    } & DefaultSession["user"];
  }

  interface User {
    _id: string;
    roles?: string[];
  }
}

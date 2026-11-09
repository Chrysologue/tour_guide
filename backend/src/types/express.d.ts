declare global {
  namespace Express {
    interface AdminPayload {
      id: string;
      email: string;
    }

    interface Request {
      admin?: AdminPayload;
    }
  }
}

export {};
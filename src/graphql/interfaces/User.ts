export interface User {
  createdAt: string;
  imageUrl: string;
  latestMessage: null | {
    uuid: string;
    from: string;
    to: string;
    content: string;
    createdAt: string;
  };
  username: string;
  unread?: boolean;
}

export type EmailListRow = {
  id: string;
  email: string;
  active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
  unsubscribe_token: string;
  created_at: string;
  updated_at: string;
};

export type EmailListInsert = Pick<EmailListRow, 'email'> & {
  active?: boolean;
};

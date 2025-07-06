export type TransactionPurchaseMembershipInput = {
  userId: number;
  paymentDetails: {
    paymentId: string;
    amount: number;
  };
};

export type TransactionPurchaseMembershipOutput = {
  success: boolean;
  message: string;
  transactionId?: string;
};

export type TransactionInput = {
  userId: number;
  amount: number;
  type: 'credit' | 'debit';
  details: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionOutput = {
  userId: number;
  amount: number;
  type: 'credit' | 'debit';
  id: string;
  details: string;
  createdAt: Date;
  updatedAt: Date;
};

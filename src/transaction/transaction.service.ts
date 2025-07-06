import {
  Injectable,
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import {
  TransactionInput,
  TransactionOutput,
  TransactionPurchaseMembershipInput,
  TransactionPurchaseMembershipOutput,
} from './transaction.types';
import { PrismaService } from 'src/prisma.service';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    private UserService: UserService,
    private prisma: PrismaService,
  ) {}

  async purchaseMembership(
    input: TransactionPurchaseMembershipInput,
  ): Promise<
    TransactionPurchaseMembershipOutput | InternalServerErrorException
  > {
    const MEMBERSHIP_FEE = 100;

    if (input.paymentDetails.amount < MEMBERSHIP_FEE)
      throw new NotImplementedException(
        'Insufficient amount for membership purchase',
      );

    // payment gateway integration would go here
    // For now, we will just simulate a successful transaction
    const transactionId = `txn_${Date.now()}_${input.paymentDetails.paymentId}`;
    // Simulate a successful transaction
    const success = true;
    const message = success
      ? 'Membership purchased successfully'
      : 'Membership purchase failed';

    if (!success) throw new InternalServerErrorException(message);

    // update user membership status
    const user = await this.UserService.updateUserMembershipStatus({
      userId: input.userId,
      isMember: true,
    });

    if (!user) {
      throw new InternalServerErrorException('User not found or update failed');
    }

    // save transaction details to the database
    const transactionDetails = 'Membership purchase transaction.';
    const transactionData = {
      userId: input.userId,
      id: transactionId,
      amount: MEMBERSHIP_FEE,
      type: 'credit',
      details: transactionDetails,
    };

    const transaction = await this.prisma.transaction.create({
      data: transactionData,
    });

    if (!transaction) {
      throw new InternalServerErrorException(
        'Failed to save transaction details',
      );
    }
    return {
      success: true,
      transactionId: transaction.id,
      message:
        'Membership purchased successfully. Credit: $' +
        transaction.amount.toFixed(2),
    };
  }

  async checkoutTransaction(
    input: TransactionInput,
  ): Promise<Transaction | InternalServerErrorException> {
    try {
      // create new transaction data
      const transaction = await this.prisma.transaction.create({
        data: input,
      });

      return transaction;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error creating transaction: ${error.message}`,
      );
    }
  }
}

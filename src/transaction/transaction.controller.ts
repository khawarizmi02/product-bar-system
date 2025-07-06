import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionPurchaseMembershipInput } from './transaction.types';
import { TransactionService } from './transaction.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly TransactionService: TransactionService) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('purchase-membership')
  async purchaseMembership(
    @Request() request,
    @Body() body: Omit<TransactionPurchaseMembershipInput, 'userId'>,
  ) {
    return this.TransactionService.purchaseMembership({
      userId: request.user.id,
      ...body,
    });
  }
}

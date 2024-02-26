import { ITransaction } from '../../interfaces/transaction.interface';
import { TransactionModel } from '../models/transaction.model';
import BaseDAO from './base.dao';

class TransactionDao extends BaseDAO<ITransaction> {
  // class TransactionDao extends BaseDAO<ITransactionDocument> { //  TODO Fix the generic type of the BaseDAO
  constructor() {
    super(TransactionModel);
  }
}

export { TransactionDao };

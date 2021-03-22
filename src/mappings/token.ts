import { BigInt, ByteArray, Bytes, log } from "@graphprotocol/graph-ts";
import { Transfer } from "../../generated/ETHAToken/ETHAToken";
import { Token, Account, Transaction } from "../../generated/schema";

const tokenId = "0x59e9261255644c411afdd00bd89162d09d862e38";
const GENESIS_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: Transfer): void {
  let token = Token.load(tokenId);
  if (token == null) {
    token = new Token(tokenId);
    token.address = ByteArray.fromHexString(tokenId) as Bytes;
    token.totalSupply = new BigInt(0);
    token.save();
  }
  let fromId = event.params.from.toHexString();
  let toId = event.params.to.toHexString();
  let value = event.params.value;
  let fromAccount = Account.load(fromId);
  let toAccount = Account.load(toId);
  if (fromId != GENESIS_ADDRESS && fromAccount == null) {
    log.warning("From Account does not exist {}", [fromId]);
    return;
  }
  if (fromId == GENESIS_ADDRESS) {
    token.totalSupply = token.totalSupply.plus(value);
    token.save();
  } else {
    fromAccount.balance = fromAccount.balance.minus(value);
    fromAccount.save();
  }
  if (toId == GENESIS_ADDRESS) {
    token.totalSupply = token.totalSupply.minus(value);
    token.save();
  } else if (toAccount == null) {
    toAccount = new Account(toId);
    toAccount.address = ByteArray.fromHexString(toId) as Bytes;
    toAccount.balance = value;
    toAccount.save();
  } else {
    toAccount.balance = toAccount.balance.plus(value);
    toAccount.save();
  }
  let fromTransactionId =
    event.transaction.hash.toHexString() +
    "_Transferred_" +
    event.params.from.toHexString() +
    "_" +
    event.params.to.toHexString();
  let toTransactionId =
    event.transaction.hash.toHexString() +
    "_Received_" +
    event.params.from.toHexString() +
    "_" +
    event.params.to.toHexString();
  if (fromAccount != null) {
    let fromTransaction = new Transaction(fromTransactionId);
    fromTransaction.account = fromId;
    fromTransaction.from = event.params.from;
    fromTransaction.to = event.params.to;
    fromTransaction.value = event.params.value;
    fromTransaction.transactionType = "Transferred";
    fromTransaction.save();
  }
  if (toAccount != null) {
    let toTransaction = new Transaction(toTransactionId);
    toTransaction.account = toId;
    toTransaction.from = event.params.from;
    toTransaction.to = event.params.to;
    toTransaction.value = event.params.value;
    toTransaction.transactionType = "Received";
    toTransaction.save();
  }
}

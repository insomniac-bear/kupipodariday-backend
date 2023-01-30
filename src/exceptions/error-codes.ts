import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  LoginOrPasswordIncorrect = 100,
  UserAlreadyExist = 101,
  AccessDenied = 102,
  UserNotFound = 103,
  UsersNotFound = 104,
  WishNotFound = 105,
  NoRightsForEdit = 106,
  NoRightsForRemove = 107,
}

export const code2message = new Map<ErrorCode, string>([
  [ErrorCode.LoginOrPasswordIncorrect, 'Login or password is incorrect'],
  [ErrorCode.UserAlreadyExist, 'User already exist'],
  [ErrorCode.AccessDenied, 'Access denied'],
  [ErrorCode.UserNotFound, 'User not found'],
  [ErrorCode.UsersNotFound, 'Search result is empty'],
  [ErrorCode.WishNotFound, 'Подарок не найден'],
  [ErrorCode.NoRightsForEdit, 'Недостаточно прав для редактирования'],
  [ErrorCode.NoRightsForRemove, 'Недостаточно прав для удаления'],
]);

export const code2status = new Map<ErrorCode, HttpStatus>([
  [ErrorCode.LoginOrPasswordIncorrect, HttpStatus.BAD_REQUEST],
  [ErrorCode.UserAlreadyExist, HttpStatus.BAD_REQUEST],
  [ErrorCode.AccessDenied, HttpStatus.FORBIDDEN],
  [ErrorCode.UserNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.UsersNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.WishNotFound, HttpStatus.NOT_FOUND],
  [ErrorCode.NoRightsForEdit, HttpStatus.FORBIDDEN],
  [ErrorCode.NoRightsForRemove, HttpStatus.FORBIDDEN],
]);

import { HttpErrorResponse } from '@angular/common/http';

export class ErrorHandler {
  public static getErrorMessage(error: HttpErrorResponse): string {
    let message: string = null;

    message = error.error.detail ? error.error.detail : error.message;

    return message;
  }
}

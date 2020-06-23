import moment from 'moment';

export default class TooManyAttemptsError extends Error {
  constructor(message, resetAt = 0) {
    super();
    this.name = this.constructor.name;
    this.message = resetAt > 0 ? `${message} Try again ${moment.unix(resetAt).fromNow()}` : message;
  }
}

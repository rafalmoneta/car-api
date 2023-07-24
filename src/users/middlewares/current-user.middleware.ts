import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

// This middleware is used to set the current user on the request object
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    // If the user is not logged in, we don't have to do anything
    if (!userId) return next();

    // If the user is logged in, we want to fetch it from the database
    const user = await this.usersService.findOne(req.session.userId);

    // And assign it to the request object
    req.currentUser = user;

    next();
  }
}

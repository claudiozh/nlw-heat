import { Request, Response, Router } from 'express';
import { GITHUB_LOGIN_URL } from './constants/urls';
import { AuthenticateController } from './controllers/AuthenticateController';
import { CreateMessageController } from './controllers/CreateMessageController';
import { Last3MessageController } from './controllers/Last3MessageController';
import { ProfileUserController } from './controllers/ProfileUserController';
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';

const router = Router();

router.post('/authenticate', new AuthenticateController().handle);

router.post(
  '/messages',
  ensureAuthenticated,
  new CreateMessageController().handle,
);

router.get('/messages/last3', new Last3MessageController().handle);

router.get('/profile', ensureAuthenticated, new ProfileUserController().handle);

router.get('/github', (request: Request, response: Response) => {
  response.redirect(GITHUB_LOGIN_URL);
});

router.get('/signin/callback', (request: Request, response: Response) => {
  const { code } = request.query;
  return response.json({ code });
});

export { router };

import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { User } from '.prisma/client';
import { GITHUB_ACCESS_TOKEN_URL, GITHUB_PROFILE_URL } from '../constants/urls';
import { prismaClient } from '../prisma';

interface IAccessTokenResponse {
  access_token: string
}

interface IUserResponse {
  id: number;
  avatar_url: string;
  login: string;
  name: string;
}

export class AuthenticateService {
  async execute(code: string) {
    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(
      GITHUB_ACCESS_TOKEN_URL,
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const response = await axios.get<IUserResponse>(GITHUB_PROFILE_URL, {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`,
      },
    });

    const user = await this.findOrCreateUser(response.data);

    const token = sign(
      {
        user: {
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '5d',
      },
    );

    return { user, token };
  }

  async findOrCreateUser(params: IUserResponse): Promise<User> {
    let user = await prismaClient.user.findFirst({
      where: {
        github_id: params.id,
      },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: params.id,
          avatar_url: params.avatar_url,
          login: params.login,
          name: params.name,
        },
      });
    }

    return user;
  }
}

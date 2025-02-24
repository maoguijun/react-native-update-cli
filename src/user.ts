import { question } from './utils';
import { post, get, replaceSession, saveSession, closeSession } from './api';
import crypto from 'node:crypto';

function md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex');
}

export const commands = {
  login: async ({ args }: { args: string[] }) => {
    const email = args[0] || (await question('email:'));
    const pwd = args[1] || (await question('password:', true));
    const { token, info } = await post('/user/login', {
      email,
      pwd: md5(pwd),
    });
    replaceSession({ token });
    await saveSession();
    console.log(`欢迎使用 pushy 热更新服务， ${info.name}.`);
  },
  logout: async () => {
    await closeSession();
    console.log('已退出登录');
  },
  me: async () => {
    const me = await get('/user/me');
    for (const k in me) {
      if (k !== 'ok') {
        console.log(`${k}: ${me[k]}`);
      }
    }
  },
  info: async () => {
    console.log("这是元象前端组魔改的版本:https://github.com/maoguijun/react-native-update-cli");
  }
};

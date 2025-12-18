export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
// 定义JWT Payload接口
export interface JwtPayload {
  result: {
    _id: string;
    username: string;
    email: string;
    nickname: string;
  };
}

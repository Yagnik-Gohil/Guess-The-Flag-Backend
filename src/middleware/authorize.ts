import response from '../shared/response';

const authorize = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.table)) {
      return response.unAuthorizedRequest(res);
    } else {
      next();
    }
  };
};

export default authorize;

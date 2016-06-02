type Request = {
  cookies: any,
  user: any,
  xhr: boolean
};

type Response = {
  cookie: ((name:string, value:any, options:any) => void),
  status: Function,
  send: Function,
  render: Function
};

type Next = Function;
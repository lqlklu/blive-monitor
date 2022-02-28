export interface Medal {
  name: string;
  level: number;
  color: string;
}

export interface User {
  name: string;
}

export interface Danmu {
  id: number;
  message: string;
  medal?: Medal;
  user: User;
}

export interface Superchat {
  id: number;
  message: string;
  medal?: Medal;
  user: User;
  price: number;
}

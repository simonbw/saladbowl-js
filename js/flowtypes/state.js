type State = {
  get: ((key:'game') => Game) & ((key:'ui') => UI),
  set: (key:string, value:any) => State
}

type Game = Map<string, any>;

type UI = Map<string, any>;
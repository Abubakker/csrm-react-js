import { Action, State, initState, reducer } from './payload-reducer';
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react';

type PayloadContextProps = {
  state: State;
  dispatch: Dispatch<Action>;
};

const PayloadContext = createContext<PayloadContextProps>(null!);

export function usePayloadContext() {
  return useContext(PayloadContext);
}

export default function PayloadContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  return (
    <PayloadContext.Provider value={contextValue}>
      {children}
    </PayloadContext.Provider>
  );
}

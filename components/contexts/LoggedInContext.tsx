import React, { createContext, ReactNode, useContext } from 'react';
import { useLocalStorage } from '@/components/hooks/useLocalStorage';

interface LoggedInContextValue {
    loggedIn: boolean;
    logIn: (password: string) => boolean;
    logOut: () => void;
}

const defaultValue: LoggedInContextValue = { logOut: () => {}, logIn: () => false, loggedIn: false };

const LoggedInContext = createContext<LoggedInContextValue>(defaultValue);

interface Props {
    children: ReactNode;
}
const LoggedInContextProvider = ({ children }: Props) => {
    const [loggedIn, setLoggedIn] = useLocalStorage<boolean>('loggedIn', false);

    const logOut = () => setLoggedIn(false);

    const logIn = (password: string) => {
        if (password == process.env.NEXT_PUBLIC_PASSWORD) {
            setLoggedIn(true);
            return true;
        } else {
            setLoggedIn(false);
            return false;
        }
    };

    return <LoggedInContext.Provider value={{ loggedIn, logOut, logIn }}>{children}</LoggedInContext.Provider>;
};

const useLoggedInContext = () => {
    const context = useContext(LoggedInContext);
    if (context === null) {
        throw Error('useLoggedInContext must be used within a LoggedInContext Provider');
    } else {
        return context;
    }
};

export { LoggedInContextProvider, useLoggedInContext };

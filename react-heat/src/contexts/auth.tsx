import { createContext, ReactNode, useEffect, useState } from "react";
import { SIGNIN_URL } from "../contants/urls";
import { api } from "../services/api";

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

type User = {
    id: string;
    name: string;
    login: string;
    avatar_url: string;
}

type AuthContextData = {
    user: User | null;
    signInUrl: string;
    signOut: () => void;
}

const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
    children: ReactNode;
}

function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null);

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('/authenticate', {
            code: githubCode
        });

        const { token, user } = response.data;

        localStorage.setItem('token', token);

        api.defaults.headers.common.authorization = `Bearer ${token}`;

        setUser(user);
    }

    function signOut() {
        setUser(null);
        localStorage.removeItem('token');
    }

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');

        if (hasGithubCode) {
            const [urlWithoutGithubCode, githubCode] = url.split('?code=');

            window.history.pushState({}, '', urlWithoutGithubCode);

            signIn(githubCode);
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`;
            api.get<User>('profile').then((response) => {
                setUser(response.data);
            })
        }
    }, []);

    return (
        <AuthContext.Provider value={{ signInUrl: SIGNIN_URL, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export { AuthProvider, AuthContext };
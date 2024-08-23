import { create } from "zustand"
import auth0, { Auth0Error } from "auth0-js"
import { useMutation } from "@tanstack/react-query"

export type Token = {
    accessToken: string
    idToken: string
    scope: string
    expiresTn: number
    tokenType: string
}

export type User = {
    sub: string
    nickname: string
    name: string
    picture: string
    updated_at: string
    email?: string | undefined
    email_verified?: boolean | undefined
}

interface TokenStore {
    token: Token | null
    setToken: (token: Token) => void
}

export const conn = new auth0.Authentication({
    domain: "fanplayground.eu.auth0.com",
    clientID: "WnoGSLn8FHmI3zn08UhcKt9UYS7MXYY2"
})

export const useAuthStore = create<TokenStore>()((set: any) => ({
    token: null,
    setToken: (token: Token) => set({ token })
}))

export const useLogin = () => {
    return useMutation(async ({ username, password }: { username: string; password: string }) => {
        return new Promise<Token>((resolve, reject) => {
            conn.login(
                {
                    realm: "Username-Password-Authentication",
                    username,
                    password
                },
                (error: Auth0Error | null, result: Token) => {
                    if (error) return reject(error)
                    resolve(result)
                }
            )
        })
    })
}

// Hook for getting user details
export const useUserDetails = () => {
    return useMutation(async (accessToken: string) => {
        return new Promise((resolve, reject) => {
            conn.userInfo(accessToken, (error, result) => {
                if (error) return reject(error)
                resolve(result)
            })
        })
    })
}

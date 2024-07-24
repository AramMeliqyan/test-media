"use server"

import { InputUser, PartialUser } from "./types"
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'
import { addUser, getUserByLogin } from "./api"
import { redirect } from "next/navigation"

export const handleSignup = async (prev: unknown, data: FormData) => {
    const reg = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/

    let user: PartialUser = {
        id: nanoid(),
        name: data.get('name') as string,
        surname: data.get('surname') as string,
        login: data.get('login') as string,
        password: data.get('password') as string
    }


    if (user.password) {
        if (!reg.test(user.password)) {
            return { message: "please write strong password" }
        }
        user.password = await bcrypt.hash(user.password, 10)

    }

    if (user.login) {
        let validUser = getUserByLogin(user.login)

        if (validUser) {
            return { message: "user already exets" }
        }
    }
    const result = addUser(user)
    console.log(result)

    redirect("/login")


}

export const handleLogin = async (prev: unknown, data: FormData) => {
    if (!data.get("login") || !data.get("password")) {
        return {
            message: "Please fill all the fields"
        }
    }
    const loginUser = data.get(`login`) as string
    const searchUser = getUserByLogin(loginUser)

    if (!searchUser) {
        return {
            message: "user not found"
        }
    }


    const password = data.get('password') as string;

    const validPassword = await bcrypt.compare(password, searchUser?.password)

    if (!validPassword) {
        return {
            message: "incorrect password"
        }
    }
    redirect("/profil")

}
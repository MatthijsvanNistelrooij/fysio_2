"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "./ui/input"

import logo_banner from "/public/logo.png"

import OtpModal from "./OTPModal"
import { createAccount, signInUser } from "@/app/api/users/route"

type FormType = "sign-in" | "sign-up"

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [accountId, setAccountId] = useState(null)

  const formSchema = authFormSchema(type)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setErrorMessage("")

    try {
      const user =
        type === "sign-up"
          ? await createAccount({
              fullName: values.fullName || "",
              email: values.email,
            })
          : await signInUser({ email: values.email })

      setAccountId(user.accountId)
    } catch {
      setErrorMessage("Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <div className="flex justify-center items-center md:w-1/2 w-full bg-gray-100 p-8">
        <Image
          src={logo_banner}
          alt="auth_banner"
          width={400}
          height={400}
          className="max-w-full h-auto"
        />
      </div>

      <div className="flex justify-center items-center md:w-1/2 w-full p-6 bg-white">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-md bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h1 className="text-2xl font-semibold text-center">
                {type === "sign-in" ? "Sign In" : "Sign Up"}
              </h1>

              {type === "sign-up" && (
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 mt-1 text-sm" />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 mt-1 text-sm" />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition cursor-pointer"
                  disabled={isLoading}
                >
                  {type === "sign-in" ? "Sign In" : "Sign Up"}
                  {isLoading && (
                    <Image
                      src="/assets/icons/loader.svg"
                      alt="loader"
                      width={24}
                      height={24}
                      className="ml-2 animate-spin"
                    />
                  )}
                </Button>
              </div>

              {errorMessage && (
                <p className="text-red-500 text-center text-sm mt-2">
                  *{errorMessage}
                </p>
              )}

              <div className="text-center text-sm">
                <p>
                  {type === "sign-in"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <Link
                    href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                    className="ml-1 font-medium text-indigo-600 hover:underline"
                  >
                    {type === "sign-in" ? "Sign Up" : "Sign In"}
                  </Link>
                </p>
              </div>
            </form>
          </Form>

          {accountId && (
            <OtpModal email={form.getValues("email")} accountId={accountId} />
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthForm

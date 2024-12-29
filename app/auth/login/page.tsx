"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { gql } from "graphql-request";
import { graphqlClient, setAuthToken } from "@/lib/graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const GET_USER = gql`
  query GetUser($email: String!, $password: String!) {
    getUser(email: $email, password: $password) {
      status
      message
      data
    }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response: any = await graphqlClient.request(GET_USER, data);

      if (response.getUser.status == "200") {
        const { token } = response.getUser.data;

        localStorage.setItem("token", token);
        setAuthToken(token);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        router.push("/todos");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.getUser.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                placeholder="Email"
                className="w-full"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message as string}
                </p>
              )}
            </div>
            <div>
              <Input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="Password"
                className="w-full"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message as string}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

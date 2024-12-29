"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { gql } from "graphql-request";
import { graphqlClient } from "@/lib/graphql";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const ADD_USER = gql`
  mutation AddUser($name: String!, $email: String!, $password: String!) {
    addUser(name: $name, email: $email, password: $password) {
      status
      message
      data
    }
  }
`;

export default function SignupPage() {
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
      const response: any = await graphqlClient.request(ADD_USER, data);

      if (response.addUser.status == "200") {
        toast({
          title: "Success",
          description: "Account created successfully. Please login.",
        });
        router.push("/auth/login");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.addUser.message,
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
          <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                {...register("name", { required: "Name is required" })}
                placeholder="Name"
                className="w-full"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message as string}
                </p>
              )}
            </div>
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
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
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
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

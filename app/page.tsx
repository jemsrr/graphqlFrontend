import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl text-center">Welcome to Todo App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            A simple and elegant todo application to help you stay organized.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
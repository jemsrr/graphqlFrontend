"use client";

import { useEffect, useState } from "react";
import { gql } from "graphql-request";
import { graphqlClient } from "@/lib/graphql";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation";

const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      status
      message
      data
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($task: String!) {
    addTodo(task: $task) {
      status
      message
      data
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($_id: ID!, $task: String!, $completed: Boolean!) {
    updateTodo(_id: $_id, task: $task, completed: $completed) {
      status
      message
      data
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($_id: ID!) {
    deleteTodo(_id: $_id) {
      status
      message
    }
  }
`;

export default function TodosPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [todos, setTodos] = useState<any>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }
    graphqlClient.setHeader("Authorization", `Bearer ${token}`);
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response: any = await graphqlClient.request(GET_TODOS);
      if (response.getTodos.status == 200) {
        setTodos(response.getTodos.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch todos",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      setAdding(true);
      const response: any = await graphqlClient.request(ADD_TODO, {
        task: newTask,
      });
      if (response.addTodo.status == 201) {
        setTodos([...todos, response.addTodo.data]);
        setNewTask("");
        toast({
          title: "Success",
          description: "Todo added successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add todo",
      });
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = async (todo: any) => {
    try {
      const response: any = await graphqlClient.request(UPDATE_TODO, {
        _id: todo._id,
        task: todo.task,
        completed: !todo.completed,
      });
      if (response.updateTodo.status == 200) {
        setTodos(
          todos.map((t: any) =>
            t._id === todo._id ? response.updateTodo.data : t
          )
        );
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update todo",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response: any = await graphqlClient.request(DELETE_TODO, {
        _id: id,
      });
      if (response.deleteTodo.status == 200) {
        setTodos(todos.filter((todo: any) => todo._id !== id));
        toast({
          title: "Success",
          description: "Todo deleted successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete todo",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Todo List</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <form onSubmit={addTodo} className="flex gap-4 mb-8">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1"
        />
        <Button type="submit" disabled={adding}>
          {adding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          <span className="ml-2">Add Todo</span>
        </Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Status</TableHead>
            <TableHead>Task</TableHead>
            <TableHead className="w-12">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos?.map((todo: any) => (
            <TableRow key={todo._id}>
              <TableCell>
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo)}
                />
              </TableCell>
              <TableCell className={todo.completed ? "line-through" : ""}>
                {todo.task}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo._id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {todos.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No todos yet. Add one above!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

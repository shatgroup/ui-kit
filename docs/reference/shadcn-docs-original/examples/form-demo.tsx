"use client"

import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york-v4/ui/form"
import { Input } from "@/registry/new-york-v4/ui/input"

type Values = { username: string }

export default function FormDemo() {
  const form = useForm<Values>({ defaultValues: { username: "" } })

  function onSubmit(values: Values) {
    toast("You submitted the following values.", {
      description: JSON.stringify(values),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-6">
        <FormField
          control={form.control}
          name="username"
          rules={{
            required: "Username is required.",
            minLength: { value: 2, message: "Username must be at least 2 characters." },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

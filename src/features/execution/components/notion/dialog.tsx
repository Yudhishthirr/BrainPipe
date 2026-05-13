"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

import {
  useGetNotionDatabases,
} from "@/features/integrations/hooks/use-integration";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, {
      message: "Variable name is required",
    })
    .regex(
      /^[A-Za-z_$][A-Za-z0-9_$]*$/,
      {
        message:
          "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
      }
    ),

  connectionName:
    z.string().optional(),

  databaseId: z.string().min(
    1,
    "Database selection is required"
  ),

  title: z.string().min(
    1,
    "Page title is required"
  ),

  content: z.string().min(
    1,
    "Page content is required"
  ),
});

export type NotionFormValues =
  z.infer<typeof formSchema>;

interface Props {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  onSubmit: (
    values: z.infer<
      typeof formSchema
    >
  ) => void;

  onConnectNotion: () => void;

  defaultValues?:
    Partial<NotionFormValues>;
}

export const NotionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onConnectNotion,
  defaultValues = {},
}: Props) => {

  const {
    data: databases,
  } = useGetNotionDatabases();

  console.log("Notion databases:", databases);
  const form =
    useForm<
      z.infer<typeof formSchema>
    >({
      resolver:
        zodResolver(formSchema),

      defaultValues: {
        variableName:
          defaultValues.variableName ||
          "",

        connectionName:
          defaultValues.connectionName ||
          "",

        databaseId:
          defaultValues.databaseId ||
          "",

        title:
          defaultValues.title || "",

        content:
          defaultValues.content || "",
      },
    });

  useEffect(() => {

    if (open) {

      form.reset({
        variableName:
          defaultValues.variableName ||
          "",

        connectionName:
          defaultValues.connectionName ||
          "",

        databaseId:
          defaultValues.databaseId ||
          "",

        title:
          defaultValues.title || "",

        content:
          defaultValues.content || "",
      });
    }

  }, [
    open,
    defaultValues,
    form,
  ]);

  const watchVariableName =
    form.watch(
      "variableName"
    ) || "myNotion";

  const handleSubmit = (
    values: z.infer<
      typeof formSchema
    >
  ) => {

    onSubmit(values);

    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent>

        <DialogHeader>

          <DialogTitle>
            Notion Configuration
          </DialogTitle>

          <DialogDescription>
            Configure the Notion
            settings for this node.
          </DialogDescription>

        </DialogHeader>

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(
              handleSubmit
            )}
            className="space-y-8 mt-4"
          >

            {/* Variable Name */}

            <FormField
              control={form.control}
              name="variableName"
              render={({
                field,
              }) => (
                <FormItem>

                  <FormLabel>
                    Variable Name
                  </FormLabel>

                  <FormControl>

                    <Input
                      placeholder="myNotion"
                      {...field}
                    />

                  </FormControl>

                  <FormDescription>

                    Use this name to
                    reference the result
                    in other nodes:

                    {" "}
                    {
                      `{{${watchVariableName}.url}}`
                    }

                  </FormDescription>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* Connect Notion */}

            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <div>

                  <h4 className="text-sm font-medium">
                    Notion Connection
                  </h4>

                  <p className="text-sm text-muted-foreground">
                    Connect your
                    Notion workspace
                  </p>

                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    onConnectNotion
                  }
                >
                  Connect Notion
                </Button>

              </div>

            </div>

            {/* Database Dropdown */}

            <FormField
              control={form.control}
              name="databaseId"
              render={({
                field,
              }) => (
                <FormItem>

                  <FormLabel>
                    Database
                  </FormLabel>

                  <FormControl>

                    <Select
                      onValueChange={
                        field.onChange
                      }
                      defaultValue={
                        field.value
                      }
                    >

                      <SelectTrigger>

                        <SelectValue
                          placeholder="Select database"
                        />

                      </SelectTrigger>

                      <SelectContent>

                        {databases?.map(
                          (db) => (

                            <SelectItem
                              key={db.id}
                              value={db.id}
                            >
                              {db.title}
                            </SelectItem>

                          )
                        )}

                      </SelectContent>

                    </Select>

                  </FormControl>

                  <FormDescription>
                    Choose the Notion
                    database where
                    pages will be created
                  </FormDescription>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* Page Title */}

            <FormField
              control={form.control}
              name="title"
              render={({
                field,
              }) => (
                <FormItem>

                  <FormLabel>
                    Page Title
                  </FormLabel>

                  <FormControl>

                    <Input
                      placeholder="{{chatgpt.output.title}}"
                      className="font-mono text-sm"
                      {...field}
                    />

                  </FormControl>

                  <FormDescription>
                    The title for the
                    new Notion page
                  </FormDescription>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* Content */}

            <FormField
              control={form.control}
              name="content"
              render={({
                field,
              }) => (
                <FormItem>

                  <FormLabel>
                    Page Content
                  </FormLabel>

                  <FormControl>

                    <Textarea
                      placeholder="{{chatgpt.output.text}}"
                      className="min-h-[120px] font-mono text-sm"
                      {...field}
                    />

                  </FormControl>

                  <FormDescription>

                    Use variables like

                    {" "}
                    {
                      "{{chatgpt.output.text}}"
                    }

                    {" "}
                    to save AI responses

                  </FormDescription>

                  <FormMessage />

                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">

              <Button type="submit">
                Save
              </Button>

            </DialogFooter>

          </form>

        </Form>

      </DialogContent>
    </Dialog>
  );
};
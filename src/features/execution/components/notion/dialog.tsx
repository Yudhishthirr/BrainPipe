// dialog.tsx

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

import { Input }
  from "@/components/ui/input";

import { Textarea }
  from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import z from "zod";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useForm,
} from "react-hook-form";

import {
  useEffect,
} from "react";

import {
  Button,
} from "@/components/ui/button";

const formSchema =
  z.object({

    variableName:
      z.string()
        .min(1, {
          message:
            "Variable name is required",
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

    databaseId:
      z.string().min(
        1,
        "Database selection is required"
      ),

    title:
      z.string().min(
        1,
        "Page title is required"
      ),

    content:
      z.string().min(
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
    values:
      NotionFormValues
  ) => void;

  onConnectNotion:
    () => void;

  databases?: {
    id: string;
    title: string;
  }[];

  databasesLoading?:
    boolean;

  defaultValues?:
    Partial<NotionFormValues>;
}

export const NotionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onConnectNotion,
  defaultValues = {},
  databases = [],
  databasesLoading = false,
}: Props) => {

  const form =
    useForm<NotionFormValues>({
      resolver:
        zodResolver(
          formSchema
        ),

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
          defaultValues.title ||
          "",

        content:
          defaultValues.content ||
          "",
      },
    });

  useEffect(() => {

    if (!open) return;

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
        defaultValues.title ||
        "",

      content:
        defaultValues.content ||
        "",
    });

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
    values:
      NotionFormValues
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
            Configure the
            Notion settings
            for this node.
          </DialogDescription>

        </DialogHeader>

        <Form {...form}>

          <form
            onSubmit={
              form.handleSubmit(
                handleSubmit
              )
            }
            className="space-y-6 mt-4"
          >

            <FormField
              control={
                form.control
              }
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

                    Use this name
                    to reference
                    the result:

                    {" "}

                    {
                      `{{${watchVariableName}.url}}`
                    }

                  </FormDescription>

                  <FormMessage />

                </FormItem>
              )}
            />

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

            <FormField
              control={
                form.control
              }
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
                      value={
                        field.value
                      }
                      onValueChange={
                        field.onChange
                      }
                    >

                      <SelectTrigger>

                        <SelectValue
                          placeholder="Select database"
                        />

                      </SelectTrigger>

                      <SelectContent>

                        {databasesLoading ? (

                          <div className="p-2 text-sm">
                            Loading databases...
                          </div>

                        ) : databases.length > 0 ? (

                          databases.map(
                            (db) => (

                              <SelectItem
                                key={db.id}
                                value={db.id}
                              >
                                {db.title}
                              </SelectItem>

                            )
                          )

                        ) : (

                          <div className="p-2 text-sm">
                            No databases found
                          </div>

                        )}

                      </SelectContent>

                    </Select>

                  </FormControl>

                  <FormDescription>
                    Choose the
                    Notion database
                    where pages
                    will be created
                  </FormDescription>

                  <FormMessage />

                </FormItem>
              )}
            />

            <FormField
              control={
                form.control
              }
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
                    Title of the
                    new Notion page
                  </FormDescription>

                  <FormMessage />

                </FormItem>
              )}
            />

            <FormField
              control={
                form.control
              }
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

                    Use variables
                    like

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

            <DialogFooter>

              <Button
                type="submit"
              >
                Save
              </Button>

            </DialogFooter>

          </form>

        </Form>

      </DialogContent>

    </Dialog>
  );
};
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "~/components/ui/file-upload";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { TagsInput } from "~/components/ui/tags-input";
import { createComponentSchema } from "~/utils/components";

export default function ComponentForm({
  onSubmit,
  initialValues,
  isPending,
}: {
  onSubmit: (values: z.infer<typeof createComponentSchema>) => void;
  initialValues?: z.infer<typeof createComponentSchema>;
  isPending: boolean;
}) {
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };
  const form = useForm<z.infer<typeof createComponentSchema>>({
    resolver: zodResolver(createComponentSchema),
    defaultValues: {
      tags: [],
      ...initialValues,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        {/* <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Component Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={files}
                      onValueChange={setFiles}
                      dropzoneOptions={dropZoneConfig}
                      className="relative bg-background rounded-lg p-2"
                    >
                      <FileInput
                        id="fileInput"
                        className="outline-dashed outline-1 outline-slate-500"
                      >
                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                          <CloudUpload className='text-gray-500 w-10 h-10' />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                  <FormDescription>Select an image of your component</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="My awesome component"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>The name of your component</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A bento grid to display cards."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Give a description for your component.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value ?? []}
                  onValueChange={field.onChange}
                  placeholder="Click enter after each tag"
                />
              </FormControl>
              <FormDescription>
                Add some tags for your component
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="v0Url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link to v0</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://v0.dev/chat/RrvDy8qpTOj?b=b_pkKTFLa905y"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>The URL of your component</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link to Github</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://github.com/druidui/ui"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The URL of the Github repository
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="siteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link to Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://originui.com/"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The URL of the component demo website
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}

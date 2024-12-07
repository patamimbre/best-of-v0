import { useQueryClient } from "@tanstack/react-query";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { createComponent, deleteComponent, updateComponent } from "~/functions/component";
import { toggleFavorite } from "~/functions/favorite";

export function useToggleFavoriteMutation(componentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleFavorite({ data: { componentId } }),
    //onSuccess: () => queryClient.invalidateQueries({ queryKey: ["components", { id: componentId }] }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["components"] }),
    onError: () => {
      toast.error("Failed to toggle favorite");
    },
  });
}

export function useCreateComponentMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] }),
      toast.success("Component created successfully");
      // redirect to /
      navigate({ to: "/", params: {} })
    },
    onError: () => {
      toast.error("Failed to create component");
    },
  });
}

export function useUpdateComponentMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: updateComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] }),
      toast.success("Component updated successfully");
      // redirect to /my-components
      navigate({ to: "/my-components", params: {} })
    },
    onError: () => {
      toast.error("Failed to update component");
    },
  });
}

export function useDeleteComponentMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteComponent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["components"] }),
      toast.success("Component deleted successfully");
      // redirect to /my-components
      navigate({ to: "/my-components", params: {} })
    },
    onError: () => {
      toast.error("Failed to delete component");
    },
  });
}

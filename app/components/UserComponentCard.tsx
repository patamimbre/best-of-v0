import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Github, Globe, Heart, Code, AtSign } from 'lucide-react'
import { useNavigate } from "@tanstack/react-router"
import { SelectComponent } from "~/types/database"
import { useDeleteComponentMutation } from "~/hooks/mutations"
import { AreYouSure } from "./AreYouSure"

export function UserComponentCard({ component }: Readonly<{ component: SelectComponent }>) {
  const navigate = useNavigate();
  const { mutate: deleteComponent } = useDeleteComponentMutation();

  return (
    <Card className="flex flex-col w-full max-w-xl overflow-hidden">
      <CardContent className="p-6 flex-1">
        <h2 className="text-2xl font-bold mb-2">{component.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{component.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {component.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center px-6 py-4 bg-secondary/30">
        <div className="flex space-x-4">
          {component.v0Url && (
              <a href={component.v0Url} target="_blank">
                <Code className="h-6 w-6" />
              </a>
          )}
          {component.githubUrl && (
              <a href={component.githubUrl} target="_blank">
                <Github className="h-6 w-6" />
              </a>
          )}
          {component.siteUrl && (
              <a href={component.siteUrl} target="_blank">
                <Globe className="h-6 w-6" />
              </a>
          )}
        </div>
        <div className="flex space-x-2">
          <AreYouSure
            title="Delete component"
            description="This action cannot be undone. This will permanently delete your component."
            actionText="Delete"
            action={() => deleteComponent({ data: { id: component.id } })}
          >
            <Button variant="destructive">Delete</Button>
          </AreYouSure>
          <Button onClick={() => navigate({ to: "/edit/component/$id", params: { id: component.id } })} variant="secondary">Edit</Button>
        </div>
      </CardFooter>
    </Card>
  )
}


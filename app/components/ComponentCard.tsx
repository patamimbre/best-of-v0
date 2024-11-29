import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Github, Globe, Heart, Code, AtSign } from 'lucide-react'
import { Link } from "@tanstack/react-router"
import { SelectComponent } from "db/schema"

export function ComponentCard({ component }: Readonly<{ component: SelectComponent }>) {
  return (
    <Card className="w-full max-w-lg overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-64 w-full">
          <img
            src={component.imageUrl ?? "/placeholder.svg?height=192&width=384"}
            alt={component.name}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h2 className="text-2xl font-bold mb-2">{component.name}</h2>
        <p className="text-sm text-muted-foreground mb-4">{component.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {component.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          {component.developer && (
            <Link href={`https://github.com/${component.developer}`} className="hover:underline">
              <Github className="inline mr-1 h-4 w-4" />
              <span><AtSign/>{component.developer}</span>
            </Link>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-secondary/30">
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
        <div className="flex">
          <Button variant="secondary">
            <Heart/>
            <span>{12}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}


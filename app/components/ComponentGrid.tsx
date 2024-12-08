import { ComponentCard } from "./ComponentCard";
import { UserComponentCard } from "./UserComponentCard";

import { FullComponent, SelectComponent } from "~/types/database";

export function RegularComponentGrid({ components }: { components: FullComponent[] }) {
  if (!components.length) {
    return <EmptyState />
  }

  return (
    <ComponentGrid>
      {components.map((component) => (
        <ComponentCard key={component.id} component={component} />
      ))}
    </ComponentGrid>
  )
}

export function MyComponentsGrid({ components }: { components: SelectComponent[] }) {
  if (!components.length) {
    return <EmptyState />
  }

  return (
    <ComponentGrid>
      {components.map((component) => (
        <UserComponentCard key={component.id} component={component} />
      ))}
    </ComponentGrid>
  )
}

function ComponentGrid({
  children
}: {
  children: React.ReactNode
}) {
  
  return (
    <div className="grid grid-cols-3 gap-8">
      {children}
    </div>
  );
}

function EmptyState() {
  return <div className="flex flex-col items-center justify-center h-1/2 gap-6">
    <p className="text-3xl font-semibold">No components found given the current filters</p>
    <p className="text-xl text-gray-500">Try changing the filters or creating a new component</p>
  </div>
}

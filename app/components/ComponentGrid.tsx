import { ComponentCard } from "./ComponentCard";
import { UserComponentCard } from "./UserComponentCard";

import { FullComponent, SelectComponent } from "~/types/database";

export function RegularComponentGrid({ components }: { components: FullComponent[] }) {
  return (
    <ComponentGrid>
      {components.map((component) => (
        <ComponentCard key={component.id} component={component} />
      ))}
    </ComponentGrid>
  )
}

export function MyComponentsGrid({ components }: { components: SelectComponent[] }) {
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

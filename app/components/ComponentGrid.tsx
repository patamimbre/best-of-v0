import { ComponentWithFavorites } from "~/utils/components";
import { ComponentCard } from "./ComponentCard";


export function RegularComponentGrid({ components }: { components: ComponentWithFavorites[] }) {
  return (
    <ComponentGrid>
      {components.map((component) => (
        <ComponentCard key={component.id} component={component} />
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

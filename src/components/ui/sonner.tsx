import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={false}
      visibleToasts={2}
      toastOptions={{
        duration: 3000,
        style: { 
          maxWidth: '280px',
          minHeight: '48px',
          padding: '8px 12px'
        },
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg text-xs py-2",
          description: "group-[.toast]:text-muted-foreground text-[11px] leading-tight",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-xs px-2 py-1",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-xs px-2 py-1",
          title: "text-xs font-medium",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

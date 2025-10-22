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
      toastOptions={{
        style: { maxWidth: '320px' },
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg text-sm",
          description: "group-[.toast]:text-muted-foreground text-xs",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground text-sm",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground text-sm",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };

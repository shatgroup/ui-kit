import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog.tsx"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./drawer.tsx"

const DesktopContext = createContext(true)

function useDesktop() {
  const [desktop, setDesktop] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(min-width: 640px)").matches,
  )
  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)")
    const update = () => setDesktop(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return desktop
}

function ResponsiveDialog({ children, ...props }: React.ComponentProps<typeof Dialog>) {
  const desktop = useDesktop()
  const Root = desktop ? Dialog : Drawer
  return (
    <DesktopContext.Provider value={desktop}>
      <Root {...props}>{children}</Root>
    </DesktopContext.Provider>
  )
}

function useParts() {
  const desktop = useContext(DesktopContext)
  return desktop
    ? {
        Content: DialogContent,
        Description: DialogDescription,
        Footer: DialogFooter,
        Header: DialogHeader,
        Title: DialogTitle,
      }
    : {
        Content: DrawerContent,
        Description: DrawerDescription,
        Footer: DrawerFooter,
        Header: DrawerHeader,
        Title: DrawerTitle,
      }
}

function ResponsiveDialogContent({ children, ...props }: React.ComponentProps<typeof DialogContent>) {
  const { Content } = useParts()
  return <Content {...props}>{children}</Content>
}

function ResponsiveDialogDescription(props: React.ComponentProps<typeof DialogDescription>) {
  const { Description } = useParts()
  return <Description {...props} />
}

function ResponsiveDialogFooter({ children, ...props }: { children?: ReactNode; className?: string }) {
  const { Footer } = useParts()
  return <Footer {...props}>{children}</Footer>
}

function ResponsiveDialogHeader({ children, ...props }: { children?: ReactNode; className?: string }) {
  const { Header } = useParts()
  return <Header {...props}>{children}</Header>
}

function ResponsiveDialogTitle(props: React.ComponentProps<typeof DialogTitle>) {
  const { Title } = useParts()
  return <Title {...props} />
}

export {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
}

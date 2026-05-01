import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
        {/* app header for the workflow navigation showcase and common elements in execution,workflow and credentials and overall deshboard*/}
            <AppHeader />
            <main className="flex-1">{children}</main>
        </>
    );
};

export default Layout;
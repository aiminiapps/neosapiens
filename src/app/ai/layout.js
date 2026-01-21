import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default function AILayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <DashboardHeader />
            <div className="flex flex-1">
                <DashboardSidebar />
                <main className="flex-1 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}

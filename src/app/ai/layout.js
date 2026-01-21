import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function AILayout({ children }) {
    return (
        <div className="min-h-screen">
            <DashboardHeader />
            {children}
        </div>
    );
}

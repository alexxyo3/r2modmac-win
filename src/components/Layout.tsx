import type { ReactNode } from 'react';

interface LayoutProps {
    sidebar: ReactNode;
    main: ReactNode;
}

export function Layout({ sidebar, main }: LayoutProps) {
    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 border-r border-gray-700 flex-shrink-0">
                {sidebar}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {main}
            </div>
        </div>
    );
}

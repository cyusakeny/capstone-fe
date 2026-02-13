import React from "react";
import OfficerSidebarV2 from "@/components/OfficerSidebarV2";

export default function OfficerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-white">
            <OfficerSidebarV2 />
            <div className="flex-1 flex flex-col min-w-0 ml-64">
                {children}
            </div>
        </div>
    );
}

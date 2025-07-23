import React from "react";

const PolicySkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto p-4 animate-pulse">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded-full w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
            </div>

            {/* Policy Card Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                    >
                        <div className="h-40 bg-gray-200"></div>
                        <div className="p-4">
                            <div className="h-5 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-full mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-5/6 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-2/3 mb-4"></div>

                            <div className="flex justify-between items-center mt-4">
                                <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
                                <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Details Section Skeleton */}
            <div className="mt-12">
                <div className="h-6 bg-gray-200 rounded-full w-1/4 mb-6"></div>

                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-full"></div>
                </div>

                {/* Feature List Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex items-start">
                            <div className="h-5 w-5 bg-gray-200 rounded-full mr-3 mt-1"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section Skeleton */}
            <div className="mt-12 bg-gray-100 p-6 rounded-lg">
                <div className="h-6 bg-gray-200 rounded-full w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
            </div>
        </div>
    );
};

export default PolicySkeleton;
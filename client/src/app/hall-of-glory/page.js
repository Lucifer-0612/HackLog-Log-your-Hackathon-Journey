import BadgeGrid from '@/components/HallOfGlory/BadgeGrid';

export default function HallOfGloryPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <header className="p-8 border-b border-gray-800">
                <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    HALL OF GLORY
                </h1>
                <p className="text-center text-gray-400 mt-2">Your eternal achievements</p>
            </header>
            <main className="container mx-auto py-10">
                <BadgeGrid />
            </main>
        </div>
    );
}

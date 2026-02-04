import TeamDashboard from '@/components/WarRoom/TeamDashboard';

export default function WarRoomPage({ params }) {
    return <TeamDashboard hackathonId={params.id} />;
}

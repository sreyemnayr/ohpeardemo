import { builtin_feeds, custom_feeds } from "@/data/feeds";
import Link from "next/link";
import { Pencil } from "lucide-react";
import Layout from "@/components/Layout";

export default function FeedPage({ params }: { params: { id: string } }) {
    params.id = decodeURIComponent(params.id);
    const feed = builtin_feeds.find(feed => feed.id === params.id) || custom_feeds.find(feed => feed.id === params.id);
    if (!feed) {
        return <div>Feed {params.id} not found</div>;
    }
    return (
        <Layout>
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-gun-metal">{feed.name}</h1>
                <p className="text-sm text-raisin-black">{feed.description}</p>
                <div className="flex flex-row gap-4">
                    <Link href={`/feeds`} className="px-3 py-2 rounded-md text-xs font-medium text-white bg-gun-metal hover:bg-mint hover:text-raisin-black transition-colors duration-200 shadow-md hover:ring-1 hover:ring-mint">
                        <Pencil className="inline w-5 h-5" />

                    </Link>
                </div>
            </div>
        </Layout>
    );
}
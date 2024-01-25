import Link from "next/link";

interface VideoCardProps {
  title: string;
  date: Date;
  image: string;
  link: string;
  tags?: string[];
}

const VideoCard: React.FC<VideoCardProps> = ({ title, date, image, link, tags }) => {
  return (
    <Link href={link}>
      <div className="flex flex-col items-center gap-5">
        <div className="relative max-w-sm border border-stone-400 rounded-md overflow-hidden shadow">

          <div className="absolute top-2 left-0">
          {tags?.map(tag => (<span className="bg-stone-500 py-2 px-4 text-xs" key={tag}>{tag}</span>))}
          </div>

          <img className="w-full" src={image} alt={title} />

          <div className="p-5">
            <h5 className="mb-2 text-lg font-bold tracking-tight text-stone-700 font-serif">
              {title}
            </h5>
            <p className="text-sm text-stone-500">
              {date.toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;

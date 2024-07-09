import Image from "next/image";
import Link from "next/link";

import Card from "@/components/atoms/card";
import { isValidUrl } from "@/utils";

type FLowProps = {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
};

const FLow = ({ id, name, description, logoUrl }: FLowProps) => (
  <Link href={`/flows/${id}`}>
    <Card className="h-full transition-shadow hover:shadow-md">
      <div className="flex flex-row items-center gap-4">
        <Image
          src={isValidUrl(logoUrl) || `https://avatar.vercel.sh/${id}`}
          alt={`${name} logo`}
          width={48}
          height={48}
          className="aspect-[1] rounded-full h-fit w-fit object-cover"
        />
        <p className="text-lg">{name}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </Card>
  </Link>
);

const FLows = ({ collectives }: { collectives: FLowProps[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {collectives.map((collective) => (
      <FLow key={collective.id} {...collective} />
    ))}
  </div>
);

export default FLows;

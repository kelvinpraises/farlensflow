import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/atoms/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import Card from "@/components/atoms/card";
import GlassContainer from "@/components/molecules/glass-container";

const CollectHome = () => {
  return (
    <GlassContainer>
      <p className="pt-4 px-4 font-semibold text-xl">Collect</p>
      <p className="px-4 pb-2 text-sm text-gray-700">
        Collect and view funding flow details
      </p>
      <div className="flex flex-col gap-4 rounded-2xl bg-[#F8F8F7] p-4">
        <Alert>
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Have someone on the{" "}
            <Link href="/flows" className="text-[#F26DB7] hover:underline">
              Flows
            </Link>{" "}
            page send you flows to start collecting
          </AlertDescription>
        </Alert>
        <Accordion type="multiple" className="w-full flex flex-col gap-2">
          {["x"].map((flow) => (
            <Card key={flow} className="rounded-lg p-0">
              <AccordionItem value={flow} className="border-b-0">
                <AccordionTrigger className="p-4">
                  {/* <Head  /> */}
                </AccordionTrigger>
                <AccordionContent className="pb-4 px-4">
                  {/* <Body /> */}
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
      </div>
    </GlassContainer>
  );
};

export default CollectHome;

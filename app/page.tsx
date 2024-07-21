import Image from "next/image";

import DocSection from "@/components/atoms/doc-section";
import GlassContainer from "@/components/molecules/glass-container";
import { Checkbox } from "@/components/atoms/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import clampBuilder from "@/utils/clamp-builder";

const IntentsHome = async () => {
  return (
    <GlassContainer>
      <header>
        <h1 className="pt-4 px-4 font-semibold text-xl">Home</h1>
        <p className="px-4 pb-2 text-sm text-gray-700">
          Fuel shared initiatives with decentralised funding flows
        </p>
      </header>
      <main className="rounded-2xl bg-[#F8F8F7] p-4 flex-1 space-y-8">
        <div className="flex flex-col items-center">
          <Image
            alt="lens"
            src="https://illustrations.popsy.co/red/photographer.svg"
            width={400}
            height={400}
          />
          <h2 className="text-base text-center sm:text-lg text-black font-medium">
            Peer into the social depths and unlock the power of flows
          </h2>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <DocSection title="Introduction" open>
            <p className="leading-7">
              FarlensFlow is a platform that bridges the gap between content
              creators on Farcaster and potential supporters. By leveraging the
              power of interest-based searches and automated crypto flows,
              FarlensFlow enables seamless, targeted funding for creators while
              allowing supporters to easily discover and fund content
              they&apos;re passionate about. Indexing is powered by&nbsp;
              <a
                href="https://index.network/"
                target="_blank"
                rel="noreferrer"
                className="truncate rounded-md bg-[#FA4A57]/10 px-2 py-1 text-sm font-medium transition-colors hover:bg-[#FA4A57]/40"
              >
                Index-Network <span className="font-mono">↗</span>
              </a>
            </p>
          </DocSection>
          <DocSection title="Platform Usage">
            <DocSection className="font-black text-lg" title="Overview" open>
              <p className="leading-7">
                Anyone can manage flows, create and collect funding flows, with
                customizable conditions and parameters. Currently, this operates
                exclusively on the Base Sepolia test network, with some
                processes requiring manual intervention. Continue reading to
                learn more about its features and capabilities!
              </p>
            </DocSection>

            <DocSection className="font-black text-lg" title="Features" open>
              <ul className="list-disc pl-6 space-y-2">
                <li>Manage all created flows</li>
                <li>Create new funding flows</li>
                <li>Farcaster interest matches, suggestion feed</li>
                <li>Optional flow gating conditions</li>
                <li>Splitting and collecting funding flows</li>
              </ul>
            </DocSection>

            <DocSection className="font-black text-lg" title="Curate Flow" open>
              <p>TBD</p>
            </DocSection>

            <DocSection className="font-black text-lg" title="Fund Flow" open>
              <p>TBD</p>
            </DocSection>

            <DocSection
              className="font-black text-lg"
              title="Collect Flow"
              open
            >
              <p>TBD</p>
            </DocSection>

            <DocSection className="font-black text-lg" title="Use Cases" open>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Fund creators in specialized fields that align with your
                  interests
                </li>
                <li>
                  Support emerging creators and help grow communities around
                  shared passions
                </li>
                <li>
                  Establish long-term support for your favorite content creators
                </li>
                <li>
                  For businesses/DAOs, support creators who align with your
                  brand values and reach your target audience
                </li>
              </ul>
            </DocSection>
          </DocSection>
          <DocSection title="Smart Contracts">
            <Alert className="mb-4 mr-4">
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                This operates exclusively on the Base Sepolia test network.
              </AlertDescription>
            </Alert>

            <DocSection className="font-black text-lg" title="Overview" open>
              <p className="leading-7">
                The{" "}
                <a
                  href="https://github.com/drips-network/"
                  target="_blank"
                  rel="noreferrer"
                  className="truncate rounded-md bg-[#FA4A57]/10 px-2 py-1 text-sm font-medium transition-colors hover:bg-[#FA4A57]/40"
                >
                  Drips contract <span className="font-mono">↗</span>
                </a>{" "}
                implements the core streaming flow of any platform that uses the
                SNDr Core contract. Fund allocation is managed by a SNDr
                Allocator Strategy contract and implements the logic of how
                recipients receive funding flows.
              </p>
            </DocSection>

            <DocSection className="font-black text-lg" title="Features" open>
              <ul className="list-disc pl-6 space-y-2">
                <li>Initiate funding flows between sender and recipients</li>
                <li>Access control specifications on flow collection</li>
                <li>Manage initiated flows</li>
              </ul>
            </DocSection>

            <DocSection className="font-black text-lg" title="Deployments" open>
              <div
                style={{
                  maxWidth: `${clampBuilder(320, 732, 13, 38.75)}`,
                  height: "auto",
                }}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">
                        Contract&nbsp;Name
                      </TableHead>
                      <TableHead className="font-bold">
                        Contract&nbsp;Address
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="flex items-center gap-1 flex-wrap">
                        <p>Drips</p>
                      </TableCell>
                      <TableCell>
                        <a
                          href="https://basescan.org/address/0x20acC4e3fA1455ABe007edfC02136E57a0D5622C"
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono truncate rounded-md bg-[#FA4A57]/10 px-2 py-1 text-sm font-medium transition-colors hover:bg-[#FA4A57]/40"
                        >
                          0x20acC4e3fA1455ABe007edfC02136E57a0D5622C ↗
                        </a>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="flex items-center gap-1 flex-wrap">
                        <p>Address&nbsp;Driver</p>
                      </TableCell>
                      <TableCell>
                        <a
                          href="https://basescan.org/address/0x9bd5650dED71ffBd113070f8A3Aa69130c9Afb77"
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono truncate rounded-md bg-[#FA4A57]/10 px-2 py-1 text-sm font-medium transition-colors hover:bg-[#FA4A57]/40"
                        >
                          0x9bd5650dED71ffBd113070f8A3Aa69130c9Afb77 ↗
                        </a>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="flex items-center gap-1 flex-wrap">
                        <p>NFT&nbsp;Driver</p>
                      </TableCell>
                      <TableCell>
                        <a
                          href="https://basescan.org/address/0xFa500cdF0325D78a7c5AE4cE51b0c06b886C96AC"
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono truncate rounded-md bg-[#FA4A57]/10 px-2 py-1 text-sm font-medium transition-colors hover:bg-[#FA4A57]/40"
                        >
                          0xFa500cdF0325D78a7c5AE4cE51b0c06b886C96AC ↗
                        </a>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="flex items-center gap-1 flex-wrap">
                        <p>SNDr&nbsp;Core</p>
                      </TableCell>
                      <TableCell>
                        <p>TBD</p>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="flex items-center gap-1 flex-wrap">
                        <p>SNDr&nbsp;Allocator</p>
                      </TableCell>
                      <TableCell>
                        <p>TBD</p>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </DocSection>
          </DocSection>
          <DocSection title="Demo" className="p-0">
            <p>TBD</p>
          </DocSection>
          <DocSection title="Future Improvements">
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Checkbox id="task-0" />
                <label htmlFor="task-0" className="text-sm">
                  Implement smart contract wallet for transaction batching
                </label>
              </li>
              <li className="flex items-center space-x-2">
                <Checkbox id="task-1" />
                <label htmlFor="task-1" className="text-sm">
                  Streamline flow management into a Farcaster frame
                </label>
              </li>
              <li className="flex items-center space-x-2">
                <Checkbox id="task-2" />
                <label htmlFor="task-2" className="text-sm">
                  Enable cancellation and withdrawal of active flows
                </label>
              </li>
              <li className="flex items-center space-x-2">
                <Checkbox id="task-3" />
                <label htmlFor="task-3" className="text-sm">
                  Streamline and automate flow collection mechanisms
                </label>
              </li>
              <li className="flex items-center space-x-2">
                <Checkbox id="task-4" />
                <label htmlFor="task-4" className="text-sm">
                  Integrate businesses/DAOs based funding allocation systems
                </label>
              </li>
              <li className="flex items-center space-x-2">
                <Checkbox id="task-5" />
                <label htmlFor="task-5" className="text-sm">
                  Complete access controls on protected flows
                </label>
              </li>
              <li className="flex items-center space-x-2">
                <Checkbox id="task-6" />
                <label htmlFor="task-6" className="text-sm">
                  Optimize gas usage where possible
                </label>
              </li>
              <li className="flex items-center space-x-2">
                <Checkbox id="task-7" />
                <label htmlFor="task-7" className="text-sm">
                  Finalize preparations for mainnet deployment
                </label>
              </li>
            </ul>
          </DocSection>
        </div>
      </main>
    </GlassContainer>
  );
};

export default IntentsHome;

export async function getUserAddress(name: string) {
  if (name.endsWith(".eth")) {
    // Try to resolve the .eth name using Farcaster
    try {
      const response = await fetch(
        `https://fnames.farcaster.xyz/transfers/current?name=${name}`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.transfer && data.transfer.owner) {
          return data.transfer.owner;
        }
      }
    } catch (error) {
      console.error("Error resolving .eth name with Farcaster:", error);
    }

    // If resolution fails or no owner found, remove .eth and continue
    name = name.slice(0, -4);
  }

  // Original Farcaster name resolution
  const response = await fetch(
    `https://fnames.farcaster.xyz/transfers/current?name=${name}`,
  );
  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }
  const data = await response.json();
  return data.transfer ? data.transfer.owner : null;
}
